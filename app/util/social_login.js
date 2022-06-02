//----------------------- Facebook Login -----------------------

// yarn add react-native-fbsdk

// ****** ANDROID ******

// <!--add FacebookActivity-->
// <activity tools:replace="android:theme"
//         android:name="com.facebook.FacebookActivity"
//         android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
//         android:label="@string/app_name"
//         android:theme="@android:style/Theme.Translucent.NoTitleBar"/>
// <!--add CustomTabActivity-->
// <activity
//     android:name="com.facebook.CustomTabActivity"
//     android:exported="true">
//     <intent-filter>
//         <action android:name="android.intent.action.VIEW" />
//         <category android:name="android.intent.category.DEFAULT" />
//         <category android:name="android.intent.category.BROWSABLE" />
//         <data android:scheme="@string/fb_login_protocol_scheme" />
//     </intent-filter>
// </activity>
// <!--reference your fb_app_id-->
// <meta-data
//     android:name="com.facebook.sdk.ApplicationId"
//     android:value="@string/fb_app_id"/>

// <string name="fb_app_id">447573652617213</string>
// <string name="fb_login_protocol_scheme">fb447573652617213</string>

// ****** IOS ******

// case 1: when Facebook only:
// <key>CFBundleURLTypes</key>
// <array>
//   <dict>
//   <key>CFBundleURLSchemes</key>
//   <array>
//     <string>fb[APP_ID]</string>
//   </array>
//   </dict>
// </array>
// <key>FacebookAppID</key>
// <string>[APP_ID]</string>
// <key>FacebookDisplayName</key>
// <string>[APP_NAME]</string>
// <key>LSApplicationQueriesSchemes</key>
// <array>
//   <string>fbapi</string>
//   <string>fb-messenger-share-api</string>
//   <string>fbauth2</string>
//   <string>fbshareextension</string>
// </array>

// case 2: when Facebook + Google:
// <key>CFBundleURLTypes</key>
// <array>
//   <dict>
//     <key>CFBundleURLSchemes</key>
//     <array>
//       <string>fb[APP_ID]</string>
//       <string>com.googleusercontent.apps.847719880921-cq3qbr3ffsrhdin5dtj6tjep9ldv9rr6</string>
//     </array>
//   </dict>
// </array>
// <key>FacebookAppID</key>
// <string>[APP_ID]</string>
// <key>FacebookDisplayName</key>
// <string>[APP_NAME]</string>
// <key>LSApplicationQueriesSchemes</key>
// <array>
//   <string>fbapi</string>
//   <string>fb-messenger-share-api</string>
//   <string>fbauth2</string>
//   <string>fbshareextension</string>
// </array>

// case 3: when Facebook + Twitter:
// <key>CFBundleURLTypes</key>
// <array>
//   <dict>
//     <key>CFBundleURLSchemes</key>
//     <array>
//       <string>fb[APP_ID]</string>
//       <string>twitterkit-UGWo9n8WKS5iuG1pwP2sg</string> // oauth_callback url twitter
//     </array>
//   </dict>
// </array>
// <key>FacebookAppID</key>
// <string>[APP_ID]</string>
// <key>FacebookDisplayName</key>
// <string>[APP_NAME]</string>
// <key>LSApplicationQueriesSchemes</key>
// <array>
//     <string>twitter</string>
//     <string>twitterauth</string>
//     <string>fbapi</string>
// 		<string>fb-messenger-share-api</string>
// 		<string>fbauth2</string>
// 		<string>fbshareextension</string>
// </array>

// case 1: when Facebook + Google:
// https://github.com/saif0347/AmazonForestNew/blob/master/ios/AmazonForest/AppDelegate.m

// case 2: when Facebook + Twitter
// https://github.com/project529/p529garagev2/blob/master/ios/GarageApp/AppDelegate.m


import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from "react-native-fbsdk";

export const facebookLogin = (callback) => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        function (result) {
            if (result.isCancelled) {
                console.log("Login cancelled");
            }
            else {
                console.log("Login success: " + result.grantedPermissions.toString());
                console.log('result1: ' + JSON.stringify(result));
                // get user data now
                infoRequest = new GraphRequest(
                    '/me?fields=id,name,email,picture.type(large)',
                    null,
                    (error, result) => {
                        if (error) {
                            console.log('Error fetching data: ' + error.toString());
                        }
                        else {
                            console.log(JSON.stringify(result));
                            console.log('id: ' + result.id);
                            console.log('name: ' + result.name);
                            console.log('photo: ' + result.picture.data.url);
                            console.log('email: ' + result.email);
                            AccessToken.getCurrentAccessToken()
                                .then((accessToken) => {
                                    console.log('token: ' + accessToken.accessToken);
                                    let user = { provider: 'facebook', authToken: accessToken.accessToken, authTokenSecret: '', id: result.id, name: result.name, photo: result.picture.data.url, email: result.email };
                                    callback(user);
                                });
                        }
                    }
                );
                new GraphRequestManager().addRequest(infoRequest).start();
            }
        },
        function (error) {
            console.log("Login fail with error: " + error);
        }
    );
};

//----------------------- Google Login -----------------------

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const googleLogin = async (callback) => {
    GoogleSignin.configure();
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log('photo: ' + userInfo.user.photo);
        console.log("id: " + userInfo.user.id);
        console.log("name: " + userInfo.user.name);
        console.log("email: " + userInfo.user.email);
        callback(userInfo.user);
    } catch (error) {
        console.log("error: " + error.code);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
        } else {
            // some other error happened
        }
    }
};