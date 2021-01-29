
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, Image,Alert} from 'react-native';
const bullet1 =  require('../images/bullet1.png');
const bullet2 =  require('../images/bullet2.png');
const size = 12;
class VerticalLine extends Component {
  render() {
  //  Alert.alert(''+this.props.Waypoint);
      return(
        <View style={{marginLeft:7,marginTop:7,alignItems:'center',flexDirection:'column', flex:0.1}}>
          <View style={{marginTop:10,justifyContent:'flex-start'}}>
            <Image source = {bullet1} style={{margin:1,width:size,height:size,resizeMode:'contain'}} />
          </View>

            <View style={{margin:2,justifyContent:'center',height:66,width:2,backgroundColor:'#C7C7C7'}}/>

          <View style={{justifyContent:'flex-end'}}>
              <Image source = {this.props.Waypoint ? bullet1 : bullet2} style={{margin:1,width:size,height:size,resizeMode:'contain'}} />
          </View>

          {(this.props.Waypoint != false) &&
            <View>
              <View style={{marginLeft:5,margin:2,justifyContent:'center',height:50,width:2,backgroundColor:'#C7C7C7'}}/>

              <View style={{justifyContent:'flex-end'}}>
                  <Image source = {bullet2} style={{margin:1,width:size,height:size,resizeMode:'contain'}} />
              </View>
            </View>
          }
        </View>
      )
    }
 }

 export { VerticalLine }
