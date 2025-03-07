import { Client, Account, Databases, Storage, ID } from "appwrite";

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67c94fa00008ae1cf856');

// Configuration
export const appwriteConfig = {
    databaseId: '67c94fb3003269d82917',
    userCollectionId: '67c94ffc0008c7fc5405',
};

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// Generate valid Appwrite ID (max 36 chars, alphanumeric with period, hyphen, underscore)
const generateValidId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 6);
    return `user${timestamp}${randomStr}`.substring(0, 36);
};

// Authentication helper functions
export const auth = {
    // Register a new user
    async register(email, password, name) {
        try {
            // Generate a valid ID
            const userId = generateValidId();
            
            // Create account with userId first, then email, password, and name
            const newAccount = await account.create(
                userId,
                email,
                password,
                name
            );

            if (!newAccount) throw new Error('Failed to create account');

            // Store user data
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                userId,
                {
                    name,
                    email,
                    password,
                    userId
                }
            );

            // Create auth session
            return await this.login(email, password);
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    // Login user
    async login(email, password) {
        try {
            return await account.createSession(email, password);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    // Get current session
    async getSession() {
        try {
            return await account.getSession('current');
        } catch (error) {
            return null;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    },

    // Logout user
    async logout() {
        try {
            await account.deleteSession('current');
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        }
    }
};