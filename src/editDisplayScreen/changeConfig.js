import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient('http://ec2-18-212-195-64.compute-1.amazonaws.com', { transports: [ 'websocket'] });

export default class changeConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WeatherConfig: "",
            MapConfig: "",
            NewsConfig: "",
            CalendarConfig: "",
            Address: "",
            DeviceID:""
        };
    }

    componentDidMount(){
        this.setState(this.props.navigation.state.params)
        this.setState({user:this.props.navigation.state.params.user})
        this.handleDeviceID()
    }

    handleDeviceID() {
        //console.log(this.state)
        axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/phoneGetDisplay', { params: { DeviceID: this.props.navigation.state.params.config.DeviceID } }).then(res => {
            if (res.data.code == 400) {
                alert("device not found")
            } else {
                this.setState(res.data);
                this.setState({ existID: true })
            }
        }).catch(err => { console.warn(err) })
    }

    onPress() {
        const configData = this.state
        //console.log(configData)
        axios.post('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/changeConfig', { configData }).then(res => {
            if (res.data.code === 400) {
                alert("device not found")
            }
        }).catch(err => { console.warn(err) })
        socket.emit('config:receive', { config: this.state });
        socket.on('config:send', (data) => { console.warn(data) })
    }

    render() {
        return (
            <View>
                <View>
                    <Header
                        backgroundColor='#67baf6'
                        centerComponent={{ text: 'Edit Display Setting', style: { color: '#fff' } }}
                    />
                </View>

                <View >
                    <Text>WeatherConfig</Text>
                    <Picker
                        selectedValue={this.state.WeatherConfig}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({WeatherConfig:itemValue})
                        }
                        itemStyle={{height:44}}
                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="top-left" value="top-left" />
                        <Picker.Item label="top-middle" value="top-middle" />
                        <Picker.Item label="top-right" value="top-right" />
                    </Picker>
                    <Text>MapConfig</Text>
                    <Picker
                        selectedValue={this.state.MapConfig}
                        //style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({MapConfig:itemValue})
                        }
                        itemStyle={{height:44}}
                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="bottom-left" value="bottom-left" />
                        <Picker.Item label="bottom-right" value="bottom-right" />
                    </Picker>
                    <Text>NewsConfig</Text>
                    <Picker
                        selectedValue={this.state.NewsConfig}
                        //style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({NewsConfig:itemValue})
                        }
                        itemStyle={{height:44}}
                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="top-left" value="top-left" />
                        <Picker.Item label="top-right" value="top-right" />
                        <Picker.Item label="middle-left" value="middle-left" />
                        <Picker.Item label="middle-right" value="middle-right" />
                    </Picker>
                    <Text>CalendarConfig</Text>
                    <Picker
                        selectedValue={this.state.CalendarConfig}
                        //style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({CalendarConfig:itemValue})
                        }
                        itemStyle={{height:44}}
                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="bottom-left" value="bottom-left" />
                        <Picker.Item label="bottom-right" value="bottom-right" />
                    </Picker>
                </View>
                <View>
                    <Text>Address</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={text => this.setState({Address:text})}
                        value={this.state.Address}
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onPress.bind(this)}
                    >
                        <Text> Submit </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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