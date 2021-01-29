import React , {Component} from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image, Alert} from 'react-native';
import { Input  } from '../Components'
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header } from '../Components';
import colors from '../Components/colors';
import { Dialog } from 'react-native-simple-dialogs';
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');
const logo3 = require('../images/logo3.png');
const right_arrow2 = require('../images/right_arrow2.png');
const reset_password_icon = require('../images/reset_password_icon.png');
const logout_icon = require('../images/logout_icon.png');
const cancel_button = require('../images/cancel_button.png');
const submit_button = require('../images/submit_button.png');
import messaging from '@react-native-firebase/messaging';
import * as MyConstants from '../Components/Constants';
let URL_LOGOUT  =  MyConstants.BASE_URL + "User/Logout";
let URL_UPDATE_PASSWORD  =  MyConstants.BASE_URL + "User/UpdatePassword";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import axios from "axios";
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;

class Settings extends Component{

  constructor(props){
    super(props);
    this.state = {
      dialogVisible : false,
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "" ,
      oldPassword : "",
      newPassword: "",
      newPasswordRep: "",
      dialogChangePass:false}
  }

  componentWillMount(){
     commonData = CommonDataManager.getInstance();
  }

  render(){
    return(
      <View style={{flex:2 }}>
          <Header onBackPress={()=>this.props.navigation.pop()} headerText = {'Settings'} headerColor={colors.HeaderColor}
              showSettings={false} showBack={true} showEmergencyContact={false}/>
           <ImageBackground style={{  width:width, height:height, justifyContent: 'center'}} source = {login_bg}>
            <View style={styles.backCorner}>
              <View style={{padding:10,alignSelf:'center',marginTop:20}}>

               <TouchableOpacity onPress = {()=> this.props.navigation.navigate('ViewProfile')} >
                  <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{fontFamily:'Gotham Book',fontSize:18}}> View Profile </Text>
                    <Image source={right_arrow2} style={{width:20,height:20, resizeMode:'contain'}} />
                  </View>
               </TouchableOpacity>
               <View style={styles.horizontalLine}/>

               <TouchableOpacity style={{marginTop:15}} onPress = {()=> this.checkIfOnRide()}>
                  <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{fontFamily:'Gotham Book',fontSize:18}}> Emergency Contact </Text>
                      <Image source={right_arrow2} style={{width:20,height:20, resizeMode:'contain'}} />
                  </View>
               </TouchableOpacity>
               <View style={styles.horizontalLine}/>

