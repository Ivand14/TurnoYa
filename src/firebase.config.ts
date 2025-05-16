// Import the functions you need from the SDKs you need

import {getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1c1Jb7PhupQpYg9RVyRCANXhQIG9-uVs",
  authDomain: "turnosya-c5672.firebaseapp.com",
  projectId: "turnosya-c5672",
  storageBucket: "turnosya-c5672.firebasestorage.app",
  messagingSenderId: "290368851401",
  appId: "1:290368851401:web:39cb8fe7875285b2d5ec18",
  measurementId: "G-SR1K77SL4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app;