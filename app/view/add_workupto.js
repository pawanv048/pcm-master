import React from 'react';
import { Text, Image, TextInput, View } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, ColButton, TitleBar, showErrorToast, showToast, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Utils from '../util/utils.js';

class AddWorkUpTo extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        title: '',
        link: '',
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
                    title={Strings.t44}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingBottom: 0, backgroundColor: 'white' }]}>
                    <Col extraStyle={[{ paddingHorizontal: 10, paddingBottom: 20, alignItems: 'stretch' }]}>
                        {/* <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                autoCapitalize='words'
                                ref={(input) => this.title = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={'Enter title'} // placeholder/label
                                value={this.state.title}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ title: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.link.focus()} />
                        </Row> */}
                        {/* <Row extraStyle={[{ marginTop: 20, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                            <TextInput
                                ref={(input) => this.link = input}
                                style={{ marginHorizontal: 0, flex: 1, fontSize: 15 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={'Enter link'} // placeholder/label
                                value={this.state.link}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => this.setState({ link: text })}
                                blurOnSubmit={true}
                                onSubmitEditing={() => {
                                    //
                                }} />
                        </Row> */}
                        <Row extraStyle={[{ marginTop: 20 }]}>
                            <Col extraStyle={[{ flex: 1, alignItems: 'stretch', borderColor: Colors.textLight, borderBottomWidth: 1, }]}>
                                <TextInput
                                    autoCapitalize='none'
                                    ref={(input) => this.link = input}
                                    style={{ marginHorizontal: 0, flex: 1, fontSize: 15, height: 40, backgroundColor: '#fafafa' }}
                                    placeholderTextColor={Colors.textLight}
                                    placeholder={Strings.t45} // placeholder/label
                                    value={this.state.link}
                                    keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                    onChangeText={(text) => this.setState({ link: text })}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => {
                                        //
                                    }} />
                            </Col>
                            <Button
                                label={Strings.t23}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.buttonO45, { marginLeft: 10, height: 40, width: 100 }]}
                                labelStyle={[stylesC.buttonOT14]}
                                onPress={() => {
                                    this.props.navigation.navigate('ChooseVideo', { from: 'AddWorkUpTo' });
                                    // Utils.moveToScreen(this.props.navigation, 'HomeStack', 'ChooseVideo')
                                }} />
                        </Row>

                        <Button
                            label={Strings.t38}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button45, { marginTop: 30, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT16]}
                            onPress={this.addWorkUpto} />
                    </Col>
                </Body>
            </Screen>
        );
    }


    addWorkUpto = () => {
        // if (this.state.title === '') {
        //     showErrorToast('Please enter title')
        //     return
        // }
        if (this.state.link === '') {
            showErrorToast(Strings.t46)
            return
        }

        this.setState({ loading: true })
        Api.addWorkUpTo('add', this.props.user.id, this.state.link, 'dummy',
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t47)
                    this.props.navigation.goBack()
                }
                else {
                    showErrorToast(response.msg)
                }
            },
            (error) => {
                this.setState({ loading: false })
            });
    };

    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        // const copiedVideoID = this.props.copiedVideoID
        const copiedVideoID = this.props.navigation.getParam('copiedVideoID');
        if (copiedVideoID) {
            this.setState({ link: copiedVideoID })
        }
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        // copiedVideoID: state.CopiedVideoIDReducer.copiedVideoID,
    }
}
const mapDispatchToProps = dispatch => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(AddWorkUpTo)