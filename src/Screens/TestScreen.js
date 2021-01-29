import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import OpenMapNavigation from '../Components/OpenMapNavigation';

const TestScreen = () => {
    
    const openMaps = () => {
        OpenMapNavigation(`${29.5968451},${-95.61992180000001}`,`${encodeURI('')}`)
        .then(res => { 
            console.log('OpenMapNavigation:', res)
        });
    }
    
    return (
        <SafeAreaView style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={openMaps} style={{width:200,height:40,}}>
                <Text style={{ fontSize: 16, color: 'blue'}}>Start Navigation</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

const urlEncode = (address) => {
    
}

export default TestScreen;
