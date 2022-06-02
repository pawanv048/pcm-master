import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { PopupCustom, Col, TitleBar, Body, ListItem, Center, SearchBar } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';

export default class WeekdayPicker extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        models: [],
    };

    showPopup = (models) => {
        this.setState({ visible: true, models: models});
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
                containerStyle={[stylesC.popupContent]}>
                <TitleBar
                    title={Strings.t23}
                    titlePos='center' />
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        data={this.state.models}
                        extraData={this.state} // refresh list on state change
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderItem} />
                </View>
            </PopupCustom>
        );
    }

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                containerStyle={[stylesC.listItemP]}
                activeOpacity={0.6}
                parentStyle={[stylesC.listItem, { padding: 0 }]}
                lineStyle={[stylesC.lineHM]}
                onPress={() => {
                    this.onSelect(index)
                }}>
                <Center>
                    <Text style={[stylesC.textD16, { padding: 5 }]}>
                        {item}
                    </Text>
                </Center>
            </ListItem>
        )
    };

    onSelect = (index) => {
        this.props.onSelect(index)
        this.hidePopup()
    };

}