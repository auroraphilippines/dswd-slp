// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Check for ad blockers or other connection issues
    const checkFirebaseConnectivity = async () => {
        try {
            // Add a very small timeout to test connectivity
            const testTimeout = setTimeout(() => {
                console.warn('Firebase connectivity check timed out. Possible ad blocker interference.');
                localStorage.setItem('firebaseConnectivityIssue', 'true');
            }, 5000);

            // Try to clear the timeout if the check succeeds
            clearTimeout(testTimeout);
            localStorage.removeItem('firebaseConnectivityIssue');
            console.log('Firebase connection check passed');
        } catch (error) {
            console.error('Firebase connectivity check failed:', error);
            localStorage.setItem('firebaseConnectivityIssue', 'true');
        }
    };

    // Run the check
    checkFirebaseConnectivity();

    // Enable logging in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Firebase initialized successfully');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
    localStorage.setItem('firebaseConnectivityIssue', 'true');
}

// Export a function to check if there are connectivity issues
export const hasFirebaseConnectivityIssues = () => {
    return localStorage.getItem('firebaseConnectivityIssue') === 'true';
};

export { app, auth, db, storage };
export default app;
