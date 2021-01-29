import React , {Component} from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image , Alert} from 'react-native';
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header } from '../Components';
import colors from '../Components/colors';
import { Dialog } from 'react-native-simple-dialogs';
const ok_button =  require('../images/ok_button2.png');
const cancel_button =  require('../images/cancel_button2.png');
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CommonDataManager from '../Components/CommonDataManager';
import Utils from '../Components/Utils'
import MonthSelectorCalendar from 'react-native-month-selector';
let commonData;
import moment from 'moment';
class MyMonthCalendar extends Component {

  constructor(props){
    super(props);
    this.state = { month : moment(1556665200000) }
    this.onDayPress = this.onDayPress.bind(this);

  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();
  //  this.setState({month:1575158400000});
    // if(commonData.getSelRideDate() != 0 ){
    //     //commonData.setSelRideDate({selDate:dateType,showDate:myUtils.formattedDate(split[2],split[1],split[0])});
    //     //this.setState({ selectedMonth: commonData.getSelRideDate().calDate  });
    //     // Alert.alert(''+commonData.getSelRideDate().Timestamp);
    // }
    // else{
    //   //  Alert.alert(''+commonData.getSelRideDate().calDate);
    // }
  }

  onDayPress(day) {
  //  let split = day.dateString.split('-');
    // Alert.alert(split[1]+'/'+split[2]+'/'+split[0]);
    //Alert.alert(''+day);
    this.setState({ month: day })
    this.getMonthDateRange(day.format('YYYY'),day.format('MM'),day.format('MMM YYYY'));
  //  Alert.alert(''+day.timestamp);
    // let dateType = split[1]+'/'+split[2]+'/'+split[0] ;

    // commonData.setSelRideDate({Timestamp:day.timestamp,selDate:dateType,showDate:myUtils.formattedDate(split[2],split[1],split[0]) , calDate : day.dateString});
    // this.setState({ selected: day.dateString });
  }

   getMonthDateRange(year, month, formattedDate) {


    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);
    let myUtils = new Utils();

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');
    var endDateStart = moment(endDate).startOf('day');
    // just for demonstration:
    // console.log(startDate.toDate());
    // console.log(endDate.toDate());

    // make sure to call toDate() for plain JavaScript date type
    commonData.setSelRideDate({StartMonthTicks:startDate,EndMonthTicks:endDate,selDate:formattedDate,showDate:formattedDate });
//    return { start: startDate, end: endDateStart };
  }

  onScreenClosed(){
    const { params } = this.props.navigation.state;
    params.dateChanged();
    this.props.navigation.pop();
  }

  render(){
    // const seldataa = '2019-05-21';
    // //var seldata =  this.state.year +'-'+ this.state.month +'-'+ this.state.day;
    // Object.freeze(seldata);
    // const mardate = {  '2019-05-11'  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10} }
    // Object.freeze(mardate);
    // var selmonth = ''+this.state.year +'-'+ this.state.month +'-01';
    // var person={  '2019-05-11'  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10} }
    // var newPerson={...person,  seldataa  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10}}
    //   Object.freeze(newPerson);
    //const { params } = this.props.navigation.state;

    // let minDate = params.minDate.split('-');
    //
    // let simplifiedMinDate = params.minDate[0] - params.minDate[0] - params.minDate[0];
    return(
      <View style={{flex:2 }}>
          <Header onBackPress={()=>this.props.navigation.pop()} headerText = {'Scheduled Ride'}
                  headerColor={colors.HeaderColor} showSettings={false} showBack={true} showEmergencyContact={false}/>

           <ImageBackground style={{  width:width, height:height, backgroundColor:'#ffffff'}}  >
             <MonthSelectorCalendar   selectedDate={this.state.month}  onMonthTapped={(date) => this.onDayPress(date)}  />

              <View style={{justifyContent:'center',alignItems:'center'}}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity onPress = {()=> this.props.navigation.pop()} >
                    <Image style={{width:width/100*70,height:70 , resizeMode:'center'}} source={cancel_button}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = {()=> this.onScreenClosed()} >
                    <Image style={{width:width/100*70,height:70 , resizeMode:'center'}} source={ok_button}/>
                  </TouchableOpacity>
                </View>
              </View>
          </ImageBackground>
      </View>
    )
  }

  componentDidMount(){

  }
}

const styles = StyleSheet.create({
  backCorner: {
    backgroundColor: '#E7E7E7',
    margin:10,
    height:320,
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
    fontSize:26, fontWeight: 'bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-10
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic',
  },
});

export default MyMonthCalendar ;
