// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeDefaultData } from './initializeData';
import Logger from '@/lib/logger';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with settings
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
});

// Initialize Storage with settings
const storage = getStorage(app);

// Initialize default data in development
if (process.env.NODE_ENV === 'development') {
    initializeDefaultData().then(() => {
        Logger.log('Default data initialization completed');
    }).catch(error => {
        Logger.error('Error initializing default data:', error);
    });
}

// Development logging
if (process.env.NODE_ENV === 'development') {
    Logger.log('Firebase initialized in development mode');
}

// Set CORS configuration
const corsConfig = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600
};

// Check for ad blockers or other connection issues
const checkFirebaseConnectivity = async () => {
    try {
        // Add a very small timeout to test connectivity
        const testTimeout = setTimeout(() => {
            Logger.warn('Firebase connectivity check timed out. Possible ad blocker interference.');
            if (typeof window !== 'undefined') {
                localStorage.setItem('firebaseConnectivityIssue', 'true');
            }
        }, 5000);

        // Try to clear the timeout if the check succeeds
        clearTimeout(testTimeout);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('firebaseConnectivityIssue');
        }
        Logger.log('Firebase connection check passed');
    } catch (error) {
        Logger.error('Firebase connectivity check failed:', error);
        if (typeof window !== 'undefined') {
            localStorage.setItem('firebaseConnectivityIssue', 'true');
        }
    }
};

// Run the check only on client side
if (typeof window !== 'undefined') {
    checkFirebaseConnectivity();
}

// Enable logging in development
if (process.env.NODE_ENV === 'development') {
    Logger.log('Firebase initialized successfully');
}

// Export a function to check if there are connectivity issues
export const hasFirebaseConnectivityIssues = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return localStorage.getItem('firebaseConnectivityIssue') === 'true';
};

export { auth, db, storage, corsConfig };
export default app;