import React from 'react';
import { View, Platform } from 'react-native'
import { stylesC } from '../styles/style_common.js';
import { PopupCustom, TitleBar, Line, Button } from '../custom/components.js';
import * as Strings from '../constants/strings.js';
import * as Colors from '../constants/colors.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class MyTimePicker extends React.Component {
    constructor(props) {
        super(props);
    }

    showing = false

    state = {
        visible: false,
        day: '',
        time: moment().format('h:mm a'),
        value: new Date()
    };

    showPopup = (day) => {
        this.showing = true
        this.setState({ visible: true, day: day });
    };

    hidePopup = () => {
        this.showing = false
        this.setState({ visible: false });
    };

    render() {
        if (Platform.OS === 'android') {
            console.log('TIME SHOW: '+this.showing);
            if (this.showing) {
                return (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.value}
                        mode='time'
                        minuteInterval={5}
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            this.hidePopup()
                            if (event.type === 'dismissed') {
                                return
                            }
                            const currentDate = selectedDate || date;
                            let time = moment(currentDate).format('h:mm a');
                            console.log('time: ' + time);
                            this.setState({ time: time, value: currentDate })
                            this.props.onTimeSelect(time, this.state.day)
                        }}
                    />
                )
            }
            return null
        }
        return (
            <PopupCustom
                animationType="fade"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={this.hidePopup}
                onPressOutside={this.hidePopup}
                containerStyle={{ width: 300, height: 300, alignItems: 'stretch' }}>
                <TitleBar
                    title={Strings.t205}
                    titlePos='center' />
                <Line
                    style={[stylesC.lineHL]} />
                <View style={{ flex: 1 }}>
                    <DateTimePicker
                        style={{backgroundColor:'white'}}
                        testID="dateTimePicker"
                        value={this.state.value}
                        minuteInterval={5}
                        mode='time'
                        textColor="black"
                        is24Hour={false}
                        display="spinner"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || date;
                            let time = moment(currentDate).format('h:mm a');
                            console.log('time: ' + time);
                            this.setState({ time: time, value: currentDate })
                        }}/>
                    <Button
                        label={Strings.t20}
                        activeOpacity={1}
                        buttonStyle={[stylesC.button45, { marginTop: 0, marginHorizontal: 0, borderRadius:0 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={() => {
                            console.log('done');
                            this.hidePopup()
                            this.props.onTimeSelect(this.state.time, this.state.day)
                        }} />
                </View>
            </PopupCustom>
        );
    }
}