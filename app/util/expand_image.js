import React from 'react';
import { Text, Image, TextInput, View } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, showToast, showErrorToast, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
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

class ExpandImage extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        uri: '',
        fullScreen: false,
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus} onBlur={this.onBlur}>
                <TitleBar
                    canUpdate
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={''}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>
                    <Col extraStyle={[{ alignItems: 'stretch' }]}>
                        <Col extraStyle={[styles.fieldContainer, { width: '100%', height: '100%', borderColor: 'white', backgroundColor: 'black', overflow: 'hidden' }]}>
                            {this.state.uri === '' ?
                                null
                                :
                                <Image
                                    source={{ uri: this.state.uri }}   // Can be a URL or a local file.
                                    ref={(ref) => {
                                        this.imgViewer = ref
                                    }}
                                    resizeMode='contain'
                                    style={{ width: '100%', height: '100%' }} />
                            }
                        </Col>
                    </Col>
                </Body>
            </Screen>
        );
    }

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
        let url = this.props.navigation.getParam('url');
        this.setState({ uri: url })
    };

    onBlur = () => {
        console.log('onBlur');
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls
    }
}
export default connect(mapStateToProps, {})(ExpandImage)