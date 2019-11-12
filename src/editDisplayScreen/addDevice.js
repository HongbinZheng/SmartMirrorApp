import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Picker, TextInput, Alert } from 'react-native';

export default class addDevice extends Component {
    constructor (props) {
        super(props);
        this.state ={
            DeviceID:""
        }
    }

    onFieldChange(event) {
        // for a regular input field, read field name and value from the event
        //const fieldName = event.target.name;
        //const fieldValue = event.target.value;
        this.props.onChange(event);
    }

    render() {
        return (
            <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    style={{ height: 40 , width: '50%'}}
                    name="DeviceID"
                    placeholder="Enter Your DeviceID"
                    onChangeText={(text) => this.onFieldChange(text)}
                    value={this.props.DeviceID}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.props.handleDeviceID.bind(this)}
                >
                    <Text> Submit </Text>
                </TouchableOpacity>
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