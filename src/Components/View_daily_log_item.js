
import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Dimensions, Alert,TouchableOpacity, Animated} from 'react-native';
var {height, width} = Dimensions.get('window');
import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip, Button } from '../Components';

const bullet_icon =  require('../images/bullet.png');

class View_daily_log_item extends Component {

  constructor(props) {
    super(props);
    this.state = { detail: 0 ,counter : 1}
  }

  calculateTime(start,end){
    var seconds = (end  - start ) / 1000;
    return seconds;
  }

    displayTime(ticksInSecs) {
      var ticks = ticksInSecs;
      var hh = Math.floor(ticks / 3600);
      var mm = Math.floor((ticks % 3600) / 60);
      var ss = ticks % 60;

      var p_mm = this.pad(mm, 2);
      var p_hh = this.pad(hh, 2);

      let hoursFormat = (p_hh > 0) ? (p_hh   + " Hours ") : (p_hh   + " Hour ");
      return  formatDuration = p_mm != 0 ? (hoursFormat   + " " + p_mm +" Mins ") : hoursFormat ;
        //Alert.alert( pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2) );
    }

    pad(n, width) {
        var n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('') + n;
    }

    componentWillMount(){
      console.log(JSON.stringify(this.props.Data));
    }

  render() {
    let durationTicks = this.calculateTime(this.props.Data.StartTimeTicks,this.props.Data.EndTimeTicks);
    let displayDuration = this.displayTime(durationTicks);
    return (
      <View style={styles.container}>
        <View style={{marginTop:10,marginLeft:10,marginRight:10,flexDirection:'row',alignSelf:'flex-start'}}>
          <Text style={{fontSize:16,fontFamily:'Gotham Medium'}}> {'Trip '+ (this.props.position +1) } </Text>

        </View>
        <View style={{ marginTop:5,flexDirection:'row',paddingLeft:10,paddingRight:10}} >
            <View style={{marginTop:5,flexDirection:'row'}}>
              <View_PickUp_Drop State={1}   PickUp_time = {this.props.Data.Rides[0].PickupTime } WaypointTime = {false}  DetialType = {1}
                                            DropOff_time = {this.props.Data.Rides[this.props.Data.Rides.length-1].DropoffTime} />
            </View>
            <View style={{marginTop:13}}>
              <VerticalLine Waypoint = {false}/>
            </View>
            <View_Trip_Detail StartAddress = {this.props.Data.Rides[0].PickupAddress} WayPointAddress = {false}
                              EndAddress = {this.props.Data.Rides[this.props.Data.Rides.length-1].DropoffAddress} />
        </View>
      </View>
    );
  }
//          <Text style={{color:'#BD954E',alignSelf:'center',fontSize:14,fontFamily:'Gotham Medium'}}>  { '( '+displayDuration+')' } </Text>
  // <View_PickUp_Drop State={this.state.detail}
  //                   PickUp_time = {this.props.Data.PickUp_time}
  //                   DropOff_time = {this.props.Data.DropOff_time} />
  // <VerticalLine/>
  // <View_Trip_Detail StartAddress = {this.props.Data.StartAddress}
  //                   EndAddress = {this.props.Data.EndAddress} />

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
    padding:5,
    marginBottom:10,
    marginTop:10
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

export default View_daily_log_item ;
