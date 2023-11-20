import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Transaction from '../Screens/Transaction';
import History from '../Screens/History';
import {colorsobject} from '../assets/Color';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useFocusEffect} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const BASE_URL = 'https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api';

const Bottomnavigation = ({navigation}) => {
  const route = useRoute();
  const [userInfo, setUserInfo] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forceRender, setForceRender] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const getUserDetailsFromStorage = async () => {
        try {
          const storedUserDetails = await AsyncStorage.getItem('userDetails');

          if (!storedUserDetails) {
            navigation.navigate('Login');
            Alert.alert('Login Details not found, Please login Again');
          } else {
            const {userInfo, loaded} = JSON.parse(storedUserDetails);
            setUserInfo(userInfo);
            setLoaded(loaded);
            // Update your state or perform any other actions with the retrieved data
          }
        } catch (error) {
          // Handle errors
        } finally {
          setLoading(false);
        }
      };

      getUserDetailsFromStorage();
    }, [forceRender]),
  );

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Confirm Exit', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const Tab = createBottomTabNavigator();

  const [active, setActive] = useState('Transaction');

  const handleLogout = async () => {
    try {
      // Sign out from Google Sign-In
      await GoogleSignin.signOut();

      // Remove user details from AsyncStorage
      await AsyncStorage.removeItem('userDetails');

      setForceRender(forceRender + 1);
      // Navigate to the Login screen or perform any other actions
      await navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  useEffect(() => {
    if (!loading) {
      // Now that user details are loaded, you can perform additional actions if needed
    }
  }, [userInfo, loading]);

  useEffect(() => {
    const createuser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userInfo,
          }),
        });

        if (response.ok) {
          setLoading(false);
          Alert.alert('User created');
          console.log('User created');
        } else {
          setLoading(false);
          Alert.alert('Can not create more than 100 user');
          // Handle error
          console.error('User is not created');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Failed to create user');
        console.error('Error creating user:', error);
      }
    };
    if (route.params && route.params.fromLogin) {
      createuser();
    }
  }, [route.params]);

  return (
    <>
      <View style={styles.headercontainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={styles.headerimage}
              source={{
                uri:
                  userInfo?.user?.photo ||
                  'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
              }}
            />
            <Text style={styles.headertext}>{userInfo?.user?.name}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../assets/images/logout.png')}
            style={{height: 20, width: 20, tintColor: colorsobject.white}}
          />
          <Text style={{color: colorsobject.white}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        tabBar={({state, descriptors, navigation}) => (
          <View style={styles.container}>
            <View style={styles.icons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.iconContainer,
                  {
                    borderTopWidth: active == 'Transaction' ? 3 : 0,
                    borderTopColor:
                      active == 'Transaction' ? colorsobject.themecolor : null,
                  },
                ]}
                onPress={() => {
                  active == 'Transaction' ? null : setActive('Transaction');
                  navigation.navigate('Transaction');
                }}>
                <Image
                  source={require('../assets/images/transaction.png')}
                  style={[
                    styles.icon,
                    {
                      tintColor:
                        active === 'Transaction'
                          ? colorsobject.themecolor
                          : null,
                    },
                  ]}
                />

                <Text
                  style={{
                    color:
                      active == 'Transaction'
                        ? colorsobject.themecolor
                        : colorsobject.black,
                  }}>
                  Transaction
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.iconContainer,
                  {
                    borderTopWidth: active == 'History' ? 3 : 0,
                    borderTopColor:
                      active == 'History' ? colorsobject.themecolor : null,
                  },
                ]}
                onPress={() => {
                  active == 'History' ? null : setActive('History');
                  navigation.navigate('History');
                }}>
                <Image
                  source={require('../assets/images/history.png')}
                  style={[
                    styles.icon,
                    {
                      tintColor:
                        active === 'History' ? colorsobject.themecolor : null,
                    },
                  ]}
                />
                <Text
                  style={{
                    color:
                      active == 'History'
                        ? colorsobject.themecolor
                        : colorsobject.black,
                  }}>
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}>
        <Tab.Screen
          name={'Transaction'}
          component={Transaction}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name={'History'}
          component={History}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </>
  );
};

export default Bottomnavigation;

const styles = StyleSheet.create({
  headercontainer: {
    top: 0,
    height: 60,
    backgroundColor: colorsobject.themecolor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerimage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colorsobject.white,
  },
  headertext: {
    color: colorsobject.white,
    fontSize: 20,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colorsobject.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderWidth: 2,
    borderTopColor: colorsobject.white,
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'relative',
    height: 50,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },

  icon: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
});
