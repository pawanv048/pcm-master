import { Linking, Platform, Share } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
//import moment from 'moment' // npm install moment --save

const Utils = {
  getGroupedPrograms: (programs) => {
    const memo = programs.reduce((memo, object) => {
      if (object.program.master_id in memo)
        memo[object.program.master_id].push(object);
      else
        memo[object.program.master_id] = [object];
      return memo;
    }, {});
    let models = [];
    Object.keys(memo)
      .reduce((a, key) => {
        const objects = memo[key]
          .sort()
        // console.log(key);
        // console.log(JSON.stringify(objects));
        let model = {
          title: key,
          programs: objects
        }
        models = models.concat(model);
      }, [])
    return models;
  },

  placeCall: (phone) => {
    let url = '';
    if (Platform.OS === 'android') {
      url = `tel:${phone}`;
    }
    else {
      url = `telprompt:${phone}`;
    }
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
            .catch(() => null);
        }
      });
  },

  openEmail: (email) => {
    Linking.openURL('mailto:' + email);
  },

  openUrl: (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url).catch(() => null);
        }
      });
  },

  getBigNumber: (number) => {
    let s = "";
    let n = 0;
    if (number < 1000) {
      return "" + number;
    }
    else if (number >= 1000 && number < 1000000) {
      s = "" + (number / 1000) + "K";
      n = number % 1000;
      if (n == 0)
        return s;
      return n + s;
    }
    else {
      s = "" + (number / 1000000) + "M";
      n = number % 1000000;
      if (n == 0)
        return s;
      return n + s;
    }
    return number;
  },

  round: (value, ndec) => {
    var n = 10;
    for (var i = 1; i < ndec; i++) {
      n *= 10;
    }
    if (!ndec || ndec <= 0)
      return Math.round(value);
    else
      return Math.round(value * n) / n;
  },

  checkName: (name) => {
    let nameReg = /^[a-zA-Z]*$/;
    return nameReg.test(name.replace(' ', ''));
  },

  checkEmail: (email) => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailReg.test(email);
  },

  formatPhone: (text) => {
    var cleaned = ('' + text).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '' : ''),
        number = [intlCode, '', match[2], '-', match[3], '-', match[4]].join('');
      return number;
    }
    return text;
  },

  // Note: mode.name search
  filterItems: (query, models) => {
    if (query === '') {
      return models;
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    let list = models.filter(model => model.name.search(regex) >= 0);
    // if(list.length > 3){
    //   return [list[0], list[1], list[2]];
    // }
    return list;
  },

  randomFixedNumber: (length) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
  },

  getTimeAgo: (millis) => {
    let currentTime = Math.round((new Date()).getTime());
    let seconds = (currentTime - millis) / 1000;
    if (seconds < 60) {
      return parseInt(seconds) + "s ago";
    } else if (seconds < 3600) {
      return "" + parseInt(seconds / 60) + "m ago";
    } else if (seconds < 86400) {
      return "" + parseInt(seconds / 3600) + "h ago";
    } else if (seconds < 604800) {
      return "" + parseInt(seconds / 86400) + "d ago";
    } else if (seconds < 2419200) {
      return "" + parseInt(seconds / 604800) + "w ago";
    } else if (seconds < 29030400) {
      return "" + parseInt(seconds / 2419200) + "M ago";
    } else {
      return "" + parseInt(seconds / 29030400) + "Y ago";
    }
  },

  moveToStack: (navigation, routeName) => {
    navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: routeName })
      ],
    }));
  },

  moveToScreen: (navigation, stackName, routeName) => {
    navigation.navigate(stackName, {}, NavigationActions.navigate({ routeName: routeName }))
  },

  onShare: async (title, msg) => {
    try {
      const result = await Share.share({
        dialogTitle: title,
        title: title,
        message: msg,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        }
        else {
          // shared
        }
      }
      else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    }
    catch (error) {
      //alert(error.message);
    }
  },

  arrayAddItem: (models, item) => {
    return models.concat(item);
  },

  // needs customization
  searchLocal: (viewObject) => {
    console.log('searchLocal');
    let models = viewObject.state.models;
    let tempModels = viewObject.state.tempModels;
    if (tempModels.length == 0) {
      tempModels = models;
    }
    models = [];
    if (viewObject.state.search == '') {
      models = tempModels;
    }
    else {
      tempModels.find((model) => {
        if (model.name.toLowerCase().includes(viewObject.state.search.toLowerCase())) {
          models = models.concat(model);
        }
      });
    }
    viewObject.setState({ models: models, tempModels: tempModels });
  },

  getCurrentDate: () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + '-' + month + '-' + year;
  },

  // {month:'', ...}
  // group by month names
  // can also use it to sort list alphabetically
  getGroupedCalendarEntries: (calendarEntries) => {
    const memo = calendarEntries.reduce((memo, object) => {
      if (object.month in memo)
        memo[object.month].push(object);
      else
        memo[object.month] = [object];
      return memo;
    }, {});
    let models = [];
    Object.keys(memo)
      .reduce((a, key) => {
        const objects = memo[key]
          .sort()
        console.log(key);
        console.log(JSON.stringify(objects));
        let model = {
          title: key,
          data: objects
        }
        models = models.concat(model);
      }, [])
    return models;
  },

  // getDayName: (dateStr)=>{ // DD/MM/YYYY
  //   let arr = dateStr.split('/');
  //   let day = arr[0];
  //   let month = arr[1];
  //   let year = arr[2];
  //   let newDateStr = month+'/'+day+'/'+year;
  //   let newDate = new Date(newDateStr);
  //   let dayName = moment(newDate).format('dddd');
  //   return dayName;
  // },

  // getMonthName: (dateStr)=>{ // DD/MM/YYYY
  //     let arr = dateStr.split('/');
  //     let day = arr[0];
  //     let month = arr[1];
  //     let year = arr[2];
  //     let newDateStr = month+'/'+day+'/'+year;
  //     let newDate = new Date(newDateStr);
  //     let monthName = moment(newDate).format('MMMM');
  //     return monthName;
  // },

  // checkFutureTime: (dateStr)=>{
  //   let eventDate = moment(dateStr, 'DD-MM-YYYY') // parsing date
  //   let todayDate = new Date();
  //   if(eventDate > todayDate.getTime()){
  //       return true;
  //   }
  //   return false;
  // }

}

export default Utils
