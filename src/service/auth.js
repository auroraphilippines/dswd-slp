// "@/service/auth.js"
import { auth, db } from "@/service/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    where,
    updateDoc
} from "firebase/firestore";

// Helper function to retry Firestore operations
const retryOperation = async (operation, maxAttempts = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export const registerUser = async (name, email, password) => {
    try {
        // Step 1: Create the authentication user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 2: Create user document with multiple retries
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second

        const createUserDocument = async () => {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name,
                    email,
                    role: "SLP Member",
                    status: "active",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return true;
            } catch (error) {
                console.error(`Attempt ${retryCount + 1} failed:`, error);
                return false;
            }
        };

        let documentCreated = false;
        while (retryCount < maxRetries && !documentCreated) {
            documentCreated = await createUserDocument();
            if (!documentCreated) {
                retryCount++;
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }

        // Even if document creation fails, return success for auth
        return { 
            success: true, 
            user: {
                uid: user.uid,
                email: user.email,
                name,
                role: "SLP Member",
                status: "active"
            }
        };

    } catch (error) {
        console.error("Registration error:", error);
        let errorMessage = "Failed to register user";
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "This email is already registered";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Email/password accounts are not enabled";
                break;
            case 'auth/weak-password':
                errorMessage = "Password should be at least 6 characters";
                break;
            case 'permission-denied':
                errorMessage = "Unable to create user profile. Please try again later.";
                break;
            case 'auth/network-request-failed':
                errorMessage = "Network error. Please check your connection.";
                break;
        }
        
        return { 
            success: false, 
            error: errorMessage 
        };
    }
};

export const loginUser = async (email, password) => {
    try {
        // First check if user exists in Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("No account found with this email");
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Check if user is active
        if (userData.status === "disabled") {
            throw new Error("This account has been disabled");
        }

        // For local accounts, check password directly
        if (userData.password) {
            if (userData.password !== password) {
                throw new Error("Invalid password");
            }

            // Update last login timestamp
            await updateDoc(doc(db, "users", userDoc.id), {
                lastLoginAt: serverTimestamp()
            });

            return { 
                success: true, 
                user: {
                    ...userData,
                    uid: userDoc.id,
                    email: userData.email
                }
            };
        }

        // For Firebase Auth accounts
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update last login timestamp
            await updateDoc(doc(db, "users", user.uid), {
                lastLoginAt: serverTimestamp()
            });

            return { 
                success: true, 
                user: {
                    ...userData,
                    uid: user.uid,
                    email: user.email
                }
            };
        } catch (authError) {
            // If auth fails, check if we need to recreate the auth account
            if (authError.code === 'auth/user-not-found') {
                // Create new auth account with the same credentials
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Update Firestore document with new uid
                await updateDoc(doc(db, "users", userDoc.id), {
                    uid: user.uid,
                    lastLoginAt: serverTimestamp()
                });

                return { 
                    success: true, 
                    user: {
                        ...userData,
                        uid: user.uid,
                        email: user.email
                    }
                };
            }
            throw authError;
        }
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Failed to login";
        
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-email':
                errorMessage = "No account found with this email";
                break;
            case 'auth/wrong-password':
                errorMessage = "Invalid password";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many failed attempts. Please try again later";
                break;
            case 'auth/user-disabled':
                errorMessage = "This account has been disabled";
                break;
        }
        
        return { 
            success: false, 
            error: errorMessage 
        };
    }
};

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth,
            async (user) => {
                unsubscribe();
                if (!user) {
                    resolve(null);
                    return;
                }

                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (!userDoc.exists()) {
                        resolve(null);
                        return;
                    }

                    const userData = userDoc.data();
                    resolve({
                        ...userData,
                        uid: user.uid,
                        email: user.email
                    });
                } catch (error) {
                    console.error("Get current user error:", error);
                    reject(error);
                }
            },
            reject
        );
    });
};

export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { 
            success: false, 
            error: error.message || "Failed to logout" 
        };
    }
};

export const resetPassword = async (email) => {
    try {
        // First check if user exists in Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("No account found with this email");
        }

        // Send password reset email using Firebase Auth
        await sendPasswordResetEmail(auth, email);
        
        return { success: true };
    } catch (error) {
        console.error("Password reset error:", error);
        let errorMessage = "Failed to reset password";
        
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-email':
                errorMessage = "No account found with this email";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many attempts. Please try again later";
                break;
        }
        
        return { success: false, error: errorMessage };
    }
};

export const resetLocalPassword = async (email, newPassword) => {
    try {
        // First check if user exists in Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("No account found with this email");
        }

        // Get the user document
        const userDoc = querySnapshot.docs[0];
        
        // Update the password in Firestore
        await updateDoc(doc(db, "users", userDoc.id), {
            password: newPassword,
            updatedAt: serverTimestamp()
        });
        
        return { 
            success: true,
            userId: userDoc.id
        };
    } catch (error) {
        console.error("Local password reset error:", error);
        let errorMessage = "Failed to reset password";
        
        if (error.code === 'permission-denied') {
            errorMessage = "You don't have permission to reset the password";
        }
        
        return { success: false, error: errorMessage };
    }
};