import React , {Component} from 'react';
import { FlatList , View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image, Alert} from 'react-native';
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header , View_CheckIO_BreakIO , Searchbar2 } from '../Components';
import colors from '../Components/colors';
const right_arrow2 = require('../images/right_arrow2.png');
const dtime_bg = require('../images/dtime_bg.png');
const wtime_bg = require('../images/wtime_bg.png');
const mtime_bg = require('../images/mtime_bg.png');
const logo3 = require('../images/logo3.png');
const go_button = require('../images/go_button1.png');

import View_notification_item from '../Components/View_notification_item';
import View_logs_item from '../Components/View_logs_item';
import LogsLists_Days from '../Data/LogsLists_Days.json'
import LogsLists_Weeks from '../Data/LogsLists_Weeks.json'
import LogsLists_Months from '../Data/LogsLists_Months.json'

const DailyLog = 'DAILY LOG';
const MonthlyLog = 'MONTHLY LOG';
const WeeklyLog = 'WEEKLY LOG';

const DailyTxt = "Daily";
const WeeklyTxt = "Weekly";
const MonthlyTxt = "Montly";

import NetworkConnectivity from '../Components/NetworkConnectivity'
import Utils from '../Components/Utils'

import * as MyConstants from '../Components/Constants';
let URL_GET_LOGS  =  MyConstants.BASE_URL + "Logs/GetLogs";

import axios from "axios";
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
let mUtils;

class MyLogs extends Component {

  constructor(props){
    super(props);
    this.state = { DialyTab : true , WeeklyTab : false , MonthlyTab : false, Heading:DailyLog ,
      selectedStartDate:"",
      selectedStartDateTimeStamp : 0,
      selectedEndDate:"",
      selectedEndDateTimeStamp : 0,
      showStartDate:"select date",
      showEndDate:"select date",
      minDate:'2010-05-10',
      maxDate:'2200-05-30',
      isStartDate: false,
      dataUpdated: false,
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      mySelectedMonth:moment(new Date()),
      logData:[]}
  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();
    commonData.deleteTodayRidesData();
    myUtils = new Utils();
  }

  renderItem = (Data) => {
    return <View_logs_item Data={Data.item}
    onPress={()=> this.props.navigation.navigate('LogsDetails', { Data:Data.item , heading:this.state.Heading })} />;
  }

  _dateChanged(){
      console.log("his.state.MonthlyTab "+this.state.MonthlyTab);
    if(this.state.MonthlyTab){
      // if(this.state.selectedEndDate !== commonData.getSelRideDate().selDate){
      //   this.setState({selectedEndDateTimeStamp: commonData.getSelRideDate().Timestamp,
      //     selectedEndDate:commonData.getSelRideDate().selDate,showEndDate:commonData.getSelRideDate().showDate});
      // }
        console.log("StartMonthTicks "+commonData.getSelRideDate().StartMonthTicks);
        console.log("EndMonthTicks "+commonData.getSelRideDate().EndMonthTicks);
        console.log("showDate "+commonData.getSelRideDate().showDate);
    //  if(this.state.mySelectedMonth !== commonData.getSelRideDate().selDate){
        this.setState({selectedStartDateTimeStamp: commonData.getSelRideDate().StartMonthTicks,
                       selectedEndDateTimeStamp :  commonData.getSelRideDate().EndMonthTicks,
          mySelectedMonth:commonData.getSelRideDate().showDate});
    //  }
      return;
    }
    if(this.state.isStartDate){
      if(this.state.selectedStartDate !== commonData.getSelRideDate().selDate){
        this.setState({selectedStartDateTimeStamp: commonData.getSelRideDate().Timestamp,selectedStartDate:commonData.getSelRideDate().selDate,showStartDate:commonData.getSelRideDate().showDate});
      }
    }
    else{
      if(this.state.selectedEndDate !== commonData.getSelRideDate().selDate){
        this.setState({selectedEndDateTimeStamp: commonData.getSelRideDate().Timestamp,selectedEndDate:commonData.getSelRideDate().selDate,showEndDate:commonData.getSelRideDate().showDate});
      }
    }
  }

  selectStartDate(){
    this.setState({isStartDate:true});
    this.props.navigation.navigate('Calendar',{dateChanged :  this._dateChanged.bind(this),
      minDate : '2010-05-10' ,
      maxDate : this.state.selectedEndDate === "" ? '2200-05-30' : this.state.selectedEndDate });
  }

  selectEndDate(){
    this.setState({isStartDate:false});
    this.props.navigation.navigate('Calendar',{dateChanged :  this._dateChanged.bind(this),
      minDate : this.state.selectedStartDate === "" ? '2010-05-10' : this.state.selectedStartDate  ,
      maxDate : '2200-05-30' });
  }

