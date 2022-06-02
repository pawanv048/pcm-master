import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RootStore from './app/redux/RootStore';
import { View, Alert, Text, Linking, Platform } from 'react-native';
import { createAppContainer, BottomNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Splash from './app/view/splash.js';
import Login from './app/view/login.js';
import Signup from './app/view/signup.js';
import ForgotPassword from './app/view/forgot_password';
import Home from './app/view/home';
import Library from './app/view/library.js';
import LibraryLimited from './app/view/library_limited';
import LibraryVideos from './app/view/library_videos';
import Membership from './app/view/membership';
import Search from './app/view/search';
import PlayVideo from './app/view/play_video';
import Notifications from './app/view/notifications';
import Chat from './app/view/chat';
import Equipment from './app/view/equipment';
import EditProfile from './app/view/edit_profile';
import SpecialPrograms from './app/view/special_programs';
import SpecialProgramDetails from './app/view/special_program_details';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import MyStorage from './app/storage/storage'

import Reminders from './app/view/reminders';
import HowTo from './app/view/how_to';
import Favorites from './app/view/favorites';
import MyPrograms from './app/view/my_programs';
import ScheduledPrograms from './app/view/scheduled_programs';
import MyProgramDetails from './app/view/my_program_details';
import AddProgram from './app/view/add_program';
import AddWeeklyProgram from './app/view/add_weekly_program';
import ChooseVideo from './app/view/choose_video';
import WorkUpTo from './app/view/workupto.js';
import AddWorkUpTo from './app/view/add_workupto';
import NavDrawer from './app/view/drawer.js';
import { Root } from "native-base";
import { extendTheme, NativeBaseProvider } from "native-base";
import { stylesC } from './app/styles/style_common.js';
import { IconCustom } from './app/custom/components.js';
import * as Colors from './app/constants/colors.js';
import { Actions } from './app/redux/Actions'
import EventBus from 'react-native-event-bus'
import SyncStorage from 'sync-storage';
import GLOBAL from './app/constants/global.js';
import Purchases from 'react-native-purchases';
import Utils from './app/util/utils.js';
import ExpandImage from './app/util/expand_image';

import setupPush from './app/util/setup_push.js';
setupPush();

const SplashStack = createStackNavigator({
  Splash: Splash,
}, {
  /* The header settings */
  defaultNavigationOptions: null
});

const LoginStack = createStackNavigator({
  Login: Login,
  Signup: Signup,
  ForgotPassword: ForgotPassword
}, {
  /* The header settings */
  defaultNavigationOptions: null
});

// const HomeStack = createStackNavigator({
//   Home: Home,
//   Membership: Membership,
// }, {
//   headerMode: 'float',
//   /* The header settings */
//   defaultNavigationOptions: null
// });

const LibraryStack = createStackNavigator({
  Library: Library,
  LibraryVideos: LibraryVideos,
  // Login: Login, // testing
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const SpecialProgramsStack = createStackNavigator({
  SpecialPrograms: SpecialPrograms,
  SpecialProgramDetails: SpecialProgramDetails,
  LibraryLimited: LibraryLimited,
  LibraryVideos: LibraryVideos,
  // Login: Login, // testing
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const MyProgramsStack = createStackNavigator({
  MyPrograms: MyPrograms,
  MyProgramDetails: MyProgramDetails,
  AddProgram: AddProgram,
  AddWeeklyProgram: AddWeeklyProgram,
  // Login: Login, // testing
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

// const ScheduledProgramsStack = createStackNavigator({
//   ScheduledPrograms: ScheduledPrograms,
//   MyProgramDetails: MyProgramDetails,
// }, {
//   headerMode: 'float',
//   /* The header settings */
//   defaultNavigationOptions: null
// });

const WorkUpToStack = createStackNavigator({
  WorkUpTo: WorkUpTo,
  AddWorkUpTo: AddWorkUpTo,
  PlayVideo: PlayVideo, // testing
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const TabStack = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <IconCustom
              conatinerStyle={[stylesC.center]}
              imageStyle={[stylesC.imageM28, { tintColor: tintColor, width: 25, height: 25 }]}
              resizeMode='contain'
              source={require('./app/assets/home.png')} />
          </View>),
      }
    },
    Library: {
      screen: LibraryStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <IconCustom
              conatinerStyle={[stylesC.center]}
              imageStyle={[stylesC.imageM28, { tintColor: tintColor, width: 25, height: 25 }]}
              resizeMode='contain'
              source={require('./app/assets/library.png')} />
          </View>),
      }
    },
    SpecialPrograms: {
      screen: SpecialProgramsStack,
      navigationOptions: {
        tabBarLabel: 'Special Programs',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <IconCustom
              conatinerStyle={[stylesC.center]}
              imageStyle={[stylesC.imageM24, { tintColor: tintColor }]}
              resizeMode='contain'
              source={require('./app/assets/special.png')} />
          </View>),
      }
    },
    Favorites: {
      screen: Favorites,
      navigationOptions: {
        tabBarLabel: 'Favorites',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <IconCustom
              conatinerStyle={[stylesC.center]}
              imageStyle={[stylesC.imageM28, { tintColor: tintColor, width: 28, height: 28 }]}
              resizeMode='contain'
              source={require('./app/assets/star.png')} />
          </View>),
      }
    },
    MyPrograms: {
      screen: MyProgramsStack,
      navigationOptions: {
        tabBarLabel: 'My Programs',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <IconCustom
              conatinerStyle={[stylesC.center]}
              imageStyle={[stylesC.imageM28, { tintColor: tintColor, width: 25, height: 25 }]}
              resizeMode='contain'
              source={require('./app/assets/programs.png')} />
          </View>),
      }
    },

  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.white,
      inactiveTintColor: Colors.themeDark,
      style: { backgroundColor: Colors.theme }
    },
  },
);

