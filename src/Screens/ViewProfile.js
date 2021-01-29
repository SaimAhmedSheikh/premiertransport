import React, { Component , PureComponent } from 'react';
import { ToastAndroid,ImageBackground,Text, View, FlatList, Dimensions, StyleSheet,ScrollView,Image ,Picker , TouchableOpacity, Alert} from 'react-native';
import  SingleCard  from './SingleCard';
import JobList from '../Data/JobList.json'
var {width, height} = Dimensions.get('window');
import { Input , LoginButton , ForgetPassword, SubmitButton, GeneralButton , Header } from '../Components';
import colors from '../Components/colors';
let Cities = [ 'Miami','Houston'];
let States = ['Florida','Texas', 'Arizona'];
let Countries = ['United States','China','Russia','Pakistan'];
const bg =  require('../images/bg2.png');
const img =  require('../images/img.png');
const save_button =  require('../images/save_button.png');
const user_img = require('../images/user_img.png');


import CommonDataManager from '../Components/CommonDataManager';
let commonData;

class ViewProfile extends PureComponent {

  constructor(props){
    super(props);
    this.state = {stateUpdated:0,
                  EmailAddress:'',
                  PhoneNumber:'',
                  Address1:'',
                  Address2:'',
                  City:'',
                  State:'',
                  Country:'',
                  ZipCode:'',
                  ProfilePic:'',
                  FirstName:'',
                  LastName:''};
  }

  componentWillMount(){
    commonData = CommonDataManager.getInstance();

    this.setState({

    ProfilePic:''+commonData.getUserData().ProfilePicture,
    FirstName:''+commonData.getUserData().FirstName === "null" ? "" : commonData.getUserData().FirstName,
    LastName:''+commonData.getUserData().LastName === "null" ? "" : commonData.getUserData().LastName,
    EmailAddress:''+commonData.getUserData().Email === "null" ? "" : commonData.getUserData().Email,
    PhoneNumber:''+commonData.getUserData().PhoneNumber === "null" ? "" : commonData.getUserData().PhoneNumber,
    Address1:''+commonData.getUserData().Address1 === "null" ? "" : commonData.getUserData().Address1,
    Address2:''+commonData.getUserData().Address2 === "null" ? "" : commonData.getUserData().Address2,
    City:''+commonData.getUserData().City === "null" ? "" : commonData.getUserData().City,
    State:''+commonData.getUserData().State === "null" ? "" : commonData.getUserData().State,
    Country:''+commonData.getUserData().Country === "null" ? "" : commonData.getUserData().Country,
    ZipCode:''+commonData.getUserData().Zipcode === "null" ? "" : commonData.getUserData().Zipcode });
  }



  refresh(){
    this.setState({

    ProfilePic:''+commonData.getUserData().ProfilePicture,
    FirstName:''+commonData.getUserData().FirstName === "null" ? "" : commonData.getUserData().FirstName,
    LastName:''+commonData.getUserData().LastName === "null" ? "" : commonData.getUserData().LastName,
    EmailAddress:''+commonData.getUserData().Email === "null" ? "" : commonData.getUserData().Email,
    PhoneNumber:''+commonData.getUserData().PhoneNumber === "null" ? "" : commonData.getUserData().PhoneNumber,
    Address1:''+commonData.getUserData().Address1 === "null" ? "" : commonData.getUserData().Address1,
    Address2:''+commonData.getUserData().Address2 === "null" ? "" : commonData.getUserData().Address2,
    City:''+commonData.getUserData().City === "null" ? "" : commonData.getUserData().City,
    State:''+commonData.getUserData().State === "null" ? "" : commonData.getUserData().State,
    Country:''+commonData.getUserData().Country === "null" ? "" : commonData.getUserData().Country,
    ZipCode:''+commonData.getUserData().Zipcode === "null" ? "" : commonData.getUserData().Zipcode });
  }

    render() {
      const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textViewStyle,  viewLineStyle, textStyle , buttonStyle, ImageStyleContainer} = styles;

      return(
        <View style = {{ flex:2 }}>
         <Header onBackPress={()=>this.props.navigation.pop()}
          isEditIcon = {true} showSettings = {true} headerText = {'Profile'}
          headerColor={colors.HeaderColor} showBack={true} showEmergencyContact={false}
          onPress = {()=> this.props.navigation.navigate('EditProfile', { onGoBack: () => this.refresh() })}/>

           <ImageBackground style={{ flex:1 }} source = {bg}>

            <ScrollView style={{ width:width }} keyboardShouldPersistTaps='handled'>
                <View style={{ flex:2 ,marginTop:10 }}>

                <View style = {{ marginTop:50,backgroundColor:"#E7E7E7",margin:10,borderRadius:30}}>
                    <View style={{marginTop: 10,alignItems:'center',flex:2,flexDirection:'column'}}>

                    <View style = { ImageStyleContainer }>
                      <Image style = {{  alignSelf:'center',borderRadius: 50,width: 100,  height: 100,  resizeMode: 'cover',  justifyContent: 'center' } }
                             source={this.state.ProfilePic == '' ? img : { uri: this.state.ProfilePic } }/>
                    </View>

                              <Text style={{marginTop:5,marginBottom:5}}>  </Text>
                              <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{fontSize:23, fontFamily:'Gotham Medium', color: '#535353',}}>  {this.state.FirstName} </Text>
                                <Text style={{fontSize:23, fontFamily:'Gotham Medium',   color: '#535353',}}> {this.state.LastName} </Text>
                              </View>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Email Address: </Text>
                                    <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.EmailAddress}
                                           editable = {false} placeholder={"peter-shane@gmail.com"} onChangeText={ EmailAddress => this.setState({ EmailAddress })}/>
                              </View>

                              <View style={viewLineStyle}/>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Phone Number: </Text>
                                    <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} value = {this.state.PhoneNumber}
                                           editable = {false} placeholder={"(541) 000 0000"} onChangeText={ PhoneNumber => this.setState({ PhoneNumber })}/>
                              </View>

                              <View style={viewLineStyle}/>


                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Address 1: </Text>
                                    <Input style={{resizeMode: 'contain',  flex:1}} placeholderTextColor={'#7B7B7B'} editable = {false} color={'#7B7B7B'} value = {this.state.Address1}
                                           multiline ={true} editable = {false}  placeholder={"Royal Palace Street 506, Albany, USA"} onChangeText={ Address1 => this.setState({ Address1 })}/>
                              </View>

                              <View style={viewLineStyle}/>


                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Address 2: </Text>
                                    <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} editable = {false} value = {this.state.Address2}
                                           multiline ={true} placeholder={"Royal Palace Street 506, Albany, USA"} onChangeText={ Address2 => this.setState({ Address2 })}/>
                              </View>

                              <View style={viewLineStyle}/>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Country: </Text>
                                    <Text style={{  color:'#7B7B7B',
                                      fontSize: 13,
                                      flex: 2,
                                      paddingBottom:4,
                                      paddingTop:3,justifyContent:'center',
                                      alignItems:'center',
                                      alignSelf:'center',
                                      fontFamily:'Gotham Book'}}> {this.state.Country} </Text>

                              </View>

                              <View style={viewLineStyle}/>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> State: </Text>
                                    <Text style={{ color:'#7B7B7B',
                                          fontSize: 13,
                                          flex: 2,
                                          paddingBottom:4,
                                          paddingTop:3,justifyContent:'center',
                                          alignItems:'center',
                                          alignSelf:'center',
                                          fontFamily:'Gotham Book'}}> {this.state.State} </Text>

                              </View>

                              <View style={viewLineStyle}/>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> City: </Text>
                                    <Text style={{  color:'#7B7B7B',
                                      fontSize: 13,
                                      flex: 2,
                                      paddingBottom:4,
                                      paddingTop:3,
                                      justifyContent:'center',
                                      alignItems:'center',
                                      alignSelf:'center',
                                      fontFamily:'Gotham Book'}}> {this.state.City} </Text>
                              </View>

                              <View style={viewLineStyle}/>

                              <View style={inputStyle}>
                                    <Text style={textViewStyle}> Zip Code: </Text>
                                    <Input   placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} value = {this.state.ZipCode}
                                           editable = {false}  placeholder={"33101"} onChangeText={ ZipCode => this.setState({ ZipCode })}/>
                              </View>
                              <View style={{marginBottom:10}}/>

                    </View>
                </View>
                </View>
              </ScrollView>

           </ImageBackground>
        </View>
     );
   }

 componentDidMount(){

 }

  componentWillUnmount(){

  }
}

const styles = {
  viewParentStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#0000000000',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
    paddingLeft:15
  },
  viewLineStyle:{
    justifyContent:'center',width:width-width/5+15,height:2,backgroundColor:'#C7C7C7',marginTop:5,marginBottom:5
  },
  textViewStyle:{
    width:135,alignSelf:'center', height:30,marginLeft:5,marginRight:5,marginTop:13,fontFamily:'Gotham Medium',fontSize:13
  },
  viewStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    justifyContent: 'center'
  },
  loginbuttonBackStyle:{
    flexDirection:'column',
    height:50,
    marginRight:40,
    marginLeft:40,
    marginTop:20,
    marginBottom:10,
    backgroundColor:'#ffffff',
    borderRadius:0,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center'
  },
  forgetbuttonBackStyle:{
    flexDirection:'column',
    height:30,
    backgroundColor:'#00000000',
    borderWidth: 1,
    borderColor: '#00000000',
    justifyContent: 'flex-end',
    alignSelf:'flex-end',
    marginRight:40
  },
  ImageStyle:{
    width: 200,
    height: 200,
    margin:20,
    resizeMode: 'contain',
    justifyContent: 'center'
  },
  RoundedCircle: {
    backgroundColor: '#ffffff',
    height: 26,
    borderRadius: 26/2,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: '#ffffff'
  },
  textBigStyle:{
    fontSize:23,
    color: '#393939',
    marginTop:-10
  },
  textBoldStyle:{
    fontSize:23,
    fontFamily:'Gotham Medium',
    color: '#535353',marginLeft:20,marginRight:20,marginBottom:15
  },
  textNormalStyle:{
    fontSize:15,
    color: '#393939',
    textAlign: 'center',
    marginBottom:20,
    fontStyle:'italic',
  },
  inputStyle:{
    flexDirection:'row',
    height:60,
    marginRight:5,
    marginLeft:5,
    marginTop:8,
    paddingLeft:10,
    marginBottom:2,
    backgroundColor:'#0000000000',
    borderRadius:0,

    justifyContent: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 5
  },
  buttonStyle: {
    flexDirection:'column',
    height:40,
    marginTop:8,
    marginBottom:8,
    borderRadius:50,
    borderWidth: 1,
    justifyContent: 'center'
  },
  ImageStyleContainer:{
   resizeMode: 'contain',
   justifyContent: 'center',
   borderColor:'#ffffff',
   borderWidth:2,
   overflow: 'hidden',
   borderRadius: 65,
   width: 100,
   height: 100,
   marginTop:-50,
   padding:1
 }
}

export default ViewProfile ;
