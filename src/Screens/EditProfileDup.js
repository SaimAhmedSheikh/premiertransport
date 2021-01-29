import React, { Component , PureComponent } from 'react';
import { ImageBackground,Text, View, FlatList, Dimensions, StyleSheet,ScrollView,Image ,Picker , TouchableOpacity} from 'react-native';
import  SingleCard  from './SingleCard';
import JobList from '../Data/JobList.json'
var {width, height} = Dimensions.get('window');
import { Input , LoginButton , ForgetPassword, SubmitButton, GeneralButton , Header } from '../Components';
import colors from '../Components/colors';
let Cities = [ 'Miami','Houston'];
let States = [ 'Florida','Texas', 'Arizona'];
let Countries = [ 'United States','China','Russia','Pakistan'];
const bg =  require('../images/bg2.png');
const img =  require('../images/img.png');
const save_button =  require('../images/save_button.png');
const edit_icon_black = require('../images/edit_icon_black.png');

class EditProfileDup extends PureComponent {

  constructor(props){
    super(props);
    this.state = {EmailAddress:'peter-shane@gmail.com',
                  PhoneNumber:'(541) 000 0000',
                  Address1:'Royal Palace Street 506, Albany, USA',
                  Address2:'Royal Palace Street 506, Albany, USA',
                  City:'',
                  State:'',
                  Country:'',
                  ZipCode:'33101'};
  }

  componentWillMount(){

  }

    render() {
      const { RoundedCircle, textBoldStyle,textNormalStyle,textBigStyle , inputStyle , textViewStyle,  viewLineStyle, textStyle , buttonStyle} = styles;

      return(
        <View style = {{ flex:2 }}>
         <Header showBack={true} onBackPress={()=>this.props.navigation.pop()}
          headerText = {'Edit Profile'} headerColor={colors.HeaderColor} show={false}/>

           <ImageBackground style={{ flex:1 }} source = {bg}>

            <ScrollView style={{ width:width }} keyboardShouldPersistTaps='handled'>
                <View style={{ marginTop:20,flex:2  }}>

                <View style = {{ marginTop:50,backgroundColor:"#E7E7E7",margin:10,borderRadius:30}}>
                    <View style={{alignItems:'center',flex:2,flexDirection:'column'}}>

                        <Image style = { { marginTop:-50, width: 100,  height: 100,  resizeMode: 'contain',  justifyContent: 'center' } } source={img}/>
                        <TouchableOpacity style={{marginTop: -30,marginRight:-80, justifyContent: 'center'}}>
                          <Image style = { {  width: 35,  height: 35,  resizeMode: 'contain'} }
                                 source={edit_icon_black}/>
                        </TouchableOpacity>
                        <Text style={{marginTop:5,marginBottom:5}}>  </Text>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={textBoldStyle}> First Name </Text>
                          <Text style={textBoldStyle}> Last Name </Text>
                        </View>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Email Address: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.EmailAddress}
                                     placeholder={"sample@gmail.com"} onChangeText={ EmailAddress => this.setState({ EmailAddress })}/>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Phone Number: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} value = {this.state.PhoneNumber}
                                     placeholder={"(541) 000 0000"} onChangeText={ PhoneNumber => this.setState({ PhoneNumber })}/>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Address 1: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.Address1}
                                     placeholder={"type here"} onChangeText={ Address1 => this.setState({ Address1 })}/>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Address 2: </Text>
                              <Input  placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} multiline ={true} value = {this.state.Address2}
                                     placeholder={"type here"} onChangeText={ Address2 => this.setState({ Address2 })}/>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Country: </Text>
                              <Picker selectedValue={this.state.Country}
                                      mode="dropdown" itemStyle={{  textAlign:'center',justifyContent:'center'}}
                                      style={{alignItems:'center',   alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11 , alignSelf:'flex-start'}}
                                      onValueChange={(itemValue, itemIndex) => this.setState({Country:itemValue}) }>
                                      {Countries.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>

                        <View style={viewLineStyle}/>


                        <View style={inputStyle}>
                              <Text style={textViewStyle}> State: </Text>
                              <Picker selectedValue={this.state.State}
                                      mode="dropdown" itemStyle={{ textAlign:'center',justifyContent:'center'}}
                                      style={{ alignItems:'center',   alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11 , alignSelf:'flex-start'}}
                                      onValueChange={(itemValue, itemIndex) => this.setState({State:itemValue}) }>
                                      {States.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>

                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> City: </Text>
                              <Picker selectedValue={this.state.City}
                                      mode="dropdown" itemStyle={{textAlign:'center',justifyContent:'center'}}
                                      style={{ alignItems:'center',   alignSelf:'center',flex:1,transform: [ { scaleX: 0.86}, { scaleY: 0.86 }, ],marginLeft: -11 , alignSelf:'flex-start'}}
                                      onValueChange={(itemValue, itemIndex) => this.setState({City:itemValue}) }>
                                      {Cities.map((item, index) => {
                                         return (< Picker.Item  color="#7B7B7B" label={''+item} value={item} key={index} />);
                                      })}
                                  </Picker>
                        </View>


                        <View style={viewLineStyle}/>

                        <View style={inputStyle}>
                              <Text style={textViewStyle}> Zip Code: </Text>
                              <Input   placeholderTextColor={'#7B7B7B'} color={'#7B7B7B'} value = {this.state.ZipCode}
                                     placeholder={"type here"} onChangeText={ ZipCode => this.setState({ ZipCode })}/>
                        </View>

                        <TouchableOpacity style={{flexDirection:'column',   justifyContent: 'center',  alignItems: 'center',
                                                  marginTop:10,marginBottom:20 }} onPress={()=> this.props.navigation.pop()} >
                            <Image style = {{width: 250,   height: 48} } source = { save_button }  />
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
              </ScrollView>

           </ImageBackground>
        </View>
     );
   }

   // when state is selected
   changeCity (val) {
     this.setState({State:val,City:'select city'});
     if(val != 'select state'){
       let statess = [];
       let value;
       let tempStates = CountiresJson.filter(t => t.name.includes(this.state.Country))[0].states[0];
       for (var key in tempStates ) {
          if(key === val){
            value = ''+tempStates[key];
            break;
          }
       }
       let tempCities= value.split(',');
       this.setState({selCities:tempCities});
     }
   }

   // when country is selected
   changeStates(val){
     if(this.state.Country !== val){
       if(val != 'select country'){
         let statess = [];
         let tempStates = CountiresJson.filter(t => t.name.includes(val))[0].states[0];
         for (var key in tempStates) {
           if (tempStates.hasOwnProperty(key)) {
               statess.push(''+key);
           }
         }
         this.setState({selStates:statess,Country:val,State:statess[0]});
       }
     }
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
    fontFamily: 'Gotham Medium',
    color: '#535353',marginLeft:10,marginRight:10,marginBottom:15
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
  }
}

export default EditProfileDup ;
