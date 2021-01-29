import React, { Component , PureComponent } from 'react';
import { Alert, ImageBackground,Text, View, FlatList, Dimensions, StyleSheet,ScrollView,Image ,Picker , TouchableOpacity , TextInput , Keyboard, ActivityIndicator} from 'react-native';
import  SingleCard  from './SingleCard';
import JobList from '../Data/JobList.json'
import CountiresJson from '../Data/Countries.json'
import ImagePicker from 'react-native-image-picker';
var {width, height} = Dimensions.get('window');
import { Input , LoginButton , ForgetPassword, SubmitButton, GeneralButton , Header } from '../Components';
import colors from '../Components/colors';
let Countries = ['select country','United States','Mexico','Canada'];
const bg =  require('../images/bg2.png');
const img =  require('../images/img.png');
const save_button =  require('../images/save_button.png');
const edit_icon_black =  require('../images/edit_icon_black.png');
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
import AskPermission from '../Components/AskPermission';

import axios from "axios";
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import { Dialog } from 'react-native-simple-dialogs';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;

import * as MyConstants from '../Components/Constants';
let URL_UPDATE_PROFILE  =  MyConstants.BASE_URL + "User/UpdateProfile";

class EditProfile extends PureComponent {

  static navigationOptions = ({ navigation }) => {
     //return header with Custom View which will replace the original header
     return {
       header: ( <Header headerText = {'Profile'} headerColor={colors.HeaderColor} show={false}/>  ),
     };
   };

  constructor(props){
    super(props);
    this.state = {
     ProfilePic:'',
     FirstName:'',
     LastName:'',
     EmailAddress:'',
     PhoneNumber:'',
     Address1:'',
     Address2:'',
     selStates:['select state'],
     selCities:['select city'],
     City:'',
     State:'',
     Country:'',
     ZipCode:'',
     loading:false,
     isImageUploading:false,
     url:''};
  }


  componentWillMount(){
    commonData = CommonDataManager.getInstance();
//    Alert.alert(''+commonData.getUserData().Country);
    let statess = [];
    let value;
    let tempStates = CountiresJson.filter(t => t.name.includes(commonData.getUserData().Country))[0].states[0];

    for (var key in tempStates) {
      if (tempStates.hasOwnProperty(key)) {
          statess.push(''+key);
      }
    }

    for (var key in tempStates ) {
       if(key === commonData.getUserData().State){
         value = ''+tempStates[key];  break;
       }
    }

    let tempCities= value.split(',');
    //this.setState({selStates:statess , selCities:tempCities});

    this.setState({

      ProfilePic:''+commonData.getUserData().ProfilePicture,
      FirstName:''+commonData.getUserData().FirstName === "null" ? "" : commonData.getUserData().FirstName,
      LastName:''+commonData.getUserData().LastName === "null" ? "" : commonData.getUserData().LastName,
      EmailAddress:''+commonData.getUserData().Email === "null" ? "" : commonData.getUserData().Email,
      PhoneNumber:''+commonData.getUserData().PhoneNumber === "null" ? "" : commonData.getUserData().PhoneNumber,
      Address1:''+commonData.getUserData().Address1 === "null" ? "" : commonData.getUserData().Address1,
      Address2:''+commonData.getUserData().Address2 === "null" ? "" : commonData.getUserData().Address2,
      selStates:['select state'],
      selCities:['select city'],
      City:''+commonData.getUserData().City === "null" ? "" : commonData.getUserData().City,
      State:''+commonData.getUserData().State === "null" ? "" : commonData.getUserData().State,
      Country:''+commonData.getUserData().Country === "null" ? "" : commonData.getUserData().Country,
      ZipCode:''+commonData.getUserData().Zipcode === "null" ? "" : commonData.getUserData().Zipcode,
      selStates:statess , selCities:tempCities });

  }

  componentDidMount(){
    let ask = new AskPermission();
     ask.requestExternalPermission();
  }


