import React from 'react';
import { Text, Image, View, FlatList, Alert } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, showToast, showErrorToast, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Clipboard from '@react-native-clipboard/clipboard';

class Favorites extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        videos: []
    }

    onLeftPress = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='menu' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t59}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.videos}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem} />
                        </View>

                        {!this.state.loading && this.state.videos.length == 0 ?
                            this.showNotFound()
                            :
                            null
                        }

                    </Col>
                </Body>
            </Screen>
        );
    }

    showNotFound = () => {
        return (
            <Col center extraStyle={[{ height: 50 }]}>
                <Text style={[stylesC.textM16]}>
                    {Strings.t51}
                </Text>
            </Col>
        )
    };

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={1}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    // handle item click
                }}>
                <Start>
                    <Image
                        resizeMode='contain'
                        style={{ width: 150, height: 100, borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}
                        source={{ uri: this.props.fileUrls.LibraryImages + item.video.thumbnail }} />
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textM16}>
                        {item.video.title}
                    </Text>
                    {item.category != null ?
                        <Text style={[stylesC.textM14, { color: Colors.theme }]}>
                            {item.category.title}
                        </Text>
                        :
                        null
                    }

                    <Row extraStyle={[{ marginTop: 10 }]}>
                        <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center]}
                            imageStyle={[stylesC.imageM28, { tintColor: Colors.theme }]}
                            resizeMode='contain'
                            source={require('../assets/play.png')}
                            onPress={() => {
                                this.playVideo(item.video)
                            }} />
                        <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM30, { tintColor: Colors.theme }]}
                            resizeMode='contain'
                            source={require('../assets/star.png')}
                            onPress={() => {
                                this.removeFromFavorites(item.video)
                            }} />
                        <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM26, { tintColor: item.workupto === '1' ? Colors.theme : Colors.gray }]}
                            resizeMode='contain'
                            source={require('../assets/workupto.png')}
                            onPress={() => {
                                this.addToWorkUpTo(item)
                            }} />
                        {/* <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM28, { tintColor: Colors.theme }]}
                            resizeMode='contain'
                            source={require('../assets/copy.png')}
                            onPress={() => {
                                this.copyVideoId(item.video)
                            }} /> */}
                    </Row>
                </Center>
                <End>

                </End>
            </ListItem>
        )
    }

    playVideo = (item) => {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        if (this.props.user.subscriber === '0') {
            this.props.navigation.navigate('Membership');
            return
        }
        this.props.navigation.navigate('PlayVideo', { video: item });
    };

    removeFromFavorites = (item) => {
        Alert.alert( // react-native
            Strings.t89,
            Strings.t90,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t92, onPress: () => {
                        // delete locally
                        this.setState(state => {
                            const videos = state.videos.filter((item_, j) => {
                                return item_.video.id !== item.id; //false will delete
                            });
                            return { videos: videos };
                        });

                        Api.addRemoveFavoriteVideo(this.props.user.id, item.id,
                            (response) => {
                                console.log('addRemoveFavoriteVideo: ' + JSON.stringify(response));
                            },
                            (error) => {
                                console.log('addRemoveFavoriteVideo error: ' + error);
                            });
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );
    };

    addToWorkUpTo = (item) => {
        let workupto = '0'
        if (item.workupto === '0') {
            workupto = '1'
        }
        else {
            workupto = '0'
        }
        // update locally
        this.setState(state => {
            const videos = state.videos.map((item_) => {
                if (item_.id === item.id) {
                    return { ...item_, workupto: workupto };
                }
                else {
                    return item_;
                }
            });
            return { videos: videos };
        });

        // this.setState({ loading: true })
        Api.addWorkUpTo('toggle', this.props.user.id, item.video.id, item.video.title,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    // showToast(Strings.t47)
                }
                else {
                    showErrorToast(response.msg)
                }
            },
            (error) => {
                this.setState({ loading: false })
            });
    };

    copyVideoId = (item) => {
        Clipboard.setString(item.id)
        showToast(Strings.t93)
    };

    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        if (this.props.user == null)
            return
        this.loadVideos()
    };

    loadVideos = () => {
        this.setState({ loading: true });
        Api.getFavoriteVideos(this.props.user.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    this.setState({ videos: response.data })
                }
                else {
                    showErrorToast(response.msg)
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
        fileUrls: state.FileUrlsReducer.fileUrls,
        user: state.UserReducer.user,
    }
}
export default connect(mapStateToProps, {})(Favorites)
