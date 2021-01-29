import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, bgcolor }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle,{backgroundColor:bgcolor,borderColor:bgcolor}]}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
//  backgroundColor: '#232323',#C38A36 borderColor: '#232323',
const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding:7
  },
  buttonStyle: {
    height:40,
    alignSelf: 'center',

    borderRadius: 1,
    borderWidth: 1,
    marginLeft: 1,
    marginRight: 1,
    paddingLeft:30,
    paddingRight:30,
  }
};

export { Button };
