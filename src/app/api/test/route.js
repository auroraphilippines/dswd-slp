import { NextResponse } from 'next/server';
import { getStorage, ref, listAll } from 'firebase/storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase app
let app;
if (getApps().length === 0) {
  console.log('Initializing new Firebase app for test');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Reusing existing Firebase app for test');
  app = getApp();
}

// Get Firebase services
const storage = getStorage(app);
const db = getFirestore(app);

export async function GET() {
  try {
    console.log('Testing Firebase connections...');
    console.log('Firebase config:', {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    });
    
    // Test Firebase Storage connection
    const storageTest = await testStorage();
    
    // Test Firestore connection
    const firestoreTest = await testFirestore();
    
    return NextResponse.json({
      success: true,
      storage: storageTest,
      firestore: firestoreTest,
      message: 'Firebase connections test completed',
      config: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      }
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      code: error.code
    }, { status: 500 });
  }
}

// Test Storage connection
async function testStorage() {
  try {
    console.log('Testing Storage connection...');
    // List top-level items in storage
    const listRef = ref(storage, '/');
    const result = await listAll(listRef);
    
    console.log('Storage test successful');
    return {
      success: true,
      prefixes: result.prefixes.map(prefix => prefix.fullPath),
      items: result.items.map(item => item.fullPath)
    };
  } catch (error) {
    console.error('Storage test error:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

// Test Firestore connection
async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    // List collections in Firestore
    const usersQuery = await getDocs(collection(db, 'users'));
    const users = usersQuery.docs.map(doc => ({
      id: doc.id,
      // Don't include sensitive data
      hasPhotoURL: !!doc.data().photoURL,
      hasEmail: !!doc.data().email
    }));
    
    console.log('Firestore test successful, found users:', usersQuery.size);
    return {
      success: true,
      collections: {
        users: usersQuery.size
      },
      sampleData: users.slice(0, 3) // Return up to 3 user records for testing
    };
  } catch (error) {
    console.error('Firestore test error:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
} 