import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {colorsobject} from '../assets/Color';
const BASE_URL = 'https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api';
const History = () => {
  const [transactions, setTransactions] = useState();
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/Transfers`);
      if (response.ok) {
        const data = await response.json();
        // Sort transactions in descending order based on id
        const sortedTransactions = data.sort((a, b) => b.id - a.id);
        setTransactions(sortedTransactions);
        setLoading(false);
        console.log(transactions);
      } else {
        setLoading(false);
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching transactions:', error);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, []),
  );

  const formatDateTime = dateTimeString => {
    const dateObject = new Date(dateTimeString);
    const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    const timeOptions = {hour: 'numeric', minute: 'numeric', second: 'numeric'};

    const formattedDate = dateObject.toLocaleDateString('en-US', dateOptions);
    const formattedTime = dateObject.toLocaleTimeString('en-US', timeOptions);

    return {formattedDate, formattedTime};
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      {loading ? (
        <ActivityIndicator size={'large'} color={colorsobject.themecolor} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.itemcontainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.field}>payment id: </Text>
                  <Text style={styles.value}>{item.id}</Text>
                </View>
                <View style={{position: 'absolute', right: 10}}>
                  <Text style={styles.value}>
                    {formatDateTime(item.createdAt).formattedTime}
                  </Text>
                  <Text style={styles.value}>
                    {formatDateTime(item.createdAt).formattedDate}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.field}>Sent to : </Text>
                  <Text style={styles.value}>{item.to}</Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.field}>sent_amount: </Text>
                  <Text style={styles.value}>{item.sent_amount}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.field}>received_amount: </Text>
                  <Text style={styles.value}>{item.received_amount}</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.field}>description : </Text>
                <Text style={styles.value}>{item.description}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  title: {
    color: colorsobject.black,
    fontWeight: '700',
    fontSize: 25,
  },
  container: {
    padding: 10,
    marginBottom: 80,
  },
  itemcontainer: {
    marginVertical: 20,
    backgroundColor: colorsobject.white,
    borderRadius: 10,
    borderColor: colorsobject.black,
    borderWidth: 1,
    padding: 10,
    gap: 10,
  },

  field: {
    color: colorsobject.black,
    fontSize: 15,
  },
  value: {
    color: 'green',
    fontSize: 15,
    fontWeight: '500',
  },
});
