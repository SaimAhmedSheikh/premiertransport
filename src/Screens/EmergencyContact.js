import React , {Component} from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image , TextInput, ScrollView , Alert } from 'react-native';
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header , Input } from '../Components';
import colors from '../Components/colors';
import { Dialog } from 'react-native-simple-dialogs';
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');
const abort_job_icon = require('../images/abort_job_icon.png');
const emergency_contact_icon =  require('../images/emergency_contact_icon.png');
const send_button =  require('../images/send_button.png');

import * as MyConstants from '../Components/Constants';
// let URL_CANCEL_TRIP  =  MyConstants.BASE_URL + "Trip/CancelTrip";
let URL_CANCEL_TRIP  =  MyConstants.BASE_URL_CANCEL_TRIP;
//  http://localhost:49170/Password/CancelTrip

import axios from "axios";
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
let  params ;

class EmergencyContact extends Component{

  constructor(props){
    super(props);
    this.state = {
      dialogVisible : false,
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      reason: "" }
  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();
     params = this.props.navigation.state;
  }

  render(){
    let displayID = commonData.getCurrentRideData().DisplayId;
    return(
      <View style={{flex:2 }}>
          <Header onBackPress={()=>this.props.navigation.pop()} headerText = {'Emergency Contact'} headerColor={colors.HeaderColor} showEmergencyContact={false} showSettings={false} showBack={true}/>
          <ScrollView style={{ width:width, height:height  }} keyboardShouldPersistTaps='handled'>
           <ImageBackground style={{  width:width, height:height, justifyContent: 'flex-start'}} source = {login_bg}>

            <View style={styles.backCorner}>
              <View style={{padding:20,marginTop:10}}>
               <Image source={emergency_contact_icon} style={{width:110,height:110 ,alignSelf:'center',marginTop:-90}} />
               <Text style={{marginTop:10,color:'#000000',fontSize:17,fontFamily:'Gotham Medium'}}> JOB ID </Text>
               <View style={[styles.viewParentStyle,{height:40}]}>
                 <TextInput
                   editable = {false}
                   placeholder={displayID}
                   placeholderTextColor={'#C5C5C5'}
                   autoCorrect={false}
                   style={{color:'#C5C5C5',flex:1,backgroundColor:'#8A8A8A',paddingLeft:10,fontFamily:'Gotham Book'}}   />
               </View>

               <Text style={{marginTop:10,color:'#000000',fontSize:17,fontFamily:'Gotham Medium'}}> REASON FOR </Text>
                <Text style={{marginTop:-3, color:'#000000',fontSize:17,fontFamily:'Gotham Book' }}> ABORTING JOB </Text>
               <View style={[{marginRight:5, marginLeft:5, backgroundColor:'#8A8A8A',flexDirection:'row',
                              height:150,resizeMode: 'contain',alignItems:'flex-start'}]}>
                 <TextInput
                   editable = {true} onChangeText={ reason => this.setState({ reason })}
                   placeholder={'type message here'}
                   placeholderTextColor={'#C5C5C5'}
                   autoCorrect={false} multiline ={true}
                   style={{ color:'#C5C5C5',flex:1,textAlign:'left',
                   backgroundColor:'#8A8A8A',paddingLeft:10, fontFamily:'Gotham Book'}}   />
               </View>
               <TouchableOpacity style={{marginTop:10}} onPress = {()=> this.validate()}>
                 <Image source = {send_button} style={{alignSelf:'center',height:50,width:width-80  ,marginTop:10,resizeMode:'contain'}}/>
               </TouchableOpacity>
              </View>
            </View>

          </ImageBackground>
            </ScrollView>
          { this.ShowConfirmDialog() }
          { this.state.loading && <WebService
            navigation={this.props.navigation}
             dialogVisible = {true}
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

  validate(){
    if(this.state.reason.length < 6 ){
      Alert.alert('', "Please enter a reason");
    }
    else
    {
      this.setState({dialogVisible:!this.state.dialogVisible})
    }
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
    //  Alert.alert(''+JSON.stringify(Repsonse.Body));
      // commonData.setTodayRidesData(JSON.stringify(Repsonse.Body));
      // commonData.setTempData(undefined);

      BackgroundTimer.setTimeout(() => {
              this.setState({loading : false , dialogVisible: !this.state.dialogVisible});
              commonData.setCurrentRideData(0);
              const { params} = this.props.navigation.state;

              this.props.navigation.pop();
                params.onPreviousScreen();
              //params.backtodash();
            //  this.props.navigation.navigate('App');

        }, 2300);

      //this.props.navigation.pop()
    }
 }

 Submit(){
    //Alert.alert(''+this.state.selectedDate);
      let RideId = 0 ;
      for(let i = 0 ; i < commonData.getCurrentRideData().Rides.length ; i++){
           if(commonData.getCurrentRideData().Rides[i].IsVisible &&
              commonData.getCurrentRideData().Rides[i].AssignTo === commonData.getUserData().UserId){
              RideId = commonData.getCurrentRideData().Rides[i].RideId;
           }
      }

      this.setState({ loading: true, alertMessage: "Submitting...", error: "", url :  URL_CANCEL_TRIP,
       MyObject : {
       	TripId:commonData.getCurrentRideData().TripId,
       	TripDisplayId:commonData.getCurrentRideData().DisplayId,
       	UserId:commonData.getUserData().UserId,
       	Reason:this.state.reason,
        RideId:RideId
       }
     });
  }

  componentDidMount(){

  }

  ShowConfirmDialog()
  {
    const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textStyle , buttonStyle} = styles;

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

                   <Image source ={abort_job_icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                   <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                   <Text style={textBoldStyle}> ABORT JOB </Text>
                   <Text style={textBigStyle}> NOTIFICATION </Text>
                   <Text style={{marginTop:5,marginBottom:10}}>  </Text>
                   <Text style={textNormalStyle}> Do you want to abort your job? </Text>

                   <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                       <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center', marginTop:60,marginBottom:20 }}
                                         onPress={()=> this.setState({dialogVisible: !this.state.dialogVisible})}>
                           <Image style = {{width: 150,   height: 48} } source={no}  />
                       </TouchableOpacity>

                       <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                 marginTop:60,marginBottom:20 }} onPress={()=> this.Submit()  }>
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
    height:450,
    width:width-30,
    flexDirection:'column',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop:80
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:15,
    height:1,
    width:width-90,
    backgroundColor:'#C7C7C7',
  },
  textBoldStyle:{
    fontSize:26, fontFamily:'Gotham Bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-5,fontFamily:'Gotham Book'
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic',fontFamily:'Gotham Book'
  },
  viewParentStyle:{
    marginRight:5,
    marginLeft:5,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#00000000',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#8A8A8A',
    textAlign:'justify'
  },
});

export default EmergencyContact ;
