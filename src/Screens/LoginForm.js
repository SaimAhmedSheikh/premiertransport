import React, {Component} from 'react';
import { Platform, Text, View, Dimensions, Image ,ImageBackground, ScrollView, Alert,Keyboard,ToastAndroid ,TouchableOpacity} from 'react-native';
import { Input , LoginButton , ForgetPassword, SubmitButton, GeneralButton } from '../Components'
import { Dialog } from 'react-native-simple-dialogs';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
var {width, height} = Dimensions.get('window');
const imageHeight = Math.round(width * 9 / 16);
const imageWidth = width;

const login_bg =  require('../images/bg.png');
const logo =  require('../images/logo2.png');
const password_icon = require('../images/password_icon.png');
const email_icon = require('../images/email_icon.png');
const text = require('../images/text2.png');
const login_button = require('../images/login_button.png');

const reset_password_icon = require('../images/reset_password_icon.png');
const email_icon_dark = require('../images/email_icon_dark.png');
const cancel_button = require('../images/cancel_button.png');
const submit_button = require('../images/submit_button.png');
const ok_button = require('../images/ok_button.png');
const successfully_sent_icon = require('../images/successfully_sent_icon.png');

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let dataaa ;

import * as MyConstants from '../Components/Constants';
import LocalNotification from '../Components/LocalNotification';
let URL_LOGIN  =  MyConstants.BASE_URL + "User/Login";
let URL_FORGET_PASSWORD  = MyConstants.BASE_URL_FORGETPASS;
let URL_UPDATE_PASSWORD  = MyConstants.BASE_URL + "User/UpdatePassword";

var device_id ;
var device_type;

if (Platform.OS === "ios") {
   device_id = "ios2";
   device_type = "ios2";
} else {
   device_id = "android1";
   device_type = "android1";
}

class LoginForm extends Component {

  constructor()
  {
    super();
    this.state = {
      dialogVisible: false,
      dialogSecond:false,
      dialogChangePass:false,
      email: "",
      forget_email: "",
      password: "",
      check: "",
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      isValidated:true,
      isLogin:false,
      oldPassword : "",
      newPassword: "",
      newPasswordRep: "" }
  }

  componentWillMount(){
     commonData = CommonDataManager.getInstance();
     // NetInfo.isConnected.fetch().then(isConnected => {
     //   if (isConnected) {
     //     Alert.alert("You are online!");
     //   } else {
     //     Alert.alert("You are offline!");
     //   }
     // });
  }


   componentDidMount(){
    try{
    //  await BackgroundGeolocation.stop();

    }catch(err){
      console.log('err '+err);
    }
  }

