import React from 'react';
import { Platform, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Content } from 'native-base';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { stylesC } from '../styles/style_common.js';
import { Button, Row, Col, Box, ListItem, Start, Center } from '../custom/components.js';
import Utils from '../util/utils.js';
import MyStorage from '../storage/storage'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Api, { googleDownloadLink, appleDownloadLink, privacyUrl, termsUrl } from '../api/api'

class NavDrawer extends React.Component {

  constructor(props) {
    super(props);
  }

  openHome = () => {
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Home')
  };

  openHowTo = ()=>{
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'HowTo')
  };

  openMembership = () => {
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Membership')
  };

  openFavorites = () => {
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Favorites')
  };

  openMyPrograms = () => {
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'MyPrograms')
  };

  openSpecialPrograms = () => {
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'SpecialPrograms')
  };

  openLibrary = () => {
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Library')
  };

  openWorkUpTo = () => {
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'WorkUpTo')
  };

  openChat = () => {
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Chat')
    this.props.setUnreadChatCount(0)
  };

  openEquipmentNeeds = () => {
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Equipment')
  };

  openEditProfile = () => {
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'EditProfile')
  };

  shareApp = () => {
    const downloadLink = Platform.OS === 'android' ? googleDownloadLink : appleDownloadLink
    Utils.onShare('PostureCoreAndMore', Strings.t52+' ' + downloadLink)
  };

  logoutUser = () => {
    MyStorage.setLogin('false')
    MyStorage.setUser(null)
    this.props.setUser(null)
    this.props.setHasSubscribed('0')
  };

  openLogin = () => {
    this.openHome()
    Utils.moveToScreen(this.props.navigation, 'LoginStack', 'Login')
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

  openPrivacy = () => {
    Utils.openUrl(privacyUrl)
  };

  openTerms = () => {
    Utils.openUrl(termsUrl)
  };

  render() {
    return (
      <ScrollView>
        <Col style={[stylesC.main, { paddingHorizontal: 0 }]}>

          {this.props.user == null ?
            <Col style={[stylesC.drawerHeader, { height: 180 }]}>
              <Image
                resizeMode='contain'
                style={{ width: 70, height: 70, alignSelf: 'center', }}
                source={require('../assets/logo.png')} />
              <Row center extraStyle={[{ marginTop: 20 }]}>
                <Button
                  label={Strings.t53}
                  activeOpacity={0.6}
                  buttonStyle={[stylesC.buttonOR30, { width: 200, marginRight: 10, borderColor: 'white' }]}
                  labelStyle={[stylesC.buttonOT14, { color: 'white' }]}
                  onPress={this.openLogin} />
              </Row>
            </Col>
            :
            <Col style={[stylesC.drawerHeader]}>
              <Image
                resizeMode='cover'
                style={{ width: 80, height: 80, alignSelf: 'center', borderRadius: 40, borderWidth: 2, borderColor: 'white', backgroundColor: 'lightgray' }}
                source={this.getProfilePhoto()} />
              <Text style={[stylesC.textD14, { color: 'white', marginTop: 5 }]}>
                {this.props.user.fname} {this.props.user.lname}
              </Text>
              <TouchableOpacity
                style={[stylesC.buttonOR30, { width: 150, alignSelf: 'center', marginTop: 5, marginHorizontal: 0, borderColor: 'white', flexDirection: 'row' }]}
                activeOpacity={0.6}
                onPress={this.openEditProfile}>
                <Image
                  resizeMode='contain'
                  style={{ width: 17, height: 17, marginRight: 5, tintColor: 'white' }}
                  source={require('../assets/edit.png')} />
                <Text style={[stylesC.buttonOT14, { color: 'white' }]}>
                  {Strings.t54}
                </Text>
              </TouchableOpacity>
            </Col>
          }

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openHome}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t55}
              </Text>
            </Center>
          </ListItem>

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openHowTo}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t202}
              </Text>
            </Center>
          </ListItem>

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openMembership}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t56}
              </Text>
            </Center>
          </ListItem>

          {this.props.user == null ?
            null
            :
            <ListItem
              containerStyle={[stylesC.menuItemP]}
              activeOpacity={0.6}
              parentStyle={[stylesC.menuItem, { padding: 0 }]}
              lineStyle={[stylesC.lineHL]}
              onPress={this.openMyPrograms}>
              <Center style={[stylesC.menuCenter]}>
                <Text style={stylesC.textM14}>
                  {Strings.t57}
                </Text>
              </Center>
            </ListItem>
          }

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openLibrary}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t58}
              </Text>
            </Center>
          </ListItem>

          {this.props.user == null ?
            null
            :
            <ListItem
              containerStyle={[stylesC.menuItemP]}
              activeOpacity={0.6}
              parentStyle={[stylesC.menuItem, { padding: 0 }]}
              lineStyle={[stylesC.lineHL]}
              onPress={this.openFavorites}>
              <Center style={[stylesC.menuCenter]}>
                <Text style={stylesC.textM14}>
                  {Strings.t59}
                </Text>
              </Center>
            </ListItem>
          }

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openSpecialPrograms}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t60}
              </Text>
            </Center>
          </ListItem>

          {this.props.user == null ?
            null
            :
            <ListItem
              containerStyle={[stylesC.menuItemP]}
              activeOpacity={0.6}
              parentStyle={[stylesC.menuItem, { padding: 0 }]}
              lineStyle={[stylesC.lineHL]}
              onPress={this.openWorkUpTo}>
              <Center style={[stylesC.menuCenter]}>
                <Text style={stylesC.textM14}>
                  {Strings.t61}
                </Text>
              </Center>
            </ListItem>
          }

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openEquipmentNeeds}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t62}
              </Text>
            </Center>
          </ListItem>

          {this.props.user == null ?
            null
            :
            <ListItem
              containerStyle={[stylesC.menuItemP]}
              activeOpacity={0.6}
              parentStyle={[stylesC.menuItem, { padding: 0 }]}
              lineStyle={[stylesC.lineHL]}
              onPress={this.openChat}>
              <Center style={[stylesC.menuCenter]}>
                <Row>
                  <Text style={stylesC.textM14}>
                    {Strings.t63}
                  </Text>
                  {this.props.unreadChatCount == 0 || !this.props.unreadChatCount?
                    null
                    :
                    <Col center extraStyle={[{ marginLeft: 8, width: 25, height: 25, borderRadius: 13, backgroundColor: Colors.theme }]}>
                      <Text style={[stylesC.textD12, { color: 'white' }]}>
                        {this.props.unreadChatCount > 9 ? '9+' : this.props.unreadChatCount}
                      </Text>
                    </Col>
                  }
                </Row>
              </Center>
            </ListItem>
          }

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.shareApp}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t64}
              </Text>
            </Center>
          </ListItem>

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openPrivacy}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t65}
              </Text>
            </Center>
          </ListItem>

          <ListItem
            containerStyle={[stylesC.menuItemP]}
            activeOpacity={0.6}
            parentStyle={[stylesC.menuItem, { padding: 0 }]}
            lineStyle={[stylesC.lineHL]}
            onPress={this.openTerms}>
            <Center style={[stylesC.menuCenter]}>
              <Text style={stylesC.textM14}>
                {Strings.t66}
              </Text>
            </Center>
          </ListItem>

          {this.props.user == null ?
            null
            :
            <ListItem
              containerStyle={[stylesC.menuItemP]}
              activeOpacity={0.6}
              parentStyle={[stylesC.menuItem, { padding: 0 }]}
              lineStyle={[stylesC.lineHL]}
              onPress={this.logoutUser}>
              <Center style={[stylesC.menuCenter]}>
                <Text style={stylesC.textM14}>
                  {Strings.t67}
                </Text>
              </Center>
            </ListItem>
          }
        </Col>
      </ScrollView>
    );
  }

  componentDidMount() {
    // console.log('drawer componentDidMount');
    if (this.props.user != null)
      this.loadUnreadChatCount()
  }

  loadUnreadChatCount = () => {
    Api.getUnreadChatCount(this.props.user.id,
      (response) => {
        this.props.setUnreadChatCount(response.data)
      },
      (error) => {
        //
      });
  };

}

const mapStateToProps = state => {
  return {
    user: state.UserReducer.user,
    fileUrls: state.FileUrlsReducer.fileUrls,
    unreadChatCount: state.ChatCountReducer.unreadChatCount
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setUser: (data) => {
      dispatch(Actions.setUser(data))
    },
    setUnreadChatCount: (data) => {
      dispatch(Actions.setUnreadChatCount(data))
    },
    setHasSubscribed: (data) => {
      dispatch(Actions.setHasSubscribed(data))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavDrawer)
