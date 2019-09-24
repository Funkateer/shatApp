/**
* @description custom-actions.js manages the custom action button in the text input field
*/

/**
* @class CustomActions
* @requires react - component react
* @requires react-native - component react-native
* @requires prop-types
* @requires expo-image-picker - component ImagePicker from expo-library enables to select an image from the device
* @requires expo-permissions - component Permissions from expo-library requests user permission for selectable tasks
* @requires expo-location - component Location from expo-library
* @requires firebase - import all components from firebase
* @requires firebase/firestore - specify firestore
*/

import React from 'react';

// import React native UI
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';

// define what the props sent to a component should look like
import PropTypes from 'prop-types';

// ImagePicker, Permissions and Location are no longer included in expo and need to be installed separately
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

// import Firebase to create a db to store data
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {
  // allows user to pick and send images from their device, this is the first of the three possible options in the CustomActions
  pickImage = async () => {
    // use expo-permissions to ask user if agrees to open camera roll
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      // only proceed if user granted permission
      if (status === 'granted') {
        // let user pick an image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
          // check if user cancelled image selection
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          // update state and store picked image
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // allows user to take a new picture to send
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // allows user to share their location using GPS
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({})
          .catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const altitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: { longitude: result.coords.longitude, latitude: result.coords.latitude },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // stores the data exchanged between users (i.g photos or gps positions) in firebase
  uploadImageFetch = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        // upload image to Storage with XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const imageNameBefore = uri.split('/');
      const imageName = imageNameBefore[imageNameBefore.length - 1];

      const ref = firebase
        .storage()
        .ref()
        .child('images/' + imageName);
      // upload image to Storage with fetch() and blob()`
      const snapshot = await ref.put(blob);
      blob.close();
      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.log(error.message);
    }
  }

  // the three options given by this component which TouchableOpacity in render() will display
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
        }
      },
    );
  };

  render() {
    return (
      // a dropdown-like menù showed as a '+' plus symbol
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    flex: 1,
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
  },
  iconText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b2b2b2',
    backgroundColor: 'transparent',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
