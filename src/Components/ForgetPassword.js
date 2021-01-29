import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ForgetPassword = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        Forgot  password ?
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#BBBBBB',
    fontSize: 15,
    fontFamily: 'Gotham Medium',
    marginTop:-5
  },
  buttonStyle: {
    flexDirection:'column',
    height:30,
    backgroundColor:'#00000000',
    borderWidth: 1,
    borderColor: '#00000000',
    justifyContent: 'center'
  }
};

export { ForgetPassword };
