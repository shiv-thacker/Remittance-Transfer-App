# step 1 :- Goolge authentication flow :-

--------In this application authentication is done by Google OAuth library '@react-native-google-signin/google-signin'-----------

import {
GoogleSignin,
GoogleSigninButton,
statusCodes,
} from '@react-native-google-signin/google-signin';

---------First we configure our client ID which was generste in google console-----------------------

GoogleSignin.configure({
webClientId:
'131693510285-bomklkn4a16i4ejh09gn17q5rfmprubk.apps.googleusercontent.com',
offlineAccess: true,
});

---------------TO sign in with google, there is signIn() function has already provided------------------

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

# step2 :- state management of this login credentials with the help of asyncstorage library '@react-native-async-storage/async-storage';

---------------------------- set login userInfo in async storage-----------------------------

await AsyncStorage.setItem(
'userDetails',
JSON.stringify({userInfo, loaded: true}),
);

-------------get data from async storage-------------------------------

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

# step 3 :- create user

-----------------We have used google api in Login page, now we pass data with the help of asyncStorage and pass this data to user api---------------

-----------------create user with api-------------------------

const BASE_URL = 'https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api';

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

#step 4 :- now we create simple UI of transaction and history with the help of bottom navigation library '@react-navigation/bottom-tabs' -----------------

---------------with the help of <Tab.Navigator> and <Tab.screen> we can navigate transaction and History screen----------------

# Step 5 :- ----------------------------- Transaction screen-------------------------------------

--------------------------For trnsaction screen there are provided three input feild to fill details, 1. sent_amount 2. Description 3. Whom to sent-----------

---we have used POST api to create this transaction ----------------------

API:- https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api/Transfers

code:-

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

# step 6 :- Create History Page

---------- To create History page we have used GET API to get all transaction HIstory--------------------------------

API:- https://654b68155b38a59f28ef05c2.mockapi.io/scopex/api/Transfers (GET Method)

code:-

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

-----------------------we have used <Flatlist/> to show all data in same format-----------------------------------

# step 7 :- Logout

-----------------------For logout we have simply used google's signout() function and 'reomveItem' from Async Storage as well-------------

code:-

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
