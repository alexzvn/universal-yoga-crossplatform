import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";



// Initialize Firebase
const config = {
  apiKey: "AIzaSyAbMfCstZneGzhqLo0XAWuw7RMgRXTw4RQ",
  authDomain: "universal-yoga-44f9d.firebaseapp.com",
  projectId: "universal-yoga-44f9d",
  storageBucket: "universal-yoga-44f9d.firebasestorage.app",
  messagingSenderId: "620026067200",
  appId: "1:620026067200:web:9a3fa3e9245892dec69be5"
}

export const app = initializeApp(config)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export const firestore = getFirestore(app)

