import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
let firebaseAdmin;
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK - server-side only, not affected by ad blockers
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
} else {
  firebaseAdmin = admin.app();
}

// Get references to Firestore and Storage
const db = firebaseAdmin.firestore();
const bucket = firebaseAdmin.storage().bucket();

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, profileData } = data;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Update user profile in Firestore directly from server
    await db.collection('users').doc(userId).update({
      ...profileData,
      lastUpdated: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Server error updating profile:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update profile'
    }, { status: 500 });
  }
}

// Handle photo uploads
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    
    if (!file || !userId) {
      return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${timestamp}.${fileExtension}`;
    const filePath = `profile-photos/${userId}/${fileName}`;
    
    // Upload to Firebase Storage
    const fileUpload = bucket.file(filePath);
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: userId,
          uploadTime: new Date().toISOString()
        }
      }
    });
    
    // Make file publicly accessible
    await fileUpload.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    // Update user profile with the new photo URL
    await db.collection('users').doc(userId).update({
      photoURL: publicUrl,
      lastUpdated: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('Server error uploading photo:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload photo'
    }, { status: 500 });
  }
} 