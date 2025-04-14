import { auth, db } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

/**
 * Update user profile in Firestore
 * @param {string} userId - The user ID
 * @param {object} profileData - Object containing profile data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Reference to user document
    const userRef = doc(db, "users", userId);
    
    // Verify user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User document does not exist');
    }

    // Update user document with new data
    await updateDoc(userRef, {
      ...profileData,
      lastUpdated: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get current user profile from Firestore
 * @returns {Promise<object|null>} User profile or null if not logged in
 */
export const getCurrentUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return null;
    }

    return {
      ...userDoc.data(),
      uid: user.uid
    };
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
}; 