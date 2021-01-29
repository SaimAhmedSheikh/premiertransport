import React from 'react';
import { TextInput, View, Text , Image , Dimensions } from 'react-native';
import colors from './colors'
var {width, height} = Dimensions.get('window');
const calendar_icon = require('../images/calendar_icon.png');
const go_button = require('../images/go_button.png');

const Searchbar2 = ({ color,img, isVisible, editable, customStyle,backcolor,label, value, onChangeText, placeholder, placeholderTextColor, secureTextEntry,underlineColorAndroid }) => {
  const { inputStyle, labelStyle, containerStyle ,containerStyle2 } = styles;
  return (
    <View style={[containerStyle ]}>

      <View style={[containerStyle2,{backgroundColor:backcolor}]}>
      <TextInput
        editable = {false}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCorrect={false}
        style={[customStyle,inputStyle,{ color:color}]}
        value={value}
        onChangeText={onChangeText}
        multiline={false}
        underlineColorAndroid = {underlineColorAndroid}  />
        <Image style = {{ width: 25,   height: 25 , resizeMode:'contain'} } source = { calendar_icon }  />
        </View>

    </View>
  );
};

const styles = {

  inputStyle: {
    color: '#ffffff',
    fontFamily:'Gotham Book',
    fontSize: 11,
    width:120,
    height:35,
    paddingBottom:6,
    paddingTop:5,
    backgroundColor:'#78787844',
    paddingLeft:10
  },
  labelStyle: {
    fontSize: 14,
    paddingTop: 0,
    paddingLeft:5,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    paddingTop:5,
    marginLeft:15,
    paddingBottom:5,
  },
  containerStyle: {
    width:150,
    height:35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerStyle2: {
    width:150,
    height:35,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius:0.5,
    borderWidth:1,
    borderColor:'#A3A3A3',
  },
};

export { Searchbar2 };
