
import { registerFIR, generateHash } from './blockchainManager.js';

console.log("Testing Blockchain Manager Connection...");

// Mock data
const mockFirId = "TEST-" + Date.now();
const mockData = { date: new Date().toISOString(), type: "TEST_VERIFICATION" };
const hash = generateHash(mockData);

async function testConnection() {
    try {
        console.log("Attempting to register mock FIR:", mockFirId);
        // This will trigger the init() function internally
        await registerFIR(mockFirId, hash);
        console.log("✅ SUCCESS: Blockchain connection works and Transaction sent!");
    } catch (error) {
        console.error("❌ FAILURE:", error.message);
        if (error.message.includes("Ganache")) {
            console.log("\nPossible Fixes:");
            console.log("1. Open Ganache application.");
            console.log("2. Ensure it is running on http://127.0.0.1:7545");
            console.log("3. If Ganache is running on a different port (e.g. 8545), update 'server/blockchainManager.js'.");
        }
    }
}

testConnection();
