/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';  
import {StyleSheet, Text, View,Button,YellowBox} from 'react-native';  
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';  
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  
import Icon from 'react-native-vector-icons/Ionicons';  
import EditDisplayScreen from './src/editDisplayScreen/EditDisplayScreen'
import ProfileScreen from './src/ProfileScreen/ProfileScreen';
import ConfigScreen from './src/editDisplayScreen/changeConfig';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ,'Setting a timer'
]);

export default class App extends Component {
    render(){
        return(
            <AppContainer />
        )
    }
}


const TabNavigator = createMaterialBottomTabNavigator(  
    {  
        Profile: { screen: ProfileScreen,  
            navigationOptions:{  
                tabBarLabel:'Profile',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-person'}/>  
                    </View>), 
            }  
        },  
        EditDisplay: { screen: EditDisplayScreen,  
            navigationOptions:{  
                tabBarLabel:'Edit Display',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-tablet-portrait'}/>  
                    </View>),    
            }  
        },  
    },  
    {  
      initialRouteName: "Profile",  
      activeColor: '#615af6',  
      inactiveColor: '#b0d2f2',  
      barStyle: { backgroundColor: '#67baf6' }, 
    },  
);  

const StackNavigator = createStackNavigator({
    ChangeConfig:{
        screen:ConfigScreen
    }
})

const AppNavigator = createDrawerNavigator({
    TabNavigator:TabNavigator,
    StackNavigator:StackNavigator
  });
  


const AppContainer = createAppContainer(AppNavigator);