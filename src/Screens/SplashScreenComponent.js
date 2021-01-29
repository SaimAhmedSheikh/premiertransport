import React from 'react';
import { Text, View, Dimensions, Image, ImageBackground } from 'react-native';
var {width, height} = Dimensions.get('window');
const imageHeight = Math.round(width * 9 / 16);
const imageWidth = width;

const SplashImage = require('../images/splash.png');

// Make a component
const SplashScreenComponent = (props) => {
  //const { textStyle, viewStyle } = styles;

  return (
    <View>
      <ImageBackground style={{resizeMode:'stretch', width:width,height:height,justifyContent: 'center'}} source={SplashImage}>

      </ImageBackground>
    </View>
  );
};

// <View style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center'}}>
//     <Image style = {{  width: 200,   height: 200, resizeMode: 'contain', justifyContent: 'center'} } source = { SplashImage } />
// </View>

export default SplashScreenComponent
