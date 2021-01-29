import React , {Component} from 'react';
import { FlatList , View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image, Alert} from 'react-native';
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header } from '../Components';
import colors from '../Components/colors';
const right_arrow2 = require('../images/right_arrow2.png');
const logo3 = require('../images/logo3.png');
import View_notification_item from '../Components/View_notification_item';
import NotificationsData from '../Data/Notifications.json'
let URL_GET_ALL_NOTIFICATIONS  =  MyConstants.BASE_URL + "User/GetAllNotifications";

import * as MyConstants from '../Components/Constants';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;


class Notifications extends Component{

  constructor(props){
    super(props);
    this.state = {
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      isValidated:true
    }
  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();
    commonData.setTempData(undefined);
    commonData.setNotifications(JSON.stringify([]));
  }


  renderItem(Data){
      return <View_notification_item Data={Data.item} />;
  }

  render(){
    let notificationsData = commonData.getNotifications();
    return(
      <View style={{flex:2 }}>
          <Header   headerText = {'Notifications'} headerColor={colors.HeaderColor}
          showSettings={true} showBack={false} showEmergencyContact={false}   onPress={()=>this.props.navigation.navigate('Setting')} />
           <ImageBackground style={{  width:width, height:height }} source = {login_bg}>
            <View style={ styles.backCorner }>
              <View style={{ alignSelf:'center' , marginTop:30, marginBottom:90  }}>
                 <View style={{ flex:1}} >
                 { notificationsData == 0 &&
                   <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                       <Text style={{fontSize:18,color:'#000000'}}> No notifications found! </Text>
                       <TouchableOpacity style={{marginTop:10,  borderRadius: 10, backgroundColor: colors.blue }} onPress = {() => this.GetNotifications()}>
                         <Text style={{paddingLeft:20,paddingRight:20,paddingTop:7,paddingBottom:7,fontSize:18,color:'#000000'}}> Retry </Text>
                       </TouchableOpacity>
                   </View>
                 }
                 {notificationsData.length > 0 &&
                   <FlatList style = {{ flex:1 }} data = { notificationsData }
                     renderItem = { this.renderItem }
                     keyExtractor = { keyExtractor= Data => notificationsData.NotificationId } />
                 }
                 </View>
              </View>
              <Image source={logo3} style={{width:190,height:190 ,alignSelf:'center',marginTop:-100,marginBottom:-200  }} />
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
        commonData.setNotifications(JSON.stringify(Repsonse.Body));
      //  Alert.alert(''+commonData.getNotifications().length);
        commonData.setTempData(undefined);
        //Alert.alert(''+JSON.stringify(Repsonse.Body) + ' '+this.state.selectedDate);
    //     let data = [
    //     {
    //         "Message": "Your trip has been cancelled",
    //         "Date": "07/31/2019",
    //     },
    //     {
    //       "Message": "Your trip has been cancelled",
    //       "Date": "07/31/2019",
    //     },
    //     {
    //       "Message": "Your trip has been cancelled",
    //       "Date": "07/31/2019",
    //     },
    //     {
    //       "Message": "Your trip has been cancelled",
    //       "Date": "07/31/2019",
    //     }
    // ];
    //    commonData.setNotifications(JSON.stringify(data));
        this.setState({loading : false, MyObject:""});
     }
   }
 }

 GetNotifications(){
   const timeoutId = BackgroundTimer.setTimeout(() => {
     this.setState({ loading: true, alertMessage: "Getting Notifications...", error: "", url :  URL_GET_ALL_NOTIFICATIONS,
      MyObject : { UserId: commonData.getUserData().UserId } });
   }, 200);

 }

  componentDidMount(){
    this.GetNotifications();
  }
}

const styles = StyleSheet.create({
  backCorner: {
    backgroundColor: '#E7E7E7',
    marginLeft:10,
    marginRight:10,
    marginTop:20,
    marginBottom:10,
    height:height-height/2 + 90,
    width:width-30,
    alignSelf:'center',
    flexDirection:'column',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
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
    fontSize:26, fontWeight: 'bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-10
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic',
  },
});

export default Notifications ;
