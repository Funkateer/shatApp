import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground } from 'react-native';

export default class Start extends React.Component {

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello Screen1!</Text>
        <Button
          title="Go to Screen 2"
          onPress={() => this.props.navigation.navigate('Chat')}
        />
      </View>
    )
  }
}
