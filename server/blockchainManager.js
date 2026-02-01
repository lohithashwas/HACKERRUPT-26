import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3('http://127.0.0.1:7545');

let contract;
let account;

async function init() {
    try {
        const configPath = path.resolve(__dirname, 'blockchain-config.json');
        if (!fs.existsSync(configPath)) {
            console.error('Config not found!');
            return;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        contract = new web3.eth.Contract(config.abi, config.address);

        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
            account = accounts[0];
            console.log('Blockchain Manager Ready. Using Account:', account);
        } else {
            console.error('No accounts found in Ganache! Ensure Ganache is running on port 7545.');
        }
    } catch (e) {
        console.error('Init Failed. Is Ganache running?', e.message);
    }
}

// Remove top-level init() to avoid silent startup failures
// init();

export function generateHash(data) {
    const stableString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(stableString).digest('hex');
}

export async function registerFIR(firId, dataHash) {
    if (!contract || !account) await init();

    if (!account) {
        throw new Error('Blockchain Registry Failed: No valid account found. Is Ganache running?');
    }

    try {
        // Send transaction from server wallet
        const tx = await contract.methods.registerFIR(firId, dataHash).send({
            from: account,
            gas: 1000000 // Gas limit, adjust if needed
        });
        console.log(`FIR ${firId} registered on Blockchain. TX: ${tx.transactionHash}`);
        return tx;
    } catch (error) {
        console.error('TX Error:', error);
        throw new Error('Blockchain Registry Failed: ' + error.message);
    }
}
