
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
var {height, width} = Dimensions.get('window');

class View_PickUp_Drop extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{ padding:5 }}>
        <View style={{ flexDirection:'column',flex:0.25 }}>
          <View style={{justifyContent:'flex-start'}}>
            <Text style={{fontFamily:'Gotham Medium',color:'#BEBEBE',fontSize:13}}>Pickup</Text>
            <Text style={{fontFamily:'Gotham Medium', fontSize:15}}>{this.props.PickUp_time}</Text>
          </View>

          {((this.props.DetialType == 1)  && (this.props.WaypointTime != false)) &&
            <View>
              <View style={{justifyContent:'center',height:this.props.State == 1 ? 53 : 45}}/>

              <View style={{justifyContent:'flex-end'}}>
                <Text style={{fontFamily:'Gotham Medium',color:'#BEBEBE',fontSize:13}}>Waypoint</Text>
                <Text style={{fontFamily:'Gotham Medium',fontSize:15}}>{this.props.WaypointTime}</Text>
              </View>

              <View style={{justifyContent:'center',height:this.props.State == 1 ?  38 : 35}}/>

              <View style={{justifyContent:'flex-end'}}>
                <Text style={{fontFamily:'Gotham Medium',color:'#BEBEBE',fontSize:13}}>Drop Off</Text>
                <Text style={{fontFamily:'Gotham Medium',fontSize:15}}>{this.props.DropOff_time}</Text>
              </View>
            </View>
         }
        {((this.props.DetialType == 0)  || (this.props.DetialType == 1)) && (this.props.WaypointTime == false) &&
            <View>
              <View style={{justifyContent:'center',height:this.props.State == 1 ? 53 : 45}}/>

              <View style={{justifyContent:'flex-end'}}>
                <Text style={{fontFamily:'Gotham Medium',color:'#BEBEBE',fontSize:13}}>Drop Off</Text>
                <Text style={{fontFamily:'Gotham Medium',fontSize:15}}>{this.props.DropOff_time}</Text>
              </View>
          </View>
        }

        </View>
      </View>
    );
  }
}


export { View_PickUp_Drop }
