import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlJ3iqqndJuPCSafedzcSgeYYJTfy48C4",
  authDomain: "aqs-de-parfum.firebaseapp.com",
  projectId: "aqs-de-parfum",
  storageBucket: "aqs-de-parfum.firebasestorage.app",
  messagingSenderId: "804998137472",
  appId: "1:804998137472:web:b2c0b90ade0bd46595c865",
  measurementId: "G-6XKEJF5ZLH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
