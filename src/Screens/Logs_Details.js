import React , {Component} from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions , TouchableOpacity , Image , Alert , FlatList} from 'react-native';
const login_bg =  require('../images/bg2.png');
var {width, height} = Dimensions.get('window');
import { Header } from '../Components';
import colors from '../Components/colors';
import { Dialog } from 'react-native-simple-dialogs';
const ok_button =  require('../images/ok_button2.png');
const daily_log_icon =  require('../images/daily_log_icon.png');
import View_daily_log_item from '../Components/View_daily_log_item';
const DailyLog = 'DAILY LOG';
const MonthlyLog = 'MONTHLY LOG';
const WeeklyLog = 'WEEKLY LOG';
//import Logs_detailed from '../Data/Logs_detailed.json'
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
let Logs_detailedTemp = new Array();
let Logs_detailed = new Array();

class Logs_Details extends Component{

  constructor(props){
    super(props);
    this.state = {   }
    this.onDayPress = this.onDayPress.bind(this);
  }

  componentWillMount(){
  commonData = CommonDataManager.getInstance();
  //  Alert.alert(''+this.props.navigation.getParam('Data').DateWeekMonth);
  let Logs_detailedTemp = this.props.navigation.getParam('Data').CompletedTrips;
  Logs_detailed = Logs_detailedTemp;
    // for(let i = 0 ; i < Logs_detailedTemp.length ; i++){
    //  Logs_detailed[i].Rides = new Array();
    //   for(let j = 0; j < Logs_detailedTemp[i].Rides.length ; j++){
    //     let isAssignedToUser = (Logs_detailedTemp[i].Rides[j].AssignTo === commonData.getUserData().UserId);
    //     console.log('isAssignedToUser '+ isAssignedToUser);
    //     if(isAssignedToUser){
    //        Logs_detailed[i].Rides.push(Logs_detailedTemp[i].Rides[j]);
    //     //  console.log(" Logs_detailedTemp Rides "+JSON.stringify(Logs_detailedTemp[i].Rides[j]));
    //     }
    //   }
    // }
  }

  onDayPress(day) {
  //  Alert.alert(day.dateString);
    this.setState({   selected: day.dateString });
  }

  render(){
    var basicAmount ;
    var overTimeAmount ;
    var doubleOverTimeAmount ;
    //let Logs_detailed = this.props.navigation.getParam('Data').CompletedTrips;

    // if(this.props.navigation.getParam('heading') == DailyLog)   // { basicAmount = '$120';  overTimeAmount = '$30';  doubleOverTimeAmount = '$100' ; }
    // else if(this.props.navigation.getParam('heading') == WeeklyLog){ basicAmount = '$250'; overTimeAmount = '$100'; doubleOverTimeAmount = '$200' ; // }
    // else if(this.props.navigation.getParam('heading') == MonthlyLog){ basicAmount = '$550'; overTimeAmount = '$750';  doubleOverTimeAmount = '$950' ; // }
    //let TotalDollars = Math.round(this.props.navigation.getParam('Data').Basic * 100) / 100;

    basicAmount = "$"+Math.round(this.props.navigation.getParam('Data').Basic * 100) / 100;//this.props.navigation.getParam('Data').Basic;
    overTimeAmount = "$"+Math.round(this.props.navigation.getParam('Data').Overtime * 100) / 100;//this.props.navigation.getParam('Data').Overtime;
    doubleOverTimeAmount = "$"+Math.round(this.props.navigation.getParam('Data').DoubleOver * 100) / 100;//this.props.navigation.getParam('Data').DoubleOver ;

    // const seldataa = '2019-05-21';
    // //var seldata =  this.state.year +'-'+ this.state.month +'-'+ this.state.day;   // Object.freeze(seldata);
    // const mardate = {  '2019-05-11'  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10} }   // Object.freeze(mardate);
    // var selmonth = ''+this.state.year +'-'+ this.state.month +'-01';   // var person={  '2019-05-11'  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10} }
    // var newPerson={...person,  seldataa  : { selected: true, marked: true, selectedColor: '#B18445' , padding:10}}   // Object.freeze(newPerson);

    return(
      <View style={{flex:2 }}>
          <Header onBackPress={()=>this.props.navigation.pop()} headerText = {'My Logs'} headerColor={colors.HeaderColor}
              showSettings={false} showBack={true} showEmergencyContact = {false}/>
           <ImageBackground style={{  width:width, height:height, backgroundColor:'#ffffff'}}  >

              <View style={{justifyContent:'center',alignItems:'center'}}>
                <View style={{margin:15,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                  <Image style={{width:width/100*25,height:width/100*25, resizeMode:'center'}} source={daily_log_icon}/>
                  <Text style={{fontSize:26, fontFamily:'Gotham Bold',color:'#000000'}}> {this.props.navigation.getParam('heading')} </Text>
                  <Text style={{fontFamily:'Gotham Book',marginTop:-7,fontSize:25, color:'#000000'}}> DETAIL </Text>
                  <Text style={{marginTop:-2,fontFamily:'Gotham Bold',fontSize:15, color:'#C29D5B'}}> {this.props.navigation.getParam('Data').Date} </Text>
                </View>
              </View>

              <View style={{justifyContent:'space-around',alignItems:'center',flexDirection:'row'}}>
                <View style={{margin:10,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{ fontSize:19, fontFamily:'Gotham Bold',color:'#303030'}}> Basic </Text>
                  <Text style={{marginTop:4, fontFamily:'Gotham Medium', fontSize:15, color:'#949293'}}> {basicAmount} </Text>
                </View>

                <View style={{height:70,width:1,backgroundColor:'#949293',alignSelf:'center',marginTop:10}}/>

                <View style={{margin:10,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{ fontSize:19, fontFamily:'Gotham Bold',color:'#303030'}}> Overtime </Text>
                  <Text style={{  marginTop:4,fontFamily:'Gotham Medium',fontSize:15, color:'#949293'}}> {overTimeAmount} </Text>
                </View>

                <View style={{height:70,width:1,backgroundColor:'#949293',alignSelf:'center',marginTop:10}}/>

                <View style={{margin:10,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{ fontSize:19, fontFamily:'Gotham Bold',color:'#303030'}}> Double Overtime </Text>
                  <Text style={{ marginTop:4,fontFamily:'Gotham Medium',fontSize:15, color:'#949293'}}> {doubleOverTimeAmount} </Text>
                </View>

              </View>
              <View style={{ width: width/100*90, height:height/100*32,backgroundColor:'#ffffff', borderRadius : 20,
                             borderStyle: 'dashed', borderWidth: 3, borderColor: '#949293', alignSelf:'center',
                             marginTop:10, padding:5}}>
                    <View style={styles.backCorner}>

                         <FlatList style = {{ flex:1 }}
                           data = { Logs_detailed }

                           renderItem={({item, index}) => this.renderItem(item, index)}
                           keyExtractor = { keyExtractor= Data => Logs_detailed.DisplayId }/>

                    </View>
              </View>
              <TouchableOpacity onPress = {()=> this.props.navigation.pop()} style={{alignSelf:'center'}}>
                <Image style={{width:width/100*70,height:70 , resizeMode:'center'}} source={ok_button}/>
              </TouchableOpacity>

          </ImageBackground>
      </View>
    )
  }

  renderItem(Data,index){
      return <View_daily_log_item Data={Data} position={index} />;
  }

  componentDidMount(){

  }
}

const styles = StyleSheet.create({
  backCorner: {
    backgroundColor: '#E7E7E7',
    flex:1,
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

export default Logs_Details ;
