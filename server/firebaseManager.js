import axios from 'axios';

// User provided credentials
// User provided credentials
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;

export async function saveFIR(data) {
    console.log("Saving FIR data to Real Firebase...");
    try {
        // We'll store it under 'firs' collection
        // 1. Generate a unique key or use firId if unique
        const firId = data.firId;

        // Add auth param for secret-based access
        const url = `${FIREBASE_DB_URL}/firs/${firId}.json?auth=${FIREBASE_SECRET}`;

        const packet = {
            ...data,
            createdAt: new Date().toISOString(),
            status: "REGISTERED",
        };

        const response = await axios.put(url, packet);

        console.log("Firebase Save Success:", response.status);

        return {
            ...data,
            firebaseId: firId // Using firId as the key
        };
    } catch (error) {
        console.error("Firebase Error:", error.response ? error.response.data : error.message);
        // Fallback or rethrow? We'll rethrow to alert the chain
        throw new Error("Failed to save to Firebase Cloud: " + error.message);
    }
}

export async function getAllFIRs() {
    console.log("Fetching ALL FIRs from Firebase...");
    try {
        const url = `${FIREBASE_DB_URL}/firs.json?auth=${FIREBASE_SECRET}`;
        const response = await axios.get(url);

        // Firebase returns an object with keys, convert to array
        if (!response.data) return [];

        return Object.values(response.data);
    } catch (error) {
        console.error("Firebase Fetch Error:", error.message);
        throw new Error("Failed to fetch records");
    }
}
