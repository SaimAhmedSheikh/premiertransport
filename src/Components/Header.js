import React from 'react';
import { Text, View , Dimensions , TouchableOpacity , Image} from 'react-native';
var {width, height} = Dimensions.get('window');
const icon_settings =  require('../images/setting_icon.png');
const back_icon = require('../images/back_icon.png');
const edit_icon = require('../images/edit_icon.png');
const emergency_icon = require('../images/emergency_contact_icon.png');

const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  var styleParent ;

  if(props.showBack && props.showSettings)
  {
      styleParent = { backgroundColor: props.headerColor };
  }
  else
  {
      styleParent = { backgroundColor: props.headerColor, justifyContent: props.showSettings ?  'space-between' : 'flex-start' };
  }

 

  return (
    <View style={[viewStyle, styleParent]}>

      { props.showBack &&
        <TouchableOpacity onPress = {()=> props.onBackPress() } style={{ alignItems:'center',marginLeft:15,width:35,height:35,justifyContent:'center' }}>
         <Image source = {back_icon} style={{ alignSelf:'center',width:23,height:23,resizeMode:'contain'}}/>
        </TouchableOpacity>
      }
      <Text style={textStyle}>{props.headerText}</Text>
      { props.showSettings &&
         <TouchableOpacity onPress = {()=> props.onPress() } style={{ marginRight:15,width:35,height:35,justifyContent:'flex-end', position:'absolute',top:'10%',right:0,left:'90%',bottom:0 }}>
          <Image source = { props.isEditIcon ? edit_icon : icon_settings } style={{ width:30,height:32,resizeMode:'contain',alignSelf:'flex-end'}}/>
         </TouchableOpacity>
      }
      { props.showEmergencyContact &&
         <TouchableOpacity onPress = {()=> props.onPress() } style={{ marginRight:15,width:35,height:35,justifyContent:'flex-end', position:'absolute',top:'10%',right:0,left:'90%',bottom:0 }}>
          <Image source = { emergency_icon } style={{ width:30,height:32,resizeMode:'contain',alignSelf:'flex-end'}}/>
         </TouchableOpacity>
      }

    </View>
  );
};

const styles = {
  viewStyle: {
    width:width,
    alignItems:'center',
    flexDirection:'column',
    height: (height/100 * 8),
    flexDirection:'row',
  },
  textStyle: {
    fontFamily:'Gotham Book',
    fontSize: 25,
    color:'#ffffff',
    marginLeft:15
  },
  imageStyle: {

  }
};

export { Header };
