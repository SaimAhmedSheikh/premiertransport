
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions , Image} from 'react-native';
var {height, width} = Dimensions.get('window');

class View_Trip_Basic extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{alignSelf:'flex-start',flexDirection:'column', flex:0.8}}>
        <View style={{justifyContent:'flex-start',height:90,padding:2,paddingLeft:15}}>

          <View style={{flexDirection:'row',marginTop:10}}>
            <Text style={styles.textStyleBold}>Trip ID:</Text>
            <Text style={styles.textStyle}>{this.props.TripID}</Text>
          </View>

            <View style={styles.horizontalLine}/>

          <View style={{flexDirection:'row'}}>
            <Text style={styles.textStyleBold}>Date:</Text>
            <Text style={styles.textStyle}>{this.props.Date}</Text>
          </View>

            <View style={styles.horizontalLine}/>

              <View style={{flexDirection:'row'}}>
                <Text style={styles.textStyle}>{this.props.thirdValue}</Text>
              </View>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  textStyleBold: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    width:90,
    fontFamily:'Gotham Medium',
    fontSize:13
  },
  textStyle: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    color: '#8A8A8A',
    fontFamily:'Gotham Book',
    fontSize:13
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
    height:1,
    width:width-width/2,
    backgroundColor:'#C7C7C7',
    marginTop:5,
    marginBottom:5
  },

});


export { View_Trip_Basic }
