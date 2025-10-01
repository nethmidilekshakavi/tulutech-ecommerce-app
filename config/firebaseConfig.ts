// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFunctions} from "@firebase/functions";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA63m1EujePgKmQ3nqARNUEpEmtICTdG3M",
  authDomain: "tulutech-ecommerce-app.firebaseapp.com",
  projectId: "tulutech-ecommerce-app",
  storageBucket: "tulutech-ecommerce-app.firebasestorage.app",
  messagingSenderId: "302228076881",
  appId: "1:302228076881:web:1f34895d6f8de07535fb70"
};

// Initialize Firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
export const functions = getFunctions(app); // ← pass app
