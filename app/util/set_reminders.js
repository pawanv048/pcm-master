// import moment from 'moment';
// import { Platform } from 'react-native';
// import MyDatabase from '../realm/database.js';
// import GLOBAL from '../constants/global.js';
// const PushNotification = require('react-native-push-notification');

// export const setReminders = () => {
//     console.log('setReminders');
    
// };

// const scheduleAlert = (date, alertTime, name) => {
//     let momObject = moment(date + ' ' + alertTime, 'DD-MM-YYYY h:mm a').subtract(1, 'days');
//     let alarmDate = new Date(momObject);
//     let todayDate = moment();
//     date = momObject.format('DD/MM/YYYY');
//     let id = alarmDate.getDate() + '' + alarmDate.getMonth();
//     // cancel old one
//     // PushNotification.cancelLocalNotifications({id:id});
//     /**
//      * push notification
//      *  when notification date is > today date (future notification)
//      */
//     if (alarmDate.getTime() > todayDate.valueOf()) {
//         setPush(id, name, 'Zajtra je zber odpadu.', alarmDate);
//     }
//     else {
//         console.log('ALARM PAST: ' + date + ' ' + alertTime);
//     }
// };

// const setPush = async (id, title, message, date) => {
//     PushNotification.localNotificationSchedule({
//         id: id, // android
//         userInfo: { id: id }, // ios
//         autoCancel: true,
//         vibration: 300,
//         date: date,
//         title: title,
//         message: message,
//         playSound: true,
//     });
// };