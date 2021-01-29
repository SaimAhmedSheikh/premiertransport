import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const GeneralButton = ({ onPress, children, buttonStyle ,textStyle }) => {

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
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 5
  },
  buttonStyle: {
    flexDirection:'column',
    height:40,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#A8E0F1',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#A8E0F1',
    justifyContent: 'center'
  }
};

export { GeneralButton };
