// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/auth';
import "firebase/firestore";
import 'firebase/storage';

import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCj-atmK42idbcU1SuEyb60utna7CcSU84",
  authDomain: "web3careers-88177.firebaseapp.com",
  projectId: "web3careers-88177",
  storageBucket: "web3careers-88177.appspot.com",
  messagingSenderId: "504285371035",
  appId: "1:504285371035:web:835856d80f1717eb75443e",
  measurementId: "G-E0DL2S37ZF"
};

let Firebase;
let db;
let functions;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
  functions = firebase.functions(Firebase);
} else{
  firebase.app()
}

export {Firebase, db, functions}