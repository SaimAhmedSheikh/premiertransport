import React , {Component} from 'react';
import { View, Text, StyleSheet , TouchableOpacity , Dimensions , ImageBackground, Alert , PermissionsAndroid , AppState , BackHandler, DeviceEventEmitter} from 'react-native';
import  JobListing  from '../Lists/JobListing'
import { Header , View_CheckIO_BreakIO , Input , Searchbar , BgTracking } from '../Components';
import colors from '../Components/colors';
var {width, height} = Dimensions.get('window');
const login_bg =  require('../images/bg2.png');
import Utils from '../Components/Utils'
let URL_GET_ALL_TRIPS  =  MyConstants.BASE_URL + "Trip/GetAllTripsByDate";
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import * as MyConstants from '../Components/Constants';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import FCM from '../Services/FCM';
import LocalNotification from '../Components/LocalNotification';


class MyRides extends Component {

  constructor(props){
    super(props);
    this.state = {
      check: "",
      val:1,
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      isValidated:true,
      selectedDate:"",
      showDate:"",
      dataUpdated: false,
      backfromRide:false,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      appState: AppState.currentState,
      getTodayRidesData:new Array()
    }
  }


    componentWillMount(){

      commonData = CommonDataManager.getInstance();
      commonData.setTempData(undefined);
      commonData.setTodayRidesData(new Array());
      this.setTodaysDate();  // Alert.alert(commonData.getToken()+"");   //   Alert.alert(commonData.getUserData().UserId+"");

    }
    componentDidMount(){
      //Alert.alert(''+commonData.getCurrentRideData());
        AppState.addEventListener('change', this._handleAppStateChange);
        this.showAppPermissionSettings();
        this.handleFirebaseMessaging();
        this.unsubscribe = messaging().onMessage(async remoteMessage => {
          //Alert.alert('FCM notification', JSON.stringify(remoteMessage))
          const { notification, data } = remoteMessage;
          if(notification) {
            const { title, body } = notification.android; 
            console.log('>>>> notification message: ', title, body);
            LocalNotification.show(title, body);
          }
          if(data) {
          }
        });
    
    }

    componentWillUnmount() {
      // this.notificationDisplayedListener();
      this.unsubscribe && this.unsubscribe();
      AppState.removeEventListener('change', this._handleAppStateChange);
      BackgroundGeolocation.removeAllListeners();
      //  navigator.geolocation.clearWatch(this.watchID);
     }

    _handleAppStateChange = (nextAppState) => {
      if (  nextAppState === 'active' ) {
        //Alert.alert('App has come to the foreground!' + nextAppState);
        this.showAppPermissionSettings();
      }
      //this.setState({appState: nextAppState});
    };

