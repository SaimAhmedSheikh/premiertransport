import React , { Component } from 'react';
import { View, Text, StyleSheet , Dimensions , Image , TouchableOpacity , Alert , Toast,ActivityIndicator,ToastAndroid } from 'react-native';
import colors from '../Components/colors'
var {width, height} = Dimensions.get('window');
const break_in =  require('../images/break_in.png');
const check_in =  require('../images/check_in.png');
const toggle_out =  require('../images/toggle_out.png');
const iconCheckInBreakIn =  require('../images/checkin_icon.png');
const iconCheckOutBreakOut =  require('../images/checkout_icon.png');
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as MyConstants from '../Components/Constants';
let URL_MARK_ATTENDANCE  =  MyConstants.BASE_URL + "User/MarkAttendance";
let URL_GET_STATUS  =  MyConstants.BASE_URL + "User/GetUpdatedStatus";
import WebService from '../API/WebService';
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');

import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const fontSize  = 16;
import { Dialog } from 'react-native-simple-dialogs';
 let doc;
 let observer;

class View_CheckIO_BreakIO extends Component{

  constructor(props){
    super(props);
    this.state = { CheckIn : false , BreakIn : false , dialogVisible : false , CheckBreak : '',
                    alertType: null,
                    alertMessage: "",
                    error: "",
                    loading: false,
                    url : URL_MARK_ATTENDANCE,
                    MyObject: "" }
  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();
    //let isBreak = commonData.getBreakInOut() == 2 ? false : true ;
    //Alert.alert('value '+(commonData.getBreakInOut() === '2'));
  //  this.getCheckInBreakInStatus();
    this.setState({ CheckIn : commonData.getCheckInOut() == 0 ? false : true , BreakIn : commonData.getBreakInOut() === '2' ? false : true});
    //this.setState({ CheckIn : commonData.getCheckInOut() == 0 ? false : true , BreakIn : commonData.getBreakInOut() === '2' ? false : true });

    auth().signInWithEmailAndPassword('jameel@lntechnologies.com', 'qwerty').catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

       return;
     });
      // For the Purpose of firestore the values for Break in and out are different
      // as api is returning new data with 2 and 3. firetore is storing in 0 and 1 like below
      // 0 -Break OUT
      // 1 - break inspect
      try{
        doc = firestore().collection("User").doc(''+commonData.getUserData().UserId)

        observer = doc.onSnapshot(docSnapshot =>
          {

            //let checkStatuss = "";
            if(docSnapshot.exists){
              let data = docSnapshot.data()
              if(data && data.BreakStatus == 1){ // break in
              //      breakStatuss = '3';
                    commonData.setBreakInOut('3');
                    this.setState({ BreakIn : true});
                }else if(data && data.BreakStatus == 0){ //beak out
              //      breakStatuss = '2';
                    commonData.setBreakInOut('2');
                    this.setState({ BreakIn : false});
                }
      
                if(data && data.CheckStatus == 1){ //  checkedIn
    
                    commonData.setCheckInOut(1);
                    this.setState({ CheckIn : true});
                }else if(data && data.CheckStatus == 0){ //
    
                    commonData.setCheckInOut(0);
                    this.setState({ CheckIn : true});
                }
      
      
            }
            // commonData.setBreakInOut(breakStatuss); CheckIn
          //  if()

            // this.setState({ BreakIn : breakStatuss === '3' ? true : false , CheckIn : docSnapshot.data().CheckStatus  == 1 ? true : false });


            //Alert.alert('CheckStatus' + docSnapshot.data().CheckStatus);
          //console.log(`Received doc snapshot: ${docSnapshot}`);
        }, err => {
        //  console.log(`Encountered error: ${err}`);
        //  Alert.alert(''+err);
        });
      }catch(e){
          console.log(""+e);
      }
  }


  componentWillUnmount(){
    try{
        observer();
    }
    catch(e){

    }

  }

  getCheckInBreakInStatus(){

    const token = commonData.getToken();//'Bearer '.concat( commonData.getToken());
    headers = {   'Content-Type': 'application/json',   'Token': token , 'Authorization' : commonData.getUserData().UserId }
    const notConnectedMsg = "You are offline! Try again after connecting to the internet.";
        axios.get(URL_GET_STATUS,{headers:headers}, {cancelToken: source.token})
             .then(responseJson => {
               let dataa = responseJson.data;
                     console.log(JSON.stringify(responseJson.data));
               //Alert.alert(JSON.stringify(responseJson.data));
               if (dataa.Status === 'OK') {
                  commonData.setBreakInOut(''+dataa.Body.BreakStatus);
                  commonData.setCheckInOut(''+dataa.Body.CheckStatus);
               } else {
                   Alert.alert(JSON.stringify(responseJson.data));

               }
               if(responseJson.data.message === 'Token Expired'){
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

  clearData_and_Exit(){
    try{
        observer();
    }
    catch(e){

    }
    commonData.removeAllKeysData();
    this.props.onLogOutPress();
  }

 // CheckOUT --- 0
 // CheckIN --- 1
 // BreakOUT --- 2
 // BreakIN --- 3

  render(){
    let CheckInn = commonData.getCheckInOut() == 0 ? false : true ;
    let BreakInn = commonData.getBreakInOut() === '2' ? false : true;
  //  Alert.alert('CheckInn '+(commonData.getCheckInOut()));
    return(
      <View>
      <View style = {{width:width,backgroundColor:'#ffffff00',justifyContent:'center'}}>

        <View style = {{flexDirection:'row',justifyContent:'center',width:width/100 * 95,height:90,alignSelf:'center'}}>

          <View style = {styles.CheckStyle} >
            <View style = {styles.viewStyle} >
              <Text style = {styles.textStyleBold} > {!CheckInn ? '  CHECK OUT  ' : 'CHECK IN  ' }</Text>
              <Text style = {styles.textStyle}> {CheckInn ? '  CHECK OUT  ' : '  CHECK IN  ' }  </Text>
            </View>
            <TouchableOpacity onPress = {()=> this.setState({dialogVisible : !this.state.dialogVisible, CheckBreak : 'Check'})} style = {{justifyContent:'center', alignSelf:'center',marginRight:10}}>
              <Image source = { CheckInn ? check_in : toggle_out} style={{alignSelf:'center', width : 47, height : 47, resizeMode : 'contain'}} />
            </TouchableOpacity>
          </View>

          <View style = {styles.BreakStyle} >
            <View style = {styles.viewStyle} >
              <Text style = {styles.textStyleBold} > {!BreakInn ?  '  BREAK OUT  ' : '  BREAK IN  '  }</Text>

            </View>

          </View>

        </View>

      </View>
      { this.state.dialogVisible && this.ShowConfirmDialog() }
      { this.state.loading && <WebService
        navigation={this.props.navigation}
         dialogVisible = {true}
         isGet = { false}
         MyMsg = {this.state.alertMessage}
         onPostMethod = {() => this.onPostMethod() }
         onTimeOutt = {()=> this.onTimeOutt() }
         onInternetNotConnected = {()=> this.onInternetNotConnected() }
         URL= {this.state.url}
         includeToken = { true }
         SuccessMsg = {true}
         MyObject = {this.state.MyObject }/> }
      </View>
    )
  }

  onInternetNotConnected(){
    this.setState({loading: false});
  }

  onTimeOutt () {
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.setState({loading:false});
    }, 2000);
  }

  onPostMethod = () => {

     let Repsonse =  commonData.getTempData();
     if(Repsonse.Code == 200){
        //Alert.alert(''+Repsonse.Body.Status);
        if(this.state.url === URL_MARK_ATTENDANCE){
          if(this.state.CheckBreak == 'Check'){
          //  let state = commonData.getCheckInOut() == 0 ? 1 : 0;
          //  Alert.alert(''+JSON.stringify(Repsonse.Body.Status));
            commonData.setCheckInOut(JSON.stringify(Repsonse.Body.Status));
            if(commonData.getCheckInOut() == 0){
              try{
                // BackgroundTimer.setTimeout(() => {
                //       BackgroundGeolocation.stop();
                //   }, 5000);
                 // BackgroundTask.schedule();
                 BackgroundGeolocation.stop();
              }
              catch(err){

              }
              this.clearData_and_Exit();
            }
            else
            {

              BackgroundTimer.setTimeout(() => {
                    this.setState({ CheckIn : !this.state.CheckIn , loading:false });
                }, 2300);
            }

          }
        }

       //commonData.setUserData(JSON.stringify(Repsonse.Body));
       //this.props.navigation.navigate('App');
     }
     else  if(Repsonse.Code == 408){ // already checked in
         if(this.state.url === URL_MARK_ATTENDANCE){
           commonData.setCheckInOut(1);
           BackgroundTimer.setTimeout(() => {    this.setState({ CheckIn : true , loading:false }); }, 2300);
         }
     }
     else  if(Repsonse.Code == 409){ // already checked out
       if(this.state.url === URL_MARK_ATTENDANCE){
          commonData.setCheckInOut(0);
           try{
              BackgroundGeolocation.stop();
           }
           catch(err){  }
       this.clearData_and_Exit();
      }
     }
     //Alert.alert(''+Repsonse.Body.Address1);
   //  this.props.navigation.navigate('App');
  }
//<Text style = {styles.textStyle}> {this.state.BreakIn ? '  BREAK OUT  ' : '  BREAK IN  ' }  </Text>
  // <TouchableOpacity onPress = {()=> this.setState({dialogVisible : true, CheckBreak : 'Break'})} style = {{justifyContent:'center', alignSelf:'center'}}>
  //   <Image source = { this.state.BreakIn ? break_in : toggle_out} style={{alignSelf:'center', width : 50, height : 45, resizeMode : 'contain'}} />
  // </TouchableOpacity>

  componentDidMount(){
    //MM/dd/yyyy hh:mm:ss tt
    //   Alert.alert("current ticks "+new Date().getTime());
  }

  ShowConfirmDialog()
  {
    const { textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textStyle , buttonStyle} = styles;
    var heading = "";
    var description = "";
    var mOnPress;
    var icon;

    if(this.state.CheckBreak == 'Check'){
      if(commonData.getCheckInOut() == 0)
      {
        heading = 'CHECK IN';
        description = 'Do you want to check in?';
        icon = iconCheckInBreakIn;
      }
      else
      {
        heading = 'CHECK OUT';
        description = 'Do you want to check out? You will be logged out!';
        icon = iconCheckOutBreakOut;
      }
    }
    // else if(this.state.CheckBreak == 'Break'){
    //   if(!this.state.CheckIn)
    //   {
    //     heading = 'BREAK IN';
    //     description = 'Do you want to break in?';
    //     icon = iconCheckInBreakIn;
    //   }
    //   else {
    //     heading = 'BREAK OUT';
    //     description = 'Do you want to break out?';
    //     icon = iconCheckOutBreakOut;
    //   }
    // }

    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7" }}
           visible={this.state.dialogVisible}
           onTouchOutside={() => this.setState({dialogVisible: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height: 250, backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}} >

                   <Image source ={icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                         <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                         <Text style={textBoldStyle}> {heading} </Text>
                         <Text style={textBigStyle}> NOTIFICATION </Text>
                         <Text style={{marginTop:5,marginBottom:10}}>  </Text>
                         <Text style={textNormalStyle}> {description} </Text>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                         <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                   marginTop:60,marginBottom:20 }} onPress={()=> this.setState({dialogVisible: !this.state.dialogVisible})}>
                             <Image style = {{width: 150,   height: 48} } source={no}  />
                         </TouchableOpacity>

                         <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                   marginTop:60,marginBottom:20 }} onPress={()=>  this.ChangeStatus()}>
                             <Image style = {{width: 150,   height: 48} } source={yes}  />
                         </TouchableOpacity>

                         </View>
               </View>
           </View>
       </Dialog>
     );
   }

   ChangeStatus(){
    // Alert.alert(''+this.state.dialogVisible+' '+this.state.loading);
       this.setState({ dialogVisible: !this.state.dialogVisible, loading : true , url:URL_MARK_ATTENDANCE,
         alertMessage:  commonData.getCheckInOut() == 0 ? 'Marking check in' : ' Marking check out, this may take a while.' ,
         MyObject : { CreatedDate : new Date().getTime(), UserId:commonData.getUserData().UserId, Status: commonData.getCheckInOut() == 0 ? 1 : 0 } });

       // if(this.state.CheckBreak == 'Check'){
       //   this.setState({dialogVisible: !this.state.dialogVisible, CheckIn : !this.state.CheckIn });
       // }
       // else if(this.state.CheckBreak == 'Break'){
       //    this.setState({dialogVisible: !this.state.dialogVisible, BreakIn : !this.state.BreakIn });
       // }
   }
}


const styles = {
  viewStyle:{
    flexDirection:'column',justifyContent:'center', alignSelf:'center'
  },
  textStyleBold:{
    fontSize: fontSize-2 ,alignSelf:'center', color:'#ffffff', fontFamily:'Gotham Bold', margin:5
  },
  textStyle:{
    fontSize: fontSize-5 ,marginTop:-5, alignSelf:'center', fontFamily:'Gotham Book',color:'#ffffff' , margin:5
  },
  CheckStyle: {
    height : 55,
    flex:1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10 ,
    borderTopRightRadius: 0 ,
    backgroundColor: colors.blue,
    flexDirection:'row',
    paddingLeft:10,
    justifyContent:'center'
  },
  BreakStyle: {
    height : 55 ,
    flex:1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0 ,
    borderTopRightRadius: 10 ,
    backgroundColor: colors.orange,
    flexDirection:'row',
    paddingRight:10,
    justifyContent:'center'
  },
  textBoldStyle:{
    fontSize:26, fontFamily: 'Gotham Bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-4 , fontFamily: 'Gotham Book',
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic',fontFamily: 'Gotham Book',
  },
};

export { View_CheckIO_BreakIO };
