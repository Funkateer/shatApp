import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'

// import react UI components
import { StyleSheet, Text, View, Button, Navigator } from 'react-native';

// class component
export default class Chat extends React.Component {
  //navigation bar configuration
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  }
  render() {
    const navigation = this.props.navigation.state.params.name;
    const chosenColor = this.props.navigation.state.params.color;
    return (
      <View style={{flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: chosenColor}}
      >
      </View>
    )
  }
}

