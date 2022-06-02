import React from 'react';
import { Text, Image, View, FlatList } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, SearchBar, showErrorToast, showToast, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Clipboard from '@react-native-clipboard/clipboard';

class Search extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        search: '',
        videos: []
    }

    onLeftPress = () => {
        // this.props.navigation.goBack();
        this.props.navigation.navigate('Home');
    };

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        if (this.props.hasSubscribed === '0' && this.props.user.free_user + '' === '0') {
            this.props.navigation.navigate('Membership');
            return
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <Row middleLeft extraStyle={[{ height: 60, backgroundColor: Colors.theme }]}>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center]}
                        imageStyle={[stylesC.imageM28, { marginHorizontal: 10, tintColor: 'white' }]}
                        resizeMode='contain'
                        source={require('../assets/back.png')}
                        onPress={this.onLeftPress} />
                    <SearchBar
                        hint={Strings.t166}
                        onChangeText={(text) => {
                            this.setState({ search: text })
                        }}
                        onSearch={(text) => {
                            this.searchVideos(text)
                        }} />
                </Row> 
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <Text style={[stylesC.textM16, { marginTop: 10, marginHorizontal: 20 }]}>
                            {Strings.t167}: {this.state.videos.length} {Strings.t108}
                        </Text>

                        <View style={[{ marginTop: 10, paddingBottom:20 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.videos}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem} />
                        </View>

                    </Col>
                </Body>
            </Screen>
        );
    }

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
                        source={{ uri: this.props.fileUrls.LibraryImages + item.thumbnail }} />
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textM16}>
                        {item.title}
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
                                this.playVideo(item)
                            }} />
                        <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM30, { tintColor: item.liked === '1' ? Colors.theme : Colors.iconMedium }]}
                            resizeMode='contain'
                            source={require('../assets/star.png')}
                            onPress={() => {
                                this.addToFavorite(item)
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
                        <IconCustomButton
                            canUpdate
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM28, { tintColor: Colors.theme }]}
                            resizeMode='contain'
                            source={require('../assets/copy.png')}
                            onPress={() => {
                                this.copyVideoId(item)
                            }} />
                    </Row>
                </Center>
                <End>

                </End>
            </ListItem>
        )
    }

    playVideo = (item) => {
        this.props.navigation.navigate('PlayVideo', {video: item});
    };

    addToFavorite = (item) => {
        // this.setState({ loading: true })
        let liked = '0'
        if (item.liked === '0') {
            liked = '1'
        }
        else {
            liked = '0'
        }
        // update locally
        this.setState(state => {
            const videos = state.videos.map((item_) => {
                if (item_.id === item.id) {
                    return { ...item_, liked: liked };
                }
                else {
                    return item_;
                }
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
        Api.addWorkUpTo('toggle', this.props.user.id, item.id, item.title,
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
    };

    searchVideos = (text) => {
        if(text === '') return
        
        this.setState({ loading: true })
        Api.searchVideos(text,
            (response) => {
                const videos = response.data
                if (response.status === 'success') {
                    this.setState({ loading: false, videos: videos })
                }
            },
            (error) => {
                this.setState({ loading: false })
            });
    };

}

const mapStateToProps = state => {
    return {
        fileUrls: state.FileUrlsReducer.fileUrls,
        user: state.UserReducer.user,
        hasSubscribed: state.HasSubscribedReducer.hasSubscribed,
    }
}
export default connect(mapStateToProps, {})(Search)