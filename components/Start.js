import React from 'react';

// import react UI components
import {
  StyleSheet, Text, View, TextInput, ImageBackground,
  TouchableHighlight, TouchableOpacity, Image
} from 'react-native';

// class component
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '#474056'
    }
  }

  render() {
    const color = this.state.color;
    return (
      <ImageBackground source={require('../assets/background-img.png')} style={{ flex: 1, justifyContent: 'space-between' }}>

        <Text style={styles.appTitle}>shatApp</Text>

        <View style={styles.container}>


          <View style={{flexDirection:'row'}}>
            <Image source={require('../assets/userIcon.png')} style={{ height: 25, width: 25, right: 3, top: 7}} />
            <TextInput
              accessible={true}
              accessibilityLabel="Name input"
              style={styles.nameInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder= 'Enter Your Name'
            />
          </View>

          <Text style={styles.colorOption}>Choose Background Color:</Text>

          <View style={styles.colors}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Change chat background color to violet"
              accessibilityRole="button"
              style={[styles.circle, {backgroundColor: '#474056'}]}
              onPress={(color) => this.setState({color: '#474056'})}
            >
              { (this.state.color == '#474056') ?
                (<View style={[styles.active, {borderColor: '#474056'}]} ></View>) :
                (<View  ></View>)
              }
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Change chat background color to black"
              accessibilityRole="button"
              style={[styles.circle, {backgroundColor: '#090C08'}]}
              onPress={(color) => this.setState({color: '#090C08'})}
            >
              { (this.state.color == '#090C08') ?
                (<View style={[styles.active, {borderColor: '#090C08'}]} ></View>) :
                (<View  ></View>)
              }
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Change chat background color to grey"
              accessibilityRole="button"
              style={[styles.circle, {backgroundColor: '#8A95A5'}]}
              onPress={(color) => this.setState({color: '#8A95A5'})}
            >
              { (this.state.color == '#8A95A5') ?
                (<View style={[styles.active, {borderColor: '#8A95A5'}]} ></View>) :
                (<View  ></View>)
              }
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Change chat background color to light green"
              accessibilityRole="button"
              style={[styles.circle, {backgroundColor: '#B9C6AE'}]}
              onPress={(color) => this.setState({color: '#B9C6AE'})}
            >
              { (this.state.color == '#B9C6AE') ?
                (<View style={[styles.active, {borderColor: '#B9C6AE'}]} ></View>) :
                (<View  ></View>)
              }
            </TouchableOpacity>
            </View>
          <TouchableHighlight style={styles.button}
            accessible={true}
            accessibilityLabel="Button to submit the form and navigate to chat room"
            accessibilityRole="button"
            //function navigates to the Chat screen with the params of the user's name and background color selected
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
            <Text style={styles.buttonLabel}>Start Chatting</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    )//return
  }//render
}

const styles = StyleSheet.create({
  appTitle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 70,
    fontWeight: '600',
    marginTop: '8%',
  },
  container: {
    alignContent: 'flex-end',
    height: '60%',
    width: '88%',
    marginBottom: '15%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.87)',
    paddingHorizontal: '6%',
    paddingVertical: '12%',
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '300',
    borderWidth: 1,
    borderColor: '#757083',
    width: '88%',
    height:32,
    paddingHorizontal: '3%',
    marginBottom:'14%',
  },
  colorOption: {
    fontSize: 16,
    fontWeight: '300',
    margin: '4%',
  },
  colors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '72%',
    height: 40,
    marginBottom:'20%',
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  active: {
    height: 50,
    width: 50,
    borderWidth: 3,
    borderRadius: 80,
    marginTop: -5,
    marginLeft: -5,
  },
  button: {
    backgroundColor: '#757083',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});
