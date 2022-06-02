import React from 'react';
import { Text, Image, View, Alert, Platform } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, TouchableOpacity, ColButton, TitleBar, ListItem, Start, Center, showToast, showErrorToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import { Picker } from '@react-native-picker/picker'
import FilterPicker from '../util/filter_picker'
import Purchases from 'react-native-purchases';

class SpecialPrograms extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        tab: 'all', // all, joined, assigned
        allPrograms: [],
        joinedPrograms: [],
        assignedPrograms: [],
        types: [{ title: 'All' }, { title: 'Free' }, { title: 'Paid' }],
        ages: ['1'], // 1 = All in DB
        goals: ['1'], // 1 = All in DB
        selectedType: { title: 'All' },
        selectedAge: { id: '1', title: 'All' },
        selectedGoal: { id: '1', title: 'All' },
    }

    onLeftPress = () => {
        this.props.navigation.toggleDrawer();
    };

    openMembership = () => {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Membership')
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='menu' // back/menu
                    onLeftPress={this.onLeftPress}
                    right // max 2 buttons
                    rightOne={
                        <ColButton
                            center
                            parentStyle={{ flex: 1 }}
                            extraStyle={{}}
                            activeOpacity={0.6}
                            onPress={() => {
                                this.openMembership()
                            }}>
                            <Text style={stylesC.textD14, { color: 'white' }}>
                                {Strings.t56}
                            </Text>
                        </ColButton>
                    }
                    title={Strings.t60}
                    titlePos='flex-start' />
                <FilterPicker
                    ref={(ref) => this.filterPicker = ref}
                    onSelect={(model, field) => {
                        console.log('model: ' + JSON.stringify(model));
                        this.setState({
                            [field]: model,
                        })
                        this.loadSpecialPrograms()
                    }} />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    {this.props.user != null ?
                        <Row center extraStyle={[{ padding: 10, backgroundColor: '#f2f2f2' }]}>
                            <Col>
                                <Button
                                    canUpdate
                                    label={Strings.t188}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 100, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'all' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onAllPress} />
                            </Col>
                            <Col extraStyle={[{ marginLeft: 10 }]}>
                                <Button
                                    canUpdate
                                    label={Strings.t189}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 100, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'joined' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onJoinedPress} />
                            </Col>
                            <Col extraStyle={[{ marginLeft: 10 }]}>
                                <Button
                                    canUpdate
                                    label={Strings.t190}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 100, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'assigned' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onAssignedPress} />
                            </Col>
                        </Row>
                        :
                        null
                    }

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>
                        {this.showProgramsList()}
                    </Col>

                </Body>
            </Screen>
        );
    }

    onAllPress = () => {
        this.setState({ tab: 'all' })
    };

    onJoinedPress = () => {
        this.setState({ tab: 'joined' })
    };

    onAssignedPress = () => {
        this.setState({ tab: 'assigned' })
    };

    showProgramsList = () => {
        if (this.state.tab === 'all') {
            return this.showAllPrograms()
        }
        else if (this.state.tab === 'joined') {
            return this.showJoinedPrograms()
        }
        else if (this.state.tab === 'assigned') {
            return this.showAssignedPrograms()
        }
    };

    showNotFound = () => {
        return (
            <Col center extraStyle={[{ height: 50 }]}>
                <Text style={[stylesC.textM16]}>
                    {Strings.t149}
                </Text>
            </Col>
        )
    };

    showAllPrograms = () => {
        console.log('showAllPrograms');
        return (
            <Col extraStyle={[{ alignItems: 'stretch' }]}>
                <Text style={[stylesC.textD14, { marginHorizontal: 15, marginTop: 10 }]}>
                    {Strings.t191}
                </Text>
                <Row extraStyle={[{ padding: 12 }]}>
                    <Col center extraStyle={[{ flex: 1 }]}>
                        <Text style={[stylesC.textM14, { marginBottom: -10 }]}>
                            {Strings.t192}
                        </Text>
                        <Col extraStyle={[{ marginTop: 5, height: 45, alignItems: 'stretch' }]}>
                            <Button
                                canUpdate
                                label={this.state.selectedType == null ? Strings.t23 : this.state.selectedType.title}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.buttonO30, { marginTop: 10, marginHorizontal: 0 }]}
                                labelStyle={[stylesC.buttonOT14]}
                                onPress={() => {
                                    this.filterPicker.showPopup(this.state.types, 'selectedType')
                                }} />
                        </Col>
                    </Col>
                    <Col center extraStyle={[{ flex: 1, marginLeft: 15 }]}>
                        <Text style={[stylesC.textM14, { marginBottom: -10 }]}>
                            {Strings.t193}
                        </Text>
                        <Col extraStyle={[{ marginTop: 5, height: 45, alignItems: 'stretch' }]}>
                            <Button
                                canUpdate
                                label={this.state.selectedAge == null ? Strings.t23 : this.state.selectedAge.title}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.buttonO30, { marginTop: 10, marginHorizontal: 0 }]}
                                labelStyle={[stylesC.buttonOT14]}
                                onPress={() => {
                                    this.filterPicker.showPopup(this.state.ages, 'selectedAge')
                                }} />
                        </Col>
                    </Col>
                    <Col center extraStyle={[{ flex: 1, marginLeft: 15 }]}>
                        <Text style={[stylesC.textM14, { marginBottom: -10 }]}>
                            {Strings.t194}
                        </Text>
                        <Col extraStyle={[{ marginTop: 5, height: 45, alignItems: 'stretch' }]}>
                            <Button
                                canUpdate
                                label={this.state.selectedGoal == null ? Strings.t23 : this.state.selectedGoal.title}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.buttonO30, { marginTop: 10, marginHorizontal: 0 }]}
                                labelStyle={[stylesC.buttonOT14]}
                                onPress={() => {
                                    this.filterPicker.showPopup(this.state.goals, 'selectedGoal')
                                }} />
                        </Col>
                    </Col>
                </Row>
                <View style={[{ marginTop: 0 }]}>
                    {this.state.allPrograms.map((item, index) => {
                        return this._renderItem(item, index)
                    })}
                    {!this.state.loading && this.state.allPrograms.length == 0 ?
                        this.showNotFound()
                        :
                        null
                    }
                </View>
            </Col>
        )
    };

    showJoinedPrograms = () => {
        console.log('showJoinedPrograms');
        if (!this.state.loading && this.state.joinedPrograms.length == 0) {
            return this.showNotFound()
        }
        return (
            <View style={[{ marginTop: 0 }]}>
                {this.state.joinedPrograms.map((item, index) => {
                    return this._renderItem(item, index)
                })}
            </View>
        )
    };

    showAssignedPrograms = () => {
        console.log('showAssignedPrograms');
        if (!this.state.loading && this.state.assignedPrograms.length == 0) {
            return this.showNotFound()
        }
        return (
            <View style={[{ marginTop: 0 }]}>
                {this.state.assignedPrograms.map((item, index) => {
                    return this._renderItem(item, index)
                })}
            </View>
        )
    };

    checkSubscribedAndFreeAccess = () => {
        if (this.props.hasSubscribed === '1'
            && this.props.subscriberFreeProgramAccess === '1')
            return true
        return false
    };

    _renderItem = (item_, index) => {
        let item = item_
        if (this.state.tab !== 'all') {
            item = item_.special_program
        }
        return (
            <ListItem
                key={index.toString()}
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={1}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    //
                }}>
                <Center extraStyle={[{ paddingHorizontal: 0 }]}>
                    <Row>
                        <Image
                            resizeMode='cover'
                            style={{ width: 120, height: '100%', backgroundColor: 'gray' }}
                            source={{ uri: this.props.fileUrls.SpecialProgram + item.image }} />
                        <Col extraStyle={[{ marginLeft: 10, flex: 1 }]}>
                            <Row spaceBetween>
                                <Text style={stylesC.textMB16}>
                                    {item.title}
                                </Text>
                                <Text style={[stylesC.textMB16, { color: Colors.theme }]}>
                                    {item.price === '0' ?
                                        Strings.t176
                                        :
                                        this.checkSubscribedAndFreeAccess() ?
                                            Strings.t176
                                            :
                                            '$' + item.price
                                    }
                                </Text>
                            </Row>


                            <Row spaceBetween extraStyle={[{ marginTop: 10 }]}>

                                {item.videos === '' || item.videos === '0' ?
                                    null
                                    :
                                    <Col extraStyle={[{ flex: 1, height: 80, borderRadius: 5, borderWidth: 1, borderColor: Colors.theme }]}>
                                        <Col center extraStyle={[{ height: 40, alignSelf: 'center' }]}>
                                            <Text style={[stylesC.textMB12, { textAlign: 'center', color: Colors.theme }]}>
                                                {Strings.t108}
                                            </Text>
                                        </Col>
                                        <Col center extraStyle={[{ height: 40, alignSelf: 'center', backgroundColor: Colors.theme, width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                            <Text style={[stylesC.textDB14, { fontSize: 20, color: 'white' }]}>
                                                {item.videos}
                                            </Text>
                                        </Col>
                                    </Col>
                                }

                                {item.programs === '' || item.programs === '0' ?
                                    null
                                    :
                                    <Col extraStyle={[{ marginLeft: 15, flex: 1, height: 80, borderRadius: 5, borderWidth: 1, borderColor: Colors.red }]}>
                                        <Col center extraStyle={[{ height: 40, alignSelf: 'center' }]}>
                                            <Text style={[stylesC.textMB12, { textAlign: 'center', color: Colors.red }]}>
                                                {Strings.t195}
                                            </Text>
                                        </Col>
                                        <Col center extraStyle={[{ height: 40, alignSelf: 'center', backgroundColor: Colors.red, width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                            <Text style={[stylesC.textDB14, { fontSize: 20, color: 'white' }]}>
                                                {item.programs}
                                            </Text>
                                        </Col>
                                    </Col>
                                }

                            </Row>

                            <Row center extraStyle={[{ marginTop: 15 }]}>
                                <Button
                                    label={Strings.t196}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonOR30, { marginTop: 0, flex: 1, height: 40, borderRadius: 20 }]}
                                    labelStyle={[stylesC.buttonOT14]}
                                    onPress={() => {
                                        if (this.props.user == null) {
                                            this.props.navigation.navigate('Login');
                                            return
                                        }
                                        // if (this.props.user.subscriber === '0') {
                                        //     this.props.navigation.navigate('Membership');
                                        //     return
                                        // }
                                        this.props.navigation.navigate('SpecialProgramDetails', { program: item });
                                    }} />
                                {this.state.tab !== 'all' ?
                                    <Button
                                        label={Strings.t179}
                                        activeOpacity={0.6}
                                        buttonStyle={[stylesC.buttonOR30, { marginTop: 0, flex: 1, height: 40, borderRadius: 20, marginLeft: 10, borderColor: Colors.red }]}
                                        labelStyle={[stylesC.buttonOT14, { color: Colors.red }]}
                                        onPress={() => {
                                            this.leaveProgram(item)
                                        }} />
                                    :
                                    item.joined === '0' ?
                                        <Button
                                            label={Strings.t139}
                                            activeOpacity={0.6}
                                            buttonStyle={[stylesC.buttonOR30, { marginTop: 0, flex: 1, height: 40, borderRadius: 20, marginLeft: 10, borderColor: Colors.purple }]}
                                            labelStyle={[stylesC.buttonOT14, { color: Colors.purple }]}
                                            onPress={() => {
                                                this.joinProgram(item)
                                            }} />
                                        :
                                        <Text style={[stylesC.textD16, { color: 'green', flex: 1, alignSelf: 'center', textAlign: 'center' }]}>
                                            {item.joined_type === '' ?
                                                ''
                                                :
                                                item.joined_type.charAt(0).toUpperCase() + item.joined_type.slice(1)
                                            }
                                        </Text>
                                }
                            </Row>
                        </Col>
                    </Row>

                </Center>

            </ListItem>
        )
    }

    joinProgram = async (item) => {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        // if (this.props.user.subscriber === '0') {
        //     this.props.navigation.navigate('Membership');
        //     return
        // }
        if (item.inapp_id != null && item.inapp_id !== 'null' && item.inapp_id !== '') {
            console.log('purcahse program');
            if (this.checkSubscribedAndFreeAccess()) {
                console.log('free access for subscriber');
                this.joinProgramNow(item)
            }
            else {
                try {
                    this.setState({ loading: true })
                    let purchaseMade = await Purchases.purchaseProduct(item.inapp_id, null, 'inapp')
                    this.setState({ loading: false })
                    console.log(purchaseMade)
                    this.joinProgramNow(item)
                }
                catch (e) {
                    this.setState({ loading: false })
                    showErrorToast(Strings.t181)
                    if (!e.userCancelled) {
                        console.log(JSON.stringify(e));
                    }
                }
            }
        }
        else {
            console.log('free program');
            this.joinProgramNow(item)
        }
    };

    joinProgramNow = (item) => {
        this.setState({ loading: true });
        Api.joinSpecialProgram(item.id, this.props.user.id, '1',
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t182)
                    this.setState(state => {
                        const allPrograms = state.allPrograms.map((item_) => {
                            if (item_.id === item.id) {
                                return { ...item, joined: '1' };
                            }
                            else {
                                return item_;
                            }
                        });
                        return { allPrograms: allPrograms };
                    });
                    this.loadJoinedSpecialPrograms()
                }
                else {
                    showErrorToast(response.msg)
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

    leaveProgram = (item) => {
        Alert.alert( // react-native
            Strings.t183,
            Strings.t184,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t179, onPress: () => {
                        this.setState({ loading: true });
                        Api.joinSpecialProgram(item.id, this.props.user.id, '0',
                            (response) => {
                                this.setState({ loading: false })
                                if (response.status === 'success') {
                                    showToast(Strings.t185)
                                    this.setState(state => {
                                        const joinedPrograms = state.joinedPrograms.filter((item_, j) => {
                                            console.log('id_:' + item_.special_pid + ', id:' + item.id);
                                            return item_.special_pid + '' !== item.id + ''; //false will delete
                                        });
                                        console.log('size: ' + joinedPrograms.length);
                                        const allPrograms = state.allPrograms.map((item_) => {
                                            if (item_.id === item.id) {
                                                return { ...item, joined: '0' };
                                            }
                                            else {
                                                return item_;
                                            }
                                        });
                                        return { joinedPrograms: joinedPrograms, allPrograms: allPrograms };
                                    });
                                }
                                else {
                                    showErrorToast(response.msg)
                                }
                            },
                            (error) => {
                                this.setState({ loading: false });
                                showErrorToast('' + error);
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
        this.setState({
            ages: this.props.filters.ages,
            goals: this.props.filters.goals,
        })
        // testing
        // let products = await Purchases.getProducts(['pcm_foamroller_training'])
        // // let products = await Purchases.getProducts(['test_test'])
        // console.log('products_testing: ' + JSON.stringify(products));
        // try {
        //     await RNIap.initConnection();
        //     const products = await RNIap.getProducts(itemSkus);
        //     // const products = await RNIap.getSubscriptions(itemSkus);
        //     console.log('Products', products);
        // } catch (err) {
        //     console.warn(err.code, err.message);
        // }
    }

    onFocus = async () => {
        console.log('onFocus');

        this.loadSpecialPrograms()
        if (this.props.user != null)
            this.loadJoinedSpecialPrograms()
    };

    loadSpecialPrograms = () => {
        let user_id = '0'
        if (this.props.user != null)
            user_id = this.props.user.id
        setTimeout(() => {
            this.setState({ loading: true })
            Api.getSpecialPrograms(user_id, this.state.selectedType.title.toLowerCase(), this.state.selectedAge.id, this.state.selectedGoal.id,
                (response) => {
                    console.log('specialPrograms: ' + JSON.stringify(response));
                    this.setState({ loading: false })
                    if (response.status === 'success') {
                        const allPrograms = response.data
                        this.setState({ allPrograms: allPrograms })
                    }
                },
                (error) => {
                    this.setState({ loading: false })
                });
        }, 50);
    };

    loadJoinedSpecialPrograms = () => {
        // this.setState({ loading: true })
        Api.getJoinedSpecialPrograms(this.props.user.id,
            (response) => {
                console.log('joined: ' + JSON.stringify(response.data));
                if (response.status === 'success') {
                    let joinedPrograms = []
                    let assignedPrograms = []
                    for (let i = 0; i < response.data.length; i++) {
                        const program = response.data[i];
                        if (program.type === 'joined') {
                            joinedPrograms = joinedPrograms.concat(program)
                        }
                        else if (program.type === 'assigned') {
                            assignedPrograms = assignedPrograms.concat(program)
                        }
                    }
                    this.setState({
                        joinedPrograms: joinedPrograms,
                        assignedPrograms: assignedPrograms,
                    })
                }
            },
            (error) => {
                //
            });
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        hasSubscribed: state.HasSubscribedReducer.hasSubscribed,
        fileUrls: state.FileUrlsReducer.fileUrls,
        filters: state.FiltersReducer.filters,
        subscriberFreeProgramAccess: state.SubscriberFreeProgramAccess.subscriberFreeProgramAccess,
    }
}
export default connect(mapStateToProps, {})(SpecialPrograms)
