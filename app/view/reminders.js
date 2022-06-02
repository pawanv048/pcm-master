import React from 'react';
import { Text, Image, View, FlatList, Switch } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, showErrorToast, showToast, ColButton, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import moment from 'moment'
import MyTimePicker from '../util/my_time_picker';
import { setAlerts } from '../util/alert_util.js';

class Reminders extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        alerts: false,
        models: [
            { day: Strings.t9, time: '8:00 am', active: true },
            { day: Strings.t10, time: '8:00 am', active: true },
            { day: Strings.t11, time: '8:00 am', active: true },
            { day: Strings.t12, time: '8:00 am', active: true },
            { day: Strings.t13, time: '8:00 am', active: true },
            { day: Strings.t14, time: '8:00 am', active: true },
            { day: Strings.t15, time: '8:00 am', active: true },
        ]
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    toggleSwitch = () => {
        this.setState({
            alerts: !this.state.alerts
        })
    };

    saveSettings = () => {
        const alertSettings = {
            alerts: this.state.alerts,
            models: this.state.models
        }
        this.setState({ loading: true });
        Api.updateAlertSettings(this.props.user.id, JSON.stringify(alertSettings),
            (response) => {
                this.setState({ loading: false });
                if (response.status == 'success') {
                    showToast(Strings.t209)
                    setAlerts(alertSettings, this.props.user.id)
                }
            },
            (error) => {
                this.setState({ loading: false });
                showToast(Strings.t210);
            });
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
                    title={Strings.t204}
                    titlePos='flex-start' />
                <MyTimePicker
                    ref={(ref) => this.timePicker = ref}
                    onTimeSelect={(time, day) => {
                        console.log('time of ' + day + ': ' + time);
                        const list = this.state.models.map((item) => {
                            if (item.day === day) {
                                return { ...item, time: time };
                            }
                            else {
                                return item;
                            }
                        });
                        this.setState({ models: list })
                    }} />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <Text style={[stylesC.textM16, { padding: 10 }]}>
                                {Strings.t206}
                            </Text>
                            <Row center extraStyle={[{ marginTop: 5, marginBottom: 10 }]}>
                                <Text style={stylesC.textMB18}>
                                    {Strings.t207}
                                </Text>
                                <Col extraStyle={[{ marginLeft: 15 }]}>
                                    <Switch
                                        trackColor={{ false: "gray", true: Colors.themeLight }}
                                        thumbColor={this.state.alerts ? Colors.themeDark : "gray"}
                                        ios_backgroundColor="lightgray"
                                        onValueChange={this.toggleSwitch}
                                        value={this.state.alerts} />
                                </Col>
                            </Row>
                            {this.state.alerts ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    horizontal={false}
                                    data={this.state.models}
                                    extraData={this.state} // refresh list on state change
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this._renderItem} />
                                :
                                null
                            }

                            <Button
                                label={Strings.t38}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.button45, { marginTop: 15, marginHorizontal: 20 }]}
                                labelStyle={[stylesC.buttonT16]}
                                onPress={() => {
                                    this.saveSettings()
                                }} />

                        </View>

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

    onDaySwitchChange = (dayItem) => {
        const list = this.state.models.map((item) => {
            if (item.day === dayItem.day) {
                return { ...item, active: !dayItem.active };
            }
            else {
                return item;
            }
        });
        this.setState({ models: list })
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
                        style={{ width: 35, height: 35, tintColor: 'gray' }}
                        source={require('../assets/bell.png')} />
                </Start>

                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textM16}>
                        {item.day}
                    </Text>
                    <Row>
                        <Text style={stylesC.textD22}>
                            {item.time}
                        </Text>
                        <ColButton
                            center
                            parentStyle={{ width: 35 }}
                            extraStyle={{ padding: 10 }}
                            activeOpacity={0.6}
                            onPress={() => {
                                this.timePicker.showPopup(item.day)
                            }}>
                            <Image
                                resizeMode='contain'
                                style={{ width: 17, height: 17, tintColor: Colors.themeDark }}
                                source={require('../assets/edit.png')} />
                        </ColButton>

                    </Row>

                </Center>
                <End middleRight extraStyle={[{ width: 100 }]}>
                    <Switch
                        trackColor={{ false: "gray", true: Colors.themeLight }}
                        thumbColor={item.active ? Colors.themeDark : "gray"}
                        ios_backgroundColor="lightgray"
                        onValueChange={() => {
                            this.onDaySwitchChange(item)
                        }}
                        value={item.active} />
                    {/* <Button
                        label={Strings.t208}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button30, { marginTop: 0, marginHorizontal: 0 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={() => {
                            this.timePicker.showPopup(item.day)
                        }} /> */}
                </End>
            </ListItem>
        )
    }


    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        this.loadData()
    };

    loadData = () => {
        this.setState({ loading: true })
        Api.getAlertSettings(this.props.user.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    let data = JSON.parse(response.data)
                    let alerts = data.alerts
                    let models = data.models
                    this.setState({ alerts: alerts, models: models })
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
        //
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Reminders)