// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4uSGo1zJq5v5TBXVVAyQZQyfkf-jBRO8",
  authDomain: "app-healthy-f5322.firebaseapp.com",
  projectId: "app-healthy-f5322",
  storageBucket: "app-healthy-f5322.appspot.com",
  messagingSenderId: "723918735199",
  appId: "1:723918735199:web:1d62df7803480ac3a6d8ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage_bucket = getStorage(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
