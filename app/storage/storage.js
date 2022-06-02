// yarn add @react-native-community/async-storage
// pod install

import AsyncStorage from '@react-native-community/async-storage';
import SyncStorage from 'sync-storage';

const version = '7'

const MyStorage = {
  setAlertSettings: async (val) => {
    try {
      await AsyncStorage.setItem('alert_settings' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getAlertSettings: async () => {
    try {
      const value = await AsyncStorage.getItem('alert_settings' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null
    }
  },

  setGuides: async (val) => {
    try {
      await AsyncStorage.setItem('guides' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getGuides: async () => {
    try {
      const value = await AsyncStorage.getItem('guides' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return [];
    } catch (e) {
      // error reading value
      return []
    }
  },

  setSubscriberFreeProgramAccess: async (val) => {
    try {
      await AsyncStorage.setItem('subscriber_free_access' + version, val)
    } catch (e) {
      // saving error
    }
  },
  getSubscriberFreeProgramAccess: async () => {
    try {
      const value = await AsyncStorage.getItem('subscriber_free_access' + version)
      return value !== null ? value : '0';
    } catch (e) {
      // error reading value
      return '0'
    }
  },

  updateSets: (pid, eid, val) => {
    SyncStorage.set('sets_' + pid + '_' + eid + '_' + version, val)
  },
  getSets: (pid, eid) => {
    return SyncStorage.get('sets_' + pid + '_' + eid + '_' + version)
    // try {
    //   const value = await AsyncStorage.getItem('sets_' + pid + '_' + eid + '_' + version)
    //   return value !== null ? value : '0';
    // } catch (e) {
    //   return '0';
    // }
  },

  setFilters: async (val) => {
    try {
      await AsyncStorage.setItem('filters' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getFilters: async () => {
    try {
      const value = await AsyncStorage.getItem('filters' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null
    }
  },

  setSpecialPrograms: async (val) => {
    try {
      await AsyncStorage.setItem('special_programs' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getSpecialPrograms: async () => {
    try {
      const value = await AsyncStorage.getItem('special_programs' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null;
    }
  },

  setCategories: async (val) => {
    try {
      await AsyncStorage.setItem('categories' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getCategories: async () => {
    try {
      const value = await AsyncStorage.getItem('categories' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null;
    }
  },

  setSlides: async (val) => {
    try {
      await AsyncStorage.setItem('slides' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getSlides: async () => {
    try {
      const value = await AsyncStorage.getItem('slides' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null;
    }
  },

  setFileUrls: async (val) => {
    try {
      await AsyncStorage.setItem('file_urls' + version, JSON.stringify(val))
    } catch (e) {
      // saving error
    }
  },
  getFileUrls: async () => {
    try {
      const value = await AsyncStorage.getItem('file_urls' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      // error reading value
      return null;
    }
  },

  setFirstOpen: async (val) => {
    try {
      await AsyncStorage.setItem('firstOpen' + version, val)
    } catch (e) {
      // saving error
    }
  },
  getFirstOpen: async () => {
    try {
      const value = await AsyncStorage.getItem('firstOpen' + version)
      return value !== null ? value : 'true';
    } catch (e) {
      // error reading value
      return 'true'
    }
  },

  setLogin: async (val) => {
    try {
      await AsyncStorage.setItem('loggedIn' + version, val)
    } catch (e) {
      // saving error
    }
  },
  isLogin: async () => {
    try {
      const value = await AsyncStorage.getItem('loggedIn' + version)
      return value !== null ? value : 'false';
    } catch (e) {
      return 'false';
    }
  },

  // json form
  setUser: async (val) => {
    try {
      if (val != null)
        await AsyncStorage.setItem('user' + version, JSON.stringify(val))
      else
        await AsyncStorage.removeItem('user' + version)
    } catch (e) {
      console.log('setUser error: ' + e);
    }
  },
  getUser: async () => {
    try {
      const value = await AsyncStorage.getItem('user' + version)
      if (value != null)
        return JSON.parse(value);
      else
        return null;
    } catch (e) {
      console.log('getUser error: ' + e);
      return null;
    }
  },
  removeUser: async () => {
    try {
      await AsyncStorage.removeItem('user' + version, (error) => {
        console.log('error: ' + error);
      })
    } catch (e) {
      // saving error
    }
  },

}

export default MyStorage;