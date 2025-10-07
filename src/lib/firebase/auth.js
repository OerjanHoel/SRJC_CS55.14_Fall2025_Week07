// Import of needed packages for authentication
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";

// Imports the auth library from firebase/clientApp
import { auth } from "@/src/lib/firebase/clientApp";

// Add an observer for changes to the user sin-in state
export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

// Adds an observer for changes to the user ID token
export function onIdTokenChanged(cb) {
  return _onIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
  // Creates a Google authentication provider instance
  const provider = new GoogleAuthProvider();
  // Starts a dialog-based authentication flow
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

// An instance to sign out the user
export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
