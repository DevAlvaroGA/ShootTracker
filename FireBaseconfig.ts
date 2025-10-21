// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx85u7hggtJvc92gGBG8gZMcRDAizXnNs",
  authDomain: "shoottracker-85391.firebaseapp.com",
  projectId: "shoottracker-85391",
  storageBucket: "shoottracker-85391.firebasestorage.app",
  messagingSenderId: "610622971890",
  appId: "1:610622971890:web:a926c5737adecd5c02956b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Inicializa Firebase Auth con React Native Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//Inicializa Firestore
export const db = getFirestore(app);