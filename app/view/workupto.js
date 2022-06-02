import React from 'react';
import { Text, Image, View, FlatList, Alert } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, showErrorToast, showToast, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'

class WorkUpTo extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        list: []
    }

    onLeftPress = () => {
        this.props.navigation.toggleDrawer();
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
                    leftType='menu' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t61}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.list}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={this.showHeader}
                                renderItem={this._renderItem} />
                        </View>

                        {!this.state.loading && this.state.list.length == 0 ?
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
                    {Strings.t88}
                </Text>
            </Col>
        )
    };

    showHeader = () => {
        return (
            <Row spaceBetween extraStyle={[{ margin: 10 }]}>
                <Button
                    label={Strings.t150}
                    activeOpacity={0.6}
                    buttonStyle={[stylesC.button45, { flex: 1, marginTop: 0, marginRight: 10 }]}
                    labelStyle={[stylesC.buttonT16]}
                    onPress={this.addWorkUpto} />
            </Row>
        )
    };

    addWorkUpto = () => {
        Utils.moveToScreen(this.props.navigation, 'HomeStack', 'AddWorkUpTo')
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
                    <Row middleRight extraStyle={[{ marginTop: 10 }]}>
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
                            conatinerStyle={[stylesC.center, { marginLeft: 15 }]}
                            imageStyle={[stylesC.imageM28, { tintColor: Colors.red }]}
                            resizeMode='contain'
                            source={require('../assets/delete.png')}
                            onPress={() => {
                                this.deleteWorkUpTo(item)
                            }} />
                    </Row>
                </Center>
                <End>

                </End>
            </ListItem>
        )
    }

    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        this.loadData()
    };

    playVideo = (item) => {
        this.props.navigation.navigate('PlayVideo', { video: item.video });
    };

    deleteWorkUpTo = (item) => {
        Alert.alert( // react-native
            Strings.t199,
            Strings.t200,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t201, onPress: () => {
                        // locally
                        this.setState(state => {
                            const list = state.list.filter((item_, j) => {
                                return item_.id !== item.id; //false will delete
                            });
                            return { list: list };
                        });
                        Api.deleteWorkUpTo(item.id,
                            (response) => {
                                if (response.status === 'success') {
                                    this.setState({ loading: false })
                                }
                                else {
                                    showErrorToast(response.msg)
                                }
                            },
                            (error) => {
                                // this.setState({ loading: false })
                            });
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );
    };

    loadData = () => {
        this.setState({ loading: true })
        Api.getWorkUpToList(this.props.user.id,
            (response) => {
                const list = response.data
                if (response.status === 'success') {
                    this.setState({ loading: false, list: list })
                }
                else {
                    showErrorToast(response.msg)
                }
            },
            (error) => {
                this.setState({ loading: false })
            });
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls,
    }
}
export default connect(mapStateToProps, {})(WorkUpTo)
