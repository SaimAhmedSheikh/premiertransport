
import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Dimensions, Alert,TouchableOpacity, Animated} from 'react-native';
var {height, width} = Dimensions.get('window');
import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip, Button } from '../Components';

const bullet_icon =  require('../images/bullet.png');
var navigate ;
class View_logs_item extends Component {

  constructor(props){
    super(props);
    this.state = { detail: 0 }

  }
  // "DateWeekMonth": "12/05/19",
  // "Hours": "5 Hrs",
  // "Trips": "3",
  // "Total": "$230.55"

  // componentWillMount(){
  //   navigate =  this.props.onPress ;
  // }

  // navv (){
  //    this.props.onPress();
  // }

  render() {
    let TotalHours = ''+Math.round(this.props.Data.Hours * 100) / 100+' Hrs ' ;
    let TotalDollars = '$'+Math.round(this.props.Data.Total * 100) / 100;

    if(TotalHours.includes('.')){
      var splits = TotalHours.split('.');
      var p_mins = Math.round(splits[1] * 100) / 100;
    //Alert.alert(TotalHours+' '+splits[0]+' '+splits[1]+' '+p_mins);
      TotalHours = splits[0] + ' Hrs ' ;//+ ' Hrs ' + ((p_mins/100) * 60) +' Mins';
    //  Alert.alert(''+splits[0]);
    }
    return (
      <View style={styles.container}>
        <View style={{flex:1,width:width-50}} >
          <TouchableOpacity style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}
           onPress={()=>this.props.onPress()}>
              <View style={{justifyContent:'flex-start',width:width/4 - 5,flexDirection:'row',alignItems:'center',marginLeft:-5}}>
                <Image source={bullet_icon} style={{marginRight:3,width:10,height:10}}/>
                <Text style={{fontFamily:'Gotham Book',fontSize : 12 , color:'#6E6E6E'}}> {this.props.Data.Date} </Text>
              </View>
              <Text style={{fontFamily:'Gotham Book',textAlign:'center',width:width/4 - 12.5,fontSize : 12 , color:'#6E6E6E'}}> {TotalHours} </Text>
              <Text style={{fontFamily:'Gotham Book',marginLeft:-2.5,textAlign:'center',width:width/4 - 12.5,fontSize : 12 , color:'#6E6E6E'}}> {this.props.Data.CompletedTrips.length} </Text>
              <Text style={{fontFamily:'Gotham Medium',marginLeft:-2.5,textAlign:'center',width:width/4 - 12.5, fontSize : 12 , color:'#6E6E6E'}}> {TotalDollars} </Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine}/>
        </View>
      </View>
    );
  }

  toggleView = ()=> {
    if(this.state.detail == 0){
      this.setState({detail:1});
    }
    else{
      this.setState({detail:0});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:5,
    marginLeft:10,
    marginRight:10,
    marginBottom:5,
    height:1,
    flex:1,
    backgroundColor:'#C7C7C7',
  }
});

export default View_logs_item ;