     ShowActivityIndicator()
      {
        const { RoundedCircle, textBoldStyle,textNormalStyle, inputStyle , textStyle , buttonStyle} = styles;
        return (
          <Dialog
               title=""
               dialogStyle = {{backgroundColor:"#ffffff"}}
               visible={this.state.isImageUploading}
               positiveButton={{ title: "OK", onPress: () => this.setState({isImageUploading:false})}} >
               <View style = {{ height: 75, backgroundColor:"#ffffff"}}>
                   <View style={{alignItems:'center',flex:1,flexDirection:'row'}}>
                       <View style={{alignItems:'center',flexDirection:'column'}}>
                         <ActivityIndicator size="large" color="#000000" style={{  alignSelf:'flex-start', width:80,   height: 80}}/>
                       </View>
                       <View style={{alignItems:'center',flex:1,flexDirection:'row'}}>
                       <View style={{alignItems:'flex-start',flex:1,flexDirection:'column',justifyContent:'center'}}>
                         <Text style={{fontSize:27,   fontWeight: 'bold',   color: colors.pinkColorDark}}> Please wait ! </Text>
                         <Text style={{fontSize:16, color: colors.darkBrown,   textAlign: 'center'}}> Uploading image </Text>
                       </View>
                         </View>
                   </View>
               </View>
           </Dialog>
         );
       }

