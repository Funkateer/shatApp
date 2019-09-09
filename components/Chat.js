import React from 'react';
// library for Android devices to keep input field above the keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer';
// import React native UI
import {  View, Platform, Text } from 'react-native';
//library with GiftedChat UI
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// import db firestore from firebase
const firebase = require('firebase');
require('firebase/firestore');

// class component
export default class Chat extends React.Component {
  constructor() {
    super();
    // firestore credentials for shatApp db
    var firebaseConfig = {
      apiKey: "AIzaSyCfkNxTq6SpqLiIl8SD3uH4kIGje8lR79w",
      authDomain: "shatapp-75fd3.firebaseapp.com",
      databaseURL: "https://shatapp-75fd3.firebaseio.com",
      projectId: "shatapp-75fd3",
      storageBucket: "shatapp-75fd3.appspot.com",
      messagingSenderId: "313707926543",
      appId: "1:313707926543:web:8deff3b3941930bc403f7a"
    };
    // app initialization
    if (!firebase.apps.length) { //avoid re-initializing
      firebase.initializeApp(firebaseConfig)
    }
    //reference to firstore collection 'messages' where chat messages are stored
    this.referenceMessages = firebase.firestore().collection('messages');
    this.state = {
      uid: 0,
      messages: [
        {
          _id: 0,
          text: 'Please wait, you are getting logged in',
          createdAt: new Date(),
          system: true
        }
      ]
    };
  }//constructor

  //  once collection gets updated a snapshot is taken
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
        messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
      this.setState({
        messages,
      });
    });
  };

  // add the message to firestore, function 'fired' by onSend
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    })
  }

  // will add new message to messages array
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=> {
      this.addMessage();
    });
  }

  // variable 'user' as used in component GiftedChat
  get user() {
    return {
      _id: this.state.uid,
      name: this.props.navigation.state.params.name,
      avatar: 'https://placeimg.com/140/140/any'
    };
  }

  //function that styles the header bar and sets the the username as title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
      headerStyle: {
        backgroundColor: navigation.state.params.color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: '600',
      },
    };
  };

  //function that determines speech bubble background color
  renderBubble(props) {
    return (
      // chat bubble stylings
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
    // user name as props for nav bar
    const navigation = this.props.navigation.state.params.name;
    // color as props for background
    const chosenColor = this.props.navigation.state.params.color;
    return (
      //set the background to the one passed in the params
      <View style={{flex: 1,backgroundColor: chosenColor,}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.user}
        />
        { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )//return
  }//render

  componentDidMount() {
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
      uid: user.uid,
      messages: [
        {
          _id: 0,
          text: 'Welcome ' + this.user.name,
          system: true
        }
      ]
      })
      // create a reference to the active user's documents (messages)
      this.referenceUSer = firebase.firestore().collection('messages').where("uid", "==", this.state.uid); // Y U NO WORK
      // listen for collection changes for current user
      this.unsubscribeUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    })
  }

  // lifecycle upon component will un-mount
  componentWillUnmount() {
    this.unsubscribeUser();
    this.authUnsubscribe()
  }
}
