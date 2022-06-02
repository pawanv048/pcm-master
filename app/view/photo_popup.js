import React from 'react';
import { Text } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { PopupCustom, TitleBar, Body, Button } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import MyImagePicker from '../util/image_picker'

export default class PhotoPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        newPhoto: null,
    };

    showPopup = () => {
        this.setState({ visible: true });
    };

    hidePopup = () => {
        this.setState({ visible: false });
    };

    render() {
        return (
            <PopupCustom
                animationType="fade"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={this.hidePopup}
                onPressOutside={this.hidePopup}
                containerStyle={[stylesC.popupContent,{height:250}]}>
                <TitleBar
                    title={Strings.t160}
                    titlePos='center' />
                <Body center loading={false}>
                    <Text style={[stylesC.textD14, { marginBottom: 0, textAlign:'center' }]}>
                        {Strings.t161}
                    </Text>
                    <Button
                        label={Strings.t162}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button45, { marginTop: 10, marginHorizontal: 0 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={() => {
                            this.cameraImage()
                        }} />
                    <Button
                        label={Strings.t163}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button45, { marginTop: 10, marginHorizontal: 0, backgroundColor:Colors.themeDark }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={() => {
                            this.galleryImage()
                        }} />
                </Body>
            </PopupCustom>
        );
    }

    cameraImage = () => {
        console.log('Camera');
        MyImagePicker.openCameraPicker((result) => {
            this.hidePopup()
            this.props.photoTaken(result)
        })
    };

    galleryImage = () => {
        console.log('Gallery');
        MyImagePicker.openGalleryPicker((result) => {
            this.hidePopup()
            this.props.photoTaken(result)
        })
    };
}