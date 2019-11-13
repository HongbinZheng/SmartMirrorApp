import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert,Button,AsyncStorage } from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native'
import { Header } from 'react-native-elements';
import axios from 'axios';
import * as GoogleSignIn from 'expo-google-sign-in';
import SocketIOClient from 'socket.io-client';
import DialogManager, { ScaleAnimation, DialogContent,DialogComponent  } from 'react-native-dialog-component';
import { AuthSession } from 'expo';
import * as Google from 'expo-google-app-auth';

import AddDevice from './addDevice';
import ChangeConfig from './changeConfig'

const socket = SocketIOClient('http://ec2-18-212-195-64.compute-1.amazonaws.com', { transports: [ 'websocket'] });

class EditDisplayScreen extends Component {
    constructor() {
        super();
        this.state = {
            WeatherConfig: "OFF",
            MapConfig: "OFF",
            NewsConfig: "OFF",
            DateConfig: "OFF",
            DeviceID: "",//"9c:b6:d0:e6:ef:53",
            DeviceIDList:[],
            Address:'',
            user:null,
            existID:false
        };
    }

    componentDidMount() {
        // if(this.state.DeviceID !== ""){
        //     this.handleDeviceID()
        // }
        this.initAsync();
    }

////////////////////Async Storage/////////////////////////////////////////
async _storeData(refreshToken,email){
    try {
        console.log('here 1')
      await AsyncStorage.setItem('email',email)
      console.log('done 1')
      await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.log(error)
    }
  };

  async _retrieveData(email) {
    try {
        console.log('here 2')
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        if(email === value){
            try{
                const refreshtoken = await AsyncStorage.getItem('refreshToken');
                console.log("refreshtoken " + refreshtoken);
                return refreshtoken;
            }catch (e){
                console.log('e ' + e);
            }
        }
      }
    } catch (error) {
      console.log(err)
    }
    return null;
  };
//////////////////End Async Storage//////////////////////////////////

//////////////////////////////EXPO CLIENT/////////////////////////////////////////////

signInWithGoogleAsync = async() => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        expoClientId:'241196821087-q2rmktbrsu06bs2t3m3f4prcr3abr1a9.apps.googleusercontent.com',
        androidClientId: '241196821087-usd43h4q9k8dae5imnf470cltjout116.apps.googleusercontent.com',
        iosClientId: '241196821087-kbb1ipb3km7je4h8c15ka82954o3vk5o.apps.googleusercontent.com',
        scopes: ['profile', 'email','https://mail.google.com/', 'https://www.googleapis.com/auth/calendar', "https://www.googleapis.com/auth/calendar.settings.readonly", "https://www.googleapis.com/auth/gmail.labels"],
      });
      let redirectUrl = AuthSession.getRedirectUrl();
      let result = await AuthSession.startAsync({
        authUrl:
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `&client_id=241196821087-q2rmktbrsu06bs2t3m3f4prcr3abr1a9.apps.googleusercontent.com` +
          `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
          `&response_type=code` +
          `&access_type=offline` +
          `&scope=profile%20email%20https://mail.google.com/%20https://www.googleapis.com/auth/calendar`
      });
      if (result.type === 'success') {
        axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/getDeviceList',{params: { user: user.email }}).then(res=>{
            if(res.data){
                this.setState({DeviceIDList:res.data.DeviceID})
            }
        })
        axios.get('https://expoclientbackend.appspot.com/api/getrefreshtoken',{params:{code:result.params.code, uri:redirectUrl}}).then(async res=>{    
            if(res.data.refresh_token){
                console.log('with token')
                this._storeData(res.data.refresh_token,user.email)
                user.auth = {
                    refreshToken:res.data.refresh_token,
                    accessToken : res.data.access_token
                }
                }else{
                    console.log('no token')
                    const refreshToken = await this._retrieveData(user.email)
                    console.log(refreshToken)
                    user.auth = {
                        refreshToken:refreshToken,
                        accessToken : res.data.access_token
                    }
                }
                this.setState({user:user})
            })
        this.setState({ signedIn: true, user: user });
        console.log(this.state)
      } else {
        alert('login: failed:');
      }
    } catch (e) {
      alert('login: Error:' + e);
    }
  }
  signIn = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInWithGoogleAsync();
    }
};


////////////////////////////////END EXPO CLIENT//////////////////////////////////////
    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: '241196821087-qg8t0hmd41rjt6nqg1hfoi8qngasurfd.apps.googleusercontent.com',
            webClientId:'241196821087-q2rmktbrsu06bs2t3m3f4prcr3abr1a9.apps.googleusercontent.com',
            isOfflineEnabled:true,
            scopes: [GoogleSignIn.SCOPES.PROFILE, GoogleSignIn.SCOPES.EMAIL, 'https://mail.google.com/', 'https://www.googleapis.com/auth/calendar', "https://www.googleapis.com/auth/calendar.settings.readonly", "https://www.googleapis.com/auth/gmail.labels"]
        });
        this._syncUserWithStateAsync();
    };

    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        if (user) {
            axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/getDeviceList',{params: { user: user.email }}).then(res=>{
                if(res.data){
                    this.setState({DeviceIDList:res.data.DeviceID})
                }
            })
            if(user.serverAuthCode){
                axios.get('https://smartmirrorbackend-258605.appspot.com/api/getrefreshtoken',{params:{code:user.serverAuthCode}}).then(res=>{    
                if(res.data.refresh_token){
                    user.auth.accessToken = res.data.access_token
                    user.auth.refreshToken = res.data.refresh_token
                    }else{
                        user.auth.accessToken = res.data.access_token
                    }
                    this.setState({user:user})
                })
            }
            //alert(JSON.stringify(user))
            this.setState({ signedIn: true, user: user });
            socket.emit('apis:receive', { DeviceID: this.state.DeviceID, token: user.accessToken });
            socket.on('apis:send', (data) => { console.warn(data) });
        }
    };

    onPress() {
        const configData = this.state
        axios.post('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/changeConfig', { configData }).then(res => {
            if (res.data.code === 400) {
                alert("device not found")
            }
        }).catch(err => { console.warn(err) })
        socket.emit('config:receive', { config: this.state })
        socket.on('config:send', (data) => { console.warn(data) })
    }

    onDeviceIDChange(value) {
        // parent class change handler is always called with field name and value
        this.setState({ DeviceID: value });
    }
    onAddressChange(value) {
        // parent class change handler is always called with field name and value
        this.setState({ Address: value });
    }

    handleDeviceID() {
        axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/phoneGetDisplay', { params: { DeviceID: this.state.DeviceID } }).then(res => {
            if (res.data.code == 400) {
                alert("device not found")
            } else {
                if(this.state.user !== null){
                    this.addDeviceID();
                }
                this.setState(res.data);
                this.setState({ existID: true })
                this.props.navigation.navigate('ChangeConfig',{
                    config:this.state
                })
            }
        }).catch(err => { console.warn(err) })
        //this.initAsync();
    }

    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null,signedIn:false,DeviceIDList:[],DeviceID:'' });
    };

    signInAsync = async () => {
      try {
         await GoogleSignIn.askForPlayServicesAsync();
         const { type, user } = await GoogleSignIn.signInAsync();
         if (type === 'success') {
           this._syncUserWithStateAsync();
      }
       } catch ({ message }) {
         alert('login: Error:' + message);
       }
    };

    // signIn = () => {
    //     if (this.state.user) {
    //       this.signOutAsync();
    //     } else {
    //       this.signInAsync();
    //     }
    // };


    addDeviceID(){
        params = {
            DeviceID:this.state.DeviceID,
            user:this.state.user.email
        }
        axios.post('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/addDevice', { params }).then(res=>{
            this.setState({DeviceIDList:res.data.value.Attributes.DeviceID})
        }).catch(err=>console.log(err))
    }

    render() {
        if (this.state.user !== null) {
            return (
                <View style={{ justifyContent:'center', alignItems:'center', height:'100%', width: '100%'}}>
                    <View style = {{backgroundColor: '#67baf6', width: '100%', height: '10%', justifyContent:'center', alignItems: 'center'}}>
                        <Text style = {{color: 'white', fontSize: 20}}>Edit Display</Text>
                    </View>
                    <View style = {{height: '90%', width: '100%'}}>
                        {this.state.DeviceIDList.length > 0 ? this.state.DeviceIDList.map(ID=>{
                        return(
                   <View><TouchableOpacity onPress={()=>this.props.navigation.navigate('ChangeConfig',{config:{DeviceID:ID},user:this.state.user})}><Text>{ID}</Text></TouchableOpacity></View>
                    )
                    }):null}
                    <Button
                    style={{ top: 40 }}
                        title="Add"
                        onPress={() => {
                            this.dialogComponent.show();
                        }}
                    />
                    <DialogComponent
                        ref={(dialogComponent) => { this.dialogComponent = dialogComponent; }}
                    >
                        <View>
                        <AddDevice handleDeviceID={this.handleDeviceID.bind(this)} onChange={this.onDeviceIDChange.bind(this)} />
                        </View>
                    </DialogComponent>
                    </View>
                    <Button title="Sign Out"  onPress={() => this.signIn()} />
                </View>
            )
        } else {
            if (!this.state.existID) {
                return (
                    <View style = {{height: '100%', width: '100%'}}>
                        <View style = {{backgroundColor: '#67baf6', width: '100%', height: '10%', justifyContent:'center', alignItems: 'center'}}>
                            <Text style = {{color: 'white', fontSize: 20}}>Edit Display</Text>
                        </View>
                        <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center',flex:1, height: '90%', width: '100%' }}>
                            <Text style = {{fontSize: 25}}>Add Your Device</Text>
                            <Text style = {{color: 'gray'}}>Please enter DeviceID exactly as shown on the smart mirror.{"\n"}</Text>
                            <AddDevice handleDeviceID={this.handleDeviceID.bind(this)} onChange={this.onDeviceIDChange.bind(this)} />
                            <Text>{"\n"}</Text>
                            <Text>--- OR ---</Text>
                            <Text>{"\n"}</Text>
                            <Text style={styles.header}>Sign In With Google</Text>
                            <Button title="Sign in with Google"  onPress={() => this.signIn()} />
                        </View>
                    </View>   
                )
             } else {
                return (
                    <View>
                        {/* <ChangeConfig config={this.state} onPress={this.onPress.bind(this)} valueChange={this.valueChange.bind(this)} addressChange={this.onAddressChange.bind(this)} /> */}
                    </View>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25
    },
    toggles: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        alignItems: 'flex-start'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
      }
})

export default EditDisplayScreen;