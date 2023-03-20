import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDv2X5_-6S-Mxf6xEj7j_cutWKHFiu1B5o",
  authDomain: "mini-gestione-scadenze.firebaseapp.com",
  projectId: "mini-gestione-scadenze",
  storageBucket: "mini-gestione-scadenze.appspot.com",
  messagingSenderId: "888275006480",
  appId: "1:888275006480:web:60c0f74e63d247aa238695"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Intialize Authentication
const auth = getAuth(app);

export { db, auth };