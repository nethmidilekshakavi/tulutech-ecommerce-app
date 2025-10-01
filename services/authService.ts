// services/authService.ts
import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// -------------------------
// Email Signup
// -------------------------
export const signUp = async (fullName: string, email: string, password: string): Promise<User | null> => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      email,
      role: "user",
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Signup Error:", error);
    return null;
  }
};

// -------------------------
// Email Login
// -------------------------
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};
