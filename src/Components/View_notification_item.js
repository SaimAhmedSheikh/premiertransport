
import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Dimensions, Alert,TouchableOpacity, Animated} from 'react-native';
var {height, width} = Dimensions.get('window');
import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip,  Button } from '../Components';

const notifications_icon =  require('../images/notifications_icon.png');

class View_notification_item extends Component {

  constructor(props){
    super(props);
    this.state = { detail: 0 }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1}} >
          <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'flex-start'}} onPress={()=>this.setState({detail:1})}>
              <Image  source={notifications_icon} style={{ justifyContent:'center',alignSelf:'center',width:23,height:23,resizeMode:'contain'}}/>
              <View style={{marginLeft:10,flexDirection:'column'}} >
                <Text style={{fontFamily:'Gotham Medium',fontSize : 14 , color:'#636363'}}> {this.props.Data.Message} </Text>
                <Text style={{fontFamily:'Gotham Book',fontSize : 13 , color:'#ABABAB'}}> {this.props.Data.Date} </Text>
              </View>
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
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    height:1,
    width: width-width/3 +10,
    backgroundColor:'#C7C7C7',
  }
});

export default View_notification_item ;
