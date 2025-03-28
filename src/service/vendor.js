import { db } from "@/service/firebase";
import {
    collection,
    doc,
    setDoc,
    serverTimestamp,
    addDoc,
    query,
    where,
    getDocs,
    onSnapshot,
    collectionGroup,
    deleteDoc,
    updateDoc,
    getDoc,
    orderBy
} from "firebase/firestore";

// Helper function to generate a unique vendor ID
const generateVendorId = () => {
    return `VEN${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Helper function to fetch subcollection data
const fetchSubcollectionData = async (vendorId, subcollectionName) => {
    const subcollectionRef = collection(db, "vendors", vendorId, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const subscribeToVendors = (callback) => {
    try {
        // Create a query to get all vendors
        const vendorsRef = collection(db, 'vendors');
        // Optional: Add orderBy if you want to sort at database level
        const vendorsQuery = query(vendorsRef, orderBy('createdAt', 'desc'));

        // Set up real-time listener
        const unsubscribe = onSnapshot(vendorsQuery, (snapshot) => {
            const vendors = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(vendors);
        }, (error) => {
            console.error("Error fetching vendors:", error);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error setting up vendors subscription:", error);
        return () => {};
    }
};

export const saveVendorDetails = async (vendorData, userId) => {
    try {
        const vendorId = generateVendorId();
        const vendorRef = doc(db, "vendors", vendorId);

        await setDoc(vendorRef, {
            ...vendorData,
            userId,
            vendorId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return {
            success: true,
            vendorId,
        };
    } catch (error) {
        console.error("Error saving vendor details:", error);
        return {
            success: false,
            error: error.message || "Failed to save vendor details",
        };
    }
};

export const saveManPower = async (vendorId, manPowerData, userId) => {
    try {
        // First verify this vendor belongs to the user
        const vendorRef = doc(db, "vendors", vendorId);
        const vendorDoc = await getDoc(vendorRef);
        if (!vendorDoc.exists() || vendorDoc.data().userId !== userId) {
            throw new Error("Unauthorized to add manpower to this vendor");
        }

        const manPowerRef = collection(db, "vendors", vendorId, "manpower");
        
        // Save each worker's data
        const savedWorkers = await Promise.all(
            manPowerData.map(async (worker) => {
                const workerDoc = await addDoc(manPowerRef, {
                    ...worker,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                return { ...worker, id: workerDoc.id };
            })
        );

        // Update the total wages in the vendor document
        const totalDailyWages = manPowerData.reduce((sum, worker) => sum + worker.wage, 0);
        await setDoc(doc(db, "vendors", vendorId), {
            totalDailyWages,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return {
            success: true,
            workers: savedWorkers,
        };
    } catch (error) {
        console.error("Error saving manpower data:", error);
        return {
            success: false,
            error: error.message || "Failed to save manpower data",
        };
    }
};

export const saveToolsEquipment = async (vendorId, toolsData, userId) => {
    try {
        // First verify this vendor belongs to the user
        const vendorRef = doc(db, "vendors", vendorId);
        const vendorDoc = await getDoc(vendorRef);
        if (!vendorDoc.exists() || vendorDoc.data().userId !== userId) {
            throw new Error("Unauthorized to add tools to this vendor");
        }

        const toolsRef = collection(db, "vendors", vendorId, "tools");
        
        // Save each tool's data with calculated costs
        const savedTools = await Promise.all(
            toolsData.map(async (tool) => {
                // Convert string values to numbers and ensure they're valid
                const quantity = Number(tool.quantity) || 0;
                const unitCost = Number(tool.unitPrice || tool.unitCost) || 0;
                const lifeSpan = Number(tool.lifeSpan) || 1;
                const productionCycle = Number(tool.productionCycle) || 0;

                // Calculate total cost
                const totalCost = quantity * unitCost;
                
                // Calculate depreciation cost
                const lifeSpanMonths = lifeSpan * 12;
                const depreciationCost = lifeSpan && productionCycle
                    ? (totalCost / lifeSpanMonths) * productionCycle
                    : 0;

                const calculatedTool = {
                    name: tool.name,
                    quantity: quantity,
                    unit: tool.unit,
                    unitCost: unitCost,
                    lifeSpan: lifeSpan,
                    productionCycle: productionCycle,
                    totalCost: Number(totalCost.toFixed(2)),
                    depreciationCost: Number(depreciationCost.toFixed(2)),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                
                const toolDoc = await addDoc(toolsRef, calculatedTool);
                return { ...calculatedTool, id: toolDoc.id };
            })
        );

        // Update the total costs in the vendor document
        const totalEquipmentCost = Number(
            savedTools.reduce((sum, tool) => sum + (tool.totalCost || 0), 0).toFixed(2)
        );
        const totalDepreciationCost = Number(
            savedTools.reduce((sum, tool) => sum + (tool.depreciationCost || 0), 0).toFixed(2)
        );
        
        await setDoc(doc(db, "vendors", vendorId), {
            totalEquipmentCost,
            totalDepreciationCost,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return {
            success: true,
            tools: savedTools,
        };
    } catch (error) {
        console.error("Error saving tools data:", error);
        return {
            success: false,
            error: error.message || "Failed to save tools data",
        };
    }
};

export const fetchVendors = async (userId) => {
    try {
        const vendorsRef = collection(db, "vendors");
        const q = query(vendorsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const vendors = [];
        querySnapshot.forEach((doc) => {
            vendors.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return {
            success: true,
            vendors
        };
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch vendors"
        };
    }
};

export const deleteVendor = async (vendorId) => {
    try {
        const vendorRef = doc(db, 'vendors', vendorId);
        await deleteDoc(vendorRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return { success: false, error: error.message };
    }
};

export const updateVendorDetails = async (vendorId, updatedData, userId) => {
    try {
        const vendorRef = doc(db, 'vendors', vendorId);
        
        // Remove the ownership check since we want any authenticated user to update
        await updateDoc(vendorRef, {
            ...updatedData,
            updatedAt: serverTimestamp(),
            lastUpdatedBy: userId // Optional: keep track of who made the last update
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating vendor:", error);
        return { success: false, error: error.message };
    }
}; 