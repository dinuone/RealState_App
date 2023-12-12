// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-652af.firebaseapp.com",
  projectId: "real-state-652af",
  storageBucket: "real-state-652af.appspot.com",
  messagingSenderId: "694621195435",
  appId: "1:694621195435:web:2e2a8c063c3efda224fbee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);