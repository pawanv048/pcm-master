import React from 'react';
import { Text, Image, TextInput } from 'react-native';
import { stylesC, loginLogoSize } from '../styles/style_common.js';
import { Screen, TitleBar, Body, Col, Row, showToast, showErrorToast, EditText, ColButton, Button, Circle, IconCustom, PhotoSource } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import MyStorage from '../storage/storage'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import PhotoPopup from './photo_popup'
import Api from '../api/api'

class EditProfile extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        oldPhoto: require('../assets/profile.png'),
        newPhoto: null,
        fname: '',
        lname: '',
        email: '',
        phone: '',
        showFields: false,
        opassword: '',
        password: '',
        cpassword: '',
    };

    getProfilePhoto = () => {
        if (this.props.fileUrls == null || this.props.user.photo == null || this.props.user.photo === '') {
            return require('../assets/user.png')
        }
        else {
            if (this.props.user.photo.includes('http')) {
                return { uri: this.props.user.photo }
            }
            return { uri: this.props.fileUrls.User + this.props.user.photo }
        }
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
                    title={Strings.t54}
                    titlePos='flex-start' />
                <PhotoPopup
                    ref={(ref) => this.photoPopup = ref}
                    photoTaken={(result) => {
                        this.setState({ newPhoto: result })
                        setTimeout(() => {
                            this.updatePhoto()
                        }, 50);
                    }} />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingHorizontal: 20, paddingVertical: 0 }]}>
                    <Col center>
                        <Row center extraStyle={[{ marginTop: 20, width: loginLogoSize, height: loginLogoSize, alignSelf: 'center' }]}>
                            <Image
                                resizeMode='cover'
                                style={{ width: 120, height: 120, borderRadius: 60, borderColor: Colors.theme, borderWidth: 5 }}
                                source={this.state.newPhoto == null ? this.getProfilePhoto() : { uri: this.state.newPhoto.path }} />
                            <Col bottomCenter extraStyle={[{ marginLeft: -40 }]}>
                                <Circle
                                    fill={true}
                                    borderWidth={0}
                                    activeOpacity={0.6}
                                    size={35}
                                    color={Colors.theme}
                                    component={
                                        <IconCustom
                                            conatinerStyle={[stylesC.center]}
                                            imageStyle={[stylesC.imageM18, { tintColor: 'white' }]}
                                            resizeMode='contain'
                                            source={require('../assets/edit.png')} />
                                    }
                                    onPress={this.takePhoto} />
                            </Col>
                        </Row>

                        <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                            <TextInput
                                ref={(input) => this.fname = input}
                                style={{ marginTop: 20, paddingHorizontal: 0, fontSize: 16 }}
                                placeholder={Strings.t68} // placeholder/label
                                value={this.state.fname}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ fname: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={this.onSubmitFirstName} />
                        </Col>


                        <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                            <TextInput
                                ref={(input) => this.lname = input}
                                style={{ marginTop: 10, paddingHorizontal: 0, fontSize: 16 }}
                                placeholder={Strings.t69} // placeholder/label
                                value={this.state.lname}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ lname: text })}
                                onSubmitEditing={this.onSubmitLastName} />
                        </Col>

                        <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                            <TextInput
                                ref={(input) => this.phone = input}
                                style={{ marginTop: 10, paddingHorizontal: 0, fontSize: 16 }}
                                placeholder={Strings.t70} // placeholder/label
                                value={this.state.phone}
                                keyboardType='phone-pad' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => {
                                    this.setState({ phone: Utils.formatPhone(text) })
                                }}
                                onSubmitEditing={this.onSubmitPhone} />
                        </Col>

                        <Text style={[stylesC.textM16, { marginTop: 10, width: '100%' }]}>
                            {this.state.email}
                        </Text>

                        <Text style={[stylesC.textM14, { marginTop: 15 }]}>
                            <Text style={[stylesC.textMB14, { color: Colors.red }]}>{Strings.t39}:</Text> {Strings.t71}
                        </Text>

                        <Button
                            label={Strings.t72}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button45, { marginTop: 15, marginBottom: 0, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT16]}
                            onPress={this.updateUser} />

                        {!this.state.showFields ?
                            null
                            :
                            <Col extraStyle={[{ alignItems: 'stretch' }]}>
                                <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                                    <TextInput
                                        autoCapitalize='none'
                                        secureTextEntry
                                        ref={(input) => this.opassword = input}
                                        style={{ marginTop: 10, paddingHorizontal: 0, fontSize: 16 }}
                                        placeholder={Strings.t73} // placeholder/label
                                        value={this.state.opassword}
                                        keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                        onChangeText={(text) => this.setState({ opassword: text })}
                                        blurOnSubmit={false}
                                        onSubmitEditing={this.onSubmitOldPassword} />
                                </Col>
                                <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                                    <TextInput
                                        autoCapitalize='none'
                                        secureTextEntry
                                        ref={(input) => this.password = input}
                                        style={{ marginTop: 10, paddingHorizontal: 0, fontSize: 16 }}
                                        placeholder={Strings.t74} // placeholder/label
                                        value={this.state.password}
                                        keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                        onChangeText={(text) => this.setState({ password: text })}
                                        blurOnSubmit={false}
                                        onSubmitEditing={this.onSubmitPassword} />
                                </Col>
                                <Col extraStyle={[{ alignItems: 'stretch', borderBottomWidth: 1, borderColor: 'lightgray' }]}>
                                    <TextInput
                                        autoCapitalize='none'
                                        secureTextEntry
                                        ref={(input) => this.cpassword = input}
                                        style={{ marginTop: 10, paddingHorizontal: 0, fontSize: 16 }}
                                        placeholder={Strings.t75} // placeholder/label
                                        value={this.state.cpassword}
                                        keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                        onChangeText={(text) => this.setState({ cpassword: text })}
                                        blurOnSubmit={true}
                                        onSubmitEditing={this.onSubmitConfirmPassword} />
                                </Col>
                            </Col>
                        }

                        <Button
                            label={Strings.t76}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button45, { marginTop: 20, marginBottom: 20, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT16]}
                            onPress={this.changePassword} />
                    </Col>
                </Body>
            </Screen>
        );
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    takePhoto = () => {
        this.photoPopup.showPopup()
    };

    onSubmitFirstName = () => {

    };

    onSubmitLastName = () => {

    };

    onSubmitEmail = () => {

    };

    onSubmitPhone = () => {

    };

    onSubmitOldPassword = () => {
        this.password.focus()
    };

    onSubmitPassword = () => {
        this.cpassword.focus()
    };

    onSubmitConfirmPassword = () => {

    };

    updatePhoto = () => {
        Api.updateProfile(this.props.user.fname, this.props.user.lname, this.props.user.email, this.props.user.phone, this.props.user.subscriber, this.state.newPhoto,
            (response) => {
                if (response.status === 'success') {
                    MyStorage.setUser(response.data)
                    this.props.setUser(response.data) // redux
                    showToast(Strings.t77)
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

    updateUser = () => {
        if (this.state.fname === '') {
            showErrorToast(Strings.t78);
            return;
        }
        if (this.state.lname === '') {
            showErrorToast(Strings.t79);
            return;
        }

        this.setState({ loading: true });
        Api.updateProfile(this.state.fname, this.state.lname, this.props.user.email, this.state.phone, this.props.user.subscriber, this.state.newPhoto,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    MyStorage.setUser(response.data)
                    this.props.setUser(response.data) // redux
                    showToast(Strings.t80)
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

    changePassword = () => {
        if (!this.state.showFields) {
            this.setState({ showFields: true })
            return
        }

        if (this.state.opassword === '') {
            showErrorToast(Strings.t81)
            return
        }
        if (this.state.password === '') {
            showErrorToast(Strings.t82)
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
        this.setState({ loading: true });
        Api.changePassword(this.state.opassword, this.state.password,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t86)
                    this.setState({ showFields: false, opassword: '', password: '', cpassword: '' })
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

    componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        this.setState({
            fname: this.props.user.fname,
            lname: this.props.user.lname,
            email: this.props.user.email,
            phone: (this.props.user.phone == null || this.props.user.phone === 'null') ? '' : this.props.user.phone,
            showFields: false,
            opassword: '',
            password: '',
            cpassword: '',
        })
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(Actions.setUser(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)