import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, showErrorToast, IconCustomButton, TitleBar } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { CheckBox } from 'react-native-elements'
import Utils from '../util/utils.js';
import Api, { privacyUrl, termsUrl } from '../api/api'
import MyStorage from '../storage/storage'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import GLOBAL from '../constants/global.js';
class Signup extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        fname: '',
        lname: '',
        email: '',
        password: '',
        cpassword: '',
        showPass: false,
        checked: false,
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t119}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 20 }]}>

                        <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='none'
                                ref={(input) => this.fname = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={Strings.t68} // placeholder/label
                                value={this.state.fname}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ fname: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.lname.focus()} />
                        </Row>

                        <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='none'
                                ref={(input) => this.lname = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={Strings.t69} // placeholder/label
                                value={this.state.lname}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ lname: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.email.focus()} />
                        </Row>

                        <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='none'
                                ref={(input) => this.email = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={Strings.t95} // placeholder/label
                                value={this.state.email}
                                keyboardType='email-address' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ email: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.password.focus()} />
                        </Row>

                        <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='none'
                                ref={(input) => this.password = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={Strings.t114} // placeholder/label
                                value={this.state.password}
                                secureTextEntry={!this.state.showPass}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ password: text })}
                                blurOnSubmit
                                onSubmitEditing={() => {
                                    this.cpassword.focus()
                                }} />
                            <IconCustomButton
                                canUpdate
                                conatinerStyle={[stylesC.center, { marginRight: 15 }]}
                                imageStyle={[stylesC.imageM28]}
                                resizeMode='contain'
                                source={this.state.showPass ? require('../assets/hide_pass.png') : require('../assets/show_pass.png')}
                                onPress={this.hideShowPass} />
                        </Row>

                        <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='none'
                                ref={(input) => this.cpassword = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={Strings.t168} // placeholder/label
                                value={this.state.cpassword}
                                secureTextEntry={!this.state.showPass}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ cpassword: text })}
                                blurOnSubmit
                                onSubmitEditing={() => {
                                    // 
                                }} />
                            <IconCustomButton
                                canUpdate
                                conatinerStyle={[stylesC.center, { marginRight: 15 }]}
                                imageStyle={[stylesC.imageM28]}
                                resizeMode='contain'
                                source={this.state.showPass ? require('../assets/hide_pass.png') : require('../assets/show_pass.png')}
                                onPress={this.hideShowPass} />
                        </Row>

                        <CheckBox
                            size={24}
                            checked={this.state.checked}
                            checkedColor={Colors.theme}
                            uncheckedColor={Colors.theme}
                            title={Strings.t169}
                            containerStyle={[stylesC.checkboxContainerStyle, { marginTop: 25 }]}
                            textStyle={stylesC.checkboxText14}
                            onPress={() => this.setState({ checked: !this.state.checked })} />

                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                            activeOpacity={0.6}
                            onPress={() => {
                                Utils.openUrl(privacyUrl)
                            }}>
                            <Text style={[stylesC.textD14, { color: Colors.themeDark }]}>
                                {Strings.t170}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5 }}
                            activeOpacity={0.6}
                            onPress={() => {
                                Utils.openUrl(termsUrl)
                            }}>
                            <Text style={[stylesC.textD14, { color: Colors.themeDark }]}>
                                {Strings.t171}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            label={Strings.t119}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button50, { marginTop: 30, marginBottom: 50 }]}
                            labelStyle={[stylesC.buttonT16]}
                            onPress={this.signupUser} />

                        <View style={{width:'100%', height:100}}/>
                    </Col>
                </Body>
            </Screen>
        );
    }

    signupUser = () => {
        if (this.state.fname === '') {
            showErrorToast(Strings.t172)
            return
        }
        if (this.state.lname === '') {
            showErrorToast(Strings.t173)
            return
        }
        if (this.state.email === '') {
            showErrorToast(Strings.t122)
            return
        }
        if (!Utils.checkEmail(this.state.email)) {
            showErrorToast(Strings.t174)
            return
        }
        if (this.state.password === '') {
            showErrorToast(Strings.t123)
            return
        }
        if (this.state.cpassword === '') {
            showErrorToast(Strings.t83)
            return
        }
        if (this.state.password !== this.state.cpassword) {
            showErrorToast(Strings.t84)
            return
        }
        if (this.state.password.length < 6) {
            showErrorToast(Strings.t85)
            return
        }
        if (!this.state.checked) {
            showErrorToast(Strings.t175)
            return
        }

        this.setState({ loading: true });
        Api.registerUser(this.state.email, this.state.fname, this.state.lname, this.state.password,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    // send welcome email
                    // Api.sendEmail(this.state.email,
                    //     (response) => {
                    //         //
                    //     },
                    //     (error) => {
                    //         //
                    //     });
                    MyStorage.setUser(response.data)
                    MyStorage.setLogin('true')
                    this.props.setUser(response.data) // redux
                    GLOBAL.accessToken = response.data.access_token
                    Api.updatePushToken()
                    this.moveToHome()
                }
                else {
                    showErrorToast(response.msg);
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

    moveToHome = () => {
        Utils.moveToStack(this.props.navigation, 'HomeStack')
    };

    onBack = () => {
        console.log('back');
        this.props.navigation.goBack()
    }

    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
    };

}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(Actions.setUser(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(Signup)