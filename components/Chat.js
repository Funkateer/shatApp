/**
* @description Chat.js is the second page view, displays the chat room multiple actions)
*/

/**
* @class Chat
* @requires React
* @requires React-Native
* @requires Keyboard Spacer
* @requires Custom Actions
* @requires React Native Maps
* @requires Expo Image Picker
* @requires Expo Permissions
* @requires Expo Location
* @requires Firebase
* @requires Firestore
*/

import React from 'react';

// import React native UI
import {
  StyleSheet, View, Platform, AsyncStorage, NetInfo,
} from 'react-native';

// library with GiftedChat UI
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// MapView need to be imported separately
import MapView from 'react-native-maps';

// library for Android devices to keep input field above the keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer';

// import OfflineNotice component
import OfflineNotice from './OfflineNotice';

// custom component shown in messages input bar (take photo, share an image and location)
import CustomActions from './CustomActions';

// import Firebase to create a db to store messages
const firebase = require('firebase');
require('firebase/firestore');

// class component
export default class Chat extends React.Component {
  constructor() {
    super();
    /**
    * firestore credentials for chat-app db
    */

    /**
    * @param {object} firebaseConfig database credentials
    * @param {string} apiKey
    * @param {string} authDomain
    * @param {string} databaseURL
    * @param {string} projectID
    * @param {string} storageBucket
    * @param {string} messagingSenderId
    * @param {string} appId
    */
    const firebaseConfig = {
      apiKey: 'AIzaSyCfkNxTq6SpqLiIl8SD3uH4kIGje8lR79w',
      authDomain: 'shatapp-75fd3.firebaseapp.com',
      databaseURL: 'https://shatapp-75fd3.firebaseio.com',
      projectId: 'shatapp-75fd3',
      storageBucket: 'shatapp-75fd3.appspot.com',
      messagingSenderId: '313707926543',
      appId: '1:313707926543:web:8deff3b3941930bc403f7a',
    };
    // app initialization
    if (!firebase.apps.length) { // avoid re-initializing
      firebase.initializeApp(firebaseConfig);
    }
    // reference to firstore collection 'messages' where chat messages are stored
    this.referenceMessages = firebase.firestore().collection('messages');

    // initialize state
    this.state = {
      isConnected: false,
      uid: 0,
      messages: [],
      image: null,
      location: null,
      uri: null,
      systemMessages: [
        {
          _id: 0,
          text: 'Please wait, you are getting logged in',
          createdAt: new Date(),
          system: true,
        },
      ],
    };
  }// constructor

  /**
  * once collection gets updated a snapshot is taken
  */
  onCollectionUpdate = (querySnapshot) => {
    /**
    * @function onCollectionUpdate
    * @example UI data
    * @param {string} _id message object id
    * @param {string} text text message
    * @param {number} created.At date and time
    * @param {object} user id, avatar and name
    * @param {string} user._id user id
    * @param {string} user.avatar image href
    * @param {string} user.name user name
    * @param {string} image downloadUrl
    * @param {object} location longitude and latitude
    * @param {number} location.longitude longitude coordinate of current location
    * @param {number} location.latitude latitude coordinate of current location
    */

    const messages = [];
    messages.push(this.state.systemMessages[0]);
    // go through each document
    try {
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        const data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text || '',
          createdAt: data.createdAt.toDate(),
          user: data.user,
          image: data.image || null,
          location: data.location || null,
        });
        this.setState({
          messages,
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
  * add the message object to firestore, called by onSend
  */
  addMessage() {
    /**
    * @function addMessage
    * @example message data send to firebase
    * @param {string} _id message object id
    * @param {string} text text message
    * @param {number} created.At date and time
    * @param {object} user id, avatar and name
    * @param {string} user._id user id
    * @param {string} user.avatar image href
    * @param {string} user.name user name
    * @param {string} image downloadUrl
    * @param {object} location longitude and latitude
    * @param {number} location.longitude longitude coordinate of current location
    * @param {number} location.latitude latitude coordinate of current location
    */

    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // append new messages to the ones saved in the state, Firebase and asyncStorage
  onSend(messages = []) {
    try {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), () => {
        this.addMessage();
        this.saveMessages();
      });
    } catch (error) {
      console.log(error);
    }
  }

  // variable 'user' as used in component GiftedChat
  get user() {
    return {
      _id: this.state.uid,
      name: this.props.navigation.state.params.name,
      avatar: 'https://placeimg.com/140/140/any',
    };
  }

  // styles the header bar and sets the the username as title
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerStyle: {
      backgroundColor: navigation.state.params.color,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: '600',
    },
  });

  // styles the speech bubble
  renderBubble(props) {
    return (
      // chat bubble stylings
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#128C7E',
          },
        }}
        textStyle={{
          right: {
            color: 'black',
          },
        }}
      />
    );
  }

  // custom tag displaying the position selected from user to be sent
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.01,
          }}
        />
      );
    }
    return null;
  }

  // gets ready the custom action (aka the plus sign in msg input bar)
  renderCustomActions = (props) => <CustomActions {...props} />;

  // checks if isConnected or not
  handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  }

  // pre-populate chat loading the messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // converts the messages to string and saves it into asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // hide keyboard and text input if user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar {...props} />
      );
    }
  }

  render() {
    // user name as props for nav bar
    const navigation = this.props.navigation.state.params.name;
    // color as props for background
    const chosenColor = this.props.navigation.state.params.color;

    return (
      // set the backgroundColor to the one passed in the params
      <View style={{ flex: 1, backgroundColor: chosenColor }}>

        {/* Component shows a red banned on top of the screen in user go offline */}
        <OfflineNotice />

        {this.state.uri
          // preview of the img taken or selected to be sent
          && <Image source={{ uri: this.state.uri }} style={styles.image} />}

        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          onSend={(messages) => this.onSend(messages)}
          user={this.user}
        />

        { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );// return
  }// render

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );

    // if online fetch messages from Firestore, otherwise from asyncStorage
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected == true) {
        // check whether the user is signed in and if not authorize a new user
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          // update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
            isConnected: true,
            systemMessages: [
              {
                _id: 0,
                text: `Welcome ${this.user.name}`,
                system: true,
                createdAt: new Date(),
                connection_Status: '',
              },
            ],
          });
          // listen for collection changes for chat room
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline from fetch');
        this.setState({
          isConnected: false,
        });
      }
    });// NetInfo
  }// componentDidMount

  // lifecycle upon component will un-mount
  componentWillUnmount() {
    // stop listening for changes
    this.unsubscribe();
    // stop listening to authentication
    this.authUnsubscribe();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
  }
}

// Stylings
const styles = StyleSheet.create({
  btnDelete: {
    textAlign: 'center',
    padding: 5,
    backgroundColor: 'red',
    color: 'white',
    width: '40%',
    right: 0,
    alignSelf: 'flex-end',
  },
});
