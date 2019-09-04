import React from 'react';
// import react UI components
import {
  StyleSheet, Text, View, TextInput, ImageBackground, TouchableHighlight, TouchableOpacity
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
      border: false
    }
  }

  changeColor = (value) => {
    this.setState({color: value});
  }

  render() {
    const color = this.state.color;
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/background-img.png')} style={styles.backgroundImage}>
          <Text style={styles.title}>shatApp</Text>
          <View style={styles.entries}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Enter Your Name'
            />
            <Text style={styles.colorOption}>Choose Background Color:</Text>
            <View style={styles.colors}>

              <TouchableOpacity
                style={styles.black}
                onPress={(color) => this.setState({color: '#090C08'})
              }
              >
                { (this.state.color == '#090C08') ?
                  (<View style={styles.black_active} ></View>) :
                  (<View style={styles.black} ></View>)
                }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(color) => this.setState({color: '#474056'})}
                style={styles.violet}
              >
                { (this.state.color == '#474056') ?
                  (<View style={styles.violet_active} ></View>) :
                  (<View style={styles.violet} ></View>)
                }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(color) => this.setState({color: '#8A95A5'})}
                style={styles.grey}
              >
                { (this.state.color == '#8A95A5') ?
                  (<View style={styles.grey_active} ></View>) :
                  (<View style={styles.grey} ></View>)
                }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(color) => this.setState({color: '#B9C6AE'})}
                style={styles.green}
              >
                { (this.state.color == '#B9C6AE') ?
                  (<View style={styles.green_active} ></View>) :
                  (<View style={styles.green} ></View>)
                }
              </TouchableOpacity>
              </View>
            <TouchableHighlight style={styles.button}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
              <Text style={styles.buttonLabel}>Start Chatting</Text>
            </TouchableHighlight>
          </View>
          {/* entries */}
        </ImageBackground>
      </View> //container
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 62,
    fontWeight: '600',
    marginTop: 30
  },
  entries: {
    width: '88%',
    height: '55%',
    backgroundColor: '#fff',
    marginBottom: 90,
    justifyContent: 'center',
    alignItems: 'center',

  },
  input: {
    fontSize: 18,
    fontWeight: '300',
    borderWidth: 1,
    borderColor: '#757083',
    width: '88%',
    height:36,
    paddingHorizontal: 10,
    marginBottom:20
  },
  colorOption: {
    fontSize: 16,
    fontWeight: '300',
    margin: 20
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 60,
    borderRadius: 20
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  colors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '72%',
    height: 40,
    marginLeft: 12
  },
  black: {
    backgroundColor: '#090C08',
    height: 40,
    width: 40,
    borderRadius: 80
  },
  black_active: {
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 80,
    borderWidth:2,
    borderColor: '#090C08'
  },
  violet: {
    backgroundColor: '#474056',
    height: 40,
    width: 40,
    borderRadius: 80
  },
  violet_active: {
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 80,
    borderWidth:2,
    borderColor: '#474056'
  },
  grey: {
    backgroundColor: '#8A95A5',
    height: 40,
    width: 40,
    borderRadius: 80
  },
  grey_active: {
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 80,
    borderWidth:2,
    borderColor: '#8A95A5'
  },
  green: {
    backgroundColor: '#B9C6AE',
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  green_active: {
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 80,
    borderWidth:2,
    borderColor: '#B9C6AE'
  }
});