  render()
  {
//    {this.state.isLogin &&  <View style={{ width:width, height:height }}> <RouterComponent/>   </View>}
//    {!this.state.isLogin &&  <ScrollView style={{ width:width }} keyboardShouldPersistTaps='handled'>
    const { viewParentStyle, viewStyle , loginbuttonBackStyle, forgetbuttonBackStyle , ImageStyle} = styles;
////<ImageBackground style={{  width:width, height:height, justifyContent: 'center'}} source={login_bg}>
//  <Image style = { ImageStyle } source = { logo } />
    return(
        <View >
        <ScrollView style={{ width:width }} keyboardShouldPersistTaps='handled'>
            <View style={{ width:width, height:height  }}>

              <ImageBackground style={{  width:width, height:height, justifyContent: 'center'}} source = {login_bg}>
                <View style={{ padding:5 , marginTop:-10 }}>
                  <View style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',marginBottom:20,marginTop:-60}}>
                      <Image style = {[ ImageStyle , {  width: 350,   height: 350} ]} source = { logo }  />
                  </View>
                  <View style={viewParentStyle}>
                      <Input style={{resizeMode: 'contain',width:50, height:20}} color={'#ffffff'}
                        placeholderTextColor={'#BBBBBB'} isVisible = {true} img = { email_icon } maxLength={35}
                        placeholder={"Email"} onChangeText={ email => this.setState({ email })} />
                  </View>
                  <View style={viewParentStyle}>
                      <Input secureTextEntry ={true}
                        style={{resizeMode: 'contain',width:50, height:20}} color={'#ffffff'} maxLength={20}
                        placeholderTextColor={'#BBBBBB'} isVisible = {true} img = { password_icon }
                        placeholder={"Password"} onChangeText={ password => this.setState({ password })}/>
                  </View>
                  <View style={forgetbuttonBackStyle} >
                      <ForgetPassword onPress = {() =>  this.setState({dialogVisible: true})}> Forget password? </ForgetPassword>
                  </View>
                  <TouchableOpacity style={{marginTop:10,justifyContent:'center'}} onPress={()=> this.validate()}>
                      <Image style = {[ ImageStyle , {  width:300,  height: 48 ,alignSelf:'center'} ]} source = { login_button }  />

                  </TouchableOpacity>

                </View>
              </ImageBackground>
            </View>
          </ScrollView>

        { this.ShowForgetPasswordDialog() }
        { this.ShowSuccessDialog() }
        { this.ShowChangePassword() }
        { this.state.loading && <WebService
          navigation={this.props.navigation}
           dialogVisible = {true}
           isGet = {false}
           MyMsg = {this.state.alertMessage}
           onPostMethod = {() => this.onPostMethod() }
           onTimeOutt = {()=> this.onTimeOutt() }
           onInternetNotConnected = {()=> this.onInternetNotConnected() }
           URL= {this.state.url}
           includeToken = { (this.state.url === URL_UPDATE_PASSWORD) ? true :  false }
           SuccessMsg = {true}
           MyObject = {this.state.MyObject }/> }
      </View>
    );
  };

