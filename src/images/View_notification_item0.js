
import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Dimensions, Alert,TouchableOpacity, Animated} from 'react-native';
var {height, width} = Dimensions.get('window');
import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip, , Button } from '../Components';

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
          <TouchableOpacity style={{padding:10,flexDirection:'row'}} onPress={()=>this.setState({detail:1})}>
              <Image  source={notifications_icon} style={{ justifyContent:'center',alignSelf:'center',width:25,height:25}}/>
              <View style={{marginLeft:10,flexDirection:'column'}} >
                <Text style={{fontWeight:'400',fontSize : 18 , color:'#636363'}}> You have a message from admin </Text>
                <Text style={{fontSize : 15 , color:'#ABABAB'}}> 09-05-19 </Text>
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
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    height:1,
    flex:1,
    backgroundColor:'#C7C7C7',
  }
});

export default View_notification_item ;
