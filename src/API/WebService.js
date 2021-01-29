import React, {Component} from 'react';
import { Platform, Text, View, Dimensions, Image ,ImageBackground, ScrollView, Alert,Keyboard,Toast,ActivityIndicator,ToastAndroid} from 'react-native';
import colors from '../Components/colors';
import { Dialog } from 'react-native-simple-dialogs';
import axios from "axios";
import CommonDataManager from '../Components/CommonDataManager';
import BackgroundTimer from 'react-native-background-timer';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const notConnectedMsg = "You are offline! Try again after connecting to the internet.";
var {width, height} = Dimensions.get('window');
import messaging from '@react-native-firebase/messaging';

let commonData;
import SyncStorage from 'sync-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import * as MyConstants from '../Components/Constants';
let URL_REFRESH_TOKEN  =  MyConstants.BASE_URL + "User/RefreshToken";
let navv;
  if (Platform.OS === "ios2") {
    var device_id = "ios2";
    var device_type = "ios2";
  } else {
    var device_id = "android1";
    var device_type = "android1";
  }

  let headers = { 'Content-Type': 'application/json' };

  // commonData.setUserData(JSON.stringify(Repsonse.body.user));
  // Alert.alert(''+JSON.parse(commonData.getUserData()).first_name);
let timeoutId = 0;

