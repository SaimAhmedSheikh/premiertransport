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

let URL_MARK_PICKUP  =  MyConstants.BASE_URL + "Trip/PickupRide";
let URL_MARK_DROPOFF  =  MyConstants.BASE_URL + "Trip/DropoffRide";
import colors from '../Components/colors';
import * as MyConstants from '../Components/Constants';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';

// eslint-disable-next-line max-len
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, Polygon, Polyline, Callout  } from 'react-native-maps';
import { Header } from '../Components';
import colors from '../Components/colors';
const arrived_button =  require('../images/arrived_button.png');
const cancel_button =  require('../images/cancel_button_big.png');
const confirm_dropoff_icon =  require('../images/confirm_dropoff_icon.png');
//import MapViewDirections from 'react-native-maps-directions';
const { width, height } = Dimensions.get('window');
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');
const ok =  require('../images/ok_button.png');
const cancel_button_small =  require('../images/cancel_button.png');
const phone_icon =  require('../images/phone_icon.png');
const bullet_rect =  require('../images/bullet_rect.png');
const cancel_ride_icon =  require('../images/cancel_ride_icon.png');
const pin_icon =  require('../images/pin_icon.png');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;
const CircleDistance = 350;
import CommonDataManager from '../Components/CommonDataManager';
let commonData;
// class Event extends React.Component {
//   shouldComponentUpdate(nextProps) {
//     return this.props.event.id !== nextProps.event.id;
//   }
//
//   render() {
//     const { event } = this.props;
//     return (
//       <View style={styles.event}>
//         <Text style={styles.eventName}>{event.name}</Text>
//         <Text style={styles.eventData}>{JSON.stringify(event.data, null, 2)}</Text>
//       </View>
//     );
//   }
// }
//
// Event.propTypes = { event: PropTypes.object };


// eslint-disable-next-line react/no-multi-comp
class MapScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible: false,
      PickUp:false,
      DropOff:false,
      completeTrip:false,
      cancelride:false,
      locationAllow:false,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      region:
      [
        { latitude: 24.878541,  longitude: 67.064123 },
        { latitude: 24.894103,  longitude: 67.064257 },
        // { latitude: 24.903943,  longitude: 67.077142 },
        // { latitude: 24.908373,  longitude: 67.083025 },
        // { latitude: 24.912079,  longitude: 67.083287 },
        // { latitude: 24.917890,  longitude: 67.086389 }
      ],

        myLocation: [
        {
          title: 'Office',
          coordinates: { latitude: 24.878541,  longitude: 67.064123 }},
        {
          title: 'Askari Park',
          coordinates: { latitude: 24.894103,  longitude: 67.064257 }},
        // {
        //   title: 'Subway',
        //   coordinates: { latitude: 24.903943,  longitude: 67.077142 }},
        // {
        //   title: 'Al Mustafa Hospital',
        //   coordinates: { latitude: 24.908373,  longitude: 67.083025 }},
        // {
        //   title: 'Alex Parker',
        //   coordinates: { latitude: 24.912079,  longitude: 67.083287 }},
        // {
        //   title: 'Home',
        //   coordinates: { latitude: 24.917890,  longitude: 67.086389 }},
      ],
        nextCoordinates :   { latitude: 24 ,  longitude: 67 },

        myCoords :   { latitude: 0 ,  longitude: 0 },

        areaOfInterest : [] ,
        currIndex:0
    };
  }

  populateCoordiantes() {
     let tempArrCoor = new Array();
     let tempArrLocation = new Array();

    // var tempArr = new Array();
     for(let i=0 ; i < commonData.getCurrentRideData().Rides.length ; i++){

         let PickUpAddress = commonData.getCurrentRideData().Rides[i].PickupAddress;
         let PickUpTime = commonData.getCurrentRideData().Rides[i].PickupTime;
         let PU_CoorLat = commonData.getCurrentRideData().Rides[i].PickupLocation.Latitude;
         let PU_CoorLng = commonData.getCurrentRideData().Rides[i].PickupLocation.Longitude;

         let DropOffAddress = commonData.getCurrentRideData().Rides[i].DropoffAddress;
         let DropOffTime = commonData.getCurrentRideData().Rides[i].DropoffTime;
         let DO_CoorLat = commonData.getCurrentRideData().Rides[i].DropoffLocation.Latitude;
         let DO_CoorLng = commonData.getCurrentRideData().Rides[i].DropoffLocation.Longitude;

         tempArrCoor.push({latitude:PU_CoorLat,longitude:PU_CoorLng});
         tempArrCoor.push({latitude:DO_CoorLat,longitude:DO_CoorLng});

         tempArrLocation.push({
          isPickUp : true, PickUpTime:PickUpTime,PickUpAddress:PickUpAddress, PickUpCoordinates : {latitude:PU_CoorLat,longitude:PU_CoorLng},
         });

         tempArrLocation.push({
          isPickUp : false, DropOffTime:DropOffTime,DropOffAddress:DropOffAddress, DropOffCoordinates : {latitude:DO_CoorLat,longitude:DO_CoorLng}
         })
        // tempArrLocation.push({ });
     }
    // this.setState({region: tempArrCoor});

     this.setState({region: tempArrCoor, nextCoordinates:tempArrCoor[0] , areaOfInterest : tempArrCoor , myLocation : tempArrLocation })
  }

  componentWillMount(){
      commonData = CommonDataManager.getInstance();

      //Alert.alert(''+commonData.getCurrentRideData().Rides.length);
      this.populateCoordiantes();
  }

  async componentDidMount(){
    let ask = new AskPermission();
    ask.requestLocationPermission();
  }

  _gotoCurrentLocation = () => {
     // const { myLocation, region } = this.state;
     // this.map.animateToRegion({
     //   latitude: myLocation.latitude,
     //   longitude: myLocation.longitude,
     //   latitudeDelta: region.latitudeDelta,
     //   longitudeDelta: region.longitudeDelta
     // });
   }

   _setMyLocation = event => {
     // const myLocation = event.nativeEvent.coordinate;

     // this.setState({ myLocation });
     //
     // this._gotoCurrentLocation();

     // new code for map location Jamil
     return this.getCurrentLocation().then(position => {
           if (position) {
             var myCurPos_Lat = position.coords.latitude;
             var myCurPos_Long = position.coords.longitude;
             //var oldLats;
             // if(this.state.region.length == 3)
             // {
             //    oldLats.push({latitude: position.coords.latitude,  longitude: position.coords.longitude});
             // } else {
             //   oldLats = this.state.region.slice(0,this.state.region.length-1);
             //   oldLats.push({latitude: position.coords.latitude,  longitude: position.coords.longitude});
             // }

              // Alert.alert(position.coords.latitude+' - '+position.coords.longitude);
              // if(this.state.myCoords.latitude != 0 && this.state.myCoords.longitude !=0)
              // {
              // if(this.state.myCoords.latitude != 0 && this.state.myCoords.longitude !=0){
              //     this.setState({  myCoords: {latitude: myCurPos_Lat,  longitude: myCurPos_Long}  });
              // }
              // else if(this.state.myCoords.latitude != myCurPos_Lat && this.state.myCoords.longitude != myCurPos_Long )
              // {
              //  Alert.alert('asdff');

              if(this.state.myCoords.latitude == 0 && this.state.myCoords.longitude ==0){
                 this.setState({  myCoords: {latitude: myCurPos_Lat,  longitude: myCurPos_Long}  });
                 this.map.fitToCoordinates(this.state.region, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
                 return;
              }
            //  Alert.alert(''+(this.state.myCoords.latitude  != myCurPos_Lat));
              if(this.state.myCoords.latitude != myCurPos_Lat || this.state.myCoords.longitude != myCurPos_Long )
              {
                ///let distance = this.calculateDistance(myCurPos_Lat, myCurPos_Long,this.state.nextCoordinates.latitude, this.state.nextCoordinates.longitude);
                //
                // if(distance <= CircleDistance){
                //   //Alert.alert(''+distance);
                //   //this.contiueToNextWaypoint();
                // }

                var latsLong = [];
                latsLong.push({latitude: this.state.nextCoordinates.latitude,  longitude: this.state.nextCoordinates.longitude});
                latsLong.push({latitude: myCurPos_Lat,  longitude: myCurPos_Long});
                //  latsLong.push({latitude: this.state.nextCoordinates.latitude,  longitude: this.state.nextCoordinates.longitude});
                this.map.fitToCoordinates(latsLong, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});

                this.setState({ areaOfInterest : latsLong,  myCoords: {latitude: myCurPos_Lat,  longitude: myCurPos_Long}  });
              }
            //  }
            }
          // }
         });
     };

     continueToNextRide(){
       if(this.state.currIndex+2 != this.state.region.length)
       {
         var latsLong = [];
         latsLong.push({latitude: this.state.region[this.state.currIndex+2].latitude,  longitude: this.state.region[this.state.currIndex+2].longitude});
         latsLong.push({latitude: this.state.myCoords.latitude,  longitude: this.state.myCoords.longitude});

         this.map.fitToCoordinates(latsLong, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});
         let tempMyLoc = this.state.myLocation;
         tempMyLoc.shift();
         tempMyLoc.shift();
         this.setState({ areaOfInterest : latsLong , currIndex:this.state.currIndex+2, nextCoordinates:this.state.region[this.state.currIndex+2] ,
                         myLocation: tempMyLoc  });
       }
       else{
           this.setState({ completeTrip:!this.state.completeTrip , dialogVisible: !this.state.dialogVisible });
       }
     }

     contiueToNextWaypoint(){
       if(this.state.currIndex+1 != this.state.region.length)
       {

         var latsLong = [];
         latsLong.push({latitude: this.state.region[this.state.currIndex+1].latitude,  longitude: this.state.region[this.state.currIndex+1].longitude});
         latsLong.push({latitude: this.state.myCoords.latitude,  longitude: this.state.myCoords.longitude});
         this.map.fitToCoordinates(latsLong, { edgePadding: { top: 520, right: 520, bottom: 520, left: 520 }});

         let tempMyLoc = this.state.myLocation;
         tempMyLoc.shift();
         this.setState({ areaOfInterest : latsLong , currIndex:this.state.currIndex+1, nextCoordinates:this.state.region[this.state.currIndex+1] ,
                         myLocation: tempMyLoc  });
       }
     }

       // this function uses geolib to calculate the distance between the points
      calculateDistance(origLat, origLon, markerLat, markerLon) {
        return geolib.getDistance(
          {latitude: origLat, longitude: origLon},
          {latitude: markerLat, longitude: markerLon}
        );
      }


  // makeEvent(e, name) {
  //   return {
  //     id: id++,
  //     name,
  //     data: e.nativeEvent ? e.nativeEvent : e,
  //   };
  // }

  // recordEvent(name) {
  //   return e => {
  //     if (e.persist) {
  //       e.persist();  // Avoids warnings relating to https://fb.me/react-event-pooling
  //     }
  //     this.setState(prevState => ({
  //       events: [
  //         this.makeEvent(e, name),
  //         ...prevState.events.slice(0, 10),
  //       ],
  //     }));
  //   };
  // }


  // this.map.animateToRegion(
  //         {
  //           latitude: this.state.region.latitude , longitude:this.state.region.longitude,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         },
  //         350
  //       );

  whenMapReady(){
  //   this.map.fitToCoordinates(this.state.region, { edgePadding: { top: 220, right: 220, bottom: 220, left: 220 }})
  //   this.map.fitToCoordinates([{latitude:position.coords.latitude,longitude:position.coords.longitude}], { edgePadding: { top: 120, right: 120, bottom: 120, left: 120 }})

  }

  // componentDidMount(){
  //   return this.getCurrentLocation().then(position => {
  //         if (position) {
  //           this.setState({
  //             region: [{
  //               latitude: position.coords.latitude,
  //               longitude: position.coords.longitude,
  //             }],
  //           });
  //         }
  //       });
  // }

  getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    });
  };

  render() {
    var buttonWidth = width-width/3-20;

    // Alert.alert(''+this.props.navigation.getParam('Data').PickUp_time);
    // Events that are dependent on
    // let googleProviderProps = {};
    // if (this.props.provider === PROVIDER_GOOGLE) {
    //   googleProviderProps = {
    //     onUserLocationChange: this.recordEvent('Map::onUserLocationChange'),
    //   };
    // }
    // onRegionChangeComplete={region => this.setState({ region })} //Royal Palace St.506

    return (
      <View style={styles.container}>
        <Header onBackPress={()=>this.props.navigation.pop()} headerText = {'Trip'} headerColor={colors.HeaderColor} showSettings={false} showBack={true}/>

        <MapView style={styles.map} onUserLocationChange={this._setMyLocation}

         ref={ref => (this.map = ref)} showsUserLocation={true} loadingEnabled = {true}
         showsMyLocationButton = {true} tracksViewChanges={true} followsUserLocation={true}
         onMapReady={()=>this.whenMapReady()} >
         {this.state.myLocation.map(marker => (
           <View>
             {marker.isPickUp &&
             <MapView.Marker coordinate={marker.PickUpCoordinates}   >
               <Image source={pin_icon} style={{width:27,height:27,resizeMode:'contain'}}/>
               <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:55}}>

                 <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                 paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.PickUpAddress}</Text>
                    <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.PickUpTime} Pickup</Text>
                 </View>
               </Callout>
             </MapView.Marker>
             }

             {!marker.isPickUp &&
             <MapView.Marker coordinate={marker.DropOffCoordinates}   >
               <Image source={pin_icon} style={{width:27,height:27,resizeMode:'contain'}}/>
               <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:55}}>

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
         <Polyline
            coordinates={this.state.areaOfInterest }
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[	'#7F0000']}
            strokeWidth={2}
          />
         </MapView>

          <TouchableOpacity onPress={()=> this.CheckAreaOfInterest()}
                            style={{width:buttonWidth-10,height:60,position:'absolute',top:'79%',bottom:0,left:width-width/100*80,right:'50%'}}>
            <Image source={arrived_button} style={{width:buttonWidth,height:60,resizeMode:'contain'}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.cancelride()}
                            style={{width:buttonWidth,height:60,position:'absolute', top:'87%',bottom:0,left:width-width/100*80,right:'50%'}}>
            <Image source={cancel_button} style={{width:buttonWidth,height:60,resizeMode:'contain' }}/>
          </TouchableOpacity>
      {this.state.dialogVisible && this.ShowConfirmDialog()}
      {this.state.cancelride && this.ShowCancelDialog()}
      </View>
    );
  }

  isInsideAreaOfInterest(){
    let distance = this.calculateDistance(this.state.nextCoordinates.latitude, this.state.nextCoordinates.longitude,
                                          this.state.myCoords.latitude, this.state.myCoords.longitude);
                                          //Alert.alert(''+distance);
    return distance < CircleDistance ? true : false;
  }


  CheckAreaOfInterest(){

      if(this.isInsideAreaOfInterest()){
          this.setState({dialogVisible:!this.state.dialogVisible})
      } else {
        let distance = this.calculateDistance(this.state.nextCoordinates.latitude, this.state.nextCoordinates.longitude,
                                            this.state.myCoords.latitude, this.state.myCoords.longitude);

        var dialog = '';

        if(distance > CircleDistance) {
          dialog = 'You are away from your destination';
          Alert.alert('',dialog);
        }
        else {
          //dialog = 'You are '+distance+' meters away from your destination';
        }

      }
  }

  cancelride(){
     this.setState({  cancelride:true });
     //this.setState({dialogVisible:!this.state.dialogVisible})
  }

  changeState(){

      // if this is the last Dropoff
      if(this.state.currIndex+1 == this.state.region.length && !this.state.completeTrip )
      {
        this.setState({ completeTrip:!this.state.completeTrip });
        return;
      }

      // If the ride is compeleted go back to navigation
      if(this.state.completeTrip)
      {
         this.props.navigation.pop();
         return;
      }


      if(this.state.cancelride){
        this.setState({ dialogVisible:!this.state.dialogVisible, cancelride:!this.state.cancelride });
      }
      else if(this.state.PickUp == false && this.isInsideAreaOfInterest()){
        this.contiueToNextWaypoint();
        this.setState({dialogVisible: !this.state.dialogVisible, PickUp:!this.state.PickUp });
      }
      else if(this.state.DropOff == false && this.isInsideAreaOfInterest()){
        this.contiueToNextWaypoint();
        this.setState({dialogVisible: !this.state.dialogVisible, DropOff:false , PickUp:false});
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
                                       onPress={()=> this.cancelRide()}>
                         <Image style = {{width: 150,   height: 48} } source={yes}  />
                     </TouchableOpacity>

                   </View>
               </View>
           </View>
       </Dialog>
     );
   }

   cancelRide(){
     this.state.completeTrip ? this.props.navigation.pop() : this.setState({cancelride:false});
     this.continueToNextRide();
   }

  ShowConfirmDialog()
  {
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
           <View style = {{ height: this.state.completeTrip ? 290 : 350, backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}}   >

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
                             <Text style={{ fontFamily:'Gotham Book',fontSize:13}}> Peter Waltsort </Text>
                            </View>

                            <View style={{   flexDirection:'row', marginTop:10 }}>
                             <Image source = {bullet_rect} style ={{ width:10,height:10,resizeMode:'contain', alignSelf:'center'}}/>
                             <Text style={{fontFamily:'Gotham Medium',fontSize:13}}> Customer Number: </Text>
                               <View style={{  flexDirection:'row' , justifyContent:'center' }}>
                                 <Text style={{ fontFamily:'Gotham Book',fontSize:13}}> 1 555 980 1062 </Text>
                                 <Image source = {phone_icon} style ={{ marginTop:-4,width:23,height:23,resizeMode:'contain',alignSelf:'center' }}/>
                               </View>
                             </View>
                           </View>
                         }
                           <Text style={{marginTop:3,marginBottom:3}}>  </Text>

                         <Text style={textNormalStyle}> {description} </Text>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                         { (!this.state.completeTrip ) &&
                           <View style={{flexDirection:'row' }}>
                             <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                       marginTop:60,marginBottom:20 }} onPress={()=> !this.state.PickUp ? this.cancelRideClick() : this.setState({dialogVisible:!this.state.dialogVisible})}>
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
                                                    marginTop:60,marginBottom:20 }} onPress={()=>  this.props.navigation.pop()}>
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
  }
});

export default MapScreen ;
