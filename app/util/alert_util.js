import moment from 'moment';
import { Platform } from 'react-native';
import Api from '../api/api'
const PushNotification = require('react-native-push-notification');
import Utils from '../util/utils.js';
import GLOBAL from '../constants/global.js';

export const setAlerts = (alertSettings, user_id) => {
    console.log('setAlerts');
    if (alertSettings == null)
        return
    if (!alertSettings.alerts)
        return
    // load programs and set alerts
    Api.getJoinedPrograms(user_id,
        (response) => {
            console.log('getJoinedPrograms: ' + JSON.stringify(response));
            PushNotification.cancelAllLocalNotifications();

            let programs = response.data
            for (let i = 0; i < programs.length; i++) {
                const title = programs[i].program.title
                const weekday = programs[i].program.weekday
                const weedkaySettings = getWeekdaySettings(weekday, alertSettings)
                const time = weedkaySettings.time
                if (weedkaySettings.active) {
                    // set alert
                    const date = getWeekdayDate(weekday, time)
                    scheduleAlert(date, title, 'Its time to exercise!')
                }
            }
        },
        (error) => {
            //
        });
};

const getWeekdayDate = (weekday, time) => {
    let today = new Date()
    for (let i = 0; i <= 7; i++) {
        let date = new Date()
        date.setDate(today.getDate() + i)
        let day = moment(date).format('ddd')
        // console.log('day: '+day);
        if (day.toLowerCase() === weekday.toLowerCase()) {
            let resultDate = moment(date).format('YYYY-MM-DD')
            let momObject = moment(resultDate + ' ' + time, 'YYYY-MM-DD h:mm a');
            if (momObject > today.getTime()) {
                console.log('getWeekdayDate: ' + resultDate);
                return new Date(momObject)
            }
        }
    }
};

const getWeekdaySettings = (weekday, alertSettings) => {
    for (let i = 0; i < alertSettings.models.length; i++) {
        const model = alertSettings.models[i];
        if (model.day.toLowerCase().includes(weekday.toLowerCase())) {
            return model
        }
    }
};

const scheduleAlert = (alarmDate, title, msg) => {
    let id = Utils.randomFixedNumber(6)+'';
    console.log('scheduleAlert: '+moment(alarmDate).format('YYYY-MM-DD h:mm a'));
    setPush(id, title, msg, alarmDate);
};

const setPush = async (id, title, message, date) => {
    PushNotification.localNotificationSchedule({
        channelId: GLOBAL.channelId,
        id: id, // android
        userInfo: { id: id }, // ios
        autoCancel: true,
        vibration: 300,
        date: date,
        title: title,
        message: message,
        playSound: true,
    });
};