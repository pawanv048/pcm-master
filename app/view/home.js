import React from 'react';
import { Platform, Text, StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, TitleBar, Line, Button, ColButton } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Swiper from 'react-native-swiper'
import Utils from '../util/utils.js';
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import MyStorage from '../storage/storage'
import Api from '../api/api'
import moment from 'moment'
import Purchases from 'react-native-purchases';
const PushNotification = require('react-native-push-notification');
import { Importance } from 'react-native-push-notification';
import GLOBAL from '../constants/global.js';

const styles = StyleSheet.create({
  wrapper: { height: 200, marginTop: 15 },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  categoryParent: {
    marginTop: 10,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  categoryImage: {
    width: 148,
    height: 98,
  },
})

class Home extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  targets = []

  state = {
    loading: false,
    slides: [],
    hasSchedule: false,
    joinedPrograms: [],
    allPrograms: [],
    showMsg: false,
    msg: Strings.t98,
  }

  openSearch = () => {
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    if (this.props.hasSubscribed === '0') {
      this.props.navigation.navigate('Membership');
      return
    }
    this.props.navigation.navigate('Search');
    // Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Search')
  }

  openNotifications = () => {
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Notifications')
  }

  openSubscribe = () => {
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    Utils.moveToScreen(this.props.navigation, 'HomeStack', 'Membership')
  };

  getGuide = (id) => {
    if (this.props.guides.length == 0) {
      return ''
    }
    for (let i = 0; i < this.props.guides.length; i++) {
      const guide = this.props.guides[i];
      if (guide.id === id) {
        // console.log('match: ' + guide.detail);
        return guide.detail
      }
    }
  };

  render() {
    return (
      <Screen statusBarTint='white' onFocus={this.onFocus}>
        <TitleBar
          left
          leftType='custom' // back/menu
          leftOne={
            <TouchableOpacity
              style={[stylesC.center, { width: 45, height: 55 }]}
              onPress={() => {
                this.props.navigation.toggleDrawer()
              }}>
              <Image
                resizeMode={'contain'}
                style={[stylesC.imageM24, { tintColor: Colors.headerTint }]}
                source={require('../assets/menu.png')} />
            </TouchableOpacity>
          }
          right // max 2 buttons
          rightOne={
            <TouchableOpacity
              style={[stylesC.center, { width: 45, height: 55 }]}
              onPress={this.openSearch}>
              <Image
                resizeMode={'contain'}
                style={[stylesC.imageM24, { tintColor: Colors.headerTint }]}
                source={require('../assets/search_white.png')} />
            </TouchableOpacity>
          }
          rightTwo={
            <TouchableOpacity
              style={[stylesC.center, { marginLeft: 10, width: 45, height: 55 }]}
              onPress={this.openNotifications}>
              <Col>
                <Image
                  resizeMode={'contain'}
                  style={[stylesC.imageM24, { tintColor: Colors.headerTint }]}
                  source={require('../assets/bell.png')} />
                {this.props.unreadNotificationCount > 0 ?
                  <Col extraStyle={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', position: 'absolute', marginLeft: 15, marginTop: 0 }]} />
                  :
                  null
                }
              </Col>
            </TouchableOpacity>
          }
          title='PostureCoreMore'
          titlePos='flex-start' />
        <Body loading={false} extraStyle={[{ paddingHorizontal: 15, paddingBottom: 0, paddingTop: 0 }]}>

          <ScrollView
            ref={(ref) => this.scrollView = ref}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{}}>

            {this.state.hasSchedule ?
              <Row extraStyle={[{ marginTop: 15, marginBottom: 5 }]}>
                <Image
                  resizeMode='contain'
                  style={{ width: 25, height: 25, tintColor: 'gray' }}
                  source={require('../assets/calendar.png')} />
                <Text style={[stylesC.textM14, { marginLeft: 15 }]}>
                  {Strings.t99}
                </Text>
                <Col middleRight extraStyle={[{ flex: 1 }]}>
                  <Button
                    label={Strings.t100}
                    activeOpacity={0.6}
                    buttonStyle={[stylesC.buttonOR30, { width: 100, marginHorizontal: 0, alignSelf: 'flex-end' }]}
                    labelStyle={[stylesC.buttonOT14]}
                    onPress={this.openTodaySchedule} />
                </Col>
              </Row>
              :
              null
            }

            {this.state.slides.length > 0 ?
              <Swiper
                autoplay={true}
                dotStyle={{ backgroundColor: 'lightgray', borderWidth: 1, borderColor: 'lightgray', width: 10, height: 10, borderRadius: 5 }}
                activeDotStyle={{ backgroundColor: Colors.themeDark, borderWidth: 1, borderColor: 'lightgray', width: 10, height: 10, borderRadius: 5 }}
                style={styles.wrapper}>
                {this.state.slides.map((item, index) => {
                  return (
                    <View style={styles.slide1} key={index.toString()}>
                      <Image
                        resizeMode='cover'
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: this.getSlideImage(item) }}
                        onPress={() => {
                          Utils.openUrl(item.link)
                        }} />
                    </View>
                  )
                })}
              </Swiper>
              :
              <Col center extraStyle={[styles.wrapper, { backgroundColor: Colors.theme }]}>
                <Text style={[stylesC.textD16, { color: 'white' }]}>
                  {Strings.t101}...
                </Text>
              </Col>
            }

            <Col extraStyle={[{}]}>

              {this.props.hasSubscribed === '1' ?
                null
                :
                <Row extraStyle={[{ marginTop: 10, paddingHorizontal: 8, borderColor: Colors.lineLight, borderWidth: 1, borderRadius: 10 }]}>
                  <Image
                    resizeMode='contain'
                    style={{ width: 50, height: 50 }}
                    source={require('../assets/free.png')} />
                  <Text style={[stylesC.textM14, { marginLeft: 15 }]}>
                    {Strings.t102}
                  </Text>
                  <Col middleRight extraStyle={[{ flex: 1 }]}>
                    <TouchableOpacity
                      style={[stylesC.center, { width: 100, height: 30, alignSelf: 'flex-end', backgroundColor: Colors.red, borderRadius: 15 }]}
                      onPress={this.openSubscribe}>
                      <Text style={[stylesC.textD14, { color: 'white' }]}>
                        {Strings.t103}
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              }

              <Col center extraStyle={[{ marginTop: 10, width: '100%' }]}>
                <ColButton
                  center
                  parentStyle={{ width: '100%', backgroundColor: '#f2f2f2', borderRadius: 10, padding: 5 }}
                  extraStyle={{ padding: 5 }}
                  activeOpacity={0.6}
                  onPress={() => {
                    this.setState({ showMsg: !this.state.showMsg })
                  }}>
                  <Text style={[stylesC.textD14, { color: 'blue' }]}>
                    {this.state.showMsg ? Strings.t104 : Strings.t105}
                  </Text>
                  {this.state.showMsg ?
                    <Text style={[stylesC.textD14, { marginTop: 5, color: Colors.themeDark, width: '100%', textAlign: 'center' }]}>
                      {this.state.msg}
                    </Text>
                    :
                    null
                  }
                </ColButton>
              </Col>

              <Text style={[stylesC.textD16, { marginTop: 5 }]}>
                {Strings.t106}
              </Text>

              <Text style={[stylesC.textM14]}>
                {Strings.t107}
              </Text>
              {this.props.categories.length == 0 ?
                <Col center extraStyle={[styles.wrapper, { height: 200, backgroundColor: Colors.theme }]}>
                  <Text style={[stylesC.textD16, { color: 'white' }]}>
                    {Strings.t101}...
                  </Text>
                </Col>
                :
                <Row center extraStyle={[{ marginTop: 10 }]}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {this.getParentCats(this.props.categories).map((item, index) => {
                      return (
                        <ColButton
                          key={index.toString()}
                          extraStyle={[{ marginRight: 10 }]}
                          onPress={() => {
                            // Utils.moveToScreen(this.props.navigation, 'DrawerStack', 'Library')
                            console.log('category: ' + JSON.stringify(item));
                            this.props.setSelectedCategory(item)
                            this.props.navigation.navigate('Library');
                          }}>
                          <Image
                            resizeMode='cover'
                            style={{ width: 100, height: 200, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                            source={{ uri: this.getCategoryImage(item) }} />
                          <Text style={[stylesC.textDB14, { width: 100, textAlign: 'center', borderColor: Colors.theme, borderWidth: 1, color: Colors.theme, paddingVertical: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                            {item.title}
                          </Text>
                        </ColButton>
                      )
                    })}
                  </ScrollView>
                </Row>
              }

              <Line
                style={[stylesC.lineHL, { marginTop: 20 }]} />

              <Text style={[stylesC.textD16, { marginTop: 10 }]}>
                {Strings.t60}
              </Text>
              <Text style={[stylesC.textM14]}>
                {this.getGuide('special')}
              </Text>
              {this.state.allPrograms.length == 0 ?
                this.state.loading ?
                  <Col center extraStyle={[styles.wrapper, { height: 120, backgroundColor: Colors.theme }]}>
                    <Text style={[stylesC.textD16, { color: 'white' }]}>
                      {Strings.t101} {Strings.t60}...
                    </Text>
                  </Col>
                  :
                  <Col center extraStyle={[styles.wrapper, { height: 50, backgroundColor: 'white' }]}>
                    <Text style={[stylesC.textD16, {}]}>
                      {Strings.t149}
                    </Text>
                  </Col>
                :
                <Row center extraStyle={[{ marginTop: 10 }]}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {this.state.allPrograms.map((item, index) => {
                      return (
                        <ColButton
                          key={index.toString()}
                          extraStyle={[{ width: 180, minHeight: 120, marginRight: 10, borderColor: Colors.theme, borderWidth: 1, color: Colors.theme, paddingVertical: 0, borderRadius: 10 }]}
                          onPress={() => {
                            this.openSpecialProgram(item);
                          }}>

                          <Col center extraStyle={[{ width: '100%', backgroundColor: Colors.theme, minHeight: 25, padding: 10, color: Colors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[stylesC.textD14, { color: 'white' }]}>
                              {item.title}
                            </Text>
                          </Col>

                          <Image
                            resizeMode='contain'
                            style={{ width: 180, height: 180, backgroundColor: '#f2f2f2' }}
                            source={{ uri: this.props.fileUrls.SpecialProgram + item.image }} />

                          <Row center extraStyle={[{ flex: 1, width: '100%', marginTop: 0, backgroundColor: Colors.white, padding: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>

                            <Col extraStyle={[{ flex: 1, height: 80, borderRadius: 5, borderWidth: 1, borderColor: Colors.theme }]}>
                              <Col center extraStyle={[{ height: 40, alignSelf: 'center' }]}>
                                <Text style={[stylesC.textMB12, { textAlign: 'center', color: Colors.theme }]}>
                                  {Strings.t108}
                                </Text>
                              </Col>
                              <Col center extraStyle={[{ height: 40, alignSelf: 'center', backgroundColor: Colors.themeDark, width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                <Text style={[stylesC.textDB14, { fontSize: 20, color: 'white' }]}>
                                  {item.videos}
                                </Text>
                              </Col>
                            </Col>

                            <Col extraStyle={[{ marginLeft: 5, flex: 1, height: 80, borderRadius: 5, borderWidth: 1, borderColor: Colors.purple }]}>
                              <Col center extraStyle={[{ height: 40, alignSelf: 'center' }]}>
                                <Text style={[stylesC.textMB12, { textAlign: 'center', color: Colors.purple }]}>
                                  {Strings.t109}
                                </Text>
                              </Col>
                              <Col center extraStyle={[{ height: 40, alignSelf: 'center', backgroundColor: Colors.purple, width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                <Text style={[stylesC.textDB14, { fontSize: 20, color: 'white' }]}>
                                  {item.programs}
                                </Text>
                              </Col>
                            </Col>
                          </Row>
                        </ColButton>
                      )
                    })}
                  </ScrollView>
                </Row>
              }

              <Button
                label={Strings.t110}
                activeOpacity={0.6}
                buttonStyle={[stylesC.button45, { marginTop: 10, marginBottom: 30 }]}
                labelStyle={[stylesC.buttonT16]}
                onPress={this.openSpecialPrograms} />

            </Col>
          </ScrollView>
        </Body>
      </Screen>
    );
  }

  openSpecialProgram = (item) => {
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    // if (this.props.user.subscriber === '0') {
    //     this.props.navigation.navigate('Membership');
    //     return
    // }
    this.props.navigation.navigate('SpecialProgramDetails', { program: item });
  };

  openSpecialPrograms = () => {
    this.props.navigation.navigate('SpecialPrograms');
  };

  getCategoryImage = (item) => {
    let url = this.props.fileUrls.LibraryImages + item.image
    // console.log('catUrl: ' + url);
    return url
  };

  getSlideImage = (item) => {
    let url = this.props.fileUrls.Slide + item.image
    // console.log('slideUrl: '+url);
    return url
  };

  openTodaySchedule = () => {
    if (this.state.loading)
      return
    if (this.props.user == null) {
      this.props.navigation.navigate('Login');
      return
    }
    if (this.props.hasSubscribed === '0') {
      this.props.navigation.navigate('Membership');
      return
    }
    // Utils.moveToScreen(this.props.navigation, 'HomeStack', 'MyProgramDetails')
    this.props.navigation.navigate('ScheduledPrograms', { joinedPrograms: this.state.joinedPrograms });
  };

  onLeftPress = () => {
    this.props.navigation.toggleDrawer();
  }

  async componentDidMount() {
    console.log('componentDidMount');
    let user = this.props.user
    console.log('home: ' + JSON.stringify(user));
    this.loadFileUrls()
    this.loadSlides()
    this.loadCategories()
    this.loadSpecialPrograms()
    this.loadFilters()
    this.checkSubscriberFreeProgramAccess()
    if (user != null) {
      this.checkIfSubscribed()
    }
    if (Platform.OS === 'android')
      this.createNotificationChannel()
  }

  createNotificationChannel = () => {
    console.log('createNotificationChannel');
    PushNotification.createChannel(
      {
        channelId: GLOBAL.channelId, // (required)
        channelName: GLOBAL.channelName, // (required)
        channelDescription: GLOBAL.channelDesc, // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        vibration: 300,
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  // to check if user unsubscribed
  checkIfSubscribed = async () => {
    console.log('subscribed: ' + this.props.hasSubscribed);
    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      console.log('purchaserInfo: ' + JSON.stringify(purchaserInfo));
      if (purchaserInfo == null)
        return
      const activeSubscriptions = purchaserInfo.activeSubscriptions
      if (activeSubscriptions.length > 0) {
        let subscribed = activeSubscriptions.includes('pcm_subscription')
        if (subscribed) {
          this.props.setHasSubscribed('1')
          this.updateSubcriberStatusOnServer('1')
        }
        else {
          this.props.setHasSubscribed('0')
          this.updateSubcriberStatusOnServer('0')
        }
      }
    } catch (e) {
      // Error fetching purchaser info
    }
  };

  loadGuides = async () => {
    let firstOpen = await MyStorage.getFirstOpen()
    if (firstOpen === 'true') {
      console.log('SHOW GUIDES');
      // this.props.start(); // not showing guides
    }
    else {
      console.log('DONT SHOW GUIDES');
    }
    MyStorage.setFirstOpen('false')
  };

  // free access to programs for members True/False
  checkSubscriberFreeProgramAccess = async () => {
    this.setState({ loading: true })
    let access = await MyStorage.getSubscriberFreeProgramAccess()
    if (access !== null) {
      this.props.setSubscriberFreeProgramAccess(access)
      this.setState({ loading: false })
    }
    Api.subscriberFreeProgramAccess(
      (response) => {
        this.setState({ loading: false })
        if (response.status === 'success') {
          let access = response.data + ''
          this.props.setSubscriberFreeProgramAccess(access)
          MyStorage.setSubscriberFreeProgramAccess(access)
        }
      },
      (error) => {
        this.setState({ loading: false })
      });
  };

  checkTodaySchedule = () => {
    const today = moment().format('ddd')
    console.log('today: ' + today);
    Api.getJoinedPrograms(this.props.user.id,
      (response) => {
        // console.log('getJoinedPrograms: ' + JSON.stringify(response));
        if (response.status === 'success') {
          let programs = response.data
          // group by master id
          // let groups = Utils.getGroupedPrograms(programs)
          this.setState({ joinedPrograms: programs })

          for (let i = 0; i < programs.length; i++) {
            const p = programs[i];
            if (p.program.weekday === today) {
              this.setState({ hasSchedule: true })
              break
            }
          }
        }
      },
      (error) => {
        showErrorToast('' + error);
      });
  };

  onFocus = () => {
    console.log('onFocus');
    // console.log('user: ' + JSON.stringify(this.props.user));
    this.loadHomeNotification()
    if (this.props.user != null) {
      this.loadUnreadNotificationCount()
      this.checkTodaySchedule()
      this.getUserProfile()
    }
  };

  getUserProfile = () => {
    Api.getUserProfile(
      (response) => {
        if (response.status === 'success') {
          let user = this.props.user
          // update free user status
          user.free_user = response.data.free_user
          user.subscriber = response.data.subscriber
          this.props.setUser(user)
          MyStorage.setUser(user)
          // update subscriber status
          this.props.setHasSubscribed(user.subscriber + '')
          this.loadGuides()
        }
      },
      (error) => {
        //
      });
  };

  updateSubcriberStatusOnServer = (status) => {
    Api.updateSubscribeStatus(status,
      (response) => {
        if (response.status === 'success') {
          let user = this.props.user
          user.subscriber = status
          this.props.setUser(user)
          MyStorage.setUser(user)
          // load subscriber status to see if status actually updated
          this.getUserProfile()
        }
      },
      (error) => {
        showErrorToast('' + error);
      });
  };

  loadUnreadNotificationCount = () => {
    Api.getUnreadNotificationCount(this.props.user.id,
      (response) => {
        this.props.setUnreadNotificationCount(response.data)
      },
      (error) => {
        //
      });
  };

  loadHomeNotification = () => {
    Api.getHomeNotification(
      (response) => {
        if (response.status === 'success') {
          this.setState({ showMsg: true, msg: response.data.message })
        }
      },
      (error) => {
        //
      });
  };

  loadFileUrls = async () => {
    this.setState({ loading: true })
    let urls = await MyStorage.getFileUrls()
    if (urls !== null) {
      this.setState({ loading: false })
      this.props.setFileUrls(urls)
    }
    Api.fileUrls(
      (response) => {
        this.setState({ loading: false })
        const urls = response
        this.props.setFileUrls(urls)
        MyStorage.setFileUrls(urls)
      },
      (error) => {
        this.setState({ loading: false })
      });
  };

  loadSlides = async () => {
    this.setState({ loading: true })
    let slides = await MyStorage.getSlides()
    if (slides !== null) {
      this.setState({ slides: slides, loading: false })
    }
    Api.getSlides(
      (response) => {
        this.setState({ loading: false })
        const slides = response
        MyStorage.setSlides(slides)
        this.setState({ slides: slides })
      },
      (error) => {
        this.setState({ loading: false })
      });
  };

  loadCategories = async () => {
    this.setState({ loading: true })
    let cats = await MyStorage.getCategories()
    if (cats !== null) {
      this.setState({ loading: false })
      this.props.setCategories(cats)
    }
    Api.getCategories('library',
      (response) => {
        this.setState({ loading: false })
        const cats = response
        this.props.setCategories(cats)
        MyStorage.setCategories(cats)
      },
      (error) => {
        this.setState({ loading: false })
      });
  };

  loadSpecialPrograms = () => {
    let user_id = '0'
    if (this.props.user != null)
      user_id = this.props.user.id
    setTimeout(() => {
      this.setState({ loading: true })
      Api.getSpecialPrograms(user_id, 'all', '1', '1',
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

  getParentCats = (cats) => {
    let parentCats = []
    for (let i = 0; i < cats.length; i++) {
      const cat = cats[i];
      if (cat.parent_id + '' === '0') {
        parentCats = parentCats.concat(cat)
      }
    }
    console.log('parentCats: ' + parentCats.length);
    return parentCats
  };

  loadFilters = async () => {
    this.setState({ loading: true })
    let filters = await MyStorage.getFilters()
    if (filters !== null) {
      this.props.setFilters(filters)
      this.setState({ loading: false })
    }
    Api.filters(
      (response) => {
        this.setState({ loading: false })
        const filters = response
        // console.log('filters: ' + JSON.stringify(filters));
        this.props.setFilters(filters)
        MyStorage.setFilters(filters)
        // this.setState({ ages: filters.ages, goals: filters.goals })
      },
      (error) => {
        this.setState({ loading: false })
      });
  };

}

const mapStateToProps = state => {
  return {
    user: state.UserReducer.user,
    guides: state.GuidesReducer.guides,
    fileUrls: state.FileUrlsReducer.fileUrls,
    categories: state.CategoriesReducer.categories,
    filters: state.FiltersReducer.filters,
    unreadNotificationCount: state.NotificationCountReducer.unreadNotificationCount,
    hasSubscribed: state.HasSubscribedReducer.hasSubscribed,
    subscriberFreeProgramAccess: state.SubscriberFreeProgramAccess.subscriberFreeProgramAccess,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setUser: (data) => {
      dispatch(Actions.setUser(data))
    },
    setFileUrls: (data) => {
      dispatch(Actions.setFileUrls(data))
    },
    setCategories: (data) => {
      dispatch(Actions.setCategories(data))
    },
    setSelectedCategory: (data) => {
      dispatch(Actions.setSelectedCategory(data))
    },
    setFilters: (data) => {
      dispatch(Actions.setFilters(data))
    },
    setUnreadNotificationCount: (data) => {
      dispatch(Actions.setUnreadNotificationCount(data))
    },
    setHasSubscribed: (data) => {
      dispatch(Actions.setHasSubscribed(data))
    },
    setSubscriberFreeProgramAccess: (data) => {
      dispatch(Actions.setSubscriberFreeProgramAccess(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)