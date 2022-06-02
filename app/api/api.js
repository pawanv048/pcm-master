import FormData from 'react-native/Libraries/Network/FormData';
import { Platform } from 'react-native';
import GLOBAL from '../constants/global.js';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment'

export const googleDownloadLink = 'https://play.google.com/store/apps/details?id=com.posturecoreandmore';
export const appleDownloadLink = 'https://apps.apple.com/us/app/posturecoreandmore/id1585601439';
export const shareProgramUrl = 'https://www.posturecoremore.com'; // for sharing programs
export const baseUrl = 'https://posturecoremore.com/api';
export const mediaUrl = 'https://posturecoremore.com/pcm_mobile_app/public/media';
export const privacyUrl = 'https://www.posturecoreandmore.com/privacy-policy';
export const termsUrl = 'https://www.posturecoreandmore.com/terms-and-conditions';

const filters = baseUrl + '/getFilters'; // merge apis get ages, get goals
const fileUrls = baseUrl + '/getFileUrls';
const registerUser = baseUrl + '/registerUser';
const sendEmail = baseUrl + '/sendEmail';
const loginUser = baseUrl + '/auth/loginUser';
const socialLogin = baseUrl + '/auth/socialLogin';
const forgotPassword = baseUrl + '/forgotPassword';
const updatePushToken = baseUrl + '/updatePushToken';
const updateSubscribeStatus = baseUrl + '/updateSubscribeStatus';
const changePassword = baseUrl + '/changePassword';
const updateProfile = baseUrl + '/updateProfile';
const getSlides = baseUrl + '/getSlides'; // home slider
const getCategories = baseUrl + '/getCategories';
const getCategoryVideos = baseUrl + '/getCategoryVideos';
const searchVideos = baseUrl + '/searchVideos';
const getSpecialPrograms = baseUrl + '/getSpecialPrograms';
const getJoinedSpecialPrograms = baseUrl + '/getJoinedSpecialPrograms';
const getSpecialProgramDetails = baseUrl + '/getSpecialProgramDetails';
const addRemoveFavoriteVideo = baseUrl + '/addRemoveFavoriteVideo';
const getFavoriteVideos = baseUrl + '/getFavoriteVideos';
const joinSpecialProgram = baseUrl + '/joinSpecialProgram';
const addWorkUpTo = baseUrl + '/addWorkUpTo';
const deleteWorkUpTo = baseUrl + '/deleteWorkUpTo';
const getWorkUpToList = baseUrl + '/getWorkUpToList';
const getEquipmentNeeds = baseUrl + '/getEquipmentNeeds';
const getChat = baseUrl + '/getChat';
const getUnreadChatCount = baseUrl + '/getUnreadChatCount';
const sendMessage = baseUrl + '/sendMessage';
const getNotifications = baseUrl + '/getNotifications';
const getUnreadNotificationCount = baseUrl + '/getUnreadNotificationCount';
const clearNotifications = baseUrl + '/clearNotifications';
const getJoinedPrograms = baseUrl + '/getJoinedPrograms';
const getProgramExercises = baseUrl + '/getProgramExercises';
const addProgram = baseUrl + '/addProgram';
const addWeeklyProgram = baseUrl + '/addWeeklyProgram';
const updateProgram = baseUrl + '/updateProgram';
const updateWeeklyProgram = baseUrl + '/updateWeeklyProgram';
const deleteProgram = baseUrl + '/deleteProgram';
const joinFriendProgram = baseUrl + '/joinFriendProgram';
const getProgramDetails = baseUrl + '/getProgramDetails';
const isAdminOnline = baseUrl + '/isAdminOnline';
const logoutUser = baseUrl + '/logoutUser';
const updateChatStatus = baseUrl + '/updateChatStatus';
const subscriberFreeProgramAccess = baseUrl + '/subscriberFreeProgramAccess';
const getUserProfile = baseUrl + '/getUserProfile';
const getGuides = baseUrl + '/getGuides';
const getHomeNotification = baseUrl + '/getHomeNotification';
const getGuideVideos = baseUrl + '/getGuideVideos';
const getAlertSettings = baseUrl + '/getAlertSettings';
const updateAlertSettings = baseUrl + '/updateAlertSettings';

const ContentType = 'multipart/form-data';
const headers = {
    'Content-Type': ContentType
}

const Api = {
    updateAlertSettings: async function (user_id, settings, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        params.append('settings', settings)
        apiCall(updateAlertSettings, params, 'POST', headers, onSuccess, onError)
    },

    getAlertSettings: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getAlertSettings, params, 'POST', headers, onSuccess, onError)
    },

    getGuideVideos: async function (onSuccess, onError) {
        apiCall(getGuideVideos, null, 'GET', headers, onSuccess, onError)
    },

    getHomeNotification: async function (onSuccess, onError) {
        apiCall(getHomeNotification, null, 'GET', headers, onSuccess, onError)
    },

    getGuides: async function (onSuccess, onError) {
        apiCall(getGuides, null, 'POST', headers, onSuccess, onError)
    },

    getUserProfile: async function (onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        apiCall(getUserProfile, params, 'POST', headers, onSuccess, onError)
    },

    // get access status
    subscriberFreeProgramAccess: async function (onSuccess, onError) {
        let params = new FormData()
        params.append('access', '')
        apiCall(subscriberFreeProgramAccess, params, 'POST', headers, onSuccess, onError)
    },

    updateChatStatus: async function (chat_status, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('chat_status', chat_status)
        apiCall(updateChatStatus, params, 'POST', headers, onSuccess, onError)
    },

    isAdminOnline: async function (onSuccess, onError) {
        apiCall(isAdminOnline, null, 'POST', headers, onSuccess, onError)
    },

    logoutUser: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('user_id', user_id)
        apiCall(logoutUser, params, 'POST', headers, onSuccess, onError)
    },

    deleteWorkUpTo: async function (wid, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('wid', wid)
        apiCall(deleteWorkUpTo, params, 'POST', headers, onSuccess, onError)
    },

    getWorkUpToList: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getWorkUpToList, params, 'POST', headers, onSuccess, onError)
    },

    getEquipmentNeeds: async function (onSuccess, onError) {
        // let params = new FormData()
        // params.append('access_token', GLOBAL.accessToken)
        apiCall(getEquipmentNeeds, null, 'GET', headers, onSuccess, onError)
    },

    getChat: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getChat, params, 'POST', headers, onSuccess, onError)
    },

    getUnreadChatCount: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getUnreadChatCount, params, 'POST', headers, onSuccess, onError)
    },

    sendMessage: async function (sender, user_id, message, onSuccess, onError) {
        let params = new FormData()
        console.log('access_token: '+GLOBAL.accessToken);
        console.log('sender: '+sender);
        console.log('user_id: '+user_id);
        console.log('message: '+message);
        console.log('user_time: '+moment().format('YYYY-MM-DD h:mm a'));
        
        params.append('access_token', GLOBAL.accessToken)
        params.append('sender', sender)
        params.append('user_id', user_id)
        params.append('message', message)
        params.append('user_time', moment().format('YYYY-MM-DD h:mm a'))
        apiCall(sendMessage, params, 'POST', headers, onSuccess, onError)
    },

    getNotifications: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getNotifications, params, 'POST', headers, onSuccess, onError)
    },

    getUnreadNotificationCount: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getUnreadNotificationCount, params, 'POST', headers, onSuccess, onError)
    },

    clearNotifications: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(clearNotifications, params, 'POST', headers, onSuccess, onError)
    },

    getJoinedPrograms: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getJoinedPrograms, params, 'POST', headers, onSuccess, onError)
    },

    getProgramExercises: async function (program_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('program_id', program_id)
        apiCall(getProgramExercises, params, 'POST', headers, onSuccess, onError)
    },

    addProgram: async function (master_id, user_id, title, weekday, exercises, onSuccess, onError) {
        console.log('master_id: '+master_id);
        console.log('user_id: '+user_id);
        console.log('title: '+title);
        console.log('exercises: '+exercises);
        console.log('weekday: '+weekday);
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('master_id', master_id)
        params.append('user_id', user_id)
        params.append('title', title)
        params.append('exercises', exercises)
        params.append('weekday', weekday)
        apiCall(addProgram, params, 'POST', headers, onSuccess, onError)
    },

    addWeeklyProgram: async function (master_id, user_id, title, weekdayPrograms, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('master_id', master_id)
        params.append('user_id', user_id)
        params.append('title', title)
        params.append('programs', weekdayPrograms)
        apiCall(addWeeklyProgram, params, 'POST', headers, onSuccess, onError)
    },

    updateProgram: async function (program_id, exercises, title, weekday, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('program_id', program_id)
        params.append('exercises', exercises)
        params.append('title', title)
        params.append('weekday', weekday)
        apiCall(updateProgram, params, 'POST', headers, onSuccess, onError)
    },

    updateWeeklyProgram: async function (master_id, program_id, exercises, title, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('master_id', master_id)
        params.append('program_id', program_id)
        params.append('exercises', exercises)
        params.append('title', title)
        apiCall(updateWeeklyProgram, params, 'POST', headers, onSuccess, onError)
    },

    deleteProgram: async function (master_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('master_id', master_id)
        apiCall(deleteProgram, params, 'POST', headers, onSuccess, onError)
    },

    joinFriendProgram: async function (master_id, user_id, join, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('master_id', master_id)
        params.append('user_id', user_id)
        params.append('join', join)
        apiCall(joinFriendProgram, params, 'POST', headers, onSuccess, onError)
    },

    getProgramDetails: async function (user_id, master_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        params.append('master_id', master_id)
        apiCall(getProgramDetails, params, 'POST', headers, onSuccess, onError)
    },

    updatePushToken: async function (onSuccess) {
        messaging()
            .getToken()
            .then(token => {
                console.log('FCM_TOKEN: ' + token)
                let params = new FormData()
                params.append('access_token', GLOBAL.accessToken)
                params.append('push_token', token)
                apiCall(updatePushToken, params, 'POST', headers,
                    (response) => {
                        console.log('updatePushToken: '+JSON.stringify(response));
                    },
                    (error) => {
                        console.log('error updatePushToken: ' + error);
                    })
            })
    },

    getJoinedSpecialPrograms: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getJoinedSpecialPrograms, params, 'POST', headers, onSuccess, onError)
    },

    joinSpecialProgram: async function (special_pid, user_id, join, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('special_pid', special_pid)
        params.append('user_id', user_id)
        params.append('join', join)
        apiCall(joinSpecialProgram, params, 'POST', headers, onSuccess, onError)
    },

    getFavoriteVideos: async function (user_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        apiCall(getFavoriteVideos, params, 'POST', headers, onSuccess, onError)
    },

    addRemoveFavoriteVideo: async function (user_id, video_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('user_id', user_id)
        params.append('video_id', video_id)
        apiCall(addRemoveFavoriteVideo, params, 'POST', headers, onSuccess, onError)
    },

    addWorkUpTo: async function (type, user_id, video_id, title, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('type', type)
        params.append('user_id', user_id)
        params.append('video_id', video_id)
        params.append('title', title)
        apiCall(addWorkUpTo, params, 'POST', headers, onSuccess, onError)
    },

    filters: async function (onSuccess, onError) {
        apiCall(filters, null, 'GET', headers, onSuccess, onError)
    },

    fileUrls: async function (onSuccess, onError) {
        apiCall(fileUrls, null, 'GET', headers, onSuccess, onError)
    },

    registerUser: async function (email, fname, lname, password, onSuccess, onError) {
        let params = new FormData()
        params.append('email', email)
        params.append('fname', fname)
        params.append('lname', lname)
        params.append('password', password)
        apiCall(registerUser, params, 'POST', headers, onSuccess, onError)
    },

    sendEmail: async function (email, subject, body, onSuccess, onError) {
        let params = new FormData()
        params.append('email', email)
        params.append('subject', subject)
        params.append('body', body)
        apiCall(sendEmail, params, 'POST', headers, onSuccess, onError)
    },

    loginUser: async function (email, password, onSuccess, onError) {
        let params = new FormData()
        params.append('email', email)
        params.append('password', password)
        apiCall(loginUser, params, 'POST', headers, onSuccess, onError)
    },

    socialLogin: async function (social_id, name, email, photo, onSuccess, onError) {
        console.log('social_id: '+social_id);
        console.log('name: '+name);
        console.log('email: '+email);
        console.log('photo: '+photo);
        let params = new FormData()
        params.append('social_id', social_id)
        params.append('name', name)
        params.append('email', email)
        params.append('photo', photo)
        apiCall(socialLogin, params, 'POST', headers, onSuccess, onError)
    },

    forgotPassword: async function (email, onSuccess, onError) {
        let params = new FormData()
        params.append('email', email)
        apiCall(forgotPassword, params, 'POST', headers, onSuccess, onError)
    },

    updateSubscribeStatus: async function (subscriber, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('subscriber', subscriber)
        params.append('device', Platform.OS)
        apiCall(updateSubscribeStatus, params, 'POST', headers, onSuccess, onError)
    },

    changePassword: async function (old_password, password, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('old_password', old_password)
        params.append('password', password)
        apiCall(changePassword, params, 'POST', headers, onSuccess, onError)
    },

    updateProfile: async function (fname, lname, email, phone, subscriber, photo, onSuccess, onError) {
        let params = new FormData();
        console.log('token: ' + GLOBAL.accessToken);
        console.log('fname: ' + fname);
        console.log('lname: ' + lname);
        console.log('email: ' + email);
        console.log('phone: ' + phone);
        console.log('subscriber: ' + subscriber);
        params.append('access_token', GLOBAL.accessToken)
        params.append('fname', fname)
        params.append('lname', lname)
        params.append('email', email)
        params.append('phone', phone)
        params.append('subscriber', subscriber? subscriber : 0)
        if (photo != null) {
            let arr = photo.path.split('/')
            let image = arr[arr.length - 1]
            console.log('name: ' + image);
            params.append("image", { name: image, type: photo.mime, uri: Platform.OS === "android" ? photo.path : photo.path.replace("file://", "") });
        }
        apiCall(updateProfile, params, 'POST', headers, onSuccess, onError);
    },

    getSlides: async function (onSuccess, onError) {
        apiCall(getSlides, null, 'GET', headers, onSuccess, onError)
    },

    getCategories: async function (type, onSuccess, onError) {
        let params = new FormData()
        params.append('type', type)
        apiCall(getCategories, params, 'POST', headers, onSuccess, onError)
    },

    getCategoryVideos: async function (cat_id, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('cat_id', cat_id)
        apiCall(getCategoryVideos, params, 'POST', headers, onSuccess, onError)
    },

    searchVideos: async function (keyword, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('keyword', keyword)
        apiCall(searchVideos, params, 'POST', headers, onSuccess, onError)
    },

    getSpecialPrograms: async function (user_id, type, age, goal, onSuccess, onError) {
        let params = new FormData()
        params.append('user_id', user_id)
        params.append('type', type)
        params.append('age', age)
        params.append('goal', goal)
        apiCall(getSpecialPrograms, params, 'POST', headers, onSuccess, onError)
    },

    getSpecialProgramDetails: async function (user_id, special_pid, onSuccess, onError) {
        let params = new FormData()
        params.append('access_token', GLOBAL.accessToken)
        params.append('special_pid', special_pid)
        params.append('user_id', user_id)
        apiCall(getSpecialProgramDetails, params, 'POST', headers, onSuccess, onError)
    },
}

const apiCall = (url, params, method, headers, onSuccess, onError) => {
    console.log('url: ' + url);
    fetch(url, {
        method: method,
        headers: headers,
        body: params
    })
        .then(response => response.json())
        .then(result => {
            console.log(JSON.stringify(result));
            onSuccess(result);
        })
        .catch(err => {
            console.log(err)
            onError(err);
        });
};

// const apiCallFile = (url, params, method, headers, onSuccess, onError) => {
//     console.log('url: ' + url);
//     fetch(url, {
//         method: method,
//         headers: headers,
//         body: params
//     })
//         .then(response => response.json())
//         .then(result => {
//             console.log(JSON.stringify(result));
//             onSuccess(result);
//         })
//         .catch(err => {
//             console.log(err)
//             onError(err);
//         });
// };

export default Api;