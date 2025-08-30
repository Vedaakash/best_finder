// This is the new and correct code for src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This function now securely reads your keys from your new .env file.
function getFirebaseConfig() {
    try {
        // process.env.REACT_APP_FIREBASE_CONFIG is the standard way
        // to access the variable you just created in your .env file.
        const configString = process.env.REACT_APP_FIREBASE_CONFIG;
        
        if (configString) {
            return JSON.parse(configString);
        } else {
            console.error("Firebase config not found in .env file. Make sure REACT_APP_FIREBASE_CONFIG is set.");
            return {}; // Return empty to prevent a crash
        }
    } catch (e) {
        console.error("Could not parse the Firebase config from .env file:", e);
        return {};
    }
}

// Initialize Firebase using the keys from your .env file
const app = initializeApp(getFirebaseConfig());

// Initialize and export Firebase Authentication
export const auth = getAuth(app);