// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMfXjhR1O_WNNg5yOdWA3nFh6mw5qd3xg",
  authDomain: "dswdro3.firebaseapp.com",
  projectId: "dswdro3",
  storageBucket: "dswdro3.firebasestorage.app",
  messagingSenderId: "374458859868",
  appId: "1:374458859868:web:3e2a1293135a03b6fec199",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
