
import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Dimensions, Alert,TouchableOpacity, Animated, PermissionsAndroid} from 'react-native';
var {height, width} = Dimensions.get('window');
import { View_PickUp_Drop, VerticalLine, View_Trip_Basic,
          View_Trip_Detail, View_Trip_Detail_Strip,
          View_Trip_Detail_Ride_Fare, Button } from '../Components';
import {Linking} from 'react-native'

import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, Polygon, Polyline, Callout } from 'react-native-maps';
import { Dialog } from 'react-native-simple-dialogs';
const yes =  require('../images/yes_button.png');
const no =  require('../images/no_button.png');
const ShowMap =  require('../images/show_map_button.png');
const StartRide =  require('../images/start_ride_button.png');
const CrossIcon =  require('../images/cross_icon.png');
const phone_icon =  require('../images/phone_icon.png');
const bullet_rect =  require('../images/bullet_rect.png');
const left_arrow =  require('../images/left_arrow.png');
const right_arrow =  require('../images/right_arrow.png');
const pin_icon_start = require('../images/pin_icon2.png');
const pin_icon =  require('../images/pin_icon.png');
const pin_icon_dropoff = require('../images/pin_icon3.png');
const cancel_ride_icon =  require('../images/cancel_ride_icon.png');
import * as MyConstants from '../Components/Constants';
//let URL_START_TRIP  =  MyConstants.BASE_URL + "Trip/StartRide";
let URL_START_TRIP  =  MyConstants.BASE_URL + "Trip/StartRide";
//let URL_START_TRIP  =  MyConstants.BASE_URL + "Trip/StartTrip";
let URL_GET_STATUS  =  MyConstants.BASE_URL + "User/GetUpdatedStatus";
let URL_CANCEL_TRIP  =  MyConstants.BASE_URL_CANCEL_TRIP;
import colors from '../Components/colors';
import WebService from '../API/WebService';
import BackgroundTimer from 'react-native-background-timer';
import CommonDataManager from '../Components/CommonDataManager';
let commonData;

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0422;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let calloutHeight=120;
// 0 = CheckOut
// 1 = CheckIn
// 2 = BreakIn
// 3 = BreakOut

class SingleCard extends Component {

  constructor(props){
    super(props);
    this.state = { detail: 0 , SelRideIndex: 0,
      alertType: null,
      alertMessage: "",
      error: "",
      loading: false,
      url : "",
      MyObject: "",
      startRide: false,
      rejectRide: false,
      region: [
        { latitude: 42.652580,  longitude: -73.756233},
        { latitude: 42.662580,  longitude: -73.746233},
        { latitude: 42.677220,  longitude: -73.734200}],
    }

  }

  componentWillMount(){
    let selectedIndex = 0;
    commonData = CommonDataManager.getInstance();
    var tempArr = new Array();
    for(let i=0 ; i < this.props.Data.Rides.length ; i++){
        console.log('is visible out: '+this.props.Data.Rides[i].Status);
          console.log('is visible out1=== '+this.props.Data.Rides[i].Status === "Pending");
              console.log('is visible out includes '+this.props.Data.Rides[i].Status.includes("Pending"));
      if(this.props.Data.Rides[i].IsVisible && this.props.Data.Rides[i].AssignTo === commonData.getUserData().UserId
          && this.props.Data.Rides[i].Status.includes("Pending")){
        selectedIndex = i;
        console.log('is visible'+(this.props.Data.Rides[i].IsVisible && this.props.Data.Rides[i].AssignTo === commonData.getUserData().UserId && this.props.Data.Rides[i].Status === 'Pending'));
        tempArr.push({latitude:this.props.Data.Rides[i].PickupLocation.Latitude,longitude:this.props.Data.Rides[i].PickupLocation.Longitude});
        // if("WaypointAddress" in this.props.Data.Rides[i]){
        //   if(this.props.Data.Rides[i].WaypointLocation.Latitude !=0 && this.props.Data.Rides[i].WaypointLocation.Longitude !=0){
        //     tempArr.push({latitude:this.props.Data.Rides[i].WaypointLocation.Latitude,longitude:this.props.Data.Rides[i].WaypointLocation.Longitude});
        //   }
        // }
        tempArr.push({latitude:this.props.Data.Rides[i].DropoffLocation.Latitude,longitude:this.props.Data.Rides[i].DropoffLocation.Longitude});
        break;
      }
      else if(this.props.Data.Rides[i].IsVisible
                && this.props.Data.Rides[i].AssignTo === commonData.getUserData().UserId
                && !this.props.Data.Rides[i].Status.includes("Pending")){
                //  Alert.alert('length: '+this.props.Data.Rides.length);
                 commonData.setCurrentRideData(this.props.Data);
                 this.props.onPress();
          break;
      }
    }
    this.setState({region: tempArr ,SelRideIndex: selectedIndex});
  }

