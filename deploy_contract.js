import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    console.log('--- STARTING DEPLOYMENT ---');

    // 1. Compile
    const contractPath = path.resolve(__dirname, 'contracts', 'EFIRRegistry.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'EFIRRegistry.sol': {
                content: source,
            },
        },
        settings: {
            evmVersion: 'paris',
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    console.log('Compiling contract...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        let hasError = false;
        output.errors.forEach(err => {
            console.error(err.formattedMessage);
            if (err.severity === 'error') hasError = true;
        });
        if (hasError) return;
    }

    const contractFile = output.contracts['EFIRRegistry.sol']['EFIRRegistry'];
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    console.log('Contract compiled successfully.');

    // 2. Connect to Ganache
    const web3 = new Web3('http://127.0.0.1:7545');

    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Deploying from Ganache account:', accounts[0]);

        const contract = new web3.eth.Contract(abi);

        const deployTx = contract.deploy({
            data: bytecode,
            arguments: []
        });

        console.log('Sending transaction...');
        const deployedContract = await deployTx.send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000'
        });

        console.log('SUCCESS: Contract deployed at:', deployedContract.options.address);

        // 3. Save Artifacts for Server
        const artifacts = {
            address: deployedContract.options.address,
            abi: abi
        };

        const serverDir = path.resolve(__dirname, 'server');
        if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir);

        const configPath = path.resolve(serverDir, 'blockchain-config.json');
        fs.writeFileSync(configPath, JSON.stringify(artifacts, null, 2));

        // Also save for frontend reference
        fs.writeFileSync(path.resolve(__dirname, 'src', 'contractConfig.json'), JSON.stringify(artifacts, null, 2));

        console.log('Configuration saved to server/blockchain-config.json');

    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

deploy();
