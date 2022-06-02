// npm i react-native-image-crop-picker --save

// IOS:
// <key>NSPhotoLibraryUsageDescription</key>
// <string>$(PRODUCT_NAME) would like access to your photo gallery</string>
// <key>NSCameraUsageDescription</key>
// <string>$(PRODUCT_NAME) would like to use your camera</string>

// ANDROID:
// <uses-permission android:name="android.permission.CAMERA" />
// <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
// ROOT GRADLE:
// maven { url 'https://maven.google.com' }
// maven { url "https://www.jitpack.io" }
// APP GRADLE:
// android {
//   ...
//   defaultConfig {
//       ...
//       vectorDrawables.useSupportLibrary = true
//       ...
//   }
//   ...
// }

import ImagePicker from 'react-native-image-crop-picker';

const MyImagePicker = {
      openGalleryPicker: (onResult)=>{
        console.log('openGalleryPicker');
        setTimeout(()=>{
          console.log('timeout');
          ImagePicker.openPicker({
            cropping: true
          })
          .then(image => {
            console.log('image:'+JSON.stringify(image));
            onResult(image)
          })
          .catch((error) => {
            console.log('Error:'+error)
          });
        }, 1000);
      },
    
      openCameraPicker: (onResult)=>{
        setTimeout(()=>{
          console.log('timeout');
          ImagePicker.openCamera({
            cropping: true
          })
          .then(image => {
            onResult(image)
          })
          .catch((error) => {
            console.log('Error:'+error)
          });
        }, 1000);
      },
}

export default MyImagePicker;