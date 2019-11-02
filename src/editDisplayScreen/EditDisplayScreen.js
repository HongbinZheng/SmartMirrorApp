import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert,Button } from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native'
import { Header } from 'react-native-elements';
import axios from 'axios';
import * as GoogleSignIn from 'expo-google-sign-in';
import SocketIOClient from 'socket.io-client';
import DialogManager, { ScaleAnimation, DialogContent,DialogComponent  } from 'react-native-dialog-component';

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

    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: '241196821087-qg8t0hmd41rjt6nqg1hfoi8qngasurfd.apps.googleusercontent.com',
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
        socket.emit('config:receive', { config: this.state });
        socket.on('config:send', (data) => { console.warn(data) })
    }

    valueChange(value, name) {
        this.setState({ [name]: value });
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

    addDeviceID(){
        console.log("here")
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
                <View style={{top:50}}>
                    {this.state.DeviceIDList.map(ID=>{return(
                   <View><TouchableOpacity onPress={()=>this.props.navigation.navigate('ChangeConfig',{config:{DeviceID:ID}})}><Text>{ID}</Text></TouchableOpacity></View>
                    )
     
                    })}
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
            )
        } else {
            if (!this.state.existID) {
                return (
                    <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <AddDevice handleDeviceID={this.handleDeviceID.bind(this)} onChange={this.onDeviceIDChange.bind(this)} />
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