// const DrawerStack = createStackNavigator({
//   Home: Home,
//   Library: Library,
// }, {
//   headerMode: 'float',
//   /* The header settings */
//   defaultNavigationOptions: null
// });

const EquipmentStack = createStackNavigator({
  Equipment: Equipment,
  ExpandImage: ExpandImage,
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const SearchStack = createStackNavigator({
  Search: Search,
  PlayVideo: PlayVideo,
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const HowToStack = createStackNavigator({
  HowTo: HowTo,
  PlayVideo: PlayVideo,
}, {
  headerMode: 'float',
  /* The header settings */
  defaultNavigationOptions: null
});

const HomeStack = createDrawerNavigator({
  DrawerStack: TabStack,
  ScheduledPrograms: ScheduledPrograms,
  Membership: Membership,
  Search: SearchStack,
  WorkUpToStack: WorkUpToStack,
  ChooseVideo: ChooseVideo,
  PlayVideo: PlayVideo,
  Notifications: Notifications,
  Chat: Chat,
  Equipment: EquipmentStack,
  EditProfile: EditProfile,
  Login: Login, // testing
  ExpandImage: ExpandImage,
  HowTo: HowToStack,
  Reminders:Reminders
}, {
  drawerWidth: 300,
  gesturesEnabled: false,
  headerMode: 'none',
  contentComponent: NavDrawer
});

const MainStack = createStackNavigator({
  Splash: SplashStack,
  LoginStack: LoginStack,
  HomeStack: HomeStack,
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

const AppContainer = createAppContainer(MainStack);

const theme = extendTheme({
  components: {
    Toast: {
      baseStyle: {},
      defaultProps: {},
      variants: {},
      sizes: {},
    }
  }
});

class App extends Component<Props> {

  render() {
    let uriPrefix = 'https://www.posturecoremore.com'
    return <Provider store={RootStore}>
      <AppContainer uriPrefix={uriPrefix} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  }

  topic = 'public_notification';
  componentDidMount() {
    console.log("App mount")
    SyncStorage.init();
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup("xGDJtxTceBRTvrQvJkHNojloMhZjvQBN");
    messaging()
      .subscribeToTopic(this.topic)
      .then(() => console.log('Subscribed to topic!'));

    this.createNotificationListeners();
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });
    Linking.addEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = (event) => { // D
    this.navigate(event.url);
  }

  navigate = (url) => { // E
    console.log('NAVIGATE: ' + url);
    if (url == null)
      return
    if (url.includes('/Login'))
      return
    console.log('url: ' + url);
    const route = url.replace(/.*?:\/\//g, '');
    // const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('/')[0];
    const dataArr = url.split('?');
    const params = {};
    if (dataArr[1]) {
      dataArr[1].split('&').map(param => {
        params[param.split('=')[0]] = param.split('=')[1];
      })
    }

    const id = params['program']

    console.log('route: ' + route);
    console.log('id: ' + id);
    console.log('routeName: ' + routeName);

    if (GLOBAL.navigation != null) {
      setTimeout(async () => {
        // GLOBAL.openUniversalLink = false
        console.log('OPEN DEEPLINK');
        // check if logged in
        let isLogin = await MyStorage.isLogin();
        if (isLogin === 'true') {
          GLOBAL.navigation.navigate('MyProgramDetails', { master_id: id });
        }
        else {
          Utils.moveToStack(GLOBAL.navigation, 'LoginStack')
        }
      }, 50);
    }
    else {
      console.log('NULL NAVIGATION');
    }

  }

  componentWillUnmount() {
    console.log('App unmount');
    this.notificationListener();
  }

  async createNotificationListeners() {
    this.notificationListener = messaging().onMessage(async (notification) => {
      console.log('onNotification: ' + JSON.stringify(notification));
      EventBus.getInstance().fireEvent("Notification", {})
      if (notification.data) {
        if (notification.data.type === 'Message') {
          return
        }
      }
      let isLogin = await MyStorage.isLogin()
      if (isLogin === 'true') {
        this.showAlert(notification.notification.title, notification.notification.body);
      }
    });
  }

  showAlert = (title, body) => {
    Alert.alert( // react-native
      title,
      body,
      [
        {
          text: 'OK', onPress: () => {
            //
          }
        }, // positive
      ],
      {
        cancelable: true
      }
    );
  };
}

export default App