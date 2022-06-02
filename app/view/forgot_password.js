import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustom, IconCustomButton, TitleBar, showErrorToast, showToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import Api from '../api/api'
import { sub } from 'react-native-reanimated';

class ForgotPassword extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        email: '',
        // showFields: false,
        // verificationCode: Utils.randomFixedNumber(6),
        // code: '',
        // password: '',
        // cpassword: '',
        // showPass: false,
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
                    title={Strings.t94}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 20 }]}>

                        <Row extraStyle={[{ marginTop: 30, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
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
                                onSubmitEditing={() => {
                                    //
                                }} />
                        </Row>

                        <Button
                            label={Strings.t96}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button50, { marginTop: 30, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT16]}
                            onPress={this.sendCode} />

                    </Col>
                </Body>
            </Screen>
        );
    }

    sendCode = () => {
        if (this.state.email === '') {
            return
        }
        this.setState({ loading: true });
        Api.forgotPassword(this.state.email,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t97)
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

export default ForgotPassword