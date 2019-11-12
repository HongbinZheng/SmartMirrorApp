import React from 'react';
import { Text, View,StyleSheet, Button,Image, ImageBackground } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import SocketIOClient from 'socket.io-client';

import moment from 'moment';
import mirror from './mirror.png';

const socket = SocketIOClient('http://ec2-18-212-195-64.compute-1.amazonaws.com', { transports: [ 'websocket'] });

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      firstName: "",
      lastName: "",
      photoURL: "",
      user:null,
      greeting: ''
    }
  }

  componentDidMount() {
    this.initAsync();
    var hour = moment()
            .format('HH');
      
          this.setState({ time: hour });
          if(hour < 12){
            this.setState({greeting: 'Good Morning, '})
          }
          else if(hour >= 12 && hour < 18){
            this.setState({greeting: 'Good Afternoon, '})
          }
          else if(hour >= 18 && hour <= 24){
            this.setState({greeting: 'Good Evening, '})
          }
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId: '241196821087-qg8t0hmd41rjt6nqg1hfoi8qngasurfd.apps.googleusercontent.com',
      scopes: [GoogleSignIn.SCOPES.PROFILE, GoogleSignIn.SCOPES.EMAIL, 'https://mail.google.com/','https://www.googleapis.com/auth/calendar',"https://www.googleapis.com/auth/calendar.settings.readonly","https://www.googleapis.com/auth/gmail.labels" ]
    });
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    if(user){
      this.setState({signedIn:true, firstName:user.firstName, lastName:user.lastName,photoURL:user.photoURL,user:user});
    }
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null,signedIn:false });
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

  signIn = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.signedIn ? 
          (<LoggedInPage firstName={this.state.firstName} lastName= {this.state.lastName} photoURL={this.state.photoURL} signIn={this.signIn}/>)
         : (
          <LoginPage signIn={this.signIn} />
        )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <View style = {{height: '100%', width: '100%'}}>
      <View style = {{backgroundColor: '#67baf6', width: '100%', height: '10%', justifyContent:'center', alignItems: 'center'}}>
        <Text style = {{color: 'white', fontSize: 20}}>Profile</Text>
      </View>
      <View style = {{height: '90%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.header}>Sign In With Google</Text>
        <Button title="Sign in with Google"  onPress={() => props.signIn()} />
      </View>
    </View>
  )
}

const LoggedInPage = props => {
  return (
    // <View style={styles.container}>
    //   <Text style={styles.header}>Welcome: {props.firstName}, {props.lastName} </Text>
    //   <Image style={styles.image} source={{ uri: props.photoURL }} />
    //   <Button title="Sign out"  onPress={() => props.signIn()} />
    // </View>
    <View style = {{height: '100%', width: '100%'}}>  
      <View style = {{backgroundColor: '#67baf6', width: '100%', height: '10%', justifyContent:'center', alignItems: 'center'}}>
        <Text style = {{color: 'white', fontSize: 20}}>Profile</Text>
      </View>
      <View style = {{height: '80%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground style = {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}source = {mirror}>
            <Text style = {{fontSize: 30, fontWeight: 'bold'}}>{this.state.greeting}</Text>
            <Text style = {{fontSize: 30, fontWeight: 'bold'}}>{props.firstName}!</Text>
            <Image style = {styles.profilePicWrap} source = {{uri: props.photoURL}}></Image>
        </ImageBackground>
      </View>
      <View style = {{height: '10%', width: '100%'}}>
        <Button title="Sign out"  onPress={() => props.signIn()} />
      </View>
  </View> 
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  profilePicWrap: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: '#98f9f9'//'#e2fafa'
  }
})