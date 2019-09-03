import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class HelloWorld extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box1}></View>
        <View style={styles.box2}></View>
        <View style={styles.box3}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    flex:10,
    backgroundColor: 'blue'
  },
  box2: {
    flex:120,
    backgroundColor: 'red'
  },
  box3: {
    flex:50,
    backgroundColor: 'green'
  }
});