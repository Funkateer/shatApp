# Chat App
Chat App is a React Native application for mobile devices (Android and iOS) that features GiftedChat, a chat UI by Farid Safi. This communication app allows you to
  - select images from your device's storage,
  - take photos,
  - get current geo-location,
  - write send and receive messages.

### Setup Accounts
To be able to access and use the services for the development and setup of this app, the following accounts need to be set up.
* [Expo] - building native iOS and Android apps using JavaScript and React
* [Firebase] - mobile development platform

### Data Storage
For data storage and user authentication, the services of Firebase have been used.
  - Cloud Firestore database for storage of the messages
  - Firebase Storage for storage of the images
  - Firebase Authentication with Anonymous Sign-In Provider

### Installation
```sh
$ npm install expo-cli --global
```
The following npm packages are required, the versions are mentioned for compatibility issues that might arise.

|package |
|--------|
 |@react-native-community/async-storage:|
 |cookies|
 |eslint|
 |expo|
 |firebase|
 |netinfo|
 |react|
 |react-dom|
 |react-native|
 |react-native-gesture-handler|
 |react-native-gifted-chat|
 |react-native-keyboard-spacer|
 |react-native-web|
 |react-navigation|
 |react-navigator|

All packages have been installed locally
```sh
$ npm install -s [package name]
```

### Setup
- set up React Native app with Expo by running $ expo init [project name] in the Win CMD
- create basic file setup with start.js, chat.js and custom-actions.js
- enable navigation between screens through react-navigator
- setup and configure GiftedChat, incl. KeyBoardSpacer - use hardwired data
- setup of Firebase database
- setup of Firebase authentication
- setup of AsyncStorage for offline data management
- implement NetInfo for online/offline switch
- implement mobile device's communication features, i.e. camera and geolocation
