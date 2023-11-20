import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {colorsobject} from '../assets/Color';

const SplashScreen = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsVisible(false);
      navigation.navigate('Bottomnavigation');
    }, 1000); // Set the timeout duration in milliseconds (here, 3000 milliseconds or 3 seconds)

    return () => {
      clearTimeout(splashTimeout); // Clear the timeout if the component is unmounted before the timeout completes
    };
  }, []);

  return (
    <View style={styles.container}>
      {isVisible && (
        <View style={styles.splash}>
          <Image
            style={styles.splashimage}
            source={require('../assets/images/scopex.jpg')}
          />
        </View>
      )}
      {/* Add the rest of your app components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorsobject.white,
  },
  splash: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  splashimage: {
    width: '50%',
    aspectRatio: 1,
  },
});

export default SplashScreen;
