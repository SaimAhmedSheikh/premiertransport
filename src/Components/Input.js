import React from 'react';
import { TextInput, View, Text , Image , Dimensions } from 'react-native';
import colors from './colors'
var {width, height} = Dimensions.get('window');

const Input = ({ maxLength , keyboardType, multiline, color,img, isVisible, editable, customStyle,backcolor,label, value, onChangeText, placeholder, placeholderTextColor, secureTextEntry,underlineColorAndroid }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <View style={[containerStyle,{backgroundColor:backcolor}]}>
      {isVisible &&   <Image style = {{  width: 20,   height: 20 , resizeMode:'contain'} } source = { img }  /> }
      <TextInput
        editable = {editable}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCorrect={false}
        style={[customStyle,inputStyle,{marginLeft:5,color:color}]}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={maxLength}
        underlineColorAndroid = {underlineColorAndroid}  />
    </View>
  );
};

const styles = {

  inputStyle: {
    color: '#ffffff',
    fontSize: 13,
    flex: 2,
    paddingBottom:4,
    paddingTop:3,
    fontFamily:'Gotham Book',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { Input };
