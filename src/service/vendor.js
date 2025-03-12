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

export const subscribeToVendors = (userId, callback) => {
    const vendorsRef = collection(db, "vendors");
    const q = query(vendorsRef, where("userId", "==", userId));

    return onSnapshot(q, async (snapshot) => {
        try {
            const vendorsData = [];
            
            // Fetch all vendors and their subcollections
            for (const doc of snapshot.docs) {
                const vendorData = {
                    id: doc.id,
                    ...doc.data()
                };

                // Fetch manpower data
                const workers = await fetchSubcollectionData(doc.id, "manpower");
                
                // Fetch tools and equipment data
                const toolsAndEquipment = await fetchSubcollectionData(doc.id, "tools");

                vendorsData.push({
                    ...vendorData,
                    workers,
                    toolsAndEquipment
                });
            }

            callback(vendorsData);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
            callback([]);
        }
    });
};

export const saveVendorDetails = async (vendorData) => {
    try {
        const vendorId = generateVendorId();
        const vendorRef = doc(db, "vendors", vendorId);

        await setDoc(vendorRef, {
            ...vendorData,
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

export const saveManPower = async (vendorId, manPowerData) => {
    try {
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

export const saveToolsEquipment = async (vendorId, toolsData) => {
    try {
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