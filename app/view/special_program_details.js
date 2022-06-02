import React from 'react';
import { Text, Image, View, Alert } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, ColButton, Row, Button, IconCustomButton, showToast, showErrorToast, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import Utils from '../util/utils.js';
import { Actions } from '../redux/Actions'
import Purchases from 'react-native-purchases';
import MyImageViewer from '../util/image_viewer'

class SpecialProgramDetails extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        program: null,
        tab: 'videos', // videos, sections, programs
        videos: [],
        sections: [],
        programs: [],
        joined: '0',
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    checkSubscribedAndFreeAccess = () => {
        if (this.props.hasSubscribed === '1'
            && this.props.subscriberFreeProgramAccess === '1')
            return true
        return false
    };

    calculateExpiry = () => {
        return this.state.program.non_member_expiry
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    canUpdate
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t133}
                    titlePos='flex-start' />
                <MyImageViewer
                    ref={(ref) => this.imageViewer = ref} />
                {this.state.program == null ?
                    null
                    :
                    <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 20, backgroundColor: 'white' }]}>

                        <Col
                            center
                            extraStyle={[{ backgroundColor: 'black', width: '100%', }]}>
                            <ColButton
                                extraStyle={[{ alignSelf:'center'}]}
                                activeOpacity={0.9}
                                onPress={() => {
                                    this.imageViewer.showPopup(this.props.fileUrls.SpecialProgram + this.state.program.image)
                                }}>
                                <Image
                                    resizeMode='contain'
                                    style={{ width: 150, height: 250, alignSelf: 'center', backgroundColor: '#f2f2f2' }}
                                    source={{ uri: this.props.fileUrls.SpecialProgram + this.state.program.image }}
                                />
                            </ColButton>
                        </Col>

                        <Row spaceBetween extraStyle={[{ paddingHorizontal: 15, marginTop: 10 }]}>
                            <Text style={stylesC.textMB16}>
                                {this.state.program.title}
                            </Text>
                            <Text style={[stylesC.textMB16, { color: Colors.theme }]}>
                                {this.state.program.price === '0' ?
                                    Strings.t176
                                    :
                                    this.checkSubscribedAndFreeAccess() ?
                                        Strings.t176
                                        :
                                        '$' + this.state.program.price
                                }
                            </Text>
                        </Row>
                        {this.state.joined === '1' && this.props.hasSubscribed === '0' && this.state.program.non_member_expiry != null ?
                            <Text style={[stylesC.textD14, { color: 'red', marginLeft: 15, marginRight: 15, marginTop: 5 }]}>
                                {Strings.t177} {this.calculateExpiry()} {Strings.t178}.
                            </Text>
                            :
                            null
                        }

                        <Row center extraStyle={[{ padding: 10 }]}>
                            <Col>
                                <Button
                                    canUpdate
                                    label={Strings.t108}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 100, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'videos' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onVideosPress} />
                            </Col>
                            {/* <Col extraStyle={[{ marginLeft: 10 }]}>
                                <Button
                                    canUpdate
                                    label='Sections'
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 100, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'sections' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onSectionsPress} />
                            </Col> */}
                            <Col extraStyle={[{ marginLeft: 10 }]}>
                                <Button
                                    canUpdate
                                    label={Strings.t109}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.buttonR30, { width: 150, marginTop: 0, marginHorizontal: 0, backgroundColor: this.state.tab === 'programs' ? Colors.theme : Colors.gray }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.onOtherProgramsPress} />
                            </Col>
                        </Row>

                        <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>
                            {this.showList()}
                        </Col>
                    </Body>
                }

                <Col extraStyle={[{ position: 'absolute', bottom: 0, width: '100%', padding: 15, backgroundColor: Colors.white }]}>
                    {this.state.joined === '1' ?
                        <Button
                            canUpdate
                            label={Strings.t179}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button45, { marginTop: 0, marginHorizontal: 0, backgroundColor: Colors.red }]}
                            labelStyle={[stylesC.buttonT16, { color: Colors.white }]}
                            onPress={this.leaveProgram} />
                        :
                        <Button
                            canUpdate
                            label={Strings.t180}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button45, { marginTop: 0, marginHorizontal: 0, backgroundColor: Colors.red }]}
                            labelStyle={[stylesC.buttonT16, { color: Colors.white }]}
                            onPress={this.joinProgram} />
                    }
                </Col>
            </Screen>
        );
    }

    joinProgram = async () => {
        let item = this.state.program
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        // if (this.props.user.subscriber === '0') {
        //     this.props.navigation.navigate('Membership');
        //     return
        // }
        if (item.inapp_id != null && item.inapp_id !== 'null' && item.inapp_id !== '') {
            console.log('purcahse program');
            if (this.checkSubscribedAndFreeAccess()) {
                console.log('free access for subscriber');
                this.joinProgramNow(item)
            }
            else {
                try {
                    this.setState({ loading: true })
                    let purchaseMade = await Purchases.purchaseProduct(item.inapp_id, null, 'inapp')
                    this.setState({ loading: false })
                    console.log(purchaseMade)
                    this.joinProgramNow(item)
                }
                catch (e) {
                    this.setState({ loading: false })
                    showErrorToast(Strings.t181)
                    if (!e.userCancelled) {
                        console.log(JSON.stringify(e));
                    }
                }
            }
        }
        else {
            console.log('free program');
            this.joinProgramNow(item)
        }
    };

    joinProgramNow = (item) => {
        this.setState({ loading: true });
        Api.joinSpecialProgram(item.id, this.props.user.id, '1',
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t182)
                    this.setState({ joined: '1' })
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

    leaveProgram = () => {
        Alert.alert( // react-native
            Strings.t183,
            Strings.t184,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t179, onPress: () => {
                        this.setState({ loading: true });
                        Api.joinSpecialProgram(this.state.program.id, this.props.user.id, '0',
                            (response) => {
                                this.setState({ loading: false })
                                if (response.status === 'success') {
                                    showToast(Strings.t185)
                                    this.setState({ joined: '0' })
                                }
                                else {
                                    showErrorToast(response.msg)
                                }
                            },
                            (error) => {
                                this.setState({ loading: false });
                                showErrorToast('' + error);
                            });
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );

    };

    onVideosPress = () => {
        this.setState({ tab: 'videos' })
    };

    onSectionsPress = () => {
        this.setState({ tab: 'sections' })
    };

    onOtherProgramsPress = () => {
        this.setState({ tab: 'programs' })
    };

    showList = () => {
        if (this.state.tab === 'videos') {
            return this.showVideos()
        }
        else if (this.state.tab === 'sections') {
            return this.showSections()
        }
        else if (this.state.tab === 'programs') {
            return this.showPrograms()
        }
    };

    showVideos = () => {
        console.log('showVideos');
        if (!this.state.loading && this.state.videos.length == 0) {
            return (
                <Col center extraStyle={[{ height: 50 }]}>
                    <Text style={[stylesC.textM16]}>
                        {Strings.t51}
                    </Text>
                </Col>
            )
        }
        return (
            <View style={[{ marginTop: 0, marginBottom: 30 }]}>
                {this.state.videos.map((item, index) => {
                    return this._renderVideoItem(item, index)
                })}
            </View>
        )
    };

    showSections = () => {
        console.log('showSections');
        if (!this.state.loading && this.state.sections.length == 0) {
            return (
                <Col center extraStyle={[{ height: 50 }]}>
                    <Text style={[stylesC.textM16]}>
                        {Strings.t186}
                    </Text>
                </Col>
            )
        }
        return (
            <View style={[{ marginTop: 0 }]}>
                {this.state.sections.map((item, index) => {
                    return this._renderSectionItem(item, index)
                })}
            </View>
        )
    };

    showPrograms = () => {
        console.log('showPrograms');
        if (!this.state.loading && this.state.programs.length == 0) {
            return (
                <Col center extraStyle={[{ height: 50 }]}>
                    <Text style={[stylesC.textM16]}>
                        {Strings.t149}
                    </Text>
                </Col>
            )
        }
        return (
            <View style={[{ marginTop: 0 }]}>
                {this.state.programs.map((item, index) => {
                    return this._renderProgramItem(item, index)
                })}
            </View>
        )
    };

    playVideo = (item) => {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return
        }
        // if (this.props.user.subscriber === '0') {
        //     this.props.navigation.navigate('Membership');
        //     return
        // }
        // check if program joined
        if (this.state.joined === '1')
            this.props.navigation.navigate('PlayVideo', { video: item });
        else
            showErrorToast(Strings.t187)
    };

    _renderVideoItem = (item, index) => {
        console.log('uri: ' + this.props.fileUrls.LibraryImages + item.video.thumbnail);
        return (
            <ListItem
                key={index.toString()}
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={0.6}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    this.playVideo(item.video)
                }}>
                <Start>
                    <Image
                        resizeMode='cover'
                        style={{ width: 100, height: 100, borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}
                        source={{ uri: this.props.fileUrls.LibraryImages + item.video.thumbnail }} />
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {item.video.title}
                    </Text>
                </Center>
                <End center>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center]}
                        imageStyle={[stylesC.imageM30]}
                        resizeMode='contain'
                        source={require('../assets/arrow_right.png')}
                        onPress={() => {
                            this.playVideo(item.video)
                        }} />
                </End>
            </ListItem>
        )
    }

    openSection = (item) => {
        console.log('openSection: ' + item.id);
        this.props.setSelectedCategory(item)
        // load this cateogry only
        this.props.navigation.navigate('LibraryLimited', { parentCategory: item });
    };

    _renderSectionItem = (item, index) => {
        return (
            <ListItem
                key={index.toString()}
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={0.6}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    this.openSection(item.category)
                }}>
                <Start>
                    <Image
                        resizeMode='cover'
                        style={{ width: 100, height: 100, borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}
                        source={{ uri: this.props.fileUrls.LibraryImages + item.category.image }} />
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {item.category.title}
                    </Text>
                </Center>
                <End center>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center]}
                        imageStyle={[stylesC.imageM28]}
                        resizeMode='contain'
                        source={require('../assets/arrow_right.png')}
                        onPress={() => {
                            // handle click
                        }} />
                </End>
            </ListItem>
        )
    }

    openSpecialProgram = (item) => {
        this.props.navigation.navigate('SpecialPrograms');
        this.props.navigation.navigate('SpecialProgramDetails', { program: item });
    };

    _renderProgramItem = (item, index) => {
        console.log('ITEM: ' + JSON.stringify(item));
        return (
            <ListItem
                key={index.toString()}
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={0.6}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    this.openSpecialProgram(item.special_program)
                }}>
                {/* <Start>
                    <Image
                        resizeMode='contain'
                        style={{ width: 150, height: 100, borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}
                        source={{ uri: this.props.fileUrls.LibraryImages + item.program.image }} />
                </Start> */}
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {item.special_program.title}
                    </Text>
                </Center>
                <End center>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center]}
                        imageStyle={[stylesC.imageM28]}
                        resizeMode='contain'
                        source={require('../assets/arrow_right.png')}
                        onPress={() => {
                            // handle click
                        }} />
                </End>
            </ListItem>
        )
    }

    async componentDidMount() {
        console.log('special details componentDidMount');
        let program = this.props.navigation.getParam('program');
        console.log('PROGRAM: ' + JSON.stringify(program));
        this.setState({ program: program })
        this.getSpecialProgramDetails(program)
    }

    onFocus = () => {
        console.log('onFocus');
    };

    getSpecialProgramDetails = (program) => {
        this.setState({ loading: true });
        Api.getSpecialProgramDetails(this.props.user.id, program.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    const programDetails = response.data
                    console.log('programDetails: ' + JSON.stringify(programDetails));
                    const videoLinks = programDetails.videoLinks
                    const sectionLinks = programDetails.sectionLinks
                    const programLinks = programDetails.programLinks
                    const joined = programDetails.joined
                    this.setState({
                        videos: videoLinks,
                        sections: sectionLinks,
                        programs: programLinks,
                        joined: joined,
                    })
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
        user: state.UserReducer.user,
        hasSubscribed: state.HasSubscribedReducer.hasSubscribed,
        fileUrls: state.FileUrlsReducer.fileUrls,
        filters: state.FiltersReducer.filters,
        subscriberFreeProgramAccess: state.SubscriberFreeProgramAccess.subscriberFreeProgramAccess,
        categories: state.CategoriesReducer.categories,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setSelectedCategory: (data) => {
            dispatch(Actions.setSelectedCategory(data))
        },
        setCategories: (data) => {
            dispatch(Actions.setCategories(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SpecialProgramDetails)