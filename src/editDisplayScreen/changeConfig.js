import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert } from 'react-native';
import { Header } from 'react-native-elements';

export default class changeConfig extends Component {
    constructor (props) {
        super(props);
        this.state = {
            WeatherConfig: this.props.config.WeatherConfig,
            MapConfig: this.props.config.MapConfig,
            NewsConfig: this.props.config.NewsConfig,
            DateConfig: this.props.config.DateConfig,
            address:this.props.config.address
        };
    }

    onPressButton(){
        this.props.onPress()
    }
    valueChange(value,name){
        this.props.valueChange(value,name)
    }
    onChangeText(text){
        this.props.addressChange(text)
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
                        selectedValue={this.props.config.WeatherConfig}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.valueChange(itemValue,'WeatherConfig')
                        }

                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="top-left" value="top-left" />
                        <Picker.Item label="top-middle" value="top-middle" />
                        <Picker.Item label="top-right" value="top-right" />
                    </Picker>
                    <Text>MapConfig</Text>
                    <Picker
                        selectedValue={this.props.config.MapConfig}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.valueChange(itemValue,'MapConfig')
                        }

                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="bottom-left" value="bottom-left" />
                        <Picker.Item label="bottom-right" value="bottom-right" />
                    </Picker>
                    <Text>NewsConfig</Text>
                    <Picker
                        selectedValue={this.props.config.NewsConfig}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.valueChange(itemValue,'NewsConfig')
                        }

                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="middle-left" value="middle-left" />
                        <Picker.Item label="middle-right" value="middle-right" />
                    </Picker>
                    <Text>DateConfig</Text>
                    <Picker
                        selectedValue={this.props.config.DateConfig}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.valueChange(itemValue,'DateConfig')
                        }

                    >
                        <Picker.Item label="OFF" value="OFF" />
                        <Picker.Item label="top-left" value="top-left" />
                        <Picker.Item label="top-middle" value="top-middle" />
                        <Picker.Item label="top-right" value="top-right" />
                    </Picker>
                </View>
                <View>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={text => this.onChangeText(text)}
                        value={this.props.config.Address}
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onPressButton.bind(this)}
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
