import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA63m1EujePgKmQ3nqARNUEpEmtICTdG3M",
  authDomain: "tulutech-ecommerce-app.firebaseapp.com",
  projectId: "tulutech-ecommerce-app",
  storageBucket: "tulutech-ecommerce-app.firebasestorage.app",
  messagingSenderId: "302228076881",
  appId: "1:302228076881:web:1f34895d6f8de07535fb70"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

