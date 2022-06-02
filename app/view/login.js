import React from 'react';
import { Text, Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Body, Col, Row, Button, IconCustomButton, showErrorToast, showToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import Api from '../api/api'
import MyStorage from '../storage/storage'
import { connect } from 'react-redux';
import GLOBAL from '../constants/global.js';
import { Actions } from '../redux/Actions'
import { facebookLogin, googleLogin } from '../util/social_login'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {setAlerts} from '../util/alert_util'

class Login extends React.Component {
    static navigationOptions = {
        headerShown: false
    }

    state = {
        loading: false,
        email: '',
        password: '',
        showPass: false,
        rememberMe: false,
    }

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}>
                    <Body scroll loading={this.state.loading} extraStyle={[{ paddingHorizontal: 0, paddingVertical: 0 }]}>
                        <Col extraStyle={[{ with: '100%', height: 150, backgroundColor: Colors.theme }]}>
                        </Col>
                        <Col extraStyle={[{ width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'lightgray', backgroundColor: 'white', alignSelf: 'center', marginTop: -90, alignItems: 'center', justifyContent: 'center' }]}>
                            <Image
                                resizeMode='contain'
                                style={{ width: 110, height: 110, alignSelf: 'center' }}
                                source={require('../assets/logo.png')} />
                        </Col>
                        <Col extraStyle={[{ paddingHorizontal: 20 }]}>
                            <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>

                                <TextInput
                                    autoCapitalize='none'
                                    ref={(input) => this.email = input}
                                    style={{ marginHorizontal: 0, flex: 1, fontSize: 15 }}
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
                                    style={{ marginHorizontal: 0, flex: 1, fontSize: 15 }}
                                    placeholderTextColor={Colors.textLight}
                                    placeholder={Strings.t114} // placeholder/label
                                    value={this.state.password}
                                    secureTextEntry={!this.state.showPass}
                                    keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                    onChangeText={(text) => this.setState({ password: text })}
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
                            <Row center extraStyle={[{ marginTop: 20 }]}>
                                <TouchableOpacity
                                    style={{ marginBottom: 3, height: 30 }}
                                    activeOpacity={0.6}
                                    onPress={this.forgotPassword}>
                                    <Text style={[stylesC.textD14, { color: Colors.theme }]}>
                                        {Strings.t115}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                            <Row extraStyle={[{ marginTop: 10 }]}>
                                <Button
                                    label={Strings.t53}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.button50, { marginHorizontal: 0, flex: 1, marginRight: 8 }]}
                                    labelStyle={[stylesC.buttonT16]}
                                    onPress={this.loginUser} />
                                <Button
                                    label={Strings.t116}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonO50, { marginHorizontal: 0, flex: 1, marginLeft: 8 }]}
                                    labelStyle={[stylesC.buttonOT16]}
                                    onPress={this.skipLogin} />
                            </Row>

                            <Text style={[stylesC.textM18, { marginTop: 30, alignSelf: 'center' }]}>
                                {Strings.t117}
                            </Text>
                            <Row center extraStyle={[{ marginTop: 20 }]}>
                                <IconCustomButton
                                    conatinerStyle={[stylesC.center, { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.facebookButton }]}
                                    imageStyle={[stylesC.imageM28, { tintColor: 'white' }]}
                                    resizeMode='contain'
                                    source={require('../assets/facebook.png')}
                                    onPress={this.loginWithFacebook} />

                                {Platform.OS === "ios" ?
                                    null
                                    :
                                    <IconCustomButton
                                        conatinerStyle={[stylesC.center, { marginLeft: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.googleButton }]}
                                        imageStyle={[stylesC.imageM28, { tintColor: 'white' }]}
                                        resizeMode='contain'
                                        source={require('../assets/google.png')}
                                        onPress={this.loginWithGoogle} />
                                }

                                {Platform.OS === "ios" ?
                                    <IconCustomButton
                                        conatinerStyle={[stylesC.center, { marginLeft: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.gray }]}
                                        imageStyle={[stylesC.imageM28, { tintColor: 'white' }]}
                                        resizeMode='contain'
                                        source={require('../assets/apple.png')}
                                        onPress={this.loginWithApple} />
                                    :
                                    null
                                }
                            </Row>
                            <Row center extraStyle={[{ marginTop: 30 }]}>
                                <Text style={[stylesC.textD14, { fontSize: 15 }]}>
                                    {Strings.t118}
                                </Text>
                                <TouchableOpacity
                                    style={{ marginLeft: 8 }}
                                    activeOpacity={0.6}
                                    onPress={this.moveToSignup}>
                                    <Text style={[stylesC.textD14, { fontSize: 15, color: Colors.theme }]}>
                                        {Strings.t119}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                            <Col center extraStyle={[{ marginTop: 15, marginBottom: 20, marginLeft: 20, marginRight: 20 }]}>
                                <Text style={[stylesC.textD14, { fontSize: 15 }]}>
                                    {Strings.t120}
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this.openEmail}>
                                    <Text style={[stylesC.textD14, { fontSize: 15, color: Colors.theme }]}>
                                        {Strings.email}
                                    </Text>
                                </TouchableOpacity>
                            </Col>
                        </Col>
                    </Body>
                </KeyboardAvoidingView>
            </Screen>
        );
    }

    loginSocial = (user) => {
        if (user.email == null || user.email === '') {
            showErrorToast(Strings.t121)
            return
        }
        this.setState({ loading: true });
        Api.socialLogin(user.id, user.name, user.email, user.photo,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    MyStorage.setUser(response.data)
                    MyStorage.setLogin('true')
                    this.props.setUser(response.data) // redux
                    GLOBAL.accessToken = response.data.access_token
                    Api.updatePushToken()
                    this.moveToHome(response.data)
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

    loginWithFacebook = () => {
        facebookLogin((user) => {
            this.loginSocial(user)
        })
    };

    loginWithGoogle = () => {
        googleLogin((user) => {
            this.loginSocial(user)
        })
    };

    loginWithApple = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [
                appleAuth.Scope.EMAIL,
                appleAuth.Scope.FULL_NAME
            ],
        });
        console.log('appleAuthRequestResponse: ' + JSON.stringify(appleAuthRequestResponse));
        // name, email will be null on 2nd login
        let user = {
            id: appleAuthRequestResponse.user,
            name: appleAuthRequestResponse.fullName.givenName,
            email: appleAuthRequestResponse.email,
            photo: '', // testing
        }
        this.setState({ loading: true });
        Api.socialLogin(user.id, user.name, user.email, user.photo,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    MyStorage.setUser(response.data)
                    MyStorage.setLogin('true')
                    this.props.setUser(response.data) // redux
                    GLOBAL.accessToken = response.data.access_token
                    Api.updatePushToken()
                    this.moveToHome(response.data)
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

    forgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword');
    }

    hideShowPass = () => {
        this.setState({ showPass: !this.state.showPass })
    }

    moveToSignup = () => {
        this.props.navigation.navigate('Signup');
    }

    skipLogin = () => {
        this.moveToHome(null)
    };

    openEmail = () => {
        Utils.openEmail(Strings.email)
    };

    loginUser = () => {
        // let user = { email: this.state.email, password: this.state.password }
        // this.props.setUser(user)
        // this.moveToHome()
        if (this.state.email === '') {
            showErrorToast(Strings.t122)
            return
        }
        if (this.state.password === '') {
            showErrorToast(Strings.t123)
            return
        }

        this.setState({ loading: true });
        Api.loginUser(this.state.email, this.state.password,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    MyStorage.setUser(response.data)
                    MyStorage.setLogin('true')
                    this.props.setUser(response.data) // redux
                    GLOBAL.accessToken = response.data.access_token
                    Api.updatePushToken()
                    this.moveToHome(response.data)
                }
                else {
                    showErrorToast(response.msg);
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    }

    moveToHome = (user) => {
        if (user == null) {
            this.moveNow()
        }
        else {
            // load alert settings and set alerts
            Api.getAlertSettings(user.id,
                (response) => {
                    if (response.status === 'success') {
                        let settings = JSON.parse(response.data)
                        setAlerts(settings, user.id)
                    }
                    this.moveNow()
                },
                (error) => {
                    this.moveNow()
                });
        }
    };

    moveNow = () => {
        const index = this.props.navigation.dangerouslyGetParent().state.index
        console.log('index: ' + index);
        if (index > 0) {
            this.props.navigation.goBack()
        }
        else {
            Utils.moveToStack(this.props.navigation, 'HomeStack')
        }
    };

    componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        // Api.updatePushToken() // testing
    };

}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(Actions.setUser(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Login)