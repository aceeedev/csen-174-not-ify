// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGTEiChP6wGK2brVjEz4w61-jPBKkrFxQ",
  authDomain: "csen-174-not-ify.firebaseapp.com",
  projectId: "csen-174-not-ify",
  storageBucket: "csen-174-not-ify.firebasestorage.app",
  messagingSenderId: "50712598431",
  appId: "1:50712598431:web:86149ebd2bdd374102cfaa",
  measurementId: "G-PNYTBP178G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const authProvider = new GoogleAuthProvider();

export default app;
