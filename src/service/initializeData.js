import { db, auth } from './firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';

export const initializeDefaultData = async () => {
    try {
        // First, create the admin user if authenticated user exists
        if (auth.currentUser) {
            const adminUserRef = doc(db, 'users', auth.currentUser.uid);
            const adminUserDoc = await getDoc(adminUserRef);

            if (!adminUserDoc.exists()) {
                await setDoc(adminUserRef, {
                    name: auth.currentUser.displayName || 'Admin User',
                    email: auth.currentUser.email,
                    role: 'admin',
                    status: 'Active',
                    photoURL: auth.currentUser.photoURL,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    permissions: {
                        readOnly: false,
                        accessProject: true,
                        accessParticipant: true,
                        accessFileStorage: true
                    }
                });
                console.log('Admin user created successfully');
            }

            // Then create default roles
            const defaultRoles = [
                {
                    id: 'admin',
                    name: 'Admin',
                    description: 'Full access to all features and settings',
                    permissions: {
                        readOnly: false,
                        accessProject: true,
                        accessParticipant: true,
                        accessFileStorage: true
                    }
                },
                {
                    id: 'user',
                    name: 'User',
                    description: 'Basic user with read-only access',
                    permissions: {
                        readOnly: true,
                        accessProject: false,
                        accessParticipant: false,
                        accessFileStorage: false
                    }
                }
            ];

            // Create or update each role
            for (const role of defaultRoles) {
                const roleRef = doc(db, 'roles', role.id);
                const roleDoc = await getDoc(roleRef);

                if (!roleDoc.exists()) {
                    await setDoc(roleRef, {
                        ...role,
                        createdAt: new Date()
                    });
                    console.log(`${role.name} role created successfully`);
                }
            }
        } else {
            console.log('No authenticated user found for initialization');
        }
    } catch (error) {
        console.error('Error initializing default data:', error);
        throw error; // Re-throw to handle in the calling code
    }
}; 