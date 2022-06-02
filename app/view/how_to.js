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

class HowTo extends React.Component {
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
                    title={Strings.t203}
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
        Api.getGuideVideos(
            (response) => {
                this.setState({ loading: false, videos: response })
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
export default connect(mapStateToProps, {})(HowTo)
