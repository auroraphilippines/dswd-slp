import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
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