  // openCalender(){
  //   this.props.navigation.navigate('Calendar',{dateChanged :  this._dateChanged.bind(this),
  //     minDate : this.state.selectedStartDate === "" ? '2010-05-10' : this.state.selectedStartDate  ,
  //     maxDate : this.state.selectedEndDate === "" ? '2200-05-30' : this.state.selectedEndDate });
  // }

  onTabPress(textBold){

    let FilterType = 0;
    let DailyActive = false;
    let MonthlyActive = false;
    let WeeklyActive = false;
    let selectedHeading = "";
    if(textBold === DailyTxt){ FilterType = 0; DailyActive = true ; MonthlyActive = false , WeeklyActive = false , selectedHeading = DailyLog}
    else if(textBold === WeeklyTxt){ FilterType = 1; DailyActive = false ; MonthlyActive = false , WeeklyActive = true, selectedHeading = WeeklyLog }
    else if(textBold === MonthlyTxt){ FilterType = 2; DailyActive = false ; MonthlyActive = true , WeeklyActive = false, selectedHeading = MonthlyLog }

    // From and to date are empty as first when tab is clicked no date range will be provided
    this.setState({ loading: true, alertMessage: "Getting logs...", error: "", url :  URL_GET_LOGS,
     MyObject : { UserId: commonData.getUserData().UserId , Fromdate : "" ,Todate : "" , Filter : FilterType } ,
     Heading:selectedHeading, DialyTab : DailyActive , WeeklyTab : WeeklyActive  , MonthlyTab : MonthlyActive });


  //   this.setState({ Heading:DailyLog, DialyTab : DailyActive , WeeklyTab : MonthlyActive , MonthlyTab : WeeklyActive})
  }

  render(){
    var header;
    var list;
    if(this.state.DialyTab){
      header = dtime_bg;
      list = LogsLists_Days;
    }else if(this.state.WeeklyTab){
      header = wtime_bg;
      list = LogsLists_Weeks;
    }else if(this.state.MonthlyTab){
      header = mtime_bg;
      list = LogsLists_Months;
    }

    return (
      <View style={{flex:2 , height:height - 55 }}>
          <Header headerText = {'My Logs'} headerColor={colors.HeaderColor} showSettings={true} showEmergencyContact={false}
                  showBack={false} onPress={()=>this.props.navigation.navigate('Setting')} />

           <ImageBackground style={{  width:width, height:height - 55 }} source = {login_bg}>

           <View style={{ width , height:58 , flexDirection:'row'}}>
            {this.tab(DailyTxt,'Logs',this.state.DialyTab ,() => this.onTabPress(DailyTxt))}
            {this.tab(WeeklyTxt,'Logs',this.state.WeeklyTab, () => this.onTabPress(WeeklyTxt))}
            {this.tab(MonthlyTxt,'Logs',this.state.MonthlyTab, () => this.onTabPress(MonthlyTxt))}
           </View>

           <View style={{justifyContent:'space-between' ,flex:1 , marginBottom: 55 }}>

           <View style = {{height:70,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>

          {!this.state.MonthlyTab &&
            <View style={{flexDirection:'column'}}>
             <Text style={{fontFamily:'Gotham Medium',color:'#c9c9c9'}}> FROM </Text>
               <TouchableOpacity onPress={()=> this.selectStartDate()}>
                 <Searchbar2 placeholderTextColor={'#A3A3A3'} color={'#A3A3A3'} placeholder={"select date"} value = {this.state.showStartDate} />
               </TouchableOpacity>
           </View>
         }
         {!this.state.MonthlyTab &&
            <View style={{flexDirection:'column'}}>
             <Text style={{fontFamily:'Gotham Medium',color:'#c9c9c9'}}> TO </Text>
               <TouchableOpacity onPress={()=> this.selectEndDate()}>
                 <Searchbar2 placeholderTextColor={'#A3A3A3'} color={'#A3A3A3'} placeholder={"select date"} value = {this.state.showEndDate}/>
               </TouchableOpacity>
           </View>
         }
         {this.state.MonthlyTab &&
           <View style={{flexDirection:'column'}}>
            <Text style={{fontFamily:'Gotham Medium',color:'#c9c9c9'}}> SELECT MONTH </Text>
              <TouchableOpacity onPress={()=> this.ShowMonthCalender()}>
                <Searchbar2 placeholderTextColor={'#A3A3A3'} color={'#A3A3A3'} placeholder={"select date"} value = {this.state.mySelectedMonth} />
              </TouchableOpacity>
          </View>
        }

           <View style={{flexDirection:'column'}}>
             <TouchableOpacity onPress={()=> this.GetLogs()}>

                <Text>   </Text>
                <Image source={go_button} style={{alignSelf:'center' , height:40,width:40,resizeMode:'contain'}}/>
              </TouchableOpacity>
             </View>
          </View>

            { commonData.getMyLogsData().length == 0 &&
              <View style={{ flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:18,color:'#ffffff'}}> No Logs Found </Text>
                  <TouchableOpacity style={{marginTop:10,  borderRadius: 10, backgroundColor: colors.blue }} onPress = {() => this.GetLogs()}>
                    <Text style={{paddingLeft:20,paddingRight:20,paddingTop:7,paddingBottom:7,fontSize:18,color:'#ffffff'}}> Retry </Text>
                  </TouchableOpacity>
              </View>
            }
            { commonData.getMyLogsData().length > 0 &&
            <View style={ styles.backCorner }>
              <Image source={header} style={{alignSelf:'center' ,marginTop:5,height:40,width:width-45,resizeMode:'contain'}}/>
              <View style={{ alignSelf:'center' , marginTop:10, marginBottom:30  }}>


                  <View style={{ height: height-height/2 - 110  }} >
                    <FlatList style = {{ flex:1 }} data = { commonData.getMyLogsData() }  renderItem = { this.renderItem } keyExtractor = { keyExtractor= Data => list.id } />
                  </View>

              </View>
            </View>
            }
            <View style={{ flex: 0.5, marginBottom: ( commonData.getMyLogsData().length == 0 ) ?  -70 : 50 , marginTop:10}}>
              <View_CheckIO_BreakIO onLogOutPress={()=>this.props.navigation.navigate('Login')}/>
            </View>
            </View>
          </ImageBackground>

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
             SuccessMsg = { false }
             MyObject = {this.state.MyObject }/> }
      </View>
    )
  }

  GetLogs(){
    let FilterType = 0;

    if(this.state.Heading === DailyLog){   FilterType = 0;   }
    else if(this.state.Heading === WeeklyLog){   FilterType = 1;   }
    else if(this.state.Heading === MonthlyLog){   FilterType = 2;   }
//Alert.alert(''+FilterType);
    if(this.state.Heading === MonthlyLog){
      console.log("StartMonthTicks "+commonData.getSelRideDate().StartMonthTicks);
      console.log("Fromdate "+this.state.selectedStartDateTimeStamp);
      console.log("Todate "+this.state.selectedEndDateTimeStamp);
      this.setState({ loading: true, alertMessage: "Getting logs...", error: "", url :  URL_GET_LOGS,
       MyObject : { UserId: commonData.getUserData().UserId ,
       Fromdate : this.state.selectedStartDateTimeStamp ,
       Todate : this.state.selectedEndDateTimeStamp , Filter : FilterType } });
    }
    else if(myUtils.compareDates(this.state.selectedStartDate,this.state.selectedEndDate)){
      this.setState({ loading: true, alertMessage: "Getting logs...", error: "", url :  URL_GET_LOGS,
       MyObject : { UserId: commonData.getUserData().UserId ,
       Fromdate : this.state.selectedStartDateTimeStamp ,
       Todate : this.state.selectedEndDateTimeStamp , Filter : FilterType } });
    }
    else{
      Alert.alert('','Please select a valid date range');
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
      //Alert.alert(''+JSON.stringify(Repsonse));
      if(Repsonse.Code = '200'){
        commonData.setMyLogsData(JSON.stringify(Repsonse.Body));
        commonData.setTempData(undefined);

        //Alert.alert(''+JSON.stringify(Repsonse.Body) );
        this.setState({loading : false, MyObject:"",logData:Repsonse.Body});
     }
   }
 }

  tab(textBold,text,isActive,OnPress){
    var line_color = isActive ? colors.gold : colors.HeaderColor;
    return(
      <View style={{width:width/3,height:58,justifyContent:'center',backgroundColor:colors.HeaderColor}}>
       <TouchableOpacity onPress = {OnPress}>
        <View style={{flexDirection:'column',justifyContent:'center',alignSelf:'center'}}>
          <Text style={{color:'#B3B3B3',alignSelf:'center',fontSize:17,fontFamily:'Gotham Medium'}}> {textBold} </Text>
          <Text style={{color:'#B3B3B3',marginTop:-4,alignSelf:'center',fontSize:17,fontFamily:'Gotham Book'}}> {text} </Text>
          <View style={{marginTop:5,width : width/3 -30 , height:2, alignSelf:'center', backgroundColor : line_color }} />
        </View>
        </TouchableOpacity >
      </View>
    )
  }



  componentDidMount(){
    this.setState({ loading: true, alertMessage: "Getting logs...", error: "", url :  URL_GET_LOGS,
     MyObject : { UserId: commonData.getUserData().UserId , Fromdate : "" ,Todate : "" , Filter : 0 } ,
     Heading:DailyLog, DialyTab : true , WeeklyTab : false  , MonthlyTab : false });
  }

  ShowMonthCalender(){
    this.props.navigation.navigate('MyMonthCalendar',{dateChanged :  this._dateChanged.bind(this),
      mySelectedMonth : this.state.mySelectedMonth  });
  }
}


const styles = StyleSheet.create({
  backCorner: {
    backgroundColor: '#E7E7E7',
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    height:height-height/2 -40  ,
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

export default MyLogs ;