               <TouchableOpacity style={{marginTop:15}} onPress = {()=> this.setState({dialogChangePass:!this.state.dialogChangePass})}>
                  <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{fontFamily:'Gotham Book',fontSize:18}}> Update Password </Text>
                      <Image source={right_arrow2} style={{width:20,height:20, resizeMode:'contain'}} />
                  </View>
               </TouchableOpacity>
               <View style={styles.horizontalLine}/>

               <TouchableOpacity style={{marginTop:15}} onPress = {()=> this.setState({dialogVisible:!this.state.dialogVisible})}>
                  <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{fontFamily:'Gotham Book',fontSize:18}}> Log out </Text>
                      <Image source={right_arrow2} style={{width:20,height:20, resizeMode:'contain'}} />
                  </View>
               </TouchableOpacity>
               <View style={styles.horizontalLine}/>

               <Image source={logo3} style={{width:190,height:190 ,alignSelf:'center' }} />
              </View>
            </View>
          </ImageBackground>
          { this.ShowConfirmDialog() }
          { this.ShowChangePassword() }
          { this.state.loading && <WebService
             dialogVisible = {true}
             navigation={this.props.navigation}
             isGet = {false}
             MyMsg = {this.state.alertMessage}
             onPostMethod = {() => this.onPostMethod() }
             onTimeOutt = {()=> this.onTimeOutt() }
             onInternetNotConnected = {()=> this.onInternetNotConnected() }
             URL= {this.state.url}
             includeToken = { true }
             SuccessMsg = { true }
             MyObject = {this.state.MyObject }/> }
      </View>
    )
  }

  checkIfOnRide(){
     if(commonData.getCurrentRideData() == 0){
        Alert.alert('',"You can use emergency contact when you are on ride");
     }
     else{
        this.props.navigation.navigate('EmergencyContact')
     }

  }

  ExpireToken(){
    this.setState({ loading: true, alertMessage: "Logging out, This may take a while.", error: "", url :  URL_LOGOUT,
     MyObject : { UserId: commonData.getUserData().UserId } });
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
    if(Repsonse.Status == 'OK'){
      if(this.state.url === URL_LOGOUT){
      //  BackgroundGeolocation.removeAllListeners();
      try{
         BackgroundGeolocation.stop();
      }catch(err){
        console.log('err '+err);
      }
        this.clearData_and_Exit();
      }
      else if(URL_UPDATE_PASSWORD){
        BackgroundTimer.setTimeout(() => {
              this.setState({dialogChangePass: false,loading:!this.state.loading});
          }, 2000);

      }
      //commonData.get
      //Alert.alert(''+JSON.stringify(Repsonse));
      //commonData.setTodayRidesData(JSON.stringify(Repsonse.Body));
      //this.clearData_and_Exit();
    }
 }

 clearData_and_Exit(){
   messaging().unsubscribeFromTopic("android1");
   messaging().unsubscribeFromTopic("user_"+commonData.getUserData().UserId);
   commonData.removeAllKeysData();
   this.props.navigation.navigate('Login');
 }

  componentDidMount(){

  }

  ShowChangePassword()
  {
    const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textStyle , buttonStyle} = styles;
    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7",marginTop:10}}
           visible={this.state.dialogChangePass}
           onTouchOutside={() => this.setState({dialogChangePass: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height: 410, backgroundColor:"#E7E7E7"}}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}   >

                   <Image source ={reset_password_icon} style = { { marginTop:-80, width: 140,  height: 140,  resizeMode: 'contain',  justifyContent: 'center' } }/>

                         <Text style={textBoldStyle}> CHANGE </Text>
                         <Text style={textBigStyle}> PASSWORD </Text>
                         <Text style={{marginTop:1,marginBottom:5}}>  </Text>
                         <Text style={textNormalStyle}> Change your password below! </Text>
                         <View style={inputStyle}>
                           <Input style={{resizeMode: 'contain',width:'100%', height:30,margin:10}} maxLength={20}
                                  placeholderTextColor={'#393939'}  color={'#7B7B7B'} secureTextEntry ={true}
                                  placeholder={"Old Password"} onChangeText={ oldPassword => this.setState({ oldPassword })}/>
                         </View>

                         <View style={inputStyle}>
                           <Input style={{resizeMode: 'contain',width:'100%', height:30,margin:10}} maxLength={20}
                                  placeholderTextColor={'#393939'}  color={'#7B7B7B'} secureTextEntry ={true}
                                  placeholder={"New Password"} onChangeText={ newPassword => this.setState({ newPassword })}/>
                         </View>

                         <View style={inputStyle}>
                           <Input style={{resizeMode: 'contain',width:'100%', height:30,margin:10}} maxLength={20}
                                  placeholderTextColor={'#393939'}  color={'#7B7B7B'} secureTextEntry ={true}
                                  placeholder={"Confirm Password"} onChangeText={ newPasswordRep => this.setState({ newPasswordRep })}/>
                         </View>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5,marginTop:10}}>

                           <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                     marginTop:60,marginBottom:20 }} onPress={()=> this.setState({dialogChangePass: !this.state.dialogChangePass})}>
                               <Image style = {{width: 150,   height: 48} } source = { cancel_button }  />
                           </TouchableOpacity>

                           <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                     marginTop:60,marginBottom:20 }} onPress={()=> this.ChangePassword_Validate()}>
                               <Image style = {{width: 150,   height: 48} } source = { submit_button }  />
                           </TouchableOpacity>

                         </View>
               </View>
           </View>
       </Dialog>
     );
   }

   ChangePassword_Validate(){
     if (this.state.oldPassword === "" || this.state.oldPassword.length < 5) {
         Alert.alert('Note', "Old password length is short");
     } else if (this.state.newPassword === "" || this.state.newPassword.length < 5) {
         Alert.alert('Note', "New password length is short");
     } else if (this.state.newPasswordRep != this.state.newPassword ) {
         Alert.alert('Note', "New password did not matched with repeat password");
     } else{
        this.setState({ loading: true, alertMessage: "Requesting...", error: "", url: URL_UPDATE_PASSWORD,
        MyObject : { OldPassword: this.state.oldPassword , NewPassword: this.state.newPassword, ConfirmPassword: this.state.newPasswordRep  } , isLogin: false });
     }
   }

  ShowConfirmDialog()
  {
    const {   textBoldStyle,textNormalStyle,textBigStyle , inputStyle} = styles;

    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7" }}
           visible={this.state.dialogVisible}
           onTouchOutside={() => this.setState({dialogVisible: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height: 250, backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}
               onPress = {() => this.setState({dialogVisible: !this.state.dialogVisible})}>

                   <Image source ={logout_icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                         <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                         <Text style={textBoldStyle}> LOG OUT </Text>
                         <Text style={textBigStyle}> SESSION </Text>
                         <Text style={{marginTop:5,marginBottom:10}}>  </Text>
                         <Text style={textNormalStyle}> Are you sure you want to log out? </Text>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                             <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                       marginTop:60,marginBottom:20 }} onPress={()=> this.setState({dialogVisible: !this.state.dialogVisible})}>
                                 <Image style = {{width: 150,   height: 48} } source={no}  />
                             </TouchableOpacity>

                             <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                       marginTop:60,marginBottom:20 }} onPress={()=>  this.ExpireToken() }>
                                 <Image style = {{width: 150,   height: 48} } source={yes}  />
                             </TouchableOpacity>

                         </View>
               </View>
           </View>
       </Dialog>
     );
   }

}

const styles = StyleSheet.create({
  backCorner: {
    backgroundColor: '#E7E7E7',
    margin:10,
    height:390,
    width:width-30,
    flexDirection:'column',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop:-100,
    alignSelf:'center'
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:20,
    marginBottom:10,
    height:1,
    width:width-90,
    backgroundColor:'#C7C7C7',
  },
  textBoldStyle:{
    fontSize:26, fontFamily: 'Gotham Bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-4 , fontFamily: 'Gotham Book',
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic', fontFamily: 'Gotham Book',
  },
  inputStyle:{
    flexDirection:'row',
    height:45,
    marginRight:2,
    marginLeft:2,
    marginTop:8,
    paddingLeft:10,
    marginBottom:2,
    backgroundColor:'#00000000',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
  },
});

export default Settings ;
