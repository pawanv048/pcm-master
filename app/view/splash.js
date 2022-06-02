import React from 'react';
import { Text, Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Body, Col, Row, Button, IconCustomButton, IconCustom, EditText, showErrorToast, showToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import MyStorage from '../storage/storage'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import GLOBAL from '../constants/global.js';
import Api from '../api/api'

class Splash extends React.Component {
  static navigationOptions = {
    headerShown: false
  }

  state = {
    show: false,
  }

  render() {
    if (!this.state.show)
      return null
    return (
      <Screen statusBarTint='white' onFocus={this.onFocus}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}>
          <Body scroll loading={false} extraStyle={[{ paddingHorizontal: 0, paddingVertical: 0, paddingBottom: 20, backgroundColor: Colors.white }]}>

            <Col extraStyle={[{ with: '100%', height: 200, backgroundColor: Colors.theme }]}>
            </Col>
            <Col extraStyle={[{ width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'lightgray', backgroundColor: 'white', alignSelf: 'center', marginTop: -90, alignItems: 'center', justifyContent: 'center' }]}>
              <Image
                resizeMode='contain'
                style={{ width: 110, height: 110, alignSelf: 'center' }}
                source={require('../assets/logo.png')} />
            </Col>

            <Col extraStyle={[{ paddingHorizontal: 20 }]}>

              <Image
                resizeMode='contain'
                style={{ width: 280, alignSelf: 'center' }}
                source={require('../assets/app_name.png')} />

              <Row center extraStyle={[{ marginTop: 10 }]}>
                <Col>
                  <Image
                    resizeMode='cover'
                    style={{ width: 100, height: 200, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    source={require('../assets/posture.png')} />
                  <Text style={[stylesC.textDB14, { width: 100, textAlign: 'center', borderColor: Colors.theme, borderWidth: 1, color: Colors.theme, paddingVertical: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                    Posture
                  </Text>
                </Col>
                <Col extraStyle={[{ marginLeft: 20 }]}>
                  <Image
                    resizeMode='cover'
                    style={{ width: 100, height: 200, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    source={require('../assets/core.png')} />
                  <Text style={[stylesC.textDB14, { width: 100, textAlign: 'center', borderColor: Colors.theme, borderWidth: 1, color: Colors.theme, paddingVertical: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                    Core
                  </Text>
                </Col>
                <Col extraStyle={[{ marginLeft: 20 }]}>
                  <Image
                    resizeMode='cover'
                    style={{ width: 100, height: 200, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    source={require('../assets/more.png')} />
                  <Text style={[stylesC.textDB14, { width: 100, textAlign: 'center', borderColor: Colors.theme, borderWidth: 1, paddingVertical: 8, color: Colors.theme, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                    More
                  </Text>
                </Col>
              </Row>

              <Text style={[stylesC.textM16, { alignSelf: 'center', textAlign: 'center', marginTop: 20 }]}>
                {Strings.t197}
              </Text>

              <Button
                label={Strings.t198}
                activeOpacity={0.6}
                buttonStyle={[stylesC.buttonR45, { marginTop: 20, marginHorizontal: 0 }]}
                labelStyle={[stylesC.buttonT16]}
                onPress={this.getStarted} />
            </Col>
          </Body>
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  getStarted = () => {
    Utils.moveToStack(this.props.navigation, 'LoginStack')
  };

  async componentDidMount() {
    console.log('SPLASH MOUNT');
    GLOBAL.navigation = this.props.navigation
    let isLogin = await MyStorage.isLogin();
    let user = await MyStorage.getUser();
    if (isLogin === 'true') {
      this.props.setUser(user)
      GLOBAL.accessToken = user.access_token
      this.moveToHome()
    }
    else {
      this.setState({ show: true })
    }
    // this.loadGuides()
  }

  loadGuides = async () => {
    let guides = await MyStorage.getGuides()
    this.props.setGuides(guides)
    Api.getGuides(
      (response) => {
        const guides = JSON.parse(response.data)
        this.props.setGuides(guides)
        MyStorage.setGuides(guides)
      },
      (error) => {
        //
      });
  };

  moveToHome = () => {
    Utils.moveToStack(this.props.navigation, 'HomeStack')
  };

  onFocus = () => {
    console.log('onFocus');
  };

}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (data) => {
      dispatch(Actions.setUser(data))
    },
    setGuides: (data) => {
      dispatch(Actions.setGuides(data))
    }
  }
}
export default connect(null, mapDispatchToProps)(Splash)