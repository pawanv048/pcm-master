import React from 'react';
import { Text, Image, View, FlatList, Alert } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, showErrorToast, showToast, ColButton, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import moment from 'moment'

class Notifications extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        models: []
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    // right // max 2 buttons
                    // rightOne={
                    //     <ColButton
                    //         extraStyle={[{ marginRight: 15 }]}
                    //         activeOpacity={0.6}
                    //         onPress={this.clearNotifications}>
                    //         <Text style={[stylesC.textD14, { color: 'white' }]}>
                    //             CLEAR
                    //         </Text>
                    //     </ColButton>
                    // }
                    title={Strings.t155}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.models}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem} />
                        </View>

                        {!this.state.loading && this.state.models.length == 0 ?
                            this.showNotFound()
                            :
                            null
                        }

                    </Col>
                </Body>
            </Screen>
        );
    }

    showNotFound = () => {
        return (
            <Col center extraStyle={[{ height: 50 }]}>
                <Text style={[stylesC.textM16]}>
                    {Strings.t156}
                </Text>
            </Col>
        )
    };

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={1}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 15, backgroundColor: 'transparent' }]}
                onPress={() => {
                    // handle item click
                }}>
                <Start>
                    <Image
                        resizeMode='contain'
                        style={{ width: 50, height: 50, tintColor: 'gray' }}
                        source={require('../assets/bell.png')} />
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {item.title}
                    </Text>
                    <Text style={stylesC.textM14}>
                        {item.message}
                    </Text>
                </Center>
                <End topRight extraStyle={[{width: 100}]}>
                    <Text style={[stylesC.textM12, { color: Colors.themeDark }]}>
                        {item.added_date.split(' ')[0]}
                    </Text>
                </End>
            </ListItem>
        )
    }

    clearNotifications = () => {
        if(this.state.models.length == 0){
            return
        }
        Alert.alert( // react-native
            Strings.t157,
            Strings.t158,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t159, onPress: () => {
                        this.setState({ models: [] })
                        Api.clearNotifications(this.props.user.id,
                            (response) => {
                                console.log('clearNotifications: ' + JSON.stringify(response));
                            },
                            (error) => {
                                //
                            });
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );
    };

    async componentDidMount() {
        console.log('componentDidMount');
        let title = this.props.navigation.getParam('title');
        console.log('title: ' + title);
    }

    onFocus = () => {
        console.log('onFocus');
        this.loadData()
    };

    loadData = () => {
        this.setState({ loading: true })
        Api.getNotifications(this.props.user.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    this.setState({ models: response.data })
                    this.props.setUnreadNotificationCount(0)
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUnreadNotificationCount: (data) => {
            dispatch(Actions.setUnreadNotificationCount(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)