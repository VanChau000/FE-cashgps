// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const { REACT_APP_FIREBASE_APIKEY,
    REACT_APP_FIREBASE_AUTHDOMAIN,
    REACT_APP_FIREBASE_PROJECTID,
    REACT_APP_FIREBASE_STORAGEBUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDERID,
    REACT_APP_FIREBASE_APPID,
    REACT_APP_FIREBASE_MEASUREMENID
} = process.env
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_APIKEY,
    authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECTID,
    storageBucket: REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDERID,
    appId: REACT_APP_FIREBASE_APPID,
    measurementId: REACT_APP_FIREBASE_MEASUREMENID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const fire = (firebase as any).default.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// export const db = fire.database().ref()
export default fire
