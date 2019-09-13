import React from 'react';

//import React native UI
import {
  StyleSheet, View, Platform, Text,
  TouchableOpacity, AsyncStorage, NetInfo
} from 'react-native';

//library with GiftedChat UI
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

//library for Android devices to keep input field above the keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer';

//import OfflineNotice component
import OfflineNotice from './OfflineNotice'

//import Firebase to create a new Firestore db to store messages
const firebase = require('firebase');
require('firebase/firestore');

// class component
export default class Chat extends React.Component {
  constructor() {
    super()
    //firestore credentials for shatApp db
    var firebaseConfig = {
      apiKey: "AIzaSyCfkNxTq6SpqLiIl8SD3uH4kIGje8lR79w",
      authDomain: "shatapp-75fd3.firebaseapp.com",
      databaseURL: "https://shatapp-75fd3.firebaseio.com",
      projectId: "shatapp-75fd3",
      storageBucket: "shatapp-75fd3.appspot.com",
      messagingSenderId: "313707926543",
      appId: "1:313707926543:web:8deff3b3941930bc403f7a"
    };
    //app initialization
    if (!firebase.apps.length) { //avoid re-initializing
      firebase.initializeApp(firebaseConfig)
    };
    //reference to firstore collection 'messages' where chat messages are stored
    this.referenceMessages = firebase.firestore().collection('messages');

    this.state = {
      isConnected : false,
      uid: 0,
      messages: [],
      systemMessages: [
        {
          _id: 0,
          text: 'Please wait, you are getting logged in',
          createdAt: new Date(),
          system: true,
        }
      ],
    };
  };//constructor

  //once collection gets updated a snapshot is taken
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    messages.push(this.state.systemMessages[0]);
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      })
      this.setState({
        messages,
      });
    })
  };

  //add the message to firestore, function 'fired' by onSend
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    })
  };

  //will add new message to messages array
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=> {
      this.addMessage();
      this.saveMessages();
    });
  };

  //variable 'user' as used in component GiftedChat
  get user() {
    return {
      _id: this.state.uid,
      name: this.props.navigation.state.params.name,
      avatar: 'https://placeimg.com/140/140/any'
    };
  }

  //hide keyboard and text input UI if user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar {...props}/>
      )
    };
  };

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
      //chat bubble stylings
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
  };

  //checks if isConnected or not
  handleConnectivityChange = (isConnected) => {
    if(isConnected == true) {
      console.log('Status set to online from handleConnectivityChange');
      this.setState({
        // uid: user.uid,
        isConnected: true,
      });
      this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    }
    else {
      console.log('Status set to offline from handleConnectivityChange');
      this.setState({
        isConnected: false,
      });
    }
  }

  //pre-populate chat with local stored messages
  async getMessages() {
    console.log('getMessages() has been invoked')
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    };
  };

  //converts the messages to string to be stored
  async saveMessages() {
    console.log('saveMessages() has been invoked');
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //deletes the Async storage collection 'messages'
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      console.log('delete button fired')
    } catch (error) {
      console.log(error.message);
    };
  };

  render() {
    //user name as props for nav bar
    const navigation = this.props.navigation.state.params.name;
    //color as props for background
    const chosenColor = this.props.navigation.state.params.color;

    return (
      //set the backgroundColor to the one passed in the params
      <View style={{flex: 1, backgroundColor: chosenColor}}>

        {/* Component shows a red banned on top of the screen in user go offline */}
        <OfflineNotice />

        <TouchableOpacity onPress={this.deleteMessages}>
          <Text style={styles.btnDelete}>Delete Messages</Text>
        </TouchableOpacity>

        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.user}
        />

        { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )//return
  };//render

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == true) {
        console.log('online from fetch');
        //listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
            isConnected: true,
            systemMessages:[
              {
                _id: 0,
                text: 'Welcome ' + this.user.name,
                system: true,
                createdAt: new Date(),
                connection_Status : '',
              }
            ]
          });
          //listen for collection changes for chat room
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      }
      else {
        console.log('offline from fetch');
        this.setState({
          isConnected: false,
        });
      }
    });//NetInfo
  }//componentDidMount

  //lifecycle upon component will un-mount
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    )
  };
};

//Stylings
const styles = StyleSheet.create({
  btnDelete: {
    textAlign: 'center',
    padding: 5,
    backgroundColor: 'red',
    color: 'white',
    width:'40%',
    right: 0,
    alignSelf: 'flex-end',
  },
})
