import { PermissionsAndroid , Alert} from 'react-native';


class Permissions  {
//WRITE_EXTERNAL_STORAGE

   async requestLocationPermission() {
    let allowed = false;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Premier Transportation Location Permission',
          message:
            'Premier Transportation app needs access to your location ' +
            'so you can track your location against your next destination.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Alert.alert('You can track your location');
          allowed=true;
      } else {
          Alert.alert('','Location permission denied, please enable location to track your ride');
      }
    } catch (err) {
      console.warn(err);
    }
    return allowed;
  }
//requestMultiple(permissions)
  async requestExternalPermission() {
   let allowed = false;
   try {
     const granted = await PermissionsAndroid.requestMultiple(
       [PermissionsAndroid.PERMISSIONS.CAMERA,PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE],
       {
         title: 'Premier Transportation External Storage Permission',
         message:
           'Premier Transportation app needs access to external storage ' +
           'so you can select profile picture.',
         buttonNeutral: 'Ask Me Later',
         buttonNegative: 'Cancel',
         buttonPositive: 'OK',
       },
     );
     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         //Alert.alert('You can track your location');
         allowed=true;
     } else {
        // Alert.alert('Storage access permission denied');
     }
   } catch (err) {
     console.warn(err);
   }
   return allowed;
 }
}

export default Permissions;
