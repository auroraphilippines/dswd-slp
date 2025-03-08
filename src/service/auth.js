// "@/service/auth.js"
import { auth, db } from "@/service/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Add user data to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      name: name,
      creationTimestamp: serverTimestamp(),
      lastLoginTimestamp: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