  //watchID: ?number = null;
 convertDateToUTC(date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0); }

  setTodaysDate(){
    let myUtils = new Utils();
  //  Alert.alert(''+myUtils.getTodaysDate().DateTimeStamp);
  //  Alert.alert(''+myUtils.getTodaysDate().todayDateCalenderFormat);
    // const datetime = myUtils.getTodaysDate().ForTodayTimeStamp+" 00:00";
    // var dateString = datetime,
    //   dateTimeParts = dateString.split(' '),
    //   timeParts = dateTimeParts[1].split(':'),
    //   dateParts = dateTimeParts[0].split('-'),
    //   date;
    // date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0]);
    // let aa = this.convertDateToUTC(new Date(new Date((new Date(date.getTime())).toUTCString()).getTime() ) ).getTime();
    let datatat = this.convertDateToUTC(new Date());
    var currentTime = datatat.getTime();
    var localOffset = (-1) * datatat.getTimezoneOffset() * 60000;
    var stamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000) *1000;
    commonData.setSelRideDate({Timestamp :stamp,selDate:myUtils.getTodaysDate().todayDate, showDate: myUtils.getTodaysDate().showDate , calDate : myUtils.getTodaysDate().todayDateCalenderFormat});
    this.setState({selectedDate: myUtils.getTodaysDate().DateTimeStamp , showDate: myUtils.getTodaysDate().showDate});
  }

   async showAppPermissionSettings(){
    const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (isGranted) {
        this.askForEnableLocation();
        return true;
      }
      try {
        BackgroundGeolocation.removeAllListeners();
        BackgroundGeolocation.stop();
        Alert.alert('App requires location tracking permission', 'enable in settings?', [
          { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() }
        ],
        {  cancelable: false })
      } catch (err) {
        console.log('error');
        console.log(err);
      }
  }

  async askForEnableLocation(){
      try {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
           message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/>",
           ok: "Yes",
           cancel:"",
           enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
           showDialog: true, // false => Opens the Location access page directly
           openLocationServices: true, // false => Directly catch method is called if location services are turned off
           preventOutSideTouch: true, //true => To prevent the location services popup from closing when it is clicked outside
           preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
           providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
       }).then(function(success) {
           // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
          // Alert.alert('success '+success);
           if (success.enabled) {
               if(commonData.getCurrentRideData() != 0)
               {
                   this.props.navigation.navigate('MapScreen' , { onPreviousScreen: ()=> this.onPreviousScreen()});
               }
               else
               {
                   this.LoadAgain();
               }
               this.setBackgroundLocationTracking();
           }
           else{
             this.askForEnableLocation();
           }
           }.bind(this)
       ).catch((error) => {
           console.log(error.message);
       });
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //   {
        //     title: 'Premier Transportation Location Permission',
        //     message: 'Premier Transportation app needs access to your location ' +
        //       'so you can track your location against your next destination.',
        //     buttonPositive: 'Enable',
        //   },
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //      Alert.alert('You can track your location');
        //     allowed=true;
        //     if(commonData.getCurrentRideData() != 0)
        //     {
        //         this.props.navigation.navigate('MapScreen' , { onPreviousScreen: ()=> this.onPreviousScreen()});
        //     }
        //     else
        //     {
        //         this.LoadAgain();
        //     }
        //     this.setBackgroundLocationTracking();
        //
        // } else {
        //
        // }
      } catch (err) {
        console.warn(err);
      }
  }

  setBackgroundLocationTracking(){
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Premier Transportation',
      notificationText: 'Background tracking enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 10000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,

      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar' // you can also add your own properties
      }
    });

    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
    //  Alert.alert('location '+JSON.stringify(location));
        console.log('[INFO] '+ JSON.stringify(location));
        this.sentGeoPointToFireStore(location.latitude,location.longitude);
        BackgroundGeolocation.startTask(taskKey => {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask
         BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
    //  Alert.alert(' stationary '+JSON.stringify(stationaryLocation));
  //    Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
    //        Alert.alert("BackgroundGeolocation err "+error);
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    //  Alert.alert("BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    //    Alert.alert("BackgroundGeolocation service has been stop");
    });



    BackgroundGeolocation.on('background', () => {
      //console.log('[INFO] App is in background');
    //  Alert.alert("[INFO] App is in background");
    });

    BackgroundGeolocation.on('foreground', () => {
    //  console.log('[INFO] App is in foreground');
    //    Alert.alert("[INFO] App is in foreground");

    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          // setTimeout(() =>
          //   Alert.alert('App requires location tracking permission', 'enable in settings?', [
          //     { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() }
          //   ],
          //   {  cancelable: false }), 1000);
            this.showAppPermissionSettings()
        }

    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
  }

  sentGeoPointToFireStore(lat,long){
   //   Alert.alert('sentGeoPointToFireStore '+lat+' '+long);
    auth().signInWithEmailAndPassword('jameel@lntechnologies.com', 'qwerty').catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
   //   Alert.alert(errorCode+' '+errorMessage);
       return;
     });

    firestore().collection("User")
    .doc(''+commonData.getUserData().UserId)
    .update({"Location": new firestore.GeoPoint(lat, long)})
    .then(function(docRef) {
     // Alert.alert(''+docRef.id);
     })
     .catch(function(error) {
       ToastAndroid.show('  '+error, ToastAndroid.LONG);
     });
  }

  _dateChanged(){
    if(this.state.selectedDate !== commonData.getSelRideDate().selDate){
    //   Alert.alert(''+commonData.getSelRideDate().Timestamp);

      this.setState({selectedDate:commonData.getSelRideDate().Timestamp,showDate:commonData.getSelRideDate().showDate});

      this.LoadAgain();
    }
    // Alert.alert(''+commonData.getSelRideDate().showDate);
  }

  render(){
    console.log("backfromRide "+this.state.backfromRide);
    return(
      <View style={{flex:2 }}>
        <ImageBackground style={{  width:width, height:height, justifyContent: 'center'}} source = {login_bg}>
          <View>
           <Header onPress={()=>this.props.navigation.navigate('Setting')} headerText = {'My Rides'} headerColor={colors.HeaderColor}
              showSettings={true} showBack={false} showEmergencyContact={false}/>
           <View style={{alignItems:'center',justifyContent:'space-around',flexDirection:'row',marginBottom:10,marginTop:10}}>
              <Text style={{fontFamily:'Gotham Medium',fontSize:15,color:'#ffffff'}}> TODAY'S RIDES </Text>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('Calendar',{dateChanged :  this._dateChanged.bind(this) , minDate : '2010-05-10' , maxDate : '2200-05-30'})}>
                <Searchbar placeholderTextColor={'#A3A3A3'} color={'#ffffff'} placeholder={this.state.showDate} />
              </TouchableOpacity>
           </View>
          </View>

          <JobListing navigation={this.props.navigation}
                      onPreviousScreen={()=> this.onPreviousScreen.bind(this)}
                      onStatusUpdate={()=> this.onStatusUpdate()}
                      Data = {this.state.getTodayRidesData}
                      Refresh = { this.state.backfromRide }
                      LoadAgain={()=> this.LoadAgain()}/>

          <View style={{ flex: 0.5, marginBottom:50 , marginTop:10}}>
            <View_CheckIO_BreakIO onLogOutPress={()=>this.props.navigation.navigate('Login')}/>
          </View>
         </ImageBackground>

         { this.state.loading && <WebService
           navigation={this.props.navigation}
            dialogVisible = {true}
            isGet = {false}
            MyMsg = { this.state.alertMessage }
            onPostMethod = {() => this.onPostMethod() }
            onTimeOutt = {()=> this.onTimeOutt() }
            onInternetNotConnected = {()=> this.onInternetNotConnected() }
            URL= {this.state.url}
            includeToken = { true }
            SuccessMsg = { false }
            MyObject = {this.state.MyObject }/> }

      </View>
    )
  }

  onStatusUpdate = () => {
  //  Alert.alert("onStatusUpdate");
    // BackgroundTimer.setTimeout(() => {
    // //  Alert.alert(commonData.getUserData().UserId+' '+this.state.selectedDate);
    //   this.setState({val:this.state.val+1});
    // }, 2300);
    //this.setState({check:this.state.check+" "});
  }

  LoadAgain(){

    const timeoutId = BackgroundTimer.setTimeout(() => {
  //    Alert.alert(' '+this.state.selectedDate);
      console.log("Ticks: "+this.state.selectedDate);
      this.setState({ loading: true, alertMessage: "Getting rides...", error: "", url :  URL_GET_ALL_TRIPS,
       MyObject : { DriverID: commonData.getUserData().UserId , Date : this.state.selectedDate} });
    }, 200);

  }

  onTimeOutt () {
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.setState({loading:false});
    }, 2000);
  }

 onInternetNotConnected(){
   this.setState({loading: false});
 }

 onPostMethod = () => {
   let Repsonse =  commonData.getTempData();
  //  Alert.alert(''+Repsonse.Body);
    if(Repsonse !== 0){
     //  Alert.alert(''+JSON.stringify(Repsonse));
      if(Repsonse.Code = '200'){
        commonData.setTodayRidesData(JSON.stringify(Repsonse.Body)); //setTodayRidesDataTemp
        commonData.setTodayRidesDataTemp(JSON.stringify(Repsonse.Body));

        console.log('Repsonse : '+JSON.stringify(Repsonse.Body));
        // let TempDataRides =  commonData.getTodayRidesDataTemp()[0];
        //
        //
        // if(TempDataRides.length > 0){
        //   if(TempDataRides.Rides.length > 0)
        //   {
        //     for(var i = 0 ; i < TempDataRides.Rides.length ; i++){
        //       if(TempDataRides.Rides[i].IsVisible && TempDataRides.Rides[i].AssignTo === commonData.getUserData().UserId){
        //         console.log('Ride ' + i +" "+JSON.stringify(TempDataRides.Rides[i]));
        //       }
        //     }
        //   }
        // }
        //console.log(''+JSON.stringify(Repsonse.Body));
        // if(this.state.backfromRide && commonData.getTodayRidesData().length == 0){
        //   // generate notifications
        //   const notificationn = new notifications.Notification()
        //      .android.setChannelId(MyConstants.CHANNEL_ID)
        //      .setNotificationId('2')
        //      .setTitle('All Rides Completed')
        //      .setBody('Come back to office and check out')
        //      .android.setSmallIcon('ic_launcher')
        //      .android.setLargeIcon('ic_launcher')
        //      .android.setAutoCancel(true);
        //       // Build a channel
        //       const channel = new notifications.Android
        //       .Channel(MyConstants.CHANNEL_ID, MyConstants.CHANNEL_ID, notifications.Android.Importance.Max)
        //       .setDescription('Premier Transportation');
        //
        //      // Create the channel
        //      notifications().android.createChannel(channel);
        //      notificationn.android.setAutoCancel(true);
        //      firebase.notifications().displayNotification(notificationn);
        // }

        commonData.setTempData(undefined);
        //Alert.alert(''+JSON.stringify(Repsonse.Body) + ' '+this.state.selectedDate);
        this.setState({loading : false, MyObject:"" , backfromRide:false,getTodayRidesData:commonData.getTodayRidesData()});
     }
   }
 }

 onPreviousScreen (){
//  this.LoadAgain();
   // commonData.deleteTodayRidesData();
   const timeoutId = BackgroundTimer.setTimeout(() => {
     this.setState({ loading: true, alertMessage: "Getting rides...", error: "", url :  URL_GET_ALL_TRIPS, backfromRide:!this.state.backfromRide, getTodayRidesData:new Array(),
      MyObject : { DriverID: commonData.getUserData().UserId , Date : this.state.selectedDate} });
   }, 200);
   //Alert.alert("onPreviousScreen");
 }


  //////////

   async handleFirebaseMessaging() {
    try {
      if(await FCM.getPermission()) {
        const fcmToken = await FCM.getToken();
        this.handleFirebaseMessagingToken(fcmToken);
      }
    } catch (error) {
        console.log('token error: ',error);
        return null
    }
    await messaging().subscribeToTopic("android1");
    await messaging().subscribeToTopic("user_"+commonData.getUserData().UserId);   

   }

    async handleFirebaseMessagingToken(fbcmToken) {
      const storedToken = await get('fbcmToken');
      console.log('FIREBASE TOKEN:', fbcmToken);
      if (!storedToken || storedToken !== fbcmToken) {
        await store('fbcmToken', fbcmToken);
        if (storedToken !== fbcmToken) {
          console.log(
            'You have the wrong token version stored'
          );
        }
    }
  }

  // handleFirebaseMessagingListeners() {

  //  // When Notification is received on Foreground
  //  this.notificationListener = firebase  .notifications().onNotification(notification => {
  //    const { data } = notification;

  //    const notificationn = new firebase.notifications.Notification()
  //       .android.setChannelId(MyConstants.CHANNEL_ID)
  //       .setNotificationId('1')
  //       .setTitle(''+data.title === "undefined" ? notification.title : ''+data.title)
  //       .setBody(''+data.body === "undefined" ? notification.body : ''+data.body)
  //       .android.setSmallIcon('ic_launcher')
  //       .android.setLargeIcon('ic_launcher')
  //       .android.setAutoCancel(true);
  //       //.setData({   key1: 'value1',   key2: 'value2',   });
  //       //  Alert.alert(notification.title+' f '+notification.body);
  //         const val = notification.body;
  //         if(commonData.getCurrentRideData() == 0){
  //           if(val === "New ride has been assigned to you!"){
  //              const resetAction = StackActions.reset({
  //               index: 0,
  //               actions: [NavigationActions.navigate({routeName: 'MainScreen' })]});
  //               this.props.navigation.dispatch(resetAction);
  //           }
  //         }
  //        // Build a channel
  //        const channel = new firebase.notifications.Android
  //        .Channel(MyConstants.CHANNEL_ID, MyConstants.CHANNEL_ID, firebase.notifications.Android.Importance.Max)
  //        .setDescription('Premier Transportation');


  //       // Create the channel
  //       firebase.notifications().android.createChannel(channel);
  //       firebase.notifications().displayNotification(notificationn)
  //       .catch(err => Alert.alert(''+err));


  //    });

  //   // When app is on foreground and the app opened from notification
  //   firebase.notifications().getInitialNotification()
  //     .then((notificationOpen: NotificationOpen) => {
  //       if (notificationOpen) {
  //         // App was opened by a notification
  //         // Get the action triggered by the notification being opened
  //         const action = notificationOpen.action;
  //         // Get information about the notification that was opened
  //         const notification: Notification = notificationOpen.notification;
  //         //  Alert.alert('getInitialNotification '+notification);
  //         const { data } = notificationOpen.notification;
  //     //      Alert.alert(JSON.stringify(action));
  //       //    Alert.alert(data.title+' '+data.body+' '+data.Mouqa);
  //          // Push notifications will be received on the following instances:
  //          //  •	When driver receives a job request ( take to jobs request screen)
  //          //  •	When driver accepts a job (takes to  My Jobs screen)
  //          //  •	When driver sends an emergency message  to admin  for not completing the tasks and admin cancels it
  //          //  •	When a trip is completed ( showing summary of hours and amount earned)

  //       }
  //     });

      // this.messageListener = firebase.messaging().onMessage(message => {
      //   // process data message
      //   //console.log('ON MESSAGE:', JSON.stringify(message));
      //   Alert.alert('onMessage '+message);
      // });

     // when notificaiton is displayed on notification bar
     // this.notificationDisplayedListener = firebase
     //   .notifications()
     //   .onNotificationDisplayed(notification => {
     //     Alert.alert('ON NOTIFICATION DISPLAYED');
     //     //console.log('ON NOTIFICATION DISPLAYED');
     //   });

     // When app is opened and notification is Recieved
     // firebase.notifications().onNotification((notification: Notification) => {
     //    Alert.alert('ON NOTIFICATION Recieved '+notification);
     //  });

     // When notification is opened from notificaiton bar
     // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
     //      // Get the action triggered by the notification being opened
     //      const action = notificationOpen.action;
     //      // Get information about the notification that was opened
     //      const notification: Notification = notificationOpen.notification;
     //      Alert.alert('onNotificationOpened '+notification);
     //  });

     //removeAllDeliveredNotifications()
     //removeDeliveredNotification(notificationId)
//  }

}

const styles = {
  CheckStyle: {
    height : 75 ,
    width:150,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 30 ,
    borderTopRightRadius: 0 ,
    backgroundColor: colors.blue,
    borderColor:'#000000ff'
  },
  BreakStyle: {
    height : 75 ,
    width:150,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 0 ,
    borderTopRightRadius: 30 ,
    backgroundColor: colors.orange,
     borderColor:'#000000ff'
  },
  ViewParentStyle:{
    height:40,
    marginRight:40,
    marginLeft:40,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#0000000000',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
    paddingLeft:15
  },
};

export default MyRides ;