  onTimeOutt () {
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.setState({loading:false});
    }, 2000);

  }

 checkIfLoggned (){
   if(commonData.getUserData() === 0) {

   } else {
  //   Alert.alert("ffed "+commonData.getUserData());
  //   Actions.pop();
    // Actions.main();
    //   return <RouterComponent/>
   }
 }

 componentDidUpdate(){
   // if(this.state.isLogin){
   //   const timeoutId = BackgroundTimer.setTimeout(() => {
   //       Actions.main();
   //   }, 300);
   // }
 }

 onPostMethod = () => {
    let Repsonse =  commonData.getTempData();
    // BackgroundTimer.setTimeout(() => {
    //     this.setState({dialogChangePass: !this.state.dialogChangePass});
    //   }, 2200);
  //  Alert.alert(''+JSON.stringify(Repsonse.Body.UserId));
  //  Alert.alert(''+this.state.MyObject);
    if(this.state.isValidated) {
      if(this.state.url === URL_LOGIN){
        console.log(""+JSON.stringify(Repsonse.Body));

        commonData.setUserData(JSON.stringify(Repsonse.Body));
        commonData.setToken(JSON.stringify(Repsonse.Body.Token));
        commonData.setTokenExpiry(JSON.stringify(Repsonse.Body.TokenExpiryDate));

        LocalNotification.createChannel();

        BackgroundTimer.setTimeout(() => {
            let UserData = commonData.getUserData();

            commonData.setCheckInOut(UserData.CheckStatus);
            // commonData.setBreakInOut(commonData.getUserData().BreakStatus);
          //   Alert.alert(''+UserData.PhoneNumber);
            if( (''+UserData.FirstName === "null") || ''+UserData.LastName  === "null" ||
                ''+UserData.PhoneNumber === "null" || ''+UserData.Address1  === "null" ||
                ''+UserData.Address2  === "null" )
            {
              //Alert.alert(''+UserData.FirstName);
                //Alert.alert(''+this.state.MyObject);
               this.setState({dialogChangePass: !this.state.dialogChangePass,MyObject:"",loading: false});
            }
            else{
              //Alert.alert(''+UserData.FirstName);
              this.props.navigation.navigate('App');
            }

          }, 2300);

      }
      else if(this.state.url === URL_FORGET_PASSWORD){
          this.setState({forget_email:"",MyObject:"",loading: false,isLogin:false,url : "",
          dialogSecond: !this.state.dialogSecond});
      }
      else if(this.state.url === URL_UPDATE_PASSWORD){
        this.createProfile();

      }
    }
    else{
      const timeoutId = BackgroundTimer.setTimeout(() => {
        this.setState({forget_email:"",loading: false});
      }, 2000);
    }
 }

  onInternetNotConnected(){
    this.setState({loading: false});
  }

  validate() {
   Keyboard.dismiss();
   //this.setState({dialogChangePass: !this.state.dialogChangePass});
  // Alert.alert(''+this.state.loading);
   //Actions.JobListing();
   if (this.state.email === "") {
     Alert.alert('', "Enter your registered email");
   } else if (reg.test(this.state.email.trim()) === false) {
     Alert.alert('', "Wrong email format (hint:example@demo.com)");
   } else if (this.state.password === "") {
     Alert.alert('', "Enter password" );
   } else {
    // this.setState({dialogChangePass: !this.state.dialogChangePass});
     this.setState({ loading: true, alertMessage: "Logging...", error: "", url :  URL_LOGIN, isValidated:true,
      MyObject : { Email: this.state.email, Password: this.state.password, device_token: "1234", device_id: device_id, device_type: device_type   } });
   }
 }

  ForgetPassword_Validate(){
    Keyboard.dismiss();
    if (this.state.forget_email === "") {
      Alert.alert('', "Enter your registered email");
    } else if (reg.test(this.state.forget_email.trim()) === false) {
      Alert.alert( '',"Wrong email format (hint:example@demo.com)");
    } else {
     this.setState({ loading: true, alertMessage: "Requesting...", error: "", url: URL_FORGET_PASSWORD,  dialogVisible: !this.state.dialogVisible,
     MyObject : { Email: this.state.forget_email  } , isLogin: false });
    }
  }

  ChangePassword_Validate(){

    if (this.state.oldPassword === "" || this.state.oldPassword.length < 5) {
        Alert.alert('', "Old password length is short");
    } else if (this.state.newPassword === "" || this.state.newPassword.length < 5) {
        Alert.alert('', "New password length is short");
    } else if (this.state.newPasswordRep != this.state.newPassword ) {
        Alert.alert('', "New password did not matched with repeat password");
    } else{

       this.setState({ loading: true, alertMessage: "Requesting...", error: "", url: URL_UPDATE_PASSWORD,
       MyObject : { OldPassword: this.state.oldPassword , NewPassword: this.state.newPassword, ConfirmPassword: this.state.newPasswordRep  } , isLogin: false });
    }
  }