class WebService extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      dialogVisible : true,
      dialogProgressVisible:  this.props.dialogVisible,
      dialogSuccessVisible: false,
      dialogFaliedVisible: false,
      alertType: null,
      alertMessage: "",
      successMsg:'',
      error: "" }
  }

  componentWillMount(){
      commonData = CommonDataManager.getInstance();
      navv = this.props.navigation;
      if(this.props.includeToken) {
      //  axios.defaults.headers.common = {'Authorization': `bearer ${commonData.getToken()}`}
      //  config = {  headers: { 'Content-Type': 'application/json','Authorization': "Bearer " + commonData.getToken()} };
        const token = commonData.getToken();//'Bearer '.concat( commonData.getToken());
        headers = {   'Content-Type': 'application/json',   'Token': token , 'Authorization' : commonData.getUserData().UserId }
        // Alert.alert(''+ commonData.getUserData().UserId);
      //  Alert.alert(''+ JSON.stringify(axios.defaults.headers.common));
      }
      // Alert.alert(''+ JSON.stringify(this.props.MyObject));
      //Alert.alert((new Date().getTime()+commonData.getTokenExpiry())+' '+commonData.getTokenExpiry());
      // if user is not logged in

      let UserData = commonData.getUserData();


      if( UserData == 0)
      {
        if(this.props.isGet){ this.CallGetMethod(); }
        if(!this.props.isGet){ this.CallPostMethod(); }
      }
      else if(new Date().getTime() >= commonData.getTokenExpiry()){ // if token is expired
        ToastAndroid.show('Session expired... Please login again!',ToastAndroid.LONG);
        //this.RefreshTokenOnExpire();
        this.clearData_and_Exit();
      }
      else{  // else just hit the service
        if(this.props.isGet){ this.CallGetMethod(); }
        if(!this.props.isGet){ this.CallPostMethod(); }
      }


  }

  componentDidMount(){
      timeoutId = BackgroundTimer.setTimeout(() => {
        source.cancel('Operation canceled by the user');
        this.setState({alertMessage:'Timeout, try again!' , dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: true});
        BackgroundTimer.stopBackgroundTimer();
        this.props.onTimeOutt();
    }, 20000);
  }

  render()
  {
    const { RoundedCircle, textBoldStyle,textNormalStyle, inputStyle , textStyle , buttonStyle} = styles;
    return(
          <View style={{ width:width, height:height  }}>
            { this.ShowActivityIndicator() }
            { this.state.dialogSuccessVisible &&  this.props.onPostMethod()}

            { this.props.isGet &&
              !this.state.dialogVisible &&
              !this.state.dialogProgressVisible &&
              !this.state.dialogSuccessVisible &&
              !this.state.dialogFaliedVisible &&
               this.props.onPostMethod() }

            { this.state.dialogFaliedVisible && this.props.onTimeOutt() }
          </View>
    );
  };

    RefreshTokenOnExpire(){

      const token = commonData.getToken();//'Bearer '.concat( commonData.getToken());
      headers = {   'Content-Type': 'application/json' }
      const notConnectedMsg = "You are offline! Try again after connecting to the internet.";
      axios.post(URL_REFRESH_TOKEN,{Token:""+commonData.getToken()},{headers:headers}, {cancelToken: source.token})
               .then(responseJson => {
                 let dataa = responseJson.data;
                 console.log(JSON.stringify(responseJson.data));
                 //Alert.alert(JSON.stringify(responseJson.data));
                 if (dataa.Status === 'OK') {
                   commonData.setToken(JSON.stringify(dataa.Body.Token));
                   commonData.setTokenExpiry(JSON.stringify(dataa.Body.ExpiryDate));
                     Alert.alert(JSON.stringify(dataa.Body.ExpiryDate));
                     const token = commonData.getToken();//'Bearer '.concat( commonData.getToken());
                     headers = {   'Content-Type': 'application/json',   'Token': token , 'Authorization' : commonData.getUserData().UserId }
                     if(this.props.isGet){ this.CallGetMethod(); }
                     if(!this.props.isGet){ this.CallPostMethod(); }
                 } else {
                    Alert.alert(JSON.stringify(responseJson.data.Message));
                    const token = commonData.getToken();//'Bearer '.concat( commonData.getToken());
                    headers = {   'Content-Type': 'application/json',   'Token': token , 'Authorization' : commonData.getUserData().UserId }
                    if(this.props.isGet){ this.CallGetMethod(); }
                    if(!this.props.isGet){ this.CallPostMethod(); }
                 }
                 if(responseJson.data.message === 'Token Expired'|| responseJson.data.Message === 'Token Expired'){
                   ToastAndroid.show('Session expired, please logout & login again.',ToastAndroid.LONG);
                   this.clearData_and_Exit();
                 }
               })
               .catch(
                 function(error) {
                   if (error) {
                       console.log(error);
                   }
                 }
              );
    }

    CallPostMethod() {
      axios.post(this.props.URL,this.props.MyObject,{headers:headers}, {cancelToken: source.token})
               .then(responseJson => {
                   BackgroundTimer.stopBackgroundTimer();
                   BackgroundTimer.clearTimeout(timeoutId);
                 let dataa = responseJson.data;
                  console.log(JSON.stringify(responseJson.data));
                //  Alert.alert(JSON.stringify(dataa.Body));
                 if (dataa.Status === 'OK') {
                  commonData.setTempData(dataa);
                  if(this.props.SuccessMsg)
                  {
                    this.setState({ successMsg : dataa.message ,alertMessage:'', dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: true,  dialogFaliedVisible: false });
                    BackgroundTimer.setTimeout(() => {
                      this.setState({  dialogVisible: false,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: false});
                      BackgroundTimer.stopBackgroundTimer();
                    }, 2000);
                  } else {
                    this.setState({  dialogVisible: false,  dialogProgressVisible: false,  dialogSuccessVisible: true,  dialogFaliedVisible: false});
                  }
                 } else {
                  //   Alert.alert(''+JSON.stringify(dataa));
                //  Alert.alert(''+responseJson.data.Message);
                    this.setState({ alertMessage:''+responseJson.data.Message , dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: true, });
                 }
                 if(responseJson.data.message === 'Token Expired' || responseJson.data.Message === 'Token Expired'){
                   ToastAndroid.show('Session expired, please logout & login again.',ToastAndroid.LONG);
                   this.clearData_and_Exit();
                 }
               })
               .catch(
                 function(error) {
                   if (error) {
                       console.log(error);
                       BackgroundTimer.stopBackgroundTimer();
                       this.setState({ alertMessage:'',dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: true, });
                   }
                 }
              );
   }

  CallGetMethod() {
        axios.get(this.props.URL,{headers:headers}, {cancelToken: source.token})
             .then(responseJson => {
               let dataa = responseJson.data;
                console.log(JSON.stringify(responseJson.data));
               //Alert.alert(JSON.stringify(responseJson.data));
               if (dataa.Status === 'OK') {
                 commonData.setTempData(dataa);
                 BackgroundTimer.stopBackgroundTimer();
                 this.setState({ alertMessage:'', dialogVisible: false,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: false });
               } else {
                //  Alert.alert(JSON.stringify(responseJson.data));
                 BackgroundTimer.stopBackgroundTimer();
                 this.setState({ alertMessage:''+responseJson.data.message , dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: true, });
               }
               if(responseJson.data.message === 'Token Expired' || responseJson.data.Message === 'Token Expired'){
                 ToastAndroid.show('Session expired, please logout & login again.',ToastAndroid.LONG);
                 this.clearData_and_Exit()
               }
             })
             .catch(
               function(error) {
                 if (error) {
                     console.log(error);
                     BackgroundTimer.stopBackgroundTimer();
                     this.setState({ alertMessage:'',dialogVisible: true,  dialogProgressVisible: false,  dialogSuccessVisible: false,  dialogFaliedVisible: true, });
                 }
               }
            );
  }

  clearData_and_Exit(){

    messaging().unsubscribeFromTopic("android1");
    messaging().unsubscribeFromTopic("user_"+commonData.getUserData().UserId);

    const appKey = 'LNPremierTransportation';
    const Key_TempData = appKey+"_TempData";
    const Key_UserData = appKey+"_UserData";
    const Key_Token = appKey+"_Token";
    const Key_TokenExpiry = appKey+"_TokenExpiry";
    const Key_UpdateData = appKey+"_UpdateData";
    const Key_TodayRides = appKey+"_TodayRides";
    const Key_MyLogs = appKey+"_MyLogs";
    const Key_Notifications = appKey+"_Notifications";
  //  const Key_CurrRideData = appKey+"_CurrRideData";
    const Key_ProfileCreated = appKey+"_ProfileCreated";
    const Key_SelRideDate = appKey+"_SelRideDate";
    const Key_CheckInOut = appKey+"_CheckInOut";
    const Key_BreakInOut = appKey+"_BreakInOut";
    const Key_CurrentLatLong = appKey+"_CurrentLatLong";
    SyncStorage.remove(Key_TempData);
    SyncStorage.remove(Key_UserData);
    SyncStorage.remove(Key_Token);
    SyncStorage.remove(Key_UpdateData);
    SyncStorage.remove(Key_TodayRides);
    SyncStorage.remove(Key_MyLogs);
    SyncStorage.remove(Key_Notifications);
  //  SyncStorage.remove(Key_CurrRideData);
    SyncStorage.remove(Key_SelRideDate);
    SyncStorage.remove(Key_CheckInOut);
    SyncStorage.remove(Key_BreakInOut);
    SyncStorage.remove(Key_TokenExpiry);
    //commonData.removeAllKeysData();
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
    navv.navigate('Login');
  }

 ShowActivityIndicator()
 {
   //  onTouchOutside={() => this.setState({dialogVisible: false}) }
  //onTouchOutside={() => this.setState({dialogVisible: false})  }
  //onPress = {() => this.setState({dialogProgressVisible: !this.state.dialogProgressVisible})}>
  //onPress = {() => this.setState({dialogSuccessVisible: !this.state.dialogSuccessVisible})}>
  //onPress = {() => this.setState({dialogFaliedVisible: !this.state.dialogFaliedVisible})}>
   const { RoundedCircle, textBoldStyle,textNormalStyle, inputStyle , textStyle , buttonStyle} = styles;
   return (
     <Dialog
          title=""
          dialogStyle = {{backgroundColor:"#ffffff"}}
          visible={this.state.dialogVisible}

          positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
          <View style = {{ height: 75, backgroundColor:"#ffffff"}}>

          { this.state.dialogProgressVisible &&
              <View style={{alignItems:'center',flex:1,flexDirection:'row'}}>

                  <View style={{alignItems:'center',flexDirection:'column'}}>
                    <ActivityIndicator size="large" color="#000000" style={{  alignSelf:'flex-start', width:60, height:60}}/>
                  </View>
                  <View style={{alignItems:'center',flex:1,flexDirection:'row'}}>
                  <View style={{alignItems:'flex-start',flex:1,flexDirection:'column',justifyContent:'center'}}>
                    <Text style={textBoldStyle}> Please wait </Text>
                    <Text style={textNormalStyle}> { this.props.MyMsg } </Text>
                  </View>
                    </View>
              </View>
          }

          { this.state.dialogSuccessVisible &&
              <View style={{alignItems:'center',flex:1,flexDirection:'column'}}>

              <View style={{alignItems:'center',flex:1,flexDirection:'column',justifyContent:'center'}}>
                  <Text style={textBoldStyle}> Success! </Text>
                  <Text style={textNormalStyle}> { this.state.successMsg } </Text>
              </View>
              </View>
          }

          { this.state.dialogFaliedVisible &&
            <View style={{alignItems:'center',flex:1,flexDirection:'column'}}>

            <View style={{alignItems:'center',flex:1,flexDirection:'column',justifyContent:'center'}}>
                <Text style={textBoldStyle}> Failed ! </Text>
              { this.state.alertMessage === '' ?
                <Text style={textNormalStyle}> Something went wrong, please try again! </Text> : <Text style={textNormalStyle}> {this.state.alertMessage } </Text> }
            </View>
            </View>
          }
          </View>
      </Dialog>
    );
  }
}

const styles = {
  viewParentStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#0000000000',
    borderRadius:50,
    borderWidth: 1,
    borderColor: colors.gold,
    justifyContent: 'center'
  },
  viewStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    justifyContent: 'center'
  },
  loginbuttonBackStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    marginBottom:10,
    backgroundColor:'#ffffff',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center'
  },
  forgetbuttonBackStyle:{
    flexDirection:'column',
    height:30,
    marginRight:40,
    marginLeft:40,
    backgroundColor:'#00000000',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#00000000',
    justifyContent: 'center'
  },
  ImageStyle:{
    width: 200,
    height: 200,
    margin:20,
    resizeMode: 'contain',
    justifyContent: 'center'
  },
  RoundedCircle: {
    backgroundColor: '#ffffff',
    height: 26,
    borderRadius: 26/2,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: '#ffffff'
  },
  textBoldStyle:{
    fontSize:27,
    fontWeight: 'bold',
    color: '#000'
  },
  textNormalStyle:{
    fontSize:16,
    color: '#000',
    textAlign: 'center'
  },
  inputStyle:{
    flexDirection:'row',
    height:45,
    marginRight:10,
    marginLeft:10,
    marginTop:8,
    marginBottom:2,
    backgroundColor:'#0000000000',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 5
  },
  buttonStyle: {
    flexDirection:'column',
    height:40,
    marginTop:8,
    marginBottom:8,
    borderRadius:50,
    borderWidth: 1,
    justifyContent: 'center'
  }
}

export default WebService;
