// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This is the special function that asks the platform's "secure vault"
// for your secret keys. Your keys are NOT stored in the code.
function getFirebaseConfig() {
    try {
        // This is the special, secure variable provided by the platform.
        // It contains your secret keys, safely injected when the app runs.
        
        // eslint-disable-next-line no-undef
        if (typeof __firebase_config !== 'undefined' && __firebase_config) {
            // eslint-disable-next-line no-undef
            return JSON.parse(__firebase_config);
        } else {
             // This is just a safety message and will not be used in your live app.
            console.warn("Secure Firebase config not found. This is normal for local testing.");
            return { apiKey: "PLACEHOLDER" }; // Harmless placeholder
        }
    } catch (e) {
        console.error("Could not get the secure Firebase config:", e);
        return {};
    }
}

// Initialize Firebase using the keys from the secure vault
const app = initializeApp(getFirebaseConfig());

// Initialize Firebase Authentication and export it so your App.js can use it
export const auth = getAuth(app);

