import React from 'react';
import { Text, Image, TextInput, View } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, showToast, showErrorToast, TitleBar, ListItem, Start, Center, End, ColButton } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Clipboard from '@react-native-clipboard/clipboard';
import Api from '../api/api'
import LandscapeView from 'react-native-landscape-view';

const styles = {
    fieldContainer: { alignItems: 'stretch', backgroundColor: Colors.background },
    iconContainer: { backgroundColor: Colors.theme, borderRadius: 10, width: 42, height: 42 },
}

class PlayVideo extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        uri: '',
        video: {},
        paused: false,
        active: true,
        fullScreen: false,
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        console.log('paused: ' + this.state.paused);
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus} onBlur={this.onBlur}>

                {this.state.fullScreen ?
                    null
                    :
                    <TitleBar
                        fontSize={16}
                        canUpdate
                        left
                        leftType='back' // back/menu
                        onLeftPress={this.onLeftPress}
                        title={this.state.video.title}
                        titlePos='flex-start' />
                }

                {!this.state.active ?
                    null
                    :
                    <Body scroll videoLoading={true} loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>
                        <Col extraStyle={[{ alignItems: 'stretch' }]}>
                            <Col extraStyle={[styles.fieldContainer, { width: '100%', height: '100%', borderColor: 'white', backgroundColor: 'black', overflow: 'hidden' }]}>
                                {this.state.uri === '' ?
                                    null
                                    :
                                    <Video
                                        source={{ uri: this.state.uri }}   // Can be a URL or a local file.
                                        ref={(ref) => {
                                            this.player = ref
                                        }}
                                        bufferConfig={{
                                            minBufferMs: 15000,
                                            maxBufferMs: 50000,
                                            bufferForPlaybackMs: 1000,
                                            bufferForPlaybackAfterRebufferMs: 2000
                                        }}
                                        fullscreen={false}
                                        resizeMode='contain'
                                        paused={this.state.paused}
                                        useTextureView={false}
                                        repeat={false}
                                        onLoadStart={this.onLoadStart}
                                        onLoad={this.onLoad}
                                        onBuffer={this.onBuffer}
                                        onError={this.videoError}
                                        onEnd={this.onEnd}
                                        onProgress={this.onProgress}
                                        controls={true}
                                        style={{ width: '100%', height: '100%' }} />
                                }
                            </Col>
                            <Col extraStyle={[{ position: 'absolute', top: 0, left: 0 }]}>
                                <Image
                                    resizeMode='cover'
                                    style={{ zIndex: 999, width: 50, height: 50, marginLeft: 10, marginTop: 10 }}
                                    source={require('../assets/watermark.png')} />
                            </Col>
                            <ColButton
                                center
                                parentStyle={{ position: 'absolute', top: 0, right: 0 }}
                                extraStyle={{ padding: 10 }}
                                activeOpacity={0.6}
                                onPress={() => {
                                    this.setState({ fullScreen: !this.state.fullScreen })
                                    setTimeout(() => {
                                        if (this.state.fullScreen) {
                                            Orientation.lockToLandscape();
                                        }
                                        else {
                                            Orientation.lockToPortrait();
                                        }
                                    }, 50);
                                }}>
                                <Image
                                    resizeMode='cover'
                                    style={{ width: 35, height: 35, marginRight: 5, marginTop: 0 }}
                                    source={this.state.fullScreen ? require('../assets/full_offf.png') : require('../assets/full_oon.png')} />
                            </ColButton>

                        </Col>
                    </Body>
                }
            </Screen>
        );
    }

    onLoadStart = () => {
        console.log('onLoadStart');
        this.setState({ loading: true })
    };

    onLoad = () => {
        console.log('onLoad');
        this.setState({ loading: false })
    };

    onBuffer = () => {
        console.log('onBuffer');
        this.setState({ loading: true })
    };

    onProgress = () => {
        console.log('onProgress');
        if (this.state.loading) {
            this.setState({ loading: false })
        }
    };

    videoError = () => {
        console.log('videoError');
    };

    onEnd = () => {
        console.log('onEnd');
        this.setState({ paused: true })
    };

    async componentDidMount() {
        console.log('componentDidMount');
        // Orientation.lockToLandscape();
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            console.log('LANDSCAPE');
        }
        else {
            console.log('PORTRAIT');
        }
    }

    componentWillUnmount() {
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    onFocus = () => {
        console.log('onFocus');
        let video = this.props.navigation.getParam('video');
        let fileName = video.file_name
        let title = video.title
        console.log('fileName: ' + fileName);
        console.log('title: ' + title);
        let url = this.props.fileUrls.LibraryVideos + fileName
        console.log('url: ' + url);

        let uri = url.replace(/ /g, '%20')
        console.log('uri: ' + uri);

        this.setState({ video: video, uri: uri, active: true })
        setTimeout(() => {
            this.setState({ paused: false })
        }, 1000);
    };

    onBlur = () => {
        console.log('onBlur');
        this.setState({ paused: true, fullScreen: false })
        setTimeout(() => {
            this.setState({ active: false })
        }, 50);
        Orientation.lockToPortrait();
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls
    }
}
export default connect(mapStateToProps, {})(PlayVideo)