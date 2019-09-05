import React from 'react';

// library for Android devices to keep input field above the keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer';

// import react UI
import {  View, Platform } from 'react-native';
//library with chat UI
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// class component
export default class Chat extends React.Component {
  state = {
    message: []
  };

  // set example user and system messages
  componentDidMount() {
    this.setState({
      //hard-coded 'default message'
      messages: [
        {
          _id: 1,
          text: 'Hello you',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          // system message telling that you entered the chat room
          _id: 2,
          text: 'System message, ' + '"' + this.props.navigation.state.params.name + '"' + ' just entered the chat',
          createdAt: new Date(),
          system: true,
        }
      ],
    })
  }

    //function that appends new messages to the ones saved in state
    onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  //navigation bar configuration
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  }

    //function that determines speech bubble background color
    renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#128C7E',
          }
        }}
        textStyle={{
          right: {
            color: 'black',
          },
        }}
      />
    )
  }

  render() {
    const navigation = this.props.navigation.state.params.name;
    const chosenColor = this.props.navigation.state.params.color;
    return (
      //set the background to the one passed in the params
      <View style={{flex: 1,
        backgroundColor: chosenColor,
      }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )
  }
}
