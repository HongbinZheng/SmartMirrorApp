import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient('http://ec2-18-212-195-64.compute-1.amazonaws.com', { transports: [ 'websocket'] });


const DEFAULT = {
    WeatherConfig: "",
    MapConfig: "",
    NewsConfig: "",
    CalendarConfig: "",
    Address: "",
    DeviceID:""
}

export default class changeConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WeatherConfig: "",
            MapConfig: "",
            NewsConfig: "",
            CalendarConfig: "",
            Address: "",
            DeviceID:"",
            GmailConfig:""
        };
    }

    componentDidMount(){
        this.setState(this.props.navigation.state.params)
        this.setState({user:this.props.navigation.state.params.user})
        this.handleDeviceID()
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.navigation.state.params.config.DeviceID !== this.state.DeviceID) {
            axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/phoneGetDisplay', { params: { DeviceID: nextProps.navigation.state.params.config.DeviceID } }).then(res => {
                if (res.data.code == 400) {
                    alert("device not found")
                } else {
                    this.setState(res.data);
                    console.log(this.state)
                }
            }).catch(err => { console.warn(err) })
        }
    }


    handleDeviceID() {
        //console.log(this.state)
        axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/phoneGetDisplay', { params: { DeviceID: this.props.navigation.state.params.config.DeviceID } }).then(res => {
            if (res.data.code == 400) {
                alert("device not found")
            } else {
                this.setState(res.data);
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

    pressGoBack(){
        //this.setState(DEFAULT)
        //console.log(this.state)
        this.props.navigation.goBack(null)
    }

    // render() {
    //     return (
    //         <View style = {{height: '100%', width: '100%'}}>
    //             <View style = {{height: '40%', width: '100%'}} >
    //                 <Text style = {styles.font}>WeatherConfig</Text>
    //                 <Picker
    //                     selectedValue={this.state.WeatherConfig}
    //                     //style={{ height: 50, width: 300 }}
    //                     onValueChange={(itemValue, itemIndex) =>
    //                         this.setState({WeatherConfig:itemValue})
    //                     }
    //                     itemStyle={{height:44}}
    //                 >
    //                     <Picker.Item label="OFF" value="OFF" />
    //                     <Picker.Item label="top-left" value="top-left" />
    //                     <Picker.Item label="top-right" value="top-right" />
    //                 </Picker>
    //                 <Text style = {styles.font}>MapConfig</Text>
    //                 <Picker
    //                     selectedValue={this.state.MapConfig}
    //                     //style={{ height: 50, width: 300 }}
    //                     onValueChange={(itemValue, itemIndex) =>
    //                         this.setState({MapConfig:itemValue})
    //                     }
    //                     itemStyle={{height:44}}
    //                 >
    //                     <Picker.Item label="OFF" value="OFF" />
    //                     <Picker.Item label="middle-left" value="middle-left" />
    //                     <Picker.Item label="middle-right" value="middle-right" />
    //                     <Picker.Item label="bottom-left" value="bottom-left" />
    //                     <Picker.Item label="bottom-middle" value="bottom-middle"/>
    //                     <Picker.Item label="bottom-right" value="bottom-right" />
    //                 </Picker>
    //                 <Text style = {styles.font}>NewsConfig</Text>
    //                 <Picker
    //                     selectedValue={this.state.NewsConfig}
    //                     //style={{ height: 50, width: 300 }}
    //                     onValueChange={(itemValue, itemIndex) =>
    //                         this.setState({NewsConfig:itemValue})
    //                     }
    //                     itemStyle={{height:44}}
    //                 >
    //                     <Picker.Item label="OFF" value="OFF" />
    //                     <Picker.Item label="top-left" value="top-left" />
    //                     <Picker.Item label="top-right" value="top-right" />
    //                 </Picker>
    //                 <Text style = {styles.font}>CalendarConfig</Text>
    //                 <Picker
    //                     selectedValue={this.state.CalendarConfig}
    //                     //style={{ height: 50, width: 300 }}
    //                     onValueChange={(itemValue, itemIndex) =>
    //                         this.setState({CalendarConfig:itemValue})
    //                     }
    //                     itemStyle={{height:44}}
    //                 >
    //                     <Picker.Item label="OFF" value="OFF" />
    //                     <Picker.Item label="middle-left" value="middle-left" />
    //                     <Picker.Item label="middle-right" value="middle-right" />
    //                     <Picker.Item label="bottom-left" value="bottom-left" />
    //                     <Picker.Item label="bottom-right" value="bottom-right" />
    //                 </Picker>
    //                 <Text style = {styles.font}>GmailConfig</Text>
    //                 <Picker
    //                     selectedValue={this.state.GmailConfig}
    //                     //style={{ height: 50, width: 300 }}
    //                     onValueChange={(itemValue, itemIndex) =>
    //                         this.setState({GmailConfig:itemValue})
    //                     }
    //                     itemStyle={{height:44}}
    //                 >
    //                     <Picker.Item label="OFF" value="OFF" />
    //                     <Picker.Item label="top-left" value="top-left" />
    //                     <Picker.Item label="top-right" value="top-right" />
    //                     <Picker.Item label="middle-left" value="middle-left" />
    //                     <Picker.Item label="middle-right" value="middle-right" />
    //                     <Picker.Item label="bottom-left" value="bottom-left" />
    //                     <Picker.Item label="bottom-right" value="bottom-right" />
    //                 </Picker>
    //             </View>
    //             <View style = {{height: '35%', width: '100%', justifyContent: 'center'}}>
    //                 <Text style = {styles.font}>Address</Text>
    //                 <TextInput
    //                     style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
    //                     onChangeText={text => this.setState({Address:text})}
    //                     value={this.state.Address}
    //                 />
    //             </View>
    //             <View style= {{height: '12.25%', width: '100%'}}>
    //                 <TouchableOpacity
    //                     style={styles.button}
    //                     onPress={this.onPress.bind(this)}
    //                 >
    //                     <Text> Submit </Text>
    //                 </TouchableOpacity>
    //             </View>
    //             <View style= {{height:'12.25%', width: '100%'}}>
    //                 <TouchableOpacity
    //                     style = {styles.button}
    //                     onPress = {this.pressGoBack.bind(this)}>
    //                     <Text>Back</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     )
    // }

    render() {
        return (
          <View style={styles.container}>
            <ScrollView style={styles.main}>
              {/* <View style={styles.item}>
                  <Text style={styles.text}>1</Text>
                </View>
              <View style={styles.item}>
                  <Text style={styles.text}>2</Text>
                </View> */}
                <View>
                     <Text style = {styles.font}>WeatherConfig</Text>
                     <Picker
                         selectedValue={this.state.WeatherConfig}
                         //style={{ height: 50, width: 300 }}
                         onValueChange={(itemValue, itemIndex) =>
                             this.setState({WeatherConfig:itemValue})
                         }
                         itemStyle={{height:44}}
                     >
                         <Picker.Item label="OFF" value="OFF" />
                         <Picker.Item label="top-left" value="top-left" />
                         <Picker.Item label="top-right" value="top-right" />
                     </Picker>
                </View>
                <View>
                     <Text style = {styles.font}>MapConfig</Text>
                     <Picker
                         selectedValue={this.state.MapConfig}
                         //style={{ height: 50, width: 300 }}
                         onValueChange={(itemValue, itemIndex) =>
                             this.setState({MapConfig:itemValue})
                         }
                         itemStyle={{height:44}}
                     >
                         <Picker.Item label="OFF" value="OFF" />
                         <Picker.Item label="middle-left" value="middle-left" />
                         <Picker.Item label="middle-right" value="middle-right" />
                         <Picker.Item label="bottom-left" value="bottom-left" />
                         <Picker.Item label="bottom-middle" value="bottom-middle"/>
                         <Picker.Item label="bottom-right" value="bottom-right" />
                     </Picker>
                </View>
                <View>
                     <Text style = {styles.font}>NewsConfig</Text>
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
                     </Picker>
                </View>
                <View>
                     <Text style = {styles.font}>CalendarConfig</Text>
                     <Picker
                         selectedValue={this.state.CalendarConfig}
                         //style={{ height: 50, width: 300 }}
                         onValueChange={(itemValue, itemIndex) =>
                             this.setState({CalendarConfig:itemValue})
                         }
                         itemStyle={{height:44}}
                     >
                         <Picker.Item label="OFF" value="OFF" />
                         <Picker.Item label="middle-left" value="middle-left" />
                         <Picker.Item label="middle-right" value="middle-right" />
                         <Picker.Item label="bottom-left" value="bottom-left" />
                         <Picker.Item label="bottom-right" value="bottom-right" />
                     </Picker>
                </View>
                <View>
                     <Text style = {styles.font}>GmailConfig</Text>
                     <Picker
                         selectedValue={this.state.GmailConfig}
                         //style={{ height: 50, width: 300 }}
                         onValueChange={(itemValue, itemIndex) =>
                             this.setState({GmailConfig:itemValue})
                         }
                         itemStyle={{height:44}}
                     >
                         <Picker.Item label="OFF" value="OFF" />
                         <Picker.Item label="top-left" value="top-left" />
                         <Picker.Item label="top-right" value="top-right" />
                         <Picker.Item label="middle-left" value="middle-left" />
                         <Picker.Item label="middle-right" value="middle-right" />
                         <Picker.Item label="bottom-left" value="bottom-left" />
                         <Picker.Item label="bottom-right" value="bottom-right" />
                     </Picker>
                </View>
                <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{"\n"}</Text>
                    <Text style= {{color: 'red'}}>WARNING!!!: Each spot can only be filled by one component. 
                        DO NOT place two components in the same spot. For example, placing WeatherConfig at the top-left and NewsConfig at the top-left. 
                        This will cause the user interface of the mirror to look unnatural.</Text>
                        <Text>{"\n"}</Text>
                </View>
                <View>
                {/* <View style = {{height: '10%', width: '100%', justifyContent: 'center'}}> */}
                     <Text style = {styles.font}>Address</Text>
                     <TextInput
                         style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                         onChangeText={text => this.setState({Address:text})}
                         value={this.state.Address}
                     />
                 </View>
            </ScrollView>
            <View style={styles.bbar}>
              {/* <Text style={styles.text}>Fixed bottom bar</Text> */}
              <View style= {{height: '50%%', width: '50%'}}>
                     <TouchableOpacity
                         style={styles.button}
                         onPress={this.onPress.bind(this)}
                     >
                         <Text> Submit </Text>
                     </TouchableOpacity>
                 </View>
                 <View style= {{height:'50%', width: '50%'}}>
                     <TouchableOpacity
                         style = {styles.button}
                         onPress = {this.pressGoBack.bind(this)}>
                         <Text>Back</Text>
                     </TouchableOpacity>
                 </View>
            </View>
          </View>
        );
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
      },
    font: {
        fontWeight: 'bold',
        fontSize: 16
    },

    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      tbar: {
        width: "100%",
        height: 100,
        borderBottomWidth: 5,
        borderColor: 'black',
        backgroundColor: 'red'
      },
      main: {
        flex: 1,
        height: '100%',
        width: '100%'
      },
      item: {
        height: 200,
        width: "100%",
        marginTop: 10,
        backgroundColor: 'green'
      },
      bbar: {
        width: "100%",
        height: 100,
        justifyContent: 'center',
        alignItems:'center',
        borderTopWidth: 10,
        borderColor: '#67baf6',
        backgroundColor: '#67baf6'
      },
      text: {
        color: '#ffffff',
        fontSize: 40
      }
})