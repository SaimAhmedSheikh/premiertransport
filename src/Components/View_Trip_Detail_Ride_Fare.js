
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions,TouchableOpacity,Image} from 'react-native';
var {height, width} = Dimensions.get('window');
const CrossIcon =  require('../images/cross_icon.png');

class View_Trip_Detail_Ride_Fare extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{flexDirection:'row'}}>

        <View style={{flexDirection:'column',marginTop:10,marginLeft:10,padding:5}}>
          <Text style={{fontFamily:'Gotham Bold',fontSize:14}}>Ride Duration</Text>
          <Text style={{fontFamily:'Gotham Medium',fontSize:13}}>{this.props.Duration}</Text>
        </View>

        <View style={{marginLeft:10,marginRight:10,marginTop:17,justifyContent:'center',width:3,height:40,backgroundColor:'#C7C7C7'}}/>

        <TouchableOpacity style={{flexDirection:'column',marginTop:10,marginLeft:10,padding:10,alignSelf:'center'}} onPress={()=>this.props.onCancelRideDialog()}>
          <Text style={{fontFamily:'Gotham Bold',fontSize:16,color:'#800000',textDecorationLine: 'underline',alignSelf:'flex-end'}}>REJECT RIDE</Text>
        </TouchableOpacity>

        <View style={{flex:1}}/>
        { this.props.State == 1 &&
        <TouchableOpacity style={{marginRight:18,marginTop:10,width:40,height:40,justifyContent:'center',flex:1}} onPress={()=>this.props.onPress()}>

          <Image source ={CrossIcon} style={{alignSelf:'center', width:30,height:30,resizeMode:'contain' }}  />

        </TouchableOpacity>
        }
      </View>
    );
  }
}
// for ride fare option
// <View style={{flexDirection:'column',marginTop:10,marginLeft:10,padding:5}}>
//   <Text style={{fontFamily:'Gotham Bold',fontSize:14}}>Ride Fare</Text>
//   <Text style={{fontFamily:'Gotham Medium',fontSize:13}}>${this.props.Fare}</Text>
// </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textStyleBold: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    width:90,
    color: '#8A8A8A',
    fontWeight:'bold',
    fontSize:16
  },
  textStyle: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    color: '#8A8A8A',
    fontSize:16
  },
  backCorner: {
    backgroundColor: '#E7E7E780',
    padding:10,
    margin:10,
    width:width-30,
    flexDirection:'column',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:30,
    height:1,
    flex:1,
    backgroundColor:'#C7C7C7'
  },

});


export { View_Trip_Detail_Ride_Fare }
