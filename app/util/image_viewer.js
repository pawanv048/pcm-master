import React from 'react';
import { Text } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, TitleBar, IconCustomButton } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

class MyImageViewer extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        viewer: false,
        url: ''
    }

    showPopup = (url) => {
        this.setState({ viewer: true, url: url })
    };

    hidePopup = (url) => {
        this.setState({ viewer: false })
    };

    render() {
        return (
            <Modal
                visible={this.state.viewer}
                transparent={true}
                onRequestClose={() => this.hidePopup()}>
                <ImageViewer
                    style={{ marginTop: 0 }}
                    imageUrls={[
                        {
                            url: this.state.url,
                            props: {
                                // headers: ...
                            }
                        }
                    ]} />
                <IconCustomButton
                    conatinerStyle={[{ position: 'absolute', top: 0, marginTop: 35, marginLeft: 20 }]}
                    imageStyle={[stylesC.imageM28, { tintColor: 'white', backgroundColor: Colors.black, padding:5 }]}
                    resizeMode='contain'
                    source={require('../assets/back.png')}
                    onPress={() => {
                        this.hidePopup()
                    }} />
            </Modal>
        );
    }

}

export default MyImageViewer