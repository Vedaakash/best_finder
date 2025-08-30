// This is the full and correct code for src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This function securely gets your configuration from the platform's "vault".
// It looks for the __firebase_config variable that the platform provides.
function getFirebaseConfig() {
    try {
        // eslint-disable-next-line no-undef
        if (typeof __firebase_config !== 'undefined' && __firebase_config) {
            // eslint-disable-next-line no-undef
            return JSON.parse(__firebase_config);
        } else {
            console.warn("Secure Firebase config not found. This is normal for local testing.");
            return { apiKey: "SAFE_PLACEHOLDER" }; // Harmless placeholder
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