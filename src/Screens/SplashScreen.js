import React, { Component } from 'react';
import { YellowBox, Platform , Alert} from 'react-native';
import  SplashScreenComponent  from './SplashScreenComponent';
//import RouterComponent from '../../RouterComponent';

//import LoginForm from './LoginForm'
//import Login from './Login'
import CommonDataManager from '../Components/CommonDataManager';
let commonData;

class SplashScreen extends Component {

  constructor(props){
      super(props);
      this.state = { timePassed: false, loggedIn:false };
      commonData = CommonDataManager.getInstance();
  }

  componentWillMount(){
  }

  componentDidMount() {
      setTimeout( () => {
          this.setTimePassed();
      },1500);
  }

  setTimePassed() {
    let UserData = commonData.getUserData();
    if(commonData.getUserData() == 0) {
      this.setState({loggedIn:false,timePassed: true});
    }
    else if( (''+UserData.FirstName === "null") || ''+UserData.LastName  === "null" ||
        ''+UserData.PhoneNumber === "null" || ''+UserData.Address1  === "null" ||
        ''+UserData.Address2  === "null" )
    {
      this.props.navigation.navigate('CreateProfile');
    }
    else {
      this.setState({loggedIn:true,timePassed: true});
    }


  }

  render() {
        console.disableYellowBox = true;
        YellowBox.ignoreWarnings(['Warning: ReactNative.createElement']);
        if (!this.state.timePassed) {
            return <SplashScreenComponent/>;
          } else {
            if(this.state.loggedIn){//this.state.loggedIn
              return this.props.navigation.navigate('App');
            }
            else{
              return this.props.navigation.navigate('SignIn');
            }
        }
     }
}

export default SplashScreen ;
