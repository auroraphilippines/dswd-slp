import { db } from './firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

/**
 * Upload profile photo to Firestore as base64 string with fallback to localStorage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - The base64 data URI of the image
 */
export const uploadProfilePhoto = async (file, userId) => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size should be less than 5MB');
    }
    
    console.log('Converting image to base64...');
    
    // Convert file to base64
    const base64String = await convertFileToBase64(file);
    console.log('Image converted to base64 successfully');
    
    // Try to update Firestore first
    try {
      // Update user profile in Firestore with base64 string
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        photoURL: base64String,
        lastUpdated: new Date().toISOString()
      });
      console.log('User profile updated with base64 image in Firestore');
    } catch (firestoreError) {
      console.error('Firestore update failed, using localStorage fallback:', firestoreError);
      
      // Fallback to localStorage if Firestore fails (ad blockers, etc.)
      saveProfileToLocalStorage(userId, base64String);
    }
    
    return base64String;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw new Error(error.message || 'Failed to upload profile photo');
  }
};

/**
 * Save profile data to localStorage as a fallback
 * @param {string} userId - The user ID
 * @param {string} photoURL - The base64 image string
 */
const saveProfileToLocalStorage = (userId, photoURL) => {
  try {
    // Get existing profile data if any
    const existingData = localStorage.getItem('userProfiles') || '{}';
    const profiles = JSON.parse(existingData);
    
    // Update with new photo
    profiles[userId] = {
      ...profiles[userId],
      photoURL,
      lastUpdated: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    console.log('Profile photo saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get profile photo from localStorage if Firestore fails
 * @param {string} userId - The user ID
 * @returns {string|null} - The base64 image or null if not found
 */
export const getProfilePhotoFromLocalStorage = (userId) => {
  try {
    const existingData = localStorage.getItem('userProfiles') || '{}';
    const profiles = JSON.parse(existingData);
    return profiles[userId]?.photoURL || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Convert a file to base64 data URI
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - The base64 data URI
 */
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
}; 