
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions , Image} from 'react-native';
var {height, width} = Dimensions.get('window');
const date_bullet = require('../images/date_bullet.png');

class View_Trip_Detail_Strip extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (

        <View style={{  flexDirection:'row',flex:1, alignContent:'space-around'}}>
          <View style={{flexDirection:'column',marginLeft:20,marginTop:10,padding:10,flex:1}}>
            <Text style={{fontFamily:'Gotham Medium',fontSize:14}}>Trip ID</Text>
            <Text style={{fontFamily:'Gotham Book',fontSize:14}}>{this.props.TripID}</Text>
          </View>

          <View style={{  flexDirection:'column',flex:1}}></View>

          <View style={{flexDirection:'column',marginTop:10,padding:10,flex:1}}>
            <Text style={{fontFamily:'Gotham Medium',fontSize:14}}>Date</Text>
            <Text style={{fontFamily:'Gotham Book',fontSize:14}}>{this.props.Date}</Text>
          </View>
        </View>

    );
  }
}

// <Image source={date_bullet} style ={styles.horizontalLine2}/>
//
// <View style={{flexDirection:'column',marginTop:10,padding:10}}>
//   <Text style={{fontFamily:'Gotham Medium',fontSize:14}}>Trip Type</Text>
//   <Text style={{fontFamily:'Gotham Book',fontSize:14}}>{this.props.TripType}</Text>
// </View>
          // <Image source={date_bullet} style ={styles.horizontalLine2}/>

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
    justifyContent:'flex-start',
    height:2,
    width:width-width/2,
    backgroundColor:'#C7C7C7',
    marginTop:5,
    marginBottom:5
  },
  horizontalLine2: {
    justifyContent:'center',
    marginTop:10,
    flex:1,
    resizeMode:'contain',
  }

});


export { View_Trip_Detail_Strip }
