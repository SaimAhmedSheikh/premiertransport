
import React, {Component } from 'react';
import {Platform, StyleSheet, Text, View, Dimensions,Alert} from 'react-native';
var {height, width} = Dimensions.get('window');

class View_Trip_Detail extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{marginTop:24,flexDirection:'column', flex:1}}>
        <View style={{justifyContent:'center',height:this.props.WayPointAddress != false ? 150 : 100,padding:10, marginTop:-3}}>

          <View style={{flexDirection:'row'}}>
            <Text style={styles.textStyle}>{this.props.StartAddress}</Text>
          </View>

          { (this.props.WayPointAddress != false) &&
            <View>
              <View style={styles.horizontalLine}/>

              <View style={{flexDirection:'row'}}>
                <Text style={styles.textStyle}>{this.props.WayPointAddress}</Text>
              </View>
            </View>
          }

            <View style={styles.horizontalLine}/>

          <View style={{flexDirection:'row'}}>
            <Text style={styles.textStyle}>{this.props.EndAddress}</Text>
          </View>

        </View>
      </View>
    );
  }
}

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
    fontSize:14
  },
  textStyle: {
    marginBottom:5,
    marginTop:5,
    fontFamily:'Gotham Book',
    flex:1,
    fontSize:14,
    textAlign:'center'
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
    alignSelf:'center',
    height:1,width:150,
    backgroundColor:'#C7C7C7',
    marginTop:10,
    marginBottom:10
  },

});


export { View_Trip_Detail }