       ChooseImage(){
         let ask = new AskPermission();
         ask.requestExternalPermission();
         const options = {
           title: 'Select Profile Picture',
           storageOptions: { skipBackup: true, path: 'images',   },
         };


         // Open Image Library:
          ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            //console.log('Response = ', response);

             if (response.didCancel) {
               //Alert.alert('User cancelled image picker');
             } else if (response.error) {
               Alert.alert('','ImagePicker Error: ', response.error);
             } else if (response.customButton) {
               //Alert.alert('User tapped custom button: ', response.customButton);
             } else {
               const source = { uri: response.uri };
               const formData = new FormData();
                   formData.append('file', {
                    uri:  response.uri,
                    name: response.fileName,
                    type: response.type
                });
                //Alert.alert(""+response.type);  'Content-Type': 'application/json',   'Token': token , 'Authorization' : commonData.getUserData().UserId
                //const token = 'Bearer '.concat( commonData.getToken());
                const sourceimg = 'data:image/jpeg;base64,' + response.data;

                axios({
                  url: MyConstants.BASE_URL + "User/UploadProfilePicture",
                  method: 'POST',
                  data: formData,
                  headers: {
                    Accept: 'application/json',  'Content-Type': 'multipart/form-data', 'Token': commonData.getToken(), 'Authorization': commonData.getUserData().UserId
                  }
                }).then(responseJson => {

                  let dataa = responseJson.data;
                  // Alert.alert(''+JSON.stringify(responseJson.data.Body));
                  if (dataa.Status.includes("Success")) {

                       let CloneData = commonData.getUserData();
                       CloneData.ProfilePicture = dataa.Body;
                       commonData.setUserData(JSON.stringify(CloneData));
                       this.setState({ProfilePic:sourceimg});
                   } else {
                       Alert.alert('','Something went wrong, please try again');
                       console.warn('false '+JSON.stringify(dataa.response));
                   }
                    this.setState({isImageUploading:false});
                })
               .catch(
                 function(error) {
                   if (error) {
                        console.warn('catch '+JSON.stringify(error));
                        ToastAndroid.show('Something went wrong please try again!',ToastAndroid.SHORT);
                        this.setState({isImageUploading:false});
                     }
                 }
              );
              this.setState({isImageUploading:true});
               // You can also display the image using data:
               // const source = { uri: 'data:image/jpeg;base64,' + response.data };

               // this.setState({
               //   avatarSource: source,
               // });
             }
          });
         }

    render() {
      const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textViewStyle,  viewLineStyle, textStyle , buttonStyle, ImageStyleContainer} = styles;


      return(
        <View style = {{ flex:2 }}>
        <View style = {{ flex:2 }}>
        <Header showBack={true} onBackPress={()=>this.props.navigation.pop()}
         headerText = {'Edit Profile'} headerColor={colors.HeaderColor} show={false}/>
           <ImageBackground style={{ flex:1 }} source = {bg}>
            <View>
              <Text style={{fontFamily: 'Gotham Medium',margin:20,color:'#ffffff',fontSize:18}}> EDIT YOUR PROFILE: </Text>
            </View>

            <ScrollView style={{ width:width }} keyboardShouldPersistTaps='handled'>
                <View style={{ flex:2  }}>

                <View style = {{ marginTop:50,backgroundColor:"#E7E7E7",margin:10,borderRadius:30}}>
                    <View style={{alignItems:'center',flex:2,flexDirection:'column'}}>
                        <View style = { ImageStyleContainer }>
                          <Image style = {{  alignSelf:'center',borderRadius: 50,width: 100,  height: 100,  resizeMode: 'cover',  justifyContent: 'center' } }
                                 source={this.state.ProfilePic == '' ? img : { uri: this.state.ProfilePic } }/>
                        </View>
                        <TouchableOpacity style={{marginTop: -30,marginRight:-80, justifyContent: 'center'}} onPress={()=> this.ChooseImage()}>
                          <Image style = { {  width: 35,  height: 35,  resizeMode: 'contain'} }
                                 source={edit_icon_black}/>
                        </TouchableOpacity>
                        <Text style={{marginTop:5,marginBottom:5}}>  </Text>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                        <TextInput maxLength={14}
                          placeholder={"First Name   "}  style={textBoldStyle} value = {this.state.FirstName}
                          onChangeText={FirstName => this.setState({ FirstName })} multiline={false}    />

                        <TextInput maxLength={14}
                          placeholder={"Last Name   "}   style={textBoldStyle} value = {this.state.LastName}
                          onChangeText={LastName => this.setState({ LastName })} multiline={false}    />

                        </View>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Email Address: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} value = {this.state.EmailAddress} editable = {false}
                                     placeholder={"sample@gmail.com"} onChangeText={ EmailAddress => this.setState({ EmailAddress })}/>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Phone Number: </Text>
                              <Input placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} keyboardType={'phone-pad'} value = {this.state.PhoneNumber} maxLength={14}
                                     placeholder={"(541) 000 0000"} onChangeText={ PhoneNumber => this.onTextChange( PhoneNumber )}/>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Address 1: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.Address1}
                                     placeholder={"type here"} onChangeText={ Address1 => this.setState({ Address1 })}/>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Address 2: </Text>
                              <Input placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.Address2}
                                     placeholder={"type here"} onChangeText={ Address2 => this.setState({ Address2 })}/>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Country: </Text>
                              <Picker selectedValue={this.state.Country}
                                      mode="dropdown" itemStyle={{ textAlign:'center',justifyContent:'center',fontFamily:'Gotham Bold'}}
                                      style={{ alignItems:'center',  alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11, alignSelf:'flex-start' }}
                                      onValueChange={(itemValue, itemIndex) => this.changeStates(itemValue) }>
                                      {Countries.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> State: </Text>
                              <Picker selectedValue={this.state.State}
                                      mode="dropdown" itemStyle={{ textAlign:'center',justifyContent:'center'}}
                                      style={{
                                      alignItems:'center',   alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11 , alignSelf:'flex-start'}}
                                      onValueChange={(itemValue, itemIndex) => this.changeCity(itemValue) }>
                                      {this.state.selStates.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> City: </Text>
                              <Picker selectedValue={this.state.City}
                                      mode="dropdown" itemStyle={{textAlign:'center',justifyContent:'center'}}
                                      style={{ alignItems:'center',   alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11, alignSelf:'flex-start' }}
                                      onValueChange={(itemValue, itemIndex) => this.setState({City:itemValue}) }>
                                      {this.state.selCities.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>


                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Zip Code: </Text>
                              <Input placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} keyboardType={'number-pad'} value = {this.state.ZipCode} maxLength={6}
                                     placeholder={"type here"} onChangeText={ ZipCode => this.setState({ ZipCode })}/>
                        </View>

                        <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                  marginTop:10,marginBottom:20 }} onPress={()=> this.validateProfileFields()}>
                            <Image style = {{width: 250,   height: 48} } source = { save_button }  />
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
              </ScrollView>

           </ImageBackground>
         </View>
          {this.ShowActivityIndicator()}
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
     );
   }

   onTextChange(text) {
      var cleaned = ('' + text).replace(/\D/g, '')
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
      if (match) {
          var intlCode = (match[1] ? '+1 ' : ''),
              number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');

          this.setState({   PhoneNumber: number   });
          return;
      }

      this.setState({ PhoneNumber: text });
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
      commonData.setUserData(JSON.stringify(Repsonse.Body));
     //  Alert.alert(''+Repsonse.Body.Address1);
     const timeoutId = BackgroundTimer.setTimeout(() => {
       this.props.navigation.state.params.onGoBack();
       this.props.navigation.pop();
     }, 2150);
       // this.props.navigation.state.params.onGoBack();
       // this.props.navigation.pop();
   }

   validateProfileFields(){
     Keyboard.dismiss();

     if (this.state.FirstName === "" || this.state.FirstName.length < 3) {
       Alert.alert('', "Please enter a valid first name");
     }
     else if (this.state.LastName === "" || this.state.LastName.length < 3) {
       Alert.alert( '',"Please enter a valid last name");
     }
     else if (reg.test(this.state.EmailAddress.trim()) === false) {
       Alert.alert('', "Please enter a valid email address");
     }
     else if (this.state.PhoneNumber === "" || this.state.PhoneNumber.length < 5) {
       Alert.alert('', "Please enter a valid phone number");
     }
     else if (this.state.Address1 === "" || this.state.Address1.length < 7) {
       Alert.alert('', "Please enter a valid address 1");
     }
     else if (this.state.Address2 === "" || this.state.Address2.length < 7) {
       Alert.alert('', "Please enter a valid address 2");
     }
     else if (this.state.Country === "select country" ) {
       Alert.alert('', "Please select country");
     }
     else if (this.state.State === "select state" ) {
       Alert.alert('', "Please select state");
     }
     else if (this.state.City === "select city") {
       Alert.alert('', "Please select city");
     }
     else if (this.state.ZipCode === "" || this.state.ZipCode.length < 5) {
       Alert.alert('', "Please enter a valid zipcode");
     }
     // else if (this.state.ProfilePic === "") {
     //   Alert.alert('', "Please select profile picture");
     // }
     else
     {
      // this.props.navigation.navigate('App')
      // Email:this.state.EmailAddress,
         this.setState({ loading: true, alertMessage: "Updating...", error: "", url :  URL_UPDATE_PROFILE, isValidated:true,
         MyObject : {
           UserId:commonData.getUserData().UserId,
           FirstName:this.state.FirstName,
           LastName:this.state.LastName,
           Email:this.state.EmailAddress,
           UserType:commonData.getUserData().UserType,
           PhoneNumber:this.state.PhoneNumber,
           Address1:this.state.Address1,
           Address2:this.state.Address2,
           City:this.state.City,
           State:this.state.State,
           Country:this.state.Country,
           Zipcode:this.state.ZipCode }
         });
     }
   }

   // when state is selected
   changeCity (val) {
     this.setState({State:val,City:'select city'});
     if(val != 'select state'){
       let statess = [];
       let value;
       let tempStates = CountiresJson.filter(t => t.name.includes(this.state.Country))[0].states[0];
       for (var key in tempStates ) {
          if(key === val){
            value = ''+tempStates[key];
            break;
          }
       }
       let tempCities= value.split(',');
       this.setState({selCities:tempCities});
     }
   }

   // when country is selected
   changeStates(val){
     if(this.state.Country !== val){
       if(val != 'select country'){
         let statess = [];
         let tempStates = CountiresJson.filter(t => t.name.includes(val))[0].states[0];
         for (var key in tempStates) {
           if (tempStates.hasOwnProperty(key)) {
               statess.push(''+key);
           }
         }
         this.setState({selStates:statess,Country:val,State:statess[0]});
       }
     }
   }


  componentWillUnmount(){

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
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
    paddingLeft:15
  },
  viewLineStyle:{
    justifyContent:'center',width:width-width/5+15,height:2,backgroundColor:'#C7C7C7',marginTop:5,marginBottom:5
  },
  textViewStyle:{
    width:135,alignSelf:'center', height:30,marginLeft:5,marginRight:5,marginTop:13,fontFamily:'Gotham Medium',fontSize:13
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
  textBigStyle:{
    fontSize:23,
    color: '#393939',
    marginTop:-10,
    fontFamily: 'Gotham Book',
  },
  textBoldStyle:{
    fontSize:21, fontFamily: 'Gotham Bold',   color: '#535353',marginLeft:10,marginRight:10,marginBottom:15, alignSelf:'center',textAlign:'center'
  },
  textNormalStyle:{
    fontSize:15,
    color: '#393939',
    textAlign: 'center',
    marginBottom:20,
    fontStyle:'italic',
    fontFamily: 'Gotham Book',
  },
  inputStyle:{
    flexDirection:'row',
    height:60,
    marginRight:5,
    marginLeft:5,
    marginTop:8,
    paddingLeft:10,
    marginBottom:2,
    backgroundColor:'#0000000000',
    borderRadius:0,

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
  },
  ImageStyleContainer:{
   resizeMode: 'contain',
   justifyContent: 'center',
   borderColor:'#ffffff',
   borderWidth:2,
   overflow: 'hidden',
   borderRadius: 65,
   width: 100,
   height: 100,
   marginTop:-50,
   padding:1
 }
}

export default EditProfile ;