  IncreaseIndex(){
    let Size = this.props.Data.Rides.length;
    if(this.state.SelRideIndex+1 < Size){
        this.setState({SelRideIndex:this.state.SelRideIndex+1});
    }
  }

  DecreaseIndex(){
    if(this.state.SelRideIndex > 0){
        this.setState({SelRideIndex:this.state.SelRideIndex-1});
    }
  }

  render() {
    const arrowsize = 17;
    let HasWaypoint = false;
    // if(("WaypointAddress") in this.props.Data.Rides[this.state.SelRideIndex]){
    //   if((this.props.Data.Rides[this.state.SelRideIndex].WaypointAddress === "")){
    //     //HasWaypoint = false;
    //   }
    //   else{
    //     HasWaypoint = true;
    //   }
    // }

  //    Alert.alert(''+HasWaypoint);
    return (
      <View style={styles.container}>
       { this.state.detail == 10 &&
         <View style={{flexDirection:'row' }}>
         <TouchableOpacity style={{ marginTop:3}} onPress={()=> this.DecreaseIndex()}>
           <Image source = {left_arrow} style ={{marginRight:8, width:arrowsize,height:arrowsize,resizeMode:'contain', alignSelf:'center'}}/>
         </TouchableOpacity >
           <Text style={{fontSize:18,alignSelf:'center',fontFamily:'Gotham Book',color:'#ffffff'}}>{this.state.SelRideIndex+1} of {this.props.Data.Rides.length}</Text>
          <TouchableOpacity style={{ marginTop:3}} onPress={()=> this.IncreaseIndex()}>
           <Image source = {right_arrow} style ={{marginLeft:8, width:arrowsize,height:arrowsize,resizeMode:'contain', alignSelf:'center'}}/>
         </TouchableOpacity>
         </View>
       }
        <View style={styles.backCorner} >

        { this.state.detail == 0 &&

          <TouchableOpacity style={{padding:10,flexDirection:'row',padding:10}} onPress={()=>this.setState({detail:1})}>
              <View_PickUp_Drop WaypointTime = {false} DetialType = {0} PickUp_time = {this.props.Data.Rides[this.state.SelRideIndex].PickupTime}
              DropOff_time = {this.props.Data.Rides[this.state.SelRideIndex].DropoffTime} />
              <VerticalLine Waypoint = {false}/>
              <View_Trip_Basic thirdValue={"Details..."}  TripID={this.props.Data.DisplayId} TripType={this.props.Data.TripType} Date={this.props.Data.TripDate}/>
          </TouchableOpacity>

        }

        { this.state.detail == 1 &&
          <View style={{height: this.state.detail == 2 ? 560 : (HasWaypoint ? 465 : 415)}}>


              <View style={{ flexDirection:'row',paddingTop:10,paddingLeft:10,paddingRight:10}} >
                  <View_PickUp_Drop
                  WaypointTime = {HasWaypoint ? this.props.Data.Rides[this.state.SelRideIndex].WaypointTime : false}
                  DetialType = {1} State={this.state.detail} PickUp_time = {this.props.Data.Rides[this.state.SelRideIndex].PickupTime}
                                                              DropOff_time = {this.props.Data.Rides[this.state.SelRideIndex].DropoffTime} />

                  <VerticalLine Waypoint = {HasWaypoint ? true: false}/>
                  <View_Trip_Detail StartAddress = {this.props.Data.Rides[this.state.SelRideIndex].PickupAddress}
                    WayPointAddress = {HasWaypoint ? this.props.Data.Rides[this.state.SelRideIndex].WaypointAddress : false}
                    EndAddress = {this.props.Data.Rides[this.state.SelRideIndex].DropoffAddress} />

              </View>

              <View style={{flexDirection:'row'}}>
                <View_Trip_Detail_Strip  TripID={this.props.Data.DisplayId} TripType={this.props.Data.TripType} Date={this.props.Data.TripDate}/>
              </View>

              <View style = {{ flexDirection:'column',height:80 , alignItems:'center'}}>
                <View style={styles.horizontalLine3}/>
                <View style = {{alignItems:'flex-start',padding:10}}>

                 <View style={{ justifyContent:'center', flexDirection:'row'  }}>
                  <Image source = {bullet_rect} style ={{ width:10,height:10,resizeMode:'contain', alignSelf:'center'}}/>
                  <Text style={{ width:155,fontFamily:'Gotham Medium',fontSize:13}}> Customer Name: </Text>
                  <Text style={{ fontFamily:'Gotham Book',fontSize:13}}> {this.props.Data.CustomerName} </Text>
                 </View>

                 <View style={{ justifyContent:'center', flexDirection:'row', marginTop:10 }}>
                  <Image source = {bullet_rect} style ={{ width:10,height:10,resizeMode:'contain', alignSelf:'center'}}/>
                  <Text style={{ marginTop: 4, width:155,fontFamily:'Gotham Medium',fontSize:13}}> Customer Number: </Text>
                  <TouchableOpacity style={{  flexDirection:'row' , justifyContent:'center' }}
                                    onPress = {()=> Linking.openURL(`tel:${this.props.Data.CustomerContactNo}`)}>

                    <Text style={{ marginTop: 4,fontFamily:'Gotham Book',fontSize:13}}> {this.props.Data.CustomerContactNo} </Text>
                    <Image source = {phone_icon} style ={{ marginTop:-4,width:27,height:27,resizeMode:'contain',alignSelf:'center' }}/>

                  </TouchableOpacity>
                 </View>
                </View>
              </View>

              <View style={{marginTop:10,backgroundColor:'#BFBFBF',flex:1, borderBottomLeftRadius: 14 , borderBottomRightRadius:  14 }}>


                <View_Trip_Detail_Ride_Fare State={this.state.detail} Duration={this.props.Data.Rides[this.state.SelRideIndex].Duration}
                                            Fare={this.props.Data.Rides[this.state.SelRideIndex].Fare}
                                            onPress={()=>this.setState({detail:0})} onCancelRideDialog={()=>this.ShowRejectDialogPopUp()}/>
                <View style={{marginTop:-20,width:330, alignSelf:'center',flexDirection:'row', justifyContent:'space-around' }}>

                  <TouchableOpacity  onPress={()=>this.setState({detail:2})} style={{marginTop:20}}>
                    <Image source ={ShowMap} style={{ width:width-width/2 - 50,height:50,resizeMode:'contain'}}   />
                  </TouchableOpacity>

                  <TouchableOpacity  onPress={()=> this.isCheckedInBreakedOut()} style={{marginTop:20}} >
                    <Image source ={StartRide} style={{ width:width-width/2 - 50,height:50,resizeMode:'contain'}}  />
                  </TouchableOpacity>

                </View>
             </View>
          </View>
        }

        { this.state.detail == 2 &&
          <View style={{height:360,paddingBottom:10,backgroundColor:'#E7E7E7',flex:1, borderBottomLeftRadius: 14, borderBottomRightRadius: 14}}>

            <View style={{flex:1,height:280}}>
              <MapView style={{flex:1, height:260,marginBottom:20}} onUserLocationChange={this._setMyLocation}
                tracksViewChanges={false}
               ref={ref => (this.map = ref)} showsUserLocation={false} loadingEnabled = {true}
               showsMyLocationButton = {false} followsUserLocation={false} onMapReady={()=>this.whenMapReady()} >
                 {this.props.Data.Rides.map(marker => (

                   <View>
                   { marker.IsVisible &&
                     <MapView.Marker coordinate={{latitude:marker.PickupLocation.Latitude,longitude:marker.PickupLocation.Longitude}}   >
                       <Image source={pin_icon_start} style={{width:27,height:27,resizeMode:'contain'}}/>
                       <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>

                         <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                         paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                            <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.PickupAddress}</Text>
                            <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.PickupTime} Pickup</Text>
                         </View>
                       </Callout>
                     </MapView.Marker> }


                    { marker.IsVisible &&
                     <MapView.Marker coordinate={{latitude:marker.DropoffLocation.Latitude,longitude:marker.DropoffLocation.Longitude}}   >
                       <Image source={pin_icon_dropoff} style={{width:27,height:27,resizeMode:'contain'}}/>
                       <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>

                         <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
                         paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
                            <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.DropoffAddress}</Text>
                            <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.DropoffTime} Drop off</Text>
                         </View>
                       </Callout>
                     </MapView.Marker>
                   }
                     </View>
                   ))}
                   <Polyline coordinates={this.state.region } strokeColor={colors.gold} strokeWidth={2} fillColor="#0f0"/>
                    <View style={{flexDirection:'column'}}>

                    </View>
               </MapView>

             <TouchableOpacity onPress={()=>this.setState({detail:1})} style={{marginTop:16,marginLeft:30,marginRight:15,
                               width:28,height:28, position: 'absolute',   top: '1%', left:'80%',   alignSelf: 'flex-end'}}>

                   <Image source ={CrossIcon} style={{ width:27,height:27,resizeMode:'contain' }}  />

             </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={()=> this.isCheckedInBreakedOut()} style={{  height:40, alignSelf: 'center', marginLeft: 1,
              marginRight: 1,  paddingLeft:30,  paddingRight:30}} >
              <Image source ={StartRide} style={{ width:150,height:40,resizeMode:'contain' }}  />
            </TouchableOpacity>


          </View>
        }
        </View>
        { this.state.startRide && this.ShowConfirmDialog()}
        { this.state.rejectRide && this.ShowRejectDialog()}
        { this.state.loading && <WebService
           navigation={this.props.navigation}
           dialogVisible = {true}
           isGet = {this.state.url === URL_GET_STATUS ? true : false}
           MyMsg = {this.state.alertMessage}
           onPostMethod = {() => this.onPostMethod() }
           onTimeOutt = {()=> this.onTimeOutt() }
           onInternetNotConnected = {()=> this.onInternetNotConnected() }
           URL= {this.state.url}
           includeToken = { true }
           SuccessMsg = { this.state.url === URL_CANCEL_TRIP ? true : false }
           MyObject = {this.state.MyObject }/> }
      </View>
    );
  }
 //  { (("WaypointAddress") in marker) &&
 //  <MapView.Marker coordinate={{latitude:marker.WaypointLocation.Latitude,longitude:marker.WaypointLocation.Longitude}}   >
 //    <Image source={pin_icon} style={{width:27,height:27,resizeMode:'contain'}}/>
 //    <Callout tooltip={true}  style={{alignSelf:'center',alignItems:'center',width:300,height:calloutHeight}}>
 //
 //      <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:15,paddingRight:15,paddingTop:8,
 //      paddingBottom:5,backgroundColor:'#ffffff',borderRadius:80,borderWidth:1,borderColor:'#a3a3a3'}}>
 //         <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Bold',color:'#000000'}}> {marker.WaypointAddress}</Text>
 //         <Text style={{marginLeft:10,marginRight:10,fontSize:14,fontFamily:'Gotham Book',color:'#000000'}}> {marker.WaypointTime} Waypoint</Text>
 //      </View>
 //    </Callout>
 //  </MapView.Marker>
 // }
  onTimeOutt () {
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.setState({loading:false,startRide:false,rejectRide:false});
    }, 2000);
  }

 onInternetNotConnected(){
   this.setState({loading: false,startRide:false,rejectRide:false});
 }

 onPostMethod = () => {
    //  this.setState({loading: false});
    //  Alert.alert(''+commonData.getUserData().UserId);
    let Response =  commonData.getTempData();
    //Alert.alert(''+Response.Status);
    console.log(JSON.stringify(Response));
    if(Response !== 0){
    //  Alert.alert(''+JSON.stringify(Repsonse));
      if(Response.Code === '200'){
        //Alert.alert(''+Response.Body.TripId);
        if(this.state.url === URL_START_TRIP){
          commonData.setCurrentRideData(Response.Body);
          this.setState({loading:false,startRide:false});
          this.props.onPress();
        }
        else if(this.state.url === URL_CANCEL_TRIP){
          const timeoutId = BackgroundTimer.setTimeout(() => {
              this.setState({loading:false,rejectRide:false});
              this.props.LoadAgain();
          }, 2000);
        }
        else if(this.state.url === URL_GET_STATUS){
          commonData.setBreakInOut(''+Response.Body.BreakStatus);
          commonData.setCheckInOut(''+Response.Body.CheckStatus);
          this.props.onStatusUpdate();
          // Alert.alert(''+Response.Body.CheckStatus);
          if(''+Response.Body.CheckStatus === '0'){
             Alert.alert('','Please check in first');
             this.setState({loading:false});
          }
          else if(''+Response.Body.CheckStatus === '1'){
            if(''+Response.Body.BreakStatus === '3'){
               Alert.alert('','You are in "break in" mode. Please contact admin');
               this.setState({loading:false});
            }
            else if(''+Response.Body.BreakStatus === '2'){
               this.setState({startRide:true,loading:false,detail:0});
            }
          }
        }
      }
    }
 }

 ShowRejectDialogPopUp(){
   this.setState({rejectRide:true,loading:false,startRide:false});
 }

 RequestCancel(){
    //Alert.alert(''+this.state.selectedDate);
      let RideId = 0 ;
      for(let i = 0 ; i < this.props.Data.length ; i++){
           if(this.props.Data.Rides[i].IsVisible && this.props.Data.Rides[i].AssignTo === commonData.getUserData().UserId && this.props.Data.Rides[i].Status === 'Pending'){
              RideId = this.props.Data.Rides[i].RideId;
           }
      }
      this.setState({ loading: true, alertMessage: "Rejecting ride...", error: "", url :  URL_CANCEL_TRIP, rejectRide:false,
       MyObject : {
       	TripId: this.props.Data.TripId,
       	TripDisplayId: this.props.Data.DisplayId,
       	UserId:commonData.getUserData().UserId,
       	Reason:'Driver Rejected the Ride',
        RideId:RideId
       }
     });
  }

 isCheckedInBreakedOut(){
   // if(commonData.getCheckInOut() == 0){
   //   Alert.alert('Please check in first');
   // }
   // else{
     this.setState({ loading: true, alertMessage: "Checking Status...", error: "",
      url :  URL_GET_STATUS});
  //}
   // else if(commonData.getBreakInOut() == 0){
   //   Alert.alert('You are in "break in" mode. Please contact admin')
   // }
   // else{
   //   this.setState({startRide:true})
   // }
 }



  ShowConfirmDialog()
  {
    const { textBoldStyle,textNormalStyle,textBigStyle  } = styles;
    var heading = 'START';
    var heading2 = 'RIDE';
    var description = 'Do you want to start your ride?';
    var mOnPress;
    var icon = cancel_ride_icon;

    return (
      <Dialog
           title=""
           dialogStyle = {{backgroundColor:"#E7E7E7" }}
           visible={this.state.startRide}
           onTouchOutside={() => this.setState({startRide: false})}
           positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
           <View style = {{ height:   290  , backgroundColor:"#E7E7E7" }}>
               <View style={{alignItems:'center',flex:1,flexDirection:'column'}} >

                   <Image source ={icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                         <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                         <Text style={textBoldStyle}> {heading} </Text>
                         <Text style={textBigStyle}> {heading2} </Text>
                         <Text style={{marginTop:20,marginBottom:3}}>  </Text>

                         <Text style={textNormalStyle}> {description} </Text>

                         <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                         <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                   marginTop:70,marginBottom:20 }} onPress={()=> this.setState({startRide:false})}>
                             <Image style = {{width: 150,   height: 48} } source={no}  />
                         </TouchableOpacity>

                         <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                   marginTop:70,marginBottom:20 }} onPress={()=> this.onPresss()}>
                             <Image style = {{width: 150,   height: 48} } source={yes}  />
                         </TouchableOpacity>

                         </View>
               </View>
           </View>
       </Dialog>
     );
   }

   ShowRejectDialog()
   {
     const { textBoldStyle,textNormalStyle,textBigStyle  } = styles;
     var heading = 'REJECT';
     var heading2 = 'RIDE';
     var description = 'Are you sure you want to reject this ride?';
     var mOnPress;
     var icon = cancel_ride_icon;

     return (
       <Dialog
            title=""
            dialogStyle = {{backgroundColor:"#E7E7E7" }}
            visible={this.state.rejectRide}
            onTouchOutside={() => this.setState({rejectRide: false})}
            positiveButton={{ title: "OK", onPress: () => alert("Ok touched!") }} >
            <View style = {{ height:   290  , backgroundColor:"#E7E7E7" }}>
                <View style={{alignItems:'center',flex:1,flexDirection:'column'}} >

                    <Image source ={icon} style = { { marginTop:-80, width: 120,  height: 120,  resizeMode: 'contain',  justifyContent: 'center'} }/>
                          <Text style={{marginTop:-5,marginBottom:5}}>  </Text>
                          <Text style={textBoldStyle}> {heading} </Text>
                          <Text style={textBigStyle}> {heading2} </Text>
                          <Text style={{marginTop:20,marginBottom:3}}>  </Text>

                          <Text style={textNormalStyle}> {description} </Text>

                          <View style={{flex:1,alignItems:'center',flexDirection:'row',padding:5}}>

                          <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                    marginTop:70,marginBottom:20 }} onPress={()=> this.setState({rejectRide:false})}>
                              <Image style = {{width: 150,   height: 48} } source={no}  />
                          </TouchableOpacity>

                          <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                    marginTop:70,marginBottom:20 }} onPress={()=> this.RequestCancel()}>
                              <Image style = {{width: 150,   height: 48} } source={yes}  />
                          </TouchableOpacity>

                          </View>
                </View>
            </View>
        </Dialog>
      );
    }

  async onPresss(){

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Premier Transportation Location Permission',
          message:
            'Premier Transportation app needs access to your location ' +
            'so you can track your location against your next destination.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Alert.alert('You can track your location');
          allowed=true;

          let value = this.props.Data.Rides[this.state.SelRideIndex];
        //  Alert.alert(''+JSON.stringify(this.props.Data.Rides[this.state.SelRideIndex]));
          this.setState({ loading: true, alertMessage: "Starting ride...", error: "",
          url :  URL_START_TRIP,detail:0,startRide:!this.state.startRide,
           MyObject : this.props.Data });
           //Alert.alert(''+JSON.stringify(this.props.Data));

      } else {
          Alert.alert('','Location permission denied, please enable location to track your ride');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  // MyObject : {
  //
  //        TripId: "NCUlw5S4z1d06uhS9xV9",
  //        DisplayId: "13904",
  //        TripType: "Single",
  //        TripDate: "10-05-2019",
  //        StartTime: "09:00 AM",
  //        EndTime: "03:00 PM",
  //        AssignTo: "0aGanp6jfEYrTMFHhmaA7N3IZcA2",
  //        Status: "Pending",
  //        Rides: [
  //            {
  //                RideId: 1,
  //                RideDate: "10-05-2019",
  //                PickupTime: "08:00 PM",
  //                DropoffTime: "03:00 PM",
  //                PickupAddress: null,
  //                DropoffAddress: null,
  //                Location: {
  //                    "Latitude": 0,
  //                    "Longitude": 0
  //                },
  //                CustomerName: "Anonymous",
  //                CustomerContactNo: "987-654-321",
  //                Duration: "50 minutes",
  //                Fare: "200",
  //                Status: null
  //            }
  //                        ],
  //        CreatedBy: "Admin",
  //        CreatedAt: 636933498596297842,
  //        UpdatedAt: 636933498596297842
  //
  // }

  whenMapReady(){
    this.map.fitToCoordinates(this.state.region, { edgePadding: { top: 150, right: 150, bottom: 150, left: 150 }, animated: false})
  }

  toggleView = ()=> {
    if(this.state.detail == 0){
      this.setState({detail:1});
    }
    else{
      this.setState({detail:0});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backCorner: {
    backgroundColor: '#E7E7E7',
    margin:10,
    width:width-30,
    flexDirection:'column',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  horizontalLine: {
    justifyContent:'center',
    marginTop:30,
    height:1,
    flex:1,
    backgroundColor:'#C7C7C7',
  },
  horizontalLine3:{
    justifyContent:'center',
    alignSelf:'center',
    height:1,
    marginTop:20,
    marginBottom:20,
    width:width-width/3.3,
    backgroundColor:'#C7C7C7',
    marginTop:5,
    marginBottom:5
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

export default SingleCard ;
