// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// --- PASTE YOUR FIREBASE CONFIG OBJECT FROM THE WEBSITE HERE ---
const firebaseConfig = {
   apiKey: "AIzaSyBUi7l52QspcFfRm1xN-cyeXIbdamDG6oE",
  authDomain: "fresh-pricer.firebaseapp.com",
  projectId: "fresh-pricer",
  storageBucket: "fresh-pricer.firebasestorage.app",
  messagingSenderId: "1041457321293",
  appId: "1:1041457321293:web:64464706ce3ea502ef5304",
  measurementId: "G-KYCB3L7S98"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);