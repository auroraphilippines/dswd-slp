import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing required Firebase Admin SDK configuration. Please check your environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK: ' + error.message);
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        success: false,
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Get Firestore instance
    const db = admin.firestore();
    
    // Query users collection
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return NextResponse.json({ 
        success: false,
        error: 'Email not found in our database',
        exists: false 
      });
    }

    // Get the user document
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return NextResponse.json({ 
      success: true,
      exists: true,
      userId: userDoc.id,
      userData: userData,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to verify email'
    }, { status: 500 });
  }
} 