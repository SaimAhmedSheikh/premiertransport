import React , { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  Dimensions, TouchableOpacity ,
  ScrollView, Alert , Image
} from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import AskPermission from '../Components/AskPermission';
import geolib from 'geolib';
import KeepAwake from 'react-native-keep-awake';
let URL_CANCEL_TRIP  =  MyConstants.BASE_URL + "Trip/CancelRide";
let URL_MARK_PICKUP  =  MyConstants.BASE_URL + "Trip/PickupRide";
let URL_MARK_DROPOFF  =  MyConstants.BASE_URL + "Trip/DropoffRide";
let URL_REACHED_WAYPOINT  =  MyConstants.BASE_URL + "Trip/ReachedatWayout";
const TYPE_ROUND = "roundtrip";

import colors from '../Components/colors';
import * as MyConstants from '../Components/Constants';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import {Linking,BackHandler} from 'react-native'
// eslint-disable-next-line max-len
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, Polygon, Polyline, Callout  } from 'react-native-maps';
import { Header } from '../Components';
const icon_map_navigation =  require('../images/icon_map_navigation.png');
const arrived_button =  require('../images/arrived_button.png');
const cancel_button =  require('../images/cancel_button_big.png');
const confirm_dropoff_icon =  require('../images/confirm_dropoff_icon.png');
import MapViewDirections from 'react-native-maps-directions';
const { width, height } = Dimensions.get('window');
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');
const ok =  require('../images/ok_button.png');
const cancel_button_small =  require('../images/cancel_button.png');
const details_button =  require('../images/details_button.png');

const phone_icon =  require('../images/phone_icon.png');
const bullet_rect =  require('../images/bullet_rect.png');
const cancel_ride_icon =  require('../images/cancel_ride_icon.png');

const pin_icon2 = require('../images/pin_icon2.png');
const pin_icon =  require('../images/pin_icon.png');
const pin_icon_dropoff = require('../images/pin_icon3.png');
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Utils from '../Components/Utils'
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;
const CircleDistance = 250;
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
let calloutHeight=120;
let WAYPOINT_STATUS = "Reached at waypoint";
let WayPointAddress = 0;

import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip,
          View_Trip_Detail_Ride_Fare, Button } from '../Components';
import OpenMapNavigation from '../Components/OpenMapNavigation';
import LocalNotification from '../Components/LocalNotification';
// eslint-disable-next-line react/no-multi-comp
class MapScreen extends Component {

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.unsubscribe = null;
    this.state = {
      dialogVisible: false,
      PickUp: false,
      DropOff: false,
      Waypoint: false,
      isWaypointIncluded: false,
      completeTrip: false,
      cancelride: false,
      locationAllow: false,
      alertMessage: "",
      error: "",
      loading: false,
      url: "",
      MyObject: "",
      region: [{
          latitude: 24.878541,
          longitude: 67.064123
        },
        {
          latitude: 24.894103,
          longitude: 67.064257
        },
        // { latitude: 24.903943,  longitude: 67.077142 },
        // { latitude: 24.908373,  longitude: 67.083025 },
        // { latitude: 24.912079,  longitude: 67.083287 },
        // { latitude: 24.917890,  longitude: 67.086389 }
      ],

      myLocation: [{
          title: 'Office',
          coordinates: {
            latitude: 24.878541,
            longitude: 67.064123
          }
        },
        {
          title: 'Askari Park',
          coordinates: {
            latitude: 24.894103,
            longitude: 67.064257
          }
        },
      ],
      nextCoordinates: {
        latitude: 24,
        longitude: 67
      },
      nextAddress: '',
      myCoords: {
        latitude: 0,
        longitude: 0
      },
      areaOfInterest: [],
      addrOfInterest: [],
      currIndex: 0,
      LastStatus: 'null',
      vall: 0,
      detialsDialog: false,
      PickupTime: "",
      DropoffTime: "",
      DisplayId: "",
      TripDate: "",
      CustomerNamee: ""
    };
    }

    changeKeepAwake(shouldBeAwake) {
      if (shouldBeAwake) {
        KeepAwake.activate();
      } else {
        KeepAwake.deactivate();
      }
    }

  // Get started ride data and map it according to code structure
  populateCoordiantes() {
    let tempArrCoor = new Array();
    let tempArrAddr = new Array();
    let tempArrLocation = new Array();
    let alertVal = "";
    let onceInside = false;
    let hasPickUp = false;
    let wayPointDone = false;
    let doIncludeWaypoint = false;
    let DisplayPickUpAddress = "";
    let DisplayPickUpTime = "";
    let DisplayDropOffTime = "";
    let CustomerNamee = "";
    // var tempArr = new Array();
    for (let i = 0; i < commonData.getCurrentRideData().Rides.length; i++) {
      // if(commonData.getCurrentRideData().Rides[i].IsVisible && commonData.getCurrentRideData().Rides[i].AssignTo === commonData.getUserData().UserId){
      //   console.log('Ride ' + i +" "+JSON.stringify(commonData.getCurrentRideData().Rides[i]));
      // }


      /// First Pickup check
      let PickUpAddress = commonData.getCurrentRideData().Rides[i].PickupAddress;
      let PickUpTime = commonData.getCurrentRideData().Rides[i].PickupTime;
      let PU_CoorLat = commonData.getCurrentRideData().Rides[i].PickupLocation.Latitude;
      let PU_CoorLng = commonData.getCurrentRideData().Rides[i].PickupLocation.Longitude;

      let WayPointTime = 0;
      let WayPoint_CoorLat = 0;
      let WayPoint_CoorLng = 0;

      // check if key esxists
      // if("WaypointAddress" in commonData.getCurrentRideData().Rides[i]){
      //    // if has items then populate it accordingly
      //    if(commonData.getCurrentRideData().Rides[i].WaypointLocation.Latitude !=0 &&
      //       commonData.getCurrentRideData().Rides[i].WaypointLocation.Longitude !=0){
      //        // Alert.alert('WaypointAddress ff'+commonData.getCurrentRideData().Rides[i].WaypointLocation.Longitude);
      //      doIncludeWaypoint = true;
      //       WayPointAddress = commonData.getCurrentRideData().Rides[i].WaypointAddress;
      //       WayPointTime = commonData.getCurrentRideData().Rides[i].WaypointTime;
      //       WayPoint_CoorLat = commonData.getCurrentRideData().Rides[i].WaypointLocation.Latitude;
      //       WayPoint_CoorLng = commonData.getCurrentRideData().Rides[i].WaypointLocation.Longitude;
      //     }
      //     else{
      //       WayPointAddress = 0;
      //       doIncludeWaypoint = false;
      //
      //      ////  Alert.alert(''+commonData.getCurrentRideData().Rides[i].WaypointLocation.Longitude);
      //     }
      // }

      let DropOffAddress = commonData.getCurrentRideData().Rides[i].DropoffAddress;
      let DropOffTime = commonData.getCurrentRideData().Rides[i].DropoffTime;
      let DO_CoorLat = commonData.getCurrentRideData().Rides[i].DropoffLocation.Latitude;
      let DO_CoorLng = commonData.getCurrentRideData().Rides[i].DropoffLocation.Longitude;

      // let CustomerName =  commonData.getCurrentRideData().Rides[i].CustomerName;
      // let CustomerContactNo =   commonData.getCurrentRideData().Rides[i].CustomerContactNo;
      let CustomerName = commonData.getCurrentRideData().CustomerName;
      CustomerNamee = commonData.getCurrentRideData().CustomerName;
      let CustomerContactNo = commonData.getCurrentRideData().CustomerContactNo;
      let Status = JSON.stringify(commonData.getCurrentRideData().Rides[i].Status);
      let IsVisible = commonData.getCurrentRideData().Rides[i].IsVisible;
      let AssignedTo = commonData.getCurrentRideData().Rides[i].AssignTo;
      //Status.includes("In Progress")
      console.log("IsVisible: " + IsVisible + " AssignedTo: " + AssignedTo);
      console.log("UserID: " + commonData.getUserData().UserId);
      console.log("Status: " + Status.includes("Picked"));
      console.log("Check Value: " + (IsVisible && AssignedTo === commonData.getUserData().UserId));
      if (IsVisible && AssignedTo === commonData.getUserData().UserId && Status.includes("In Progress") ||
        IsVisible && AssignedTo === commonData.getUserData().UserId && Status.includes("Picked")) {

        DisplayPickUpAddress = commonData.getCurrentRideData().Rides[i].PickupAddress;
        DisplayPickUpTime = commonData.getCurrentRideData().Rides[i].PickupTime;
        DisplayDropOffTime = commonData.getCurrentRideData().Rides[i].DropoffTime;

        if (Status.includes("null") || Status.includes("Pending") || Status.includes("In Progress")) { // this ride is not started
          if (onceInside == false) {
            hasPickUp = false;
            wayPointDone = false;
            onceInside = true;
          }

          tempArrCoor.push({
            latitude: PU_CoorLat,
            longitude: PU_CoorLng
          });
          tempArrAddr.push(PickUpAddress);
          tempArrLocation.push({
            CustomerName: CustomerName,
            CustomerContactNo: CustomerContactNo,
            isPickUp: true,
            isWaypoint: false,
            PickUpTime: PickUpTime,
            PickUpAddress: PickUpAddress,
            PickUpCoordinates: {
              latitude: PU_CoorLat,
              longitude: PU_CoorLng
            },
          });

          if (WayPointAddress != 0) {
            tempArrCoor.push({
              latitude: WayPoint_CoorLat,
              longitude: WayPoint_CoorLng
            });
            tempArrAddr.push(WayPointAddress);
            tempArrLocation.push({
              CustomerName: CustomerName,
              CustomerContactNo: CustomerContactNo,
              isPickUp: false,
              isWaypoint: true,
              WayPointTime: WayPointTime,
              WayPointAddress: WayPointAddress,
              WayPointCoordinates: {
                latitude: WayPoint_CoorLat,
                longitude: WayPoint_CoorLng
              },
            });
          }

          tempArrCoor.push({
            latitude: DO_CoorLat,
            longitude: DO_CoorLng
          });
          tempArrAddr.push(DropOffAddress);

          tempArrLocation.push({
            CustomerName: CustomerName,
            CustomerContactNo: CustomerContactNo,
            isPickUp: false,
            isWaypoint: false,
            DropOffTime: DropOffTime,
            DropOffAddress: DropOffAddress,
            DropOffCoordinates: {
              latitude: DO_CoorLat,
              longitude: DO_CoorLng
            }
          });
        } else if (Status.includes("Picked")) { // Pick up is done
          if (onceInside == false) {
            hasPickUp = true;
            wayPointDone = false;
            onceInside = true;
          }

          if (WayPointAddress != 0) {
            tempArrCoor.push({
              latitude: WayPoint_CoorLat,
              longitude: WayPoint_CoorLng
            });
            tempArrAddr.push(WayPointAddress);

            tempArrLocation.push({
              CustomerName: CustomerName,
              CustomerContactNo: CustomerContactNo,
              isPickUp: false,
              isWaypoint: true,
              WayPointTime: WayPointTime,
              WayPointAddress: WayPointAddress,
              WayPointCoordinates: {
                latitude: WayPoint_CoorLat,
                longitude: WayPoint_CoorLng
              },
            });

            tempArrCoor.push({
              latitude: DO_CoorLat,
              longitude: DO_CoorLng
            });
            tempArrAddr.push(DropOffAddress);

            tempArrLocation.push({
              CustomerName: CustomerName,
              CustomerContactNo: CustomerContactNo,
              isPickUp: false,
              isWaypoint: false,
              DropOffTime: DropOffTime,
              DropOffAddress: DropOffAddress,
              DropOffCoordinates: {
                latitude: DO_CoorLat,
                longitude: DO_CoorLng
              }
            });
          } else {
            tempArrCoor.push({
              latitude: DO_CoorLat,
              longitude: DO_CoorLng
            });
            tempArrAddr.push(DropOffAddress);

            tempArrLocation.push({
              CustomerName: CustomerName,
              CustomerContactNo: CustomerContactNo,
              isPickUp: false,
              isWaypoint: false,
              DropOffTime: DropOffTime,
              DropOffAddress: DropOffAddress,
              DropOffCoordinates: {
                latitude: DO_CoorLat,
                longitude: DO_CoorLng
              }
            });
          }

        } else if (Status.includes(WAYPOINT_STATUS) && WayPointAddress != 0) { // this ride pickup and waypoint compeleted

          if (onceInside == false) {
            hasPickUp = true;
            wayPointDone = true;
            onceInside = true;
            //   Alert.alert('Status.includes(WAYPOINT_STATUS) ' +wayPointDone);
          }
          tempArrCoor.push({
            latitude: DO_CoorLat,
            longitude: DO_CoorLng
          });
          tempArrAddr.push(DropOffAddress);

          tempArrLocation.push({
            CustomerName: CustomerName,
            CustomerContactNo: CustomerContactNo,
            isPickUp: false,
            isWaypoint: false,
            DropOffTime: DropOffTime,
            DropOffAddress: DropOffAddress,
            DropOffCoordinates: {
              latitude: DO_CoorLat,
              longitude: DO_CoorLng
            }
          });
        } else if (Status.includes("Completed")) { // this ride pickup, waypoint and drop off compeleted

        }
      } else {
        // Ride is not visible or the ride is assigned to another driver
      }

    }

    if (WayPointAddress == 0) {
      wayPointDone = true;
    }
    //    Alert.alert('wayPointDone ' +wayPointDone);
    //  Alert.alert(''+commonData.getCurrentRideData().Rides.length);
    if (tempArrCoor.length == 0) {
      tempArrCoor.push({
        latitude: 0.0,
        longitude: 0.0
      });
      tempArrCoor.push({
        latitude: 0.0,
        longitude: 0.0
      });
      this.setState({
        completeTrip: true,
        dialogVisible: true,
        PickUp: hasPickUp,
        Waypoint: wayPointDone,
        DropOff: false,
        isWaypointIncluded: doIncludeWaypoint,
        region: tempArrCoor,
        nextCoordinates: tempArrCoor[0],
        areaOfInterest: tempArrCoor,
        addrOfInterest: tempArrAddr,
        nextAddress: tempArrAddr[0],
        myLocation: []
      })
    } else {
      this.setState({
        PickUp: hasPickUp,
        Waypoint: wayPointDone,
        isWaypointIncluded: doIncludeWaypoint,
        DropOff: false,
        region: tempArrCoor,
        nextCoordinates: tempArrCoor[0],
        areaOfInterest: tempArrCoor,
        addrOfInterest: tempArrAddr,
        nextAddress: tempArrAddr[0],
        myLocation: tempArrLocation,
        PickupTime: DisplayPickUpTime,
        DropoffTime: DisplayDropOffTime,
        DisplayId: commonData.getCurrentRideData().DisplayId,
        TripDate: commonData.getCurrentRideData().TripDate,
        CustomerNamee: CustomerNamee
      })
    }

    //  }
  }

  componentWillUnmount(){
      this.changeKeepAwake(false);
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
  //  this.props.navigation.goBack(null);
    return true;
  }

  backtoDashboard(){
    this.props.navigation.pop();
  }

  componentWillMount(){
      commonData = CommonDataManager.getInstance();
      this.populateCoordiantes();
       BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        //this.GetLastStatus();
  }

  goBackNow(){
    const { params } = this.props.navigation.state;
    try{
        params.onPreviousScreen();
    }
    catch(e){

    }
    this.props.navigation.pop();
  }

  _callShowDirections = () => {
     const startPoint = {
       latitude: this.state.myCoords.latitude,
       longitude: this.state.myCoords.longitude
     }

     const targetAddress = this.state.nextAddress;
     console.log("startPoint "+JSON.stringify(startPoint));
     console.log("endPoint ", targetAddress);

     OpenMapNavigation(`${startPoint.latitude},${startPoint.longitude}`, targetAddress).then(res => { 
       console.log(res)
     });
   }

  render() {
    var buttonWidth = width-width/3-20;
    console.log('Re-rendered State : ', this.state);
  //  const { params } = this.props.navigation.state;

    //Alert.alert(''+this.state.areaOfInterest[0].latitude);
    // latitude: this.state.myCoords.latitude,  longitude: this.state.myCoords.longitude
  //  let startLatLng = ""+this.state.myCoords.latitude+","+this.state.myCoords.longitude;

    //let endLatLng = ""+this.state.areaOfInterest[1].latitude+","+this.state.areaOfInterest[1].longitude;
//backtoDashboard
    return (
      <View style={styles.container}>
        <Header onPress = {()=> this.props.navigation.navigate("EmergencyContact",{ onPreviousScreen: this.goBackNow.bind(this)   })}
                onBackPress={()=>this.props.navigation.pop()}
                headerText = {'Trip'}
                headerColor={colors.HeaderColor}
                showSettings={false}
                showBack={false}
                showEmergencyContact={true}/>

        <MapView style={styles.map} onUserLocationChange={this._setMyLocation}
         ref={ref => (this.map = ref)} showsUserLocation={true} loadingEnabled = {true}
         showsMyLocationButton = {true} tracksViewChanges={true} followsUserLocation={true}
         onMapReady={()=>this.whenMapReady()} >
         {this.state.myLocation.map(marker => (
           <View>
             {marker.isPickUp && !marker.isWaypoint &&
             <MapView.Marker coordinate={marker.PickUpCoordinates}   >
               <Image source={pin_icon2} style={{width:27,height:27,resizeMode:'contain'}}/>
               <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>

                 <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                 paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.PickUpAddress}</Text>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.PickUpTime} Pickup</Text>
                 </View>
               </Callout>
             </MapView.Marker>
             }

             {marker.isWaypoint &&
             <MapView.Marker coordinate={marker.WayPointCoordinates}   >
               <Image source={pin_icon} style={{width:27,height:27,resizeMode:'contain'}}/>
               <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>

                 <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                 paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.WayPointAddress}</Text>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.WayPointTime} Waypoint</Text>
                 </View>
               </Callout>
             </MapView.Marker>
             }

             {!marker.isPickUp && !marker.isWaypoint &&
             <MapView.Marker coordinate={marker.DropOffCoordinates}   >
               <Image source={pin_icon_dropoff} style={{width:27,height:27,resizeMode:'contain'}}/>
               <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>

                 <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                 paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.DropOffAddress}</Text>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.DropOffTime} Drop off</Text>
                 </View>
               </Callout>
             </MapView.Marker>
           }
             </View>
         ))}

          <MapViewDirections
            origin={{latitude: this.state.myCoords.latitude, longitude: this.state.myCoords.longitude}}
            destination={{latitude: this.state.areaOfInterest[0].latitude, longitude: this.state.areaOfInterest[0].longitude}}
            apikey={'AIzaSyCtQjY6rNO8YaWHP0HXuVMiBwxbGmfo1DI'}
            strokeWidth={3}
            strokeColor="#000000"
              onError={(errorMessage) => {
              //   Alert.alert(''+errorMessage);
              }}
             onStart={(params) => {
            //     Alert.alert('onStart '+params.origin);
             }}
             onReady={(paramss) => {
            //   Alert.alert('onReady s'+this.state.myCoords.latitude );
            //    Alert.alert('onReady e'+this.state.areaOfInterest[0].latitude );


             }}
          />

         </MapView>

         <TouchableOpacity onPress={()=> this._callShowDirections()}
                           style={{background:'#ffffff',width:50,height:50,position:'absolute', top:'71%',bottom:0,left:width-width/100*20,right:'90%'}}>
           <Image onPress={()=> this._callShowDirections()} source={icon_map_navigation} style={{width:50,height:50,resizeMode:'contain' }}/>
         </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.CheckAreaOfInterest()}
                            style={{width:buttonWidth-10,height:60,position:'absolute',top:'79%',bottom:0,left:width-width/100*80,right:'50%'}}>
            <Image source={arrived_button} style={{width:buttonWidth,height:60,resizeMode:'contain'}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.setState({  detialsDialog:true })}
                            style={{width:buttonWidth,height:60,position:'absolute', top:'87%',bottom:0,left:width-width/100*80,right:'50%'}}>
            <Image source={details_button} style={{width:buttonWidth,height:60,resizeMode:'contain' }}/>
          </TouchableOpacity>


      {this.state.dialogVisible && this.ShowConfirmDialog()}
      {this.state.cancelride && this.ShowCancelDialog()}
      {this.state.detialsDialog && this.ShowTripCardDetails()}
      {this.state.loading && <WebService
        navigation={this.props.navigation}
         dialogVisible = {true}
         isGet = {false}
         MyMsg = {this.state.alertMessage}
         onPostMethod = {() => this.onPostMethod() }
         onTimeOutt = {()=> this.onTimeOutt() }
         onInternetNotConnected = {()=> this.onInternetNotConnected() }
         URL= {this.state.url}
         includeToken = { true }
         SuccessMsg = { false }
         MyObject = {this.state.MyObject }/> }
      </View>
    );
  }
  // <TouchableOpacity onPress={()=> this.setState({  cancelride:true })}
  //                   style={{width:buttonWidth,height:60,position:'absolute', top:'87%',bottom:0,left:width-width/100*80,right:'50%'}}>
  //   <Image source={cancel_button} style={{width:buttonWidth,height:60,resizeMode:'contain' }}/>
  // </TouchableOpacity>
  // <Polyline
  //    coordinates={this.state.areaOfInterest }
  //    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
  //    strokeColors={[	'#7F0000']}
  //    strokeWidth={2}
  //  />

  // origin={{latitude: 24.878541, longitude: 67.064123}}
  // destination={{latitude: 24.894103, longitude: 67.064257}}

  // origin={{latitude: this.state.myCoords.latitude, longitude: this.state.myCoords.longitude}}
  // destination={{latitude: this.state.areaOfInterest[0].latitude, longitude: this.state.areaOfInterest[0].longitude}}

  onTimeOutt () {
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.setState({loading:false});
    }, 2000);
  }

 onInternetNotConnected(){
   this.setState({loading: false });
 }

 onPostMethod = () => {
    //  Alert.alert(''+commonData.getUserData().UserId);
    let Response =  commonData.getTempData();
    //Alert.alert(''+Response.Status);
  //  let CurrStatus = this.GetLastUnCompletedStatus();
  //  Alert.alert(this.GetLastUnCompletedStatus()+"  after");
    if(Response !== 0){
      //Alert.alert(''+ Response.Body.Rides[0].Status);
      if(Response.Code === '200'){

         // Check if all the status is completed or Cancelled
         let completedRidesCount = 0;
         let visibleRides = 0;

         // for(let i=0 ; i < Response.Body.Rides.length ; i++){
         //   console.log("IsVisible: "+Response.Body.Rides[i].IsVisible +" AssignTo: "+Response.Body.Rides[i].AssignTo);
         //   if(Response.Body.Rides[i].IsVisible && Response.Body.Rides[i].AssignTo === commonData.getUserData().UserId){
         //     visibleRides ++;
         //     if(Response.Body.Rides[i].Status === 'Completed' || Response.Body.Rides[i].Status === 'Cancelled'){
         //        completedRidesCount ++;
         //     }
         //   }
         // }
         // console.log("Visible rides: "+visibleRides +" completedRides: "+completedRidesCount);
         //Alert.alert('ride completed '+(completedRidesCount == Response.Body.Rides.length));
         // if(completedRidesCount == Response.Body.Rides.length){ URL_MARK_DROPOFF
        // if(completedRidesCount == visibleRides){
         if(this.state.url === URL_MARK_DROPOFF){
            this.setState({ loading:false  });
             commonData.deleteTodayRidesData();
             const timeoutId = BackgroundTimer.setTimeout(() => {
                this.setState({ completeTrip:true,dialogVisible: !this.state.dialogVisible});
             }, 700);
         }
         else
         {
           if(this.state.PickUp == false){
               this.setState({loading:false,PickUp:!this.state.PickUp });
           }
           // else if(this.state.isWaypointIncluded && this.state.Waypoint == false &&  WayPointAddress != 0){
           //  //   Alert.alert('isWaypointIncluded '+this.state.isWaypointIncluded+' '+this.state.Waypoint);
           //     this.setState({loading:false , Waypoint:!this.state.Waypoint, DropOff:false });
           // }
           else if(this.state.DropOff == false){
               this.setState({loading:false , DropOff:false , PickUp:false });
           }

           if(this.state.url === URL_CANCEL_TRIP){
             this.state.completeTrip ? this.CloseScreen() : this.setState({cancelride:false,PickUp:false,Waypoint:false,DropOff:false});
             this.continueToNextRide();
           }
           else {
             this.contiueToNextWaypoint();
           }

         }
          commonData.setCurrentRideData(Response.Body);
      }
    }
 }

  CloseScreen(){
    const { params } = this.props.navigation.state;
    try{
      params.onPreviousScreen();
    }catch(e){

    }
    //  this.props.navigation.getParam('onPreviousScreen');

          BackgroundTimer.setTimeout(() => {
              this.props.navigation.pop();
        }, 2000);
  }

  componentDidCatch(error, info) {
    // Display fallback UI
  //  Alert.alert('dfsdf'+error);
  }

  async componentDidMount(){
    let ask = new AskPermission();
    let isAllowed = ask.requestLocationPermission();

       this.changeKeepAwake(true);
  //  Alert.alert(''+isAllowed);
    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   // Create the object to update this.state.mapRegion through the onRegionChange function
    //   let region = {
    //     latitude:       position.coords.latitude,
    //     longitude:      position.coords.longitude,
    //     latitudeDelta:  0.00922*1.5,
    //     longitudeDelta: 0.00421*1.5
    //   }
    //   Alert.alert('change '+region.latitude)
    // //  this.onRegionChange(region, region.latitude, region.longitude);
    // }, (error)=>console.log(error));
  }

  _gotoCurrentLocation = () => {
     // const { myLocation, region } = this.state;
     // this.map.animateToRegion({
     //   latitude: myLocation.latitude, //   longitude: myLocation.longitude,
     //   latitudeDelta: region.latitudeDelta, //   longitudeDelta: region.longitudeDelta
     // });
   }

     toTrunc(value,n){
      let x=(value.toString()+".0").split(".");
      return parseFloat(x[0]+"."+x[1].substr(0,n));
    }


    ComponentDidUpdate(){
      //  Alert.alert('f');

    }

    // (
    //          (position) => {
    //             const initialPosition = JSON.stringify(position);
    //             this.setState({ initialPosition });
    //          },
    //          (error) => alert(error.message),
    //          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }

   _setMyLocation = event => {
       const accPnt = 5;
       var myCurPos_Lat = event.nativeEvent.coordinate.latitude;
       var myCurPos_Long = event.nativeEvent.coordinate.longitude;
       if (this.state.myCoords.latitude == 0 && this.state.myCoords.longitude == 0) {
         this.setState({
           myCoords: {
             latitude: myCurPos_Lat,
             longitude: myCurPos_Long
           }
         });
         this.map.fitToCoordinates(this.state.region, {
           edgePadding: {
             top: 520,
             right: 520,
             bottom: 520,
             left: 520
           }
         });
         // Alert.alert(''+myCurPos_Lat + ' '+myCurPos_Long);
         return;
       }
       // Alert.alert(this.state.vall+' '+this.toTrunc(this.state.myCoords.latitude,accPnt) +"  "+ this.toTrunc(myCurPos_Lat,accPnt))
       //    || this.toTrunc(this.state.myCoords.longitude,accPnt) != this.toTrunc(myCurPos_Long,accPnt)));
       //Alert.alert(''+myCurPos_Lat  + ' '+this.state.myCoords.latitude);
       if (this.toTrunc(this.state.myCoords.latitude, accPnt) != this.toTrunc(myCurPos_Lat, accPnt) ||
         this.toTrunc(this.state.myCoords.longitude, accPnt) != this.toTrunc(myCurPos_Long, accPnt)) {
         var latsLong = [];
         latsLong.push({
           latitude: this.state.nextCoordinates.latitude,
           longitude: this.state.nextCoordinates.longitude
         });
         latsLong.push({
           latitude: myCurPos_Lat,
           longitude: myCurPos_Long
         });
         this.map.fitToCoordinates(latsLong, {
           edgePadding: {
             top: 520,
             right: 520,
             bottom: 520,
             left: 520
           }
         });
         //  Alert.alert('inside');
         this.sentGeoPointToFireStore(myCurPos_Lat, myCurPos_Long);
         this.setState({
           vall: this.state.vall+1,
           areaOfInterest: latsLong,
           myCoords: {
             latitude: myCurPos_Lat,
             longitude: myCurPos_Long
           }
         });

       }

    //         type Location {
    //   latitude: Number,
    //   longitude: Number,
    //   altitude: Number,
    //   timestamp: Number, //Milliseconds since Unix epoch
    //   accuracy: Number,
    //   altitudeAccuracy: Number,
    //   speed: Number,
    // }
     // return this.getCurrentLocation().then(position => {
     //       if (position) {
     //
     //         var myCurPos_Lat = position.coords.latitude;
     //         var myCurPos_Long = position.coords.longitude;
     //
     //          if(this.state.myCoords.latitude == 0 && this.state.myCoords.longitude ==0){
     //             this.setState({  myCoords: {latitude: myCurPos_Lat,  longitude: myCurPos_Long}  });
     //             this.map.fitToCoordinates(this.state.region, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
     //            // Alert.alert(''+myCurPos_Lat + ' '+myCurPos_Long);
     //             return;
     //          }
     //          // Alert.alert(this.state.vall+' '+this.toTrunc(this.state.myCoords.latitude,accPnt) +"  "+ this.toTrunc(myCurPos_Lat,accPnt))
     //          //    || this.toTrunc(this.state.myCoords.longitude,accPnt) != this.toTrunc(myCurPos_Long,accPnt)));
     //          //Alert.alert(''+myCurPos_Lat  + ' '+this.state.myCoords.latitude);
     //          if(this.toTrunc(this.state.myCoords.latitude,accPnt) != this.toTrunc(myCurPos_Lat,accPnt) ||
     //          this.toTrunc(this.state.myCoords.longitude,accPnt) != this.toTrunc(myCurPos_Long,accPnt) )
     //          {
     //            var latsLong = [];
     //            latsLong.push({latitude: this.state.nextCoordinates.latitude,  longitude: this.state.nextCoordinates.longitude});
     //            latsLong.push({latitude: myCurPos_Lat,  longitude: myCurPos_Long});
     //            this.map.fitToCoordinates(latsLong, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
     //              Alert.alert('inside');
     //            sentGeoPointToFireStore(myCurPos_Lat,myCurPos_Long);
     //            this.setState({vall:this.state.vall++,  areaOfInterest : latsLong,  myCoords: {latitude: myCurPos_Lat,  longitude: myCurPos_Long}  });
     //
     //          }
     //
     //        }
     //     },
     //   );

     };

     sentGeoPointToFireStore(lat,long){
      //   Alert.alert('sentGeoPointToFireStore '+lat+' '+long);
       auth().signInWithEmailAndPassword('jameel@lntechnologies.com', 'qwerty').catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
      //   Alert.alert(errorCode+' '+errorMessage);
          return;
        });

       firestore().collection("User")
       .doc(''+commonData.getUserData().UserId)
       .update({"Location": new firestore.GeoPoint(lat, long)})
       .then(function(docRef) {
        // Alert.alert(''+docRef.id);
        })
        .catch(function(error) {
          ToastAndroid.show('  '+error, ToastAndroid.LONG);
        });
     }

     // will be called if the server has sucessfully updated the status of ride to cancelled
     continueToNextRide() {
       ///fdsaf = 0;
       //let CurrStatus = this.GetLastUnCompletedStatus();
       // Alert.alert(this.GetLastUnCompletedStatus()+"  CurrStatus");
       if (this.state.LastStatus.includes("null") || this.state.LastStatus.includes("Pending") || this.state.LastStatus.includes("In Progress")) {
         var latsLong = [];
         var nextAddress = ''
         latsLong.push({
           latitude: this.state.region[this.state.currIndex + 2].latitude,
           longitude: this.state.region[this.state.currIndex + 2].longitude
         });
         nextAddress = this.state.addrOfInterest[this.state.currIndex + 2]
         latsLong.push({
           latitude: this.state.myCoords.latitude,
           longitude: this.state.myCoords.longitude
         });
         this.map.fitToCoordinates(latsLong, {
           edgePadding: {
             top: 520,
             right: 520,
             bottom: 520,
             left: 520
           }
         });

         let tempMyLoc = this.state.myLocation;
         tempMyLoc.shift();
         tempMyLoc.shift();
         this.setState({
           areaOfInterest: latsLong,
           currIndex: this.state.currIndex + 2,
           nextCoordinates: this.state.region[this.state.currIndex + 2],
           nextAddress,
           myLocation: tempMyLoc,
           PickUp: false,
           DropOff: false
         });
         //  Alert.alert(''+CurrStatus);
       } else if (this.state.LastStatus.includes("Picked")) {
         var latsLong = [];
         latsLong.push({
           latitude: this.state.region[this.state.currIndex + 1].latitude,
           longitude: this.state.region[this.state.currIndex + 1].longitude
         });
         latsLong.push({
           latitude: this.state.myCoords.latitude,
           longitude: this.state.myCoords.longitude
         });
         nextAddress = this.state.addrOfInterest[this.state.currIndex + 2]
         this.map.fitToCoordinates(latsLong, {
           edgePadding: {
             top: 520,
             right: 520,
             bottom: 520,
             left: 520
           }
         });

         let tempMyLoc = this.state.myLocation;
         tempMyLoc.shift();

         this.setState({
           areaOfInterest: latsLong,
           currIndex: this.state.currIndex + 1,
           nextCoordinates: this.state.region[this.state.currIndex + 1],
           nextAddress,
           myLocation: tempMyLoc
         });
         //  Alert.alert(''+CurrStatus);
       }
       // if(this.state.currIndex+2 != this.state.region.length)
       // {
       //   var latsLong = [];
       //   latsLong.push({latitude: this.state.region[this.state.currIndex+2].latitude,  longitude: this.state.region[this.state.currIndex+2].longitude});
       //   latsLong.push({latitude: this.state.myCoords.latitude,  longitude: this.state.myCoords.longitude});
       //
       //   this.map.fitToCoordinates(latsLong, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
       //   let tempMyLoc = this.state.myLocation;
       //   tempMyLoc.shift();
       //   tempMyLoc.shift();
       //   this.setState({ areaOfInterest : latsLong , currIndex:this.state.currIndex+2, nextCoordinates:this.state.region[this.state.currIndex+2] ,
       //                   myLocation: tempMyLoc  });
       // }
       // else{
       //     this.setState({ completeTrip:!this.state.completeTrip , dialogVisible: !this.state.dialogVisible });
       // }
     }

     contiueToNextWaypoint() {
       if (this.state.currIndex + 1 != this.state.region.length) {

         var latsLong = [];
         let nextAddress='';
         latsLong.push({
           latitude: this.state.region[this.state.currIndex + 1].latitude,
           longitude: this.state.region[this.state.currIndex + 1].longitude
         });
         latsLong.push({
           latitude: this.state.myCoords.latitude,
           longitude: this.state.myCoords.longitude
         });
         nextAddress = this.state.addrOfInterest[this.state.currIndex + 1]

         this.map.fitToCoordinates(latsLong, {
           edgePadding: {
             top: 520,
             right: 520,
             bottom: 520,
             left: 520
           }
         });

         let tempMyLoc = this.state.myLocation;
         tempMyLoc.shift();

         this.setState({
           areaOfInterest: latsLong,
           currIndex: this.state.currIndex + 1,
           nextCoordinates: this.state.region[this.state.currIndex + 1],
           nextAddress,
           myLocation: tempMyLoc
         });
       }
     }

     // this function uses geolib to calculate the distance between the points
     calculateDistance(origLat, origLon, markerLat, markerLon) {
       return geolib.getDistance({
         latitude: origLat,
         longitude: origLon
       }, {
         latitude: markerLat,
         longitude: markerLon
       });
     }


    whenMapReady() {
      this.map.fitToCoordinates(this.state.region, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
    }

    getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
      });
    };

    isInsideAreaOfInterest(){
      // let distance = this.calculateDistance(this.state.nextCoordinates.latitude, this.state.nextCoordinates.longitude,
      //                                       this.state.myCoords.latitude, this.state.myCoords.longitude);
      //                                       //Alert.alert(''+distance);
      // return distance < CircleDistance ? true : false;
      return true;
    }

    CheckAreaOfInterest(){

        if(this.isInsideAreaOfInterest()){
            this.setState({dialogVisible:!this.state.dialogVisible})
        } else {
          let distance = this.calculateDistance(this.state.nextCoordinates.latitude, this.state.nextCoordinates.longitude,
                                                this.state.myCoords.latitude, this.state.myCoords.longitude);
                                            //      Alert.alert('distance ' + distance + ' + CircleDistance '+CircleDistance);
          if(distance > CircleDistance) {
            var dialog = 'You are away from your destination';   Alert.alert('',dialog);
          }
       }
    }

    GetUpdateCancelledRideData(){
      let CloneData = commonData.getCurrentRideData();
      let atIndex = 0;
      for(let i=0 ; i < CloneData.Rides.length ; i++){
        if(CloneData.Rides[i].IsVisible && CloneData.Rides[i].AssignTo === commonData.getUserData().UserId){
          let Status = JSON.stringify(CloneData.Rides[i].Status);

          if(Status.includes("In Progress") || Status.includes("Pending") || Status.includes("Picked") || Status.includes(WAYPOINT_STATUS)) { // this ride is not started
            CloneData.Rides[i].Status = "Cancelled";
            atIndex = i;
            break;
          }
          else if(Status.includes("Completed")){   // this ride pickup and drop off  compeleted

          }
         }
       }
       return CloneData;
    }


    GetLastUnCompletedStatus(){
      let CloneData = commonData.getCurrentRideData();
      let Status="";
      for(let i=0 ; i < CloneData.Rides.length ; i++){
        if(CloneData.Rides[i].IsVisible && CloneData.Rides[i].AssignTo === commonData.getUserData().UserId){
            Status = JSON.stringify(CloneData.Rides[i].Status);

            if(Status.includes("In Progress") || Status.includes("Pending") || Status.includes("Picked") || Status.includes(WAYPOINT_STATUS)) { // this ride is not started
              break;
            }
            else if(Status.includes("Completed")){   // this ride pickup and drop off  compeleted

            }
          }
       }
      // Alert.alert(''+Status);
       return Status;
    }

  changeState(){

      // // if this is the last Dropoff
      // if(this.state.currIndex+1 == this.state.region.length && !this.state.completeTrip )
      // {
      //   this.setState({ loading: true,   alertMessage: "Confirming...", error: "",   url :  URL_MARK_PICKUP,
      //   MyObject : data ,dialogVisible: !this.state.dialogVisible });
      //   //this.setState({ completeTrip:!this.state.completeTrip });
      //   //return;
      // }

      // If the ride is compeleted go back to listing of Jobs
      if(this.state.completeTrip)
      {
        commonData.setCurrentRideData(0);
        let myUtils = new Utils();

        let date = new Date();
        let options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        let dateTimeSplit = date.toLocaleTimeString("en-us", options).split(':');
      //  Alert.alert(myUtils.getTodaysDate() + ' ' +dateTimeSplit.[0] + ':' + dateTimeSplit.[1]);

      LocalNotification.show('Trip Completed', 'Trip has been completed on '+myUtils.getTodaysDate().todayDate + ' ' +dateTimeSplit[0] + ':' + dateTimeSplit[1])
        // const notificationn = new firebase.notifications.Notification()
        //    .android.setChannelId(MyConstants.CHANNEL_ID)
        //    .setNotificationId('3')
        //    .setTitle('Trip Completed')
        //    .setBody('Trip has been completed on '+myUtils.getTodaysDate().todayDate + ' ' +dateTimeSplit[0] + ':' + dateTimeSplit[1])
        //    .android.setSmallIcon('ic_launcher')
        //    .android.setLargeIcon('ic_launcher')
        //    .android.setAutoCancel(true);
        //    //.setData({   key1: 'value1',   key2: 'value2',   });
        //    //  Alert.alert(data.title+' f '+data.body+' '+data.Mouqa);

        //     // Build a channel
        //     const channel = new firebase.notifications.Android
        //     .Channel(MyConstants.CHANNEL_ID, MyConstants.CHANNEL_ID, firebase.notifications.Android.Importance.Max)
        //     .setDescription('Premier Transportation');

        //    // Create the channel
        //    firebase.notifications().android.createChannel(channel);
        //    firebase.notifications().displayNotification(notificationn);
        //   // .catch(err => Alert.alert(''+err));

        this.CloseScreen();
        return;
      }
      let data = commonData.getCurrentRideData();
      console.log(JSON.stringify(data));
      if(this.state.cancelride){
        this.setState({ dialogVisible:!this.state.dialogVisible, cancelride:!this.state.cancelride });
      }
      else if(this.state.PickUp == false && this.isInsideAreaOfInterest()){
        this.setState({ loading: true,   alertMessage: "Confirming...", error: "",   url :  URL_MARK_PICKUP,
        MyObject : data ,dialogVisible: !this.state.dialogVisible });

      }
      // else if(this.state.Waypoint == false && this.isInsideAreaOfInterest() && WayPointAddress !=0 ){
      //   this.setState({ loading: true,   alertMessage: "Confirming...", error: "",   url :  URL_REACHED_WAYPOINT,
      //   MyObject : data ,dialogVisible: !this.state.dialogVisible });
      //
      // }
      else if(this.state.DropOff == false && this.isInsideAreaOfInterest()){
      //  this.contiueToNextWaypoint();
        //this.setState({dialogVisible: !this.state.dialogVisible, DropOff:false , PickUp:false});
        this.setState({ loading: true,   alertMessage: "Confirming...", error: "",   url :  URL_MARK_DROPOFF,
        MyObject : data ,dialogVisible: !this.state.dialogVisible });
      }

  }

  cancelRideClick(){
     this.setState({ cancelride:true , dialogVisible:!this.state.dialogVisible });
  }

  ShowCancelDialog()
  {
    const { textBoldStyle,textNormalStyle,textBigStyle  } = styles;
    var heading = 'CANCEL';
    var heading2 = 'RIDE';
    var description = 'Do you want to cancel your ride?';
    var mOnPress;
    var icon = cancel_ride_icon;
    let CurrStatus = this.GetLastUnCompletedStatus();
     //Alert.alert(this.GetLastUnCompletedStatus()+"  after");
    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7" }}
           visible={this.state.cancelride}
           onTouchOutside={() => this.setState({cancelride: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height:   290  , backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}>
                   <Image source ={icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                   <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                   <Text style={textBoldStyle}> {heading} </Text>
                   <Text style={textBigStyle}> {heading2} </Text>
                   <Text style={{marginTop:3,marginBottom:3}}>  </Text>
                   <Text style={textNormalStyle}> {description} </Text>
                   <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                     <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center', marginTop:60,marginBottom:20 }}
                                       onPress={()=> this.setState({cancelride:false})}>
                         <Image style = {{width: 150,   height: 48} } source={no}  />
                     </TouchableOpacity>

                     <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center', marginTop:60,marginBottom:20 }}
                                       onPress={()=> this.cancelRide(CurrStatus)}>
                         <Image style = {{width: 150,   height: 48} } source={yes}  />
                     </TouchableOpacity>

                   </View>
               </View>
           </View>
       </Dialog>
     );
   }

   cancelRide(value){ // it will hit the service first then this lines will be called

     this.setState({ LastStatus : value, loading: true,   alertMessage: "Confirming...", error: "",   url :  URL_CANCEL_TRIP,
     MyObject : this.GetUpdateCancelledRideData() ,dialogVisible: false,cancelride:false });

   }

   ShowTripCardDetails()
   {
   //  Alert.alert(''+this.state.currIndex);
     const { textBoldStyle,textNormalStyle,textBigStyle,textStyleBold,textStyle  } = styles;
     var buttonWidth = width-width/3-20;
     let CustName = this.state.CustomerNamee;
     return (
       <Dialog
            title=""
            dialogStyle = {{backgroundColor:"#E7E7E7" }}
            visible={this.state.detialsDialog}
            onTouchOutside={() =>  this.setState({detialsDialog: false})}
            positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
            <View style = {{height: 180, backgroundColor:"#E7E7E7" }}>
                <View style={{alignItems:'center' ,flexDirection:'column'}}   >

                <TouchableOpacity style={{flexDirection:'row'}}>
                    <View_PickUp_Drop WaypointTime = {false} DetialType = {0} PickUp_time = {this.state.PickupTime}
                    DropOff_time = { this.state.DropoffTime} />
                    <VerticalLine Waypoint = {false}/>
                    <View style={{alignSelf:'flex-start',flexDirection:'column', flex:0.8}}>
                      <View style={{justifyContent:'flex-start',height:90,padding:2,paddingLeft:15}}>

                        <View style={{flexDirection:'row',marginTop:10}}>
                          <Text style={styles.textStyle}>Trip ID :  </Text>
                          <Text style={styles.textStyle}>{this.state.DisplayId}</Text>
                        </View>

                          <View style={{justifyContent:'flex-start',
                                        height:1,
                                        width:width-width/1.7,
                                        backgroundColor:'#C7C7C7',
                                        marginTop:5,
                                        marginBottom:5}}/>

                        <View style={{flexDirection:'row'}}>
                          <Text style={styles.textStyle}>Date    :   </Text>
                          <Text style={styles.textStyle}>{this.state.TripDate}</Text>
                        </View>

                          <View style={{justifyContent:'flex-start',
                                        height:1,
                                        width:width-width/1.7,
                                        backgroundColor:'#C7C7C7',
                                        marginTop:5,
                                        marginBottom:5}}/>

                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textStyle}>{CustName}</Text>
                            </View>


                      </View>
                    </View>

                </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={()=> this.setState({  detialsDialog:!this.state.detialsDialog })}
                style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                          marginTop:10,marginBottom:20 }}>
                  <Image source={cancel_button} style={{width:buttonWidth,height:60,resizeMode:'contain' }}/>
                </TouchableOpacity>
            </View>
        </Dialog>
      );
    }
///    <View_Trip_Basic thirdValue={""+CustName}  TripID={ this.state.DisplayId} TripType={ "TripType"} Date={ this.state.TripDate}/>
  ShowConfirmDialog()
  {
  //  Alert.alert(''+this.state.currIndex);
    const { textBoldStyle,textNormalStyle,textBigStyle  } = styles;
    var heading = "";
    var heading2 = "";
    var description = "";
    var mOnPress;
    var icon;

    if(this.state.completeTrip){
        heading = 'COMPLETE';
        heading2 = 'TRIP';
        description = 'Trip completed, press ok to continue';
        icon = cancel_ride_icon;
    }
    else if(this.state.cancelride){
        heading = 'CANCEL';
        heading2 = 'RIDE';
        description = 'Do you want to cancel your ride?';
        icon = cancel_ride_icon;
    }
    else if(this.state.PickUp == false){
        heading = 'CONFIRM';
        heading2 = 'PICK UP';
        description = 'Are you sure you want to confirm your pickup?';
        icon = confirm_dropoff_icon;
    }
    // else if(this.state.Waypoint == false){
    //     heading = 'CONFIRM';
    //     heading2 = 'WAYPOINT';
    //     description = 'Are you sure you want to confirm your waypoint?';
    //     icon = confirm_dropoff_icon;
    // }
    else if(this.state.DropOff == false){
        heading = 'CONFIRM';
        heading2 = 'DROP OFF';
        description = 'Are you sure you want to confirm your drop off?';
        icon = confirm_dropoff_icon;
    }


    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7" }}
           visible={this.state.dialogVisible}
           onTouchOutside={() => this.state.completeTrip ? false : this.setState({dialogVisible: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height: this.state.completeTrip ? 290 : 380, backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}>

                   <Image source ={icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                         <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                         <Text style={textBoldStyle}> {heading} </Text>
                         <Text style={textBigStyle}> {heading2} </Text>
                          <Text style={{marginTop:3,marginBottom:3}}>  </Text>

                         { (!this.state.completeTrip ) &&
                           <View style = {{alignItems:'flex-start',padding:10}}>

                            <View style={{  flexDirection:'row'  }}>
                             <Image source = {bullet_rect} style ={{ width:10,height:10,resizeMode:'contain', alignSelf:'center'}}/>
                             <Text style={{fontFamily:'Gotham Medium',fontSize:13}}> Customer Name:    </Text>
                             <Text style={{ fontFamily:'Gotham Book',fontSize:13}}> {this.state.myLocation[0].CustomerName} </Text>
                            </View>

                            <View style={{   flexDirection:'row', marginTop:15 }}>
                             <Image source = {bullet_rect} style ={{ width:10,height:10,resizeMode:'contain', alignSelf:'center'}}/>
                             <Text style={{fontFamily:'Gotham Medium',fontSize:13}}> Customer Number: </Text>
                             <TouchableOpacity style={{  flexDirection:'row' , justifyContent:'center' }}
                                               onPress = {()=> Linking.openURL(`tel:${this.state.myLocation[0].CustomerContactNo}`)}>

                               <Text style={{ marginTop: 4,fontFamily:'Gotham Book',fontSize:13}}> {this.state.myLocation[0].CustomerContactNo} </Text>
                               <Image source = {phone_icon} style ={{ marginTop:-4,width:27,height:27,resizeMode:'contain',alignSelf:'center' }}/>

                             </TouchableOpacity>
                             </View>
                           </View>
                         }
                           <Text style={{marginTop:3,marginBottom:3}}>  </Text>

                         <Text style={textNormalStyle}> {description} </Text>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                         { (!this.state.completeTrip ) &&
                           <View style={{flexDirection:'row' }}>
                             <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                       marginTop:60,marginBottom:20 }} onPress={()=> this.setState({dialogVisible:!this.state.dialogVisible})}>
                                 <Image style = {{width: 150,   height: 48 } } source={ !this.state.PickUp ? cancel_button_small : no}  />
                             </TouchableOpacity>

                             <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                       marginTop:60,marginBottom:20 }} onPress={()=> this.changeState()}>
                                 <Image style = {{width: 150,   height: 48 } } source={yes}  />
                             </TouchableOpacity>
                          </View>
                        }

                        { (this.state.completeTrip ) &&

                          <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                    marginTop:60,marginBottom:20 }} onPress={()=>  this.changeState()}>
                              <Image style = {{width: 150,   height: 48 } } source={ ok}  />
                          </TouchableOpacity>

                        }

                  </View>
               </View>
           </View>
       </Dialog>
     );
   }
}

//onPress={()=> !this.state.PickUp ? this.cancelRideClick() : this.setState({dialogVisible:!this.state.dialogVisible})}>

MapScreen.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  callout: {
    width: 60,
  },
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  event: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  eventData: {
    fontSize: 10,
    fontFamily: 'courier',
    color: '#555',
  },
  eventName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  eventList: {
    position: 'absolute',
    top: height / 2,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    width,
    height:height - (height/100 * 8)
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  textBoldStyle:{
    fontSize:26, fontFamily: 'Gotham Bold', color: '#393939'
  },
  textBigStyle:{
    fontSize:23, color: '#393939', marginTop:-4 , fontFamily: 'Gotham Book',
  },
  textNormalStyle:{
    fontSize:15,  color: '#393939',textAlign: 'center',  marginBottom:20, fontStyle:'italic',fontFamily: 'Gotham Book',
  },
  textStyleBold: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    width:90,
    color: '#8A8A8A',
    fontWeight:'bold',
    fontSize:16
  },
  textStyle: {
    textAlign: 'left',
    marginBottom:5,
    marginTop:5,
    color: '#8A8A8A',
    fontSize:16
  }
});

export default MapScreen ;