//  <Image style = { {  width: 90,  height: 90,  resizeMode: 'contain',  justifyContent: 'center'} }   source = { exclamationMark } />
 ShowForgetPasswordDialog()
 {
   const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textStyle , buttonStyle} = styles;
   return (
     <Dialog
          title=""
          dialogStyle = {{backgroundColor:"#E7E7E7"}}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
          <View style = {{ height: 350, backgroundColor:"#E7E7E7",marginTop:10}}>
              <View style={{alignItems:'center',flex:1,flexDirection:'column'}}
              onPress = {() => this.setState({dialogVisible: !this.state.dialogVisible})}>

                  <Image source = {reset_password_icon} style = { { marginTop:-95, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                        <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                        <Text style={textBoldStyle}> RESET </Text>
                        <Text style={textBigStyle}> PASSWORD </Text>
                        <Text style={{marginTop:5,marginBottom:10}}>  </Text>
                        <Text style={textNormalStyle}> Enter your email address below to receive your new password! </Text>
                        <View style={inputStyle}>
                          <Input style={{resizeMode: 'contain',width:'100%', height:30,margin:10,fontSize:16}} maxLength={35}
                                 placeholderTextColor={'#393939'} isVisible = {true} img = { email_icon_dark }  color={'#7B7B7B'}
                                 placeholder={"Enter your registered email"} onChangeText={ forget_email => this.setState({ forget_email })}/>
                        </View>

                        <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>



                        <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                  marginTop:60,marginBottom:20 }} onPress={()=> this.setState({dialogVisible: !this.state.dialogVisible})}>
                            <Image style = {{width: 150,   height: 48} } source = { cancel_button }  />
                        </TouchableOpacity>

                        <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                  marginTop:60,marginBottom:20 }} onPress={()=> this.ForgetPassword_Validate()}>
                            <Image style = {{width: 150,   height: 48} } source = { submit_button }  />
                        </TouchableOpacity>

                   </View>
              </View>
          </View>
      </Dialog>
    );
  }

  // SuccessDialog(){
  //   this.setState({dialogSecond: !this.state.dialogSecond});
  //   this.ShowSuccessDialog();
  // }

  ShowSuccessDialog()
  {
    const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textStyle , buttonStyle} = styles;
    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7"}}
           visible={this.state.dialogSecond}
           onTouchOutside={() => this.setState({dialogSecond: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height: 300, backgroundColor:"#E7E7E7"}}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}
               onPress = {() => this.setState({dialogSecond: !this.state.dialogSecond})}>

                   <Image source ={successfully_sent_icon}  style = { { marginTop:-90, width: 140,  height: 140,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                         <Text style={{marginTop:-15,marginBottom:5}}>  </Text>
                         <Text style={textBoldStyle}> SUCCESSFULLY </Text>
                         <Text style={textBigStyle}> SENT </Text>
                         <Text style={{marginTop:5,marginBottom:10}}>  </Text>
                         <Text style={{fontSize:15, color: '#393939',    textAlign: 'center',  fontStyle:'italic',}}> Thank you </Text>
                         <Text style={textNormalStyle}> Your new password will be send on your email address. </Text>
                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                         <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                   marginTop:20,marginBottom:20 }} onPress={()=> this.setState({dialogSecond: !this.state.dialogSecond})}>
                             <Image style = {{width: 150,   height: 48} } source = { ok_button }  />
                         </TouchableOpacity>

                         </View>
               </View>
           </View>
       </Dialog>
     );
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
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}
               onPress = {() => this.setState({dialogChangePass: !this.state.dialogChangePass})}>

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
                                                   marginTop:60,marginBottom:20 }} onPress={()=>
                                                     this.setState({newPasswordRep:'',newPassword:'',oldPassword:'',dialogChangePass: !this.state.dialogChangePass})}>
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

    createProfile(){
     this.setState({dialogChangePass: !this.state.dialogChangePass});
     this.props.navigation.navigate('CreateProfile');
   }
}



const styles = {
  viewParentStyle:{
    flexDirection:'column',
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
    marginTop:20,
    marginBottom:10,
    backgroundColor:'#ffffff',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center'
  },
  forgetbuttonBackStyle:{
    flexDirection:'column',
    height:30,
    backgroundColor:'#00000000',
    borderWidth: 1,
    borderColor: '#00000000',
    justifyContent: 'flex-end',
    alignSelf:'flex-end',
    marginRight:40
  },
  ImageStyle:{
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
  textBigStyle:{
    fontSize:23,
    color: '#393939',
    marginTop:-4,
    fontFamily: 'Gotham Book'
  },
  textBoldStyle:{
    fontSize:26,
    fontFamily: 'Gotham Bold',
    color: '#393939'
  },
  textNormalStyle:{
    fontSize:15,
    color: '#393939',
    textAlign: 'center',
    marginBottom:20,
    fontStyle:'italic',
    fontFamily: 'Gotham Book'
  },
  inputStyle:{
    flexDirection:'row',
    height:45,
    marginRight:2,
    marginLeft:2,
    marginTop:8,
    paddingLeft:10,
    marginBottom:2,
    backgroundColor:'#0000000000',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
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

export default LoginForm ;
