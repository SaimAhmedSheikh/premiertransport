import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LoginButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#330c00',
    fontSize: 19,
    paddingTop: 5,
    fontWeight: '500',
    paddingBottom: 5
  },
  buttonStyle: {
    flexDirection:'column',
    height:50,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#ffffff',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center'
  }
};

export { LoginButton };
