// "@/service/auth.js"
import { auth, db } from "@/service/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    serverTimestamp,
    query,
    orderBy
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
                    role: "user",
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
                role: "user",
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
            // Get user data from Firestore with retry logic
            const userData = await retryOperation(async () => {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (!userDoc.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        role: "user",
                        status: "active",
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        lastLoginAt: serverTimestamp()
                    });
                    return {
                        uid: user.uid,
                        email: user.email,
                        role: "user",
                        status: "active"
                    };
                }
                
                return userDoc.data();
            });

            // Check if user is active
            if (userData?.status === "disabled") {
                await signOut(auth);
                throw new Error("This account has been disabled");
            }

            // Update last login timestamp
            try {
                await setDoc(doc(db, "users", user.uid), {
                    lastLoginAt: serverTimestamp()
                }, { merge: true });
            } catch (updateError) {
                console.error("Failed to update last login time:", updateError);
            }

            return { 
                success: true, 
                user: {
                    ...userData,
                    uid: user.uid,
                    email: user.email
                }
            };
        } catch (firestoreError) {
            console.error("Firestore error during login:", firestoreError);
            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    role: "user",
                    status: "active"
                }
            };
        }
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Failed to login";
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/user-disabled':
                errorMessage = "This account has been disabled";
                break;
            case 'auth/user-not-found':
                errorMessage = "No account found with this email";
                break;
            case 'auth/wrong-password':
                errorMessage = "Invalid password";
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