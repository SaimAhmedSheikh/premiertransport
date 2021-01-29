import React, {Component} from 'react';
import { View,  ScrollView, FlatList, SafeAreaView, Platform,Dimensions,StyleSheet ,Text , Image} from 'react-native';
//import CreateProfile from './src/Components/_CreateProfile'
//import { SplashScreen, MapScreen , LoginForm , MyRides , MyLogs , Notifications , CreateProfile} from './src/Screens';
import SplashScreen from './src/Screens/SplashScreen';
import MapScreen from './src/Screens/MapScreen';
import LoginForm from './src/Screens/LoginForm';
import MyRides from './src/Screens/MyRides';
import MyLogs from './src/Screens/MyLogs';
import Notifications from './src/Screens/Notifications';
import CreateProfile from './src/Screens/CreateProfile';
import Settings from './src/Screens/Settings';
import EmergencyContact from './src/Screens/EmergencyContact';
import ViewProfile from './src/Screens/ViewProfile';
import EditProfile from './src/Screens/EditProfile';
import Calendar from './src/Screens/MyCalendar';
import MyMonthCalendar from './src/Screens/MyMonthCalendar';
import Logs_Details from './src/Screens/Logs_Details';

const icon_ride_active = require('./src/images/my_rides_tab_active.png');
const icon_logs_active = require('./src/images/my_logs_tab_active.png');
const icon_notification_active = require('./src/images/notifcations_tab_active.png');

const icon_ride = require('./src/images/my_rides_tab.png');
const icon_logs= require('./src/images/my_logs_tab.png');
const icon_notification = require('./src/images/notifcations_tab.png');

import { createAppContainer,  createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
const TabIconSize = 30
// First Time
// Splash -> Login -> ChangePassword -> CreateProfile -> DashBoard

// Second time
// Splash -> Dashboard


const Splash = createStackNavigator({ SplashScreen : SplashScreen } , { headerMode :'none', } );

const Login = createStackNavigator( { SignIn: LoginForm }, { headerMode :'none', } );

const CreateMyProfile = createStackNavigator( { CreateProfile: CreateProfile } );

const Dashboard = createStackNavigator(
  {
    MainScreen: createBottomTabNavigator(
    {
      MyRides : { screen : MyRides ,
        navigationOptions: {
          tabBarLabel: "My Rides",
          tabBarIcon : ({ tintColor }) => (
            <Image source={(tintColor == '#9D6E36') ? icon_ride_active : icon_ride}
            style ={{height:TabIconSize,width:TabIconSize,resizeMode:'contain'}}/>
          )
        }
      },
      MyLogs : { screen : MyLogs,
        navigationOptions: {
                tabBarLabel: "My Logs",
                tabBarIcon : ({ tintColor }) => (
                  <Image source={(tintColor == '#9D6E36') ? icon_logs_active : icon_logs}
                  style ={{height:TabIconSize,width:TabIconSize,resizeMode:'contain'}}/>
             )
          } },
      Notifications: { screen: Notifications,
        navigationOptions: {
              tabBarLabel: "Notifications",
              tabBarIcon : ({ tintColor }) => (
                <View style ={{height:TabIconSize,width:TabIconSize,resizeMode:'contain'}}>

                  <Image source={(tintColor == '#9D6E36') ? icon_notification_active : icon_notification}
                  style ={{height:TabIconSize,width:TabIconSize,resizeMode:'contain'}}/>

                </View>
           )
         }
       }
    },
    {
      tabBarOptions: {
         activeTintColor: '#9D6E36',
         inactiveTintColor: '#1B1B1B',
         labelStyle: { fontSize: 14,fontFamily:'Gotham Medium', },
         showIcon: true,
         style: { height:55 }
       }
    } )  ,
    Setting: Settings ,
    EmergencyContact : EmergencyContact ,
    MyMonthCalendar : MyMonthCalendar ,
    ViewProfile : ViewProfile ,
    EditProfile : EditProfile ,
    Calendar : Calendar ,
    LogsDetails : Logs_Details ,
    MapScreen : MapScreen
  } , {headerMode:'none'});

  export default createAppContainer(createSwitchNavigator(
    {
      Splash : Splash, Login: Login,   CreateProfile : CreateMyProfile,  App: Dashboard,
    },
    {
      initialRouteName: 'Splash',
    }
  ));


//   <View style={{borderRadius:20,width:20,height:20,justifyContent:'center',backgroundColor:'#C59A4F',position:'absolute',
//   top:0,right:0,bottom:0,left:'45%'}}>
//     <Text style={{alignSelf:'center',color:'#ffffff' }}> {CommonDataManager.getInstance().getNotifications().length} </Text>
//   </View>
// export default class App extends Component {
//   constructor(){
//      super();
//    }

//    componentWillMount()
//    {
//       // TestFairy.begin('0d214628fc17621672de9113b24e97cc48c454eb'); <SplashScreen/>
//    }

//   render(){
//     return(
//         <View>
//             <_MapView/>
//         </View>
//       );
//   }
// }

// <SafeAreaView style = {{ flex:1, backgroundColor: '#ffffff' }} >
//   <_CreateProfile/>
// </SafeAreaView>

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,   justifyContent: 'center', alignItems: 'center',   backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,   textAlign: 'center',   margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',   color: '#333333',   marginBottom: 5,
//   },
// });
