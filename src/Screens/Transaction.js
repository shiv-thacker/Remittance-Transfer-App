import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {colorsobject} from '../assets/Color';

const BASE_URL = 'https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api';

const Transaction = ({navigation}) => {
  const [sent_amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTransaction = async () => {
    setLoading(true);

    if (
      sent_amount.trim() === '' ||
      description.trim() === '' ||
      to.trim() === ''
    ) {
      Alert.alert('Please fill all Details');
      setLoading(false);
    } else {
      try {
        const response = await fetch(`${BASE_URL}/Transfers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sent_amount,
            description,
            to,
          }),
        });

        if (response.ok) {
          setLoading(false);
          Alert.alert('Transaction complete');
          // Transaction created successfully
          console.log('Transaction created!');
        } else {
          setLoading(false);
          Alert.alert('Failed to create transaction');
          // Handle error
          console.error('Failed to create transaction');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Failed to create transaction');
        console.error('Error creating transaction:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Now, send money at real exchange rate!</Text>
      <Text style={styles.subtitle}>Say NO to money transfer fees.</Text>
      <TextInput
        placeholder="Sending Amount"
        keyboardType="numeric"
        value={sent_amount}
        onChangeText={text => setAmount(text)}
        style={styles.textinput}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
        style={styles.textinput}
      />
      <TextInput
        placeholder="Reciever's name"
        value={to}
        onChangeText={text => setTo(text)}
        style={styles.textinput}
      />
      <TouchableOpacity onPress={handleCreateTransaction} style={styles.button}>
        {loading ? (
          <ActivityIndicator size={'large'} color={colorsobject.white} />
        ) : (
          <Text style={styles.btntext}>Send Money Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: colorsobject.black,
    fontWeight: '700',
    fontSize: 30,
  },
  subtitle: {
    color: colorsobject.black,
    fontWeight: '400',
    fontSize: 20,
    marginVertical: 40,
  },
  textinput: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderColor: colorsobject.themecolor,
    borderRadius: 10,
    fontWeight: '600',
    color: colorsobject.black,
    width: '100%',
  },
  button: {
    backgroundColor: colorsobject.themecolor,
    alignItems: 'center',
    width: '70%',
    borderRadius: 10,
    marginTop: 10,

    height: 60,
    justifyContent: 'center',
  },
  btntext: {
    color: colorsobject.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
