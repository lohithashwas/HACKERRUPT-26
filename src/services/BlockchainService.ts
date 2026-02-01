
import { ethers } from 'ethers';
import ContractConfig from '../contractConfig.json';

export interface BlockData {
    firId: string;
    complainant: string;
    officer: string;
    incidentType: string;
}

export interface BlockchainResult {
    hash: string;
    blockNumber: number;
    timestamp: number;
    from: string;
}

export class BlockchainService {
    private static provider: ethers.JsonRpcProvider | null = null;
    private static signer: any | null = null;
    private static contract: ethers.Contract | null = null;

    // Hardcoded for Demo (Ganache)
    private static GANACHE_URL = "http://127.0.0.1:7545";
    private static MNEMONIC = "title business into topic solution engage horror damp drastic lyrics viable airport";

    // Auto-Connect to Ganache
    static async connectToGanache(): Promise<string> {
        try {
            console.log("Connecting directly to Ganache...");
            this.provider = new ethers.JsonRpcProvider(this.GANACHE_URL);

            // Create wallet from Mnemonic and connect provider
            this.signer = ethers.Wallet.fromPhrase(this.MNEMONIC).connect(this.provider);

            // Initialize Contract
            this.contract = new ethers.Contract(
                ContractConfig.address,
                ContractConfig.abi,
                this.signer
            );

            const address = await this.signer.getAddress();
            console.log("Ganache Wallet Connected:", address);
            return address;

        } catch (error: any) {
            console.error("Ganache Connection Failed:", error);
            throw new Error("Failed to connect to Local Blockchain (Ganache). Ensure it is running on port 7545.");
        }
    }

    // Register FIR on Smart Contract
    static async registerFIR(data: BlockData): Promise<BlockchainResult> {
        if (!this.contract || !this.signer) {
            await this.connectToGanache();
            if (!this.contract) throw new Error("Blockchain not connected");
        }

        try {
            console.log("Submitting Transaction to Ganache...", data);

            const tx = await this.contract.registerFIR(
                data.firId,
                data.complainant,
                data.officer,
                data.incidentType,
                { gasLimit: 500000 } // Force gas limit to avoid estimateGas errors
            );

            console.log("Transaction Sent:", tx.hash);
            const receipt = await tx.wait();
            console.log("Transaction Confirmed:", receipt);

            const block = await this.provider?.getBlock(receipt.blockNumber);

            return {
                hash: receipt.hash,
                blockNumber: receipt.blockNumber,
                timestamp: block ? block.timestamp * 1000 : Date.now(),
                from: receipt.from
            };

        } catch (error: any) {
            console.error("Smart Contract Error:", error);
            throw new Error("Blockchain Transaction Failed: " + (error.reason || error.message));
        }
    }

    static async isConnected(): Promise<boolean> {
        return !!this.signer;
    }

    static async getAddress(): Promise<string | null> {
        if (this.signer) return await this.signer.getAddress();
        return null;
    }
}
