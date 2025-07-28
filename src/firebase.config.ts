import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpyUMoZfLwPP15uY5di9Vur5jVPhANPeg",
  authDomain: "uturns-1746e.firebaseapp.com",
  projectId: "uturns-1746e",
  storageBucket: "uturns-1746e.firebasestorage.app",
  messagingSenderId: "438214592364",
  appId: "1:438214592364:web:87293b6d9118c14dab9549",
  measurementId: "G-B80JR922RF",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

