import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true
  }
  return false
}

const getPermission = () => requestUserPermission();

const getToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) return fcmToken;
  return new Promise(resolve => { messaging().onTokenRefresh(newToken => resolve(newToken)) });
};


const getNotifications = () => {
  // return eventChannel(emitter => {
  //   const handler = ({ action, opened_from_tray: open }) => {

  //   if (action) {
  //        emitter({ action: JSON.parse(action), open: open === 1 });
  //       }
  //   };
  //   FCM.getInitialNotification().then(handler);

  //   PushNotification.createChannel(
  //     {
  //       channelId: "YAHBG_notifications", // (required)
  //       channelName: "YAHBG_notifications", // (required)
  //       channelDescription: "YAHBG notifications channel", // (optional) default: undefined.
  //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //       importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );

  //   const listener = FCM.on(FCMEvent.Notification, handler);
  //   //return () => listener.remove();
  //   return () => listener.remove();
  // });

}




export default { getPermission, getToken, getNotifications  };
