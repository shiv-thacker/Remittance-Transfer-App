import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {colorsobject} from '../assets/Color';
import Navigation from '../Navigation.js/Navigation';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId:
    '131693510285-bomklkn4a16i4ejh09gn17q5rfmprubk.apps.googleusercontent.com',
  offlineAccess: true,
});

const Login = () => {
  // useEffect(() => {
  //   const handleLogout = async () => {
  //     try {
  //       // Sign out from Google Sign-In
  //       await GoogleSignin.signOut();

  //       // Remove user details from AsyncStorage
  //       await AsyncStorage.removeItem('userDetails');
  //     } catch (error) {
  //       console.error('Logout Error:', error);
  //     }
  //   };

  //   handleLogout();
  // }, []);
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    userGoogleInfo: {},
    loaded: false,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserDetails({userGoogleInfo: userInfo, loaded: true});
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify({userInfo, loaded: true}),
      );
      navigation.navigate('Bottomnavigation', {
        userDetails: {userInfo, loaded: true},
        fromLogin: true,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log('other errror');
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserDetails({userGoogleInfo: null, loaded: false}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{flex: 1, backgroundColor: colorsobject.themecolor, padding: 20}}>
      <Text style={{color: 'white', fontSize: 40, fontWeight: '600'}}>
        Login
      </Text>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 30, fontWeight: '400'}}>
          Sign in with
        </Text>
        <GoogleSigninButton
          onPress={() => signIn()}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          style={{width: 192, height: 48, marginTop: 20}}
        />
      </View>

      {/* <TouchableOpacity onPress={() => signOut()}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      {/* 
      {userDetails.loaded ? (
        <View>
          <Text>{userDetails.userGoogleInfo.user.name}</Text>
          <Text>{userDetails.userGoogleInfo.user.email}</Text>
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              borderWidth: 1,
            }}
            source={{uri: userDetails.userGoogleInfo.user.photo}}
          />
        </View>
      ) : (
        <Text>Not loaded</Text>
      )} */}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
