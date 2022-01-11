import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6yG-oYYtPdZAWgqObnf2AEaXgqvTNxz0",
  authDomain: "login-page6774.firebaseapp.com",
  databaseURL: "https://login-page6774-default-rtdb.firebaseio.com",
  projectId: "login-page6774",
  storageBucket: "login-page6774.appspot.com",
  messagingSenderId: "336504698970",
  appId: "1:336504698970:web:b570ecd09a3605064e0063",
  measurementId: "G-GCJ9561GHP"
};

// Initialize Firebase1
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();