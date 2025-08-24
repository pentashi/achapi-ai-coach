// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // For database
import { firebaseConfig } from "./firebaseConfig";
import { getAuth } from "firebase/auth"; 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 
export {app, db, auth };
