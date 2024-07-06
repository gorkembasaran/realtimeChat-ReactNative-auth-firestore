import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAr5lZjjEOg0Qevqw4QMBuGso0eMEgCaDA",
    authDomain: "chatapp-rn-c9ae5.firebaseapp.com",
    projectId: "chatapp-rn-c9ae5",
    storageBucket: "chatapp-rn-c9ae5.appspot.com",
    messagingSenderId: "330546778044",
    appId: "1:330546778044:web:85744c973bd503694b25b9",
    measurementId: "G-Q3ZFKNYDNM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };