import React, { Component , PureComponent } from 'react';
import { FlatList, View, Dimensions, StyleSheet , Text , TouchableOpacity} from 'react-native';
import  SingleCard  from '../Screens/SingleCard';
import JobList from '../Data/JobList.json'
import colors from '../Components/colors';

var { width, height } = Dimensions.get('window');
var navv;
var stat;

class JobListing extends PureComponent {
  constructor(props){
    super(props);
    this.state = {selected: 0}
    navv = this.props.navigation;
    stat = this.props;
  }

  componentWillMount(){

  }


  renderItem(Data){ 
      return <SingleCard Data={Data.item} onStatusUpdate={()=> stat.onStatusUpdate()} onPress={()=>navv.navigate('MapScreen', { Data:Data.item ,
        onPreviousScreen:stat.onPreviousScreen()})} LoadAgain = {()=> stat.LoadAgain()} />;
  }

  //onPress={()=> this.props.navigation.navigate('MapScreen', { Data:Data.item   })}

  render() {
    return(
       <View style = {{ flex:2 }}>
          { this.props.Data.length == 0 &&
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:18,color:'#ffffff'}}> No Rides Assigned for Today </Text>
                <TouchableOpacity style={{marginTop:10,  borderRadius: 10, backgroundColor: colors.blue }} onPress = {() => this.props.LoadAgain()}>
                  <Text style={{paddingLeft:20,paddingRight:20,paddingTop:7,paddingBottom:7,fontSize:18,color:'#ffffff'}}> Retry </Text>
                </TouchableOpacity>
            </View>
          }
          {this.props.Data.length > 0 &&
              <FlatList style = {{ flex:1 }}
                data = { this.props.Data }
                renderItem = { this.renderItem }
                extraData = { this.props.Refresh }
                keyExtractor={keyExtractor= Data => this.props.Data.TripId}/>
          }
        </View>
   );
  }
//keyExtractor= Data => this.props.Data.TripId
  // <View style = {{ flex:2 }}>
  //      <FlatList style = {{ flex:1 }}
  //        data = { JobList }
  //        renderItem = { this.renderItem }
  //        keyExtractor = { keyExtractor= Data => JobList.id }/>
  //  </View>

  componentWillUnmount(){

  }
}

export default JobListing ;
