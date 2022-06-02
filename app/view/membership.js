import React from 'react';
import { Text, Linking, Platform, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, showToast, showErrorToast, ColButton, TitleBar, Line } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import MyStorage from '../storage/storage'
import Purchases from 'react-native-purchases';

class Membership extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        purchaserInfo: null,
        subscription: null,
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }

        let subscription = this.state.subscription

        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t56}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 20, paddingVertical: 20, alignItems: 'stretch' }]}>

                        <Col center extraStyle={[{ backgroundColor: Colors.themeDark, padding: 20, borderRadius: 10 }]}>
                            <Text style={[stylesC.textDB18, { color: 'white' }]}>
                                {Strings.t124}
                            </Text>
                            <Text style={[stylesC.textDB16, { color: 'white', fontSize: 36 }]}>
                                {subscription != null ? subscription.price_string : '---'}
                            </Text>
                            <Text style={[stylesC.textD16, { color: 'white', fontWeight: 'bold' }]}>
                                {Strings.t125}
                            </Text>

                            {this.props.hasSubscribed === '0' ?
                                <Text style={[stylesC.textDB16, { color: 'white', marginTop: 10, textAlign: 'center' }]}>
                                    {Strings.t126}
                                </Text>
                                :
                                null
                            }
                            <Text style={[stylesC.textM16, { color: 'white' }]}>
                                {subscription != null ? subscription.description : '---'}
                            </Text>

                            {!this.checkSubscribed(subscription) ?
                                <Text style={[stylesC.textD16, { color: 'lightgreen', marginTop: 10 }]}>
                                    {Strings.t102}
                                </Text>
                                :
                                <Col extraStyle={[{ marginTop: 10, borderColor: 'white', padding: 8, borderWidth: 1, borderRadius: 10 }]}>
                                    <Text style={[stylesC.textD16, { color: 'lightgreen', alignSelf: 'center', fontWeight: 'bold' }]}>
                                        {Strings.t127}
                                    </Text>
                                    {this.subRenewsAt(subscription) === '' ?
                                        null
                                        :
                                        <Text style={[stylesC.textD16, { color: 'yellow', alignSelf: 'center' }]}>
                                            {Strings.t128} {this.subRenewsAt(subscription)}
                                        </Text>
                                    }
                                </Col>
                            }
                            {
                                !this.checkSubscribed(subscription) ?
                                    <Button
                                        canUpdate
                                        label={Strings.t129}
                                        activeOpacity={0.6}
                                        buttonStyle={[stylesC.button45, { marginTop: 20, marginHorizontal: 0 }]}
                                        labelStyle={[stylesC.buttonT16]}
                                        onPress={this.subscribePackage} />
                                    :
                                    null
                                    // <Button
                                    //     canUpdate
                                    //     label={Strings.t130}
                                    //     activeOpacity={1}
                                    //     buttonStyle={[stylesC.buttonO45, { marginTop: 20, marginHorizontal: 0, borderColor: 'white' }]}
                                    //     labelStyle={[stylesC.buttonOT16, { color: 'white' }]}
                                    //     onPress={this.manageSubscription} />
                            }

                        </Col>
                        <Text style={[stylesC.textM14, { marginTop: 15 }]}>
                            <Text style={[stylesC.textMB14, { color: Colors.red }]}>{Strings.t39}:</Text> {Strings.t131}
                        </Text>
                    </Col>
                </Body>
            </Screen>
        );
    }

    updateSubscriberStatus = (status) => {
        this.props.setHasSubscribed(status)
        this.setState({ loading: true })
        Api.updateSubscribeStatus(status,
            (response) => {
                if (response.status === 'success') {
                    let user = this.props.user
                    user.subscriber = status
                    this.props.setUser(user)
                    MyStorage.setUser(user)
                }
                this.setState({ loading: false })
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

    subscribePackage = async () => {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        let product = this.state.subscription
        try {
            this.setState({ loading: true })
            let purchaseMade = null
            if (Platform.OS === 'ios') {
                purchaseMade = await Purchases.purchaseProduct(product.identifier)
            }
            else {
                // check if already active subscription
                const purchaserInfo = await Purchases.getPurchaserInfo()
                if (purchaserInfo.activeSubscriptions.length > 0) {
                    const activeProduct = purchaserInfo.activeSubscriptions[0]
                    let upgradeInfo = {
                        oldSKU: activeProduct // testing
                    }
                    purchaseMade = await Purchases.purchaseProduct(product.identifier, upgradeInfo)
                    console.log('upgraded')
                }
                else {
                    purchaseMade = await Purchases.purchaseProduct(product.identifier)
                }
            }
            this.setState({ loading: false })
            console.log(purchaseMade)
            this.setState({ purchaserInfo: purchaseMade.purchaserInfo })
            // update subscriber status
            let subscriber = purchaseMade.purchaserInfo.activeSubscriptions.length > 0
            this.updateSubscriberStatus(subscriber ? '1' : '0')
        }
        catch (e) {
            this.setState({ loading: false })
            if (!e.userCancelled) {
                console.log(JSON.stringify(e));
            }
        }
    }

    manageSubscription = () => {
        let purchaserInfo = this.state.purchaserInfo
        if (purchaserInfo.managementURL != null) {
            Linking.canOpenURL(purchaserInfo.managementURL)
                .then((supported) => {
                    if (supported) {
                        return Linking.openURL(purchaserInfo.managementURL)
                            .catch(() => null);
                    }
                });
        }
        else {
            showErrorToast(Strings.t132)
        }
    };

    async componentDidMount() {
        console.log('componentDidMount');
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
        }
    }

    checkSubscribed = (product) => {
        console.log('subscribed: ' + this.props.hasSubscribed);
        return this.props.hasSubscribed === '1'
    }

    subRenewsAt = (product) => {
        console.log('product: ' + JSON.stringify(product));
        if (product == null)
            return ''
        if (this.state.purchaserInfo == null) {
            return ''
        }
        // return ''
        const allExpirationDates = this.state.purchaserInfo.allExpirationDates
        console.log('allExpirationDates: ' + JSON.stringify(allExpirationDates))
        if (allExpirationDates.length > 0) {
            const expDate = allExpirationDates[product.identifier]
            if (expDate)
                return expDate.split('T')[0]
        }
        return ''
    }

    fetchPurchaserInfo = async () => {
        try {
            const purchaserInfo = await Purchases.getPurchaserInfo();
            console.log('purchaserInfo: ' + JSON.stringify(purchaserInfo));
            this.setState({ purchaserInfo: purchaserInfo })
            this.checkIfSubscribedOnFocus(purchaserInfo)
        } catch (e) {
            // Error fetching purchaser info
        }
    }

    checkIfSubscribedOnFocus = (purchaserInfo) => {
        if (this.props.user != null) {
            Api.getUserProfile(
                (response) => {
                    if (response.status === 'success') {
                        let user = this.props.user
                        // update free user status
                        user.free_user = response.data.free_user
                        user.subscriber = response.data.subscriber
                        this.props.setUser(user)
                        MyStorage.setUser(user)
                        // update subscriber status
                        this.props.setHasSubscribed(user.subscriber + '')
                    }
                },
                (error) => {
                    //
                });
        }
        // if(purchaserInfo == null)
        //     return
        // const activeSubscriptions = purchaserInfo.activeSubscriptions
        // if (activeSubscriptions.length > 0) {
        //     let subscribed = activeSubscriptions.includes('pcm_membership')
        //     if(subscribed){
        //         this.props.setHasSubscribed('1')
        //     }
        //     else{
        //         this.props.setHasSubscribed('0')
        //     }
        // }
    };

    loadData = async () => {
        this.setState({ loading: true })
        const products = await Purchases.getProducts([Platform.OS === 'ios' ? 'pcm_membership' : 'pcm_subscription']);
        if (products !== null && products.length !== 0) {
            // console.log(JSON.stringify(products));
            // let models = []
            // for (let i = 0; i < products.length; i++) {
            //     const product = products[i];
            //     models = models.concat(product)
            // }
            // models.sort((a, b) => (a.price > b.price) ? 1 : -1)
            console.log('subscription: ' + JSON.stringify(products[0]));
            this.setState({ loading: false, subscription: products[0] })
        }
        else {
            console.log('null');
        }
    }

    onFocus = () => {
        console.log('onFocus');
        this.fetchPurchaserInfo()
        this.loadData()
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        hasSubscribed: state.HasSubscribedReducer.hasSubscribed,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(Actions.setUser(data))
        },
        setHasSubscribed: (data) => {
            dispatch(Actions.setHasSubscribed(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Membership)