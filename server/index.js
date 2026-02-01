import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as firebaseManager from './firebaseManager.js';
import * as blockchainManager from './blockchainManager.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>E-FIR Blockchain Server Online</h1>');
});

app.post('/api/create-fir', async (req, res) => {
    console.log('>>> FIR Submission Received');
    try {
        const firData = req.body;

        // 1. Mock Save to Firebase
        const savedData = await firebaseManager.saveFIR(firData);

        // 2. Hash Data for Blockchain
        const dataHash = blockchainManager.generateHash(savedData);

        // 3. Register on Ganache
        console.log('Registering on Blockchain...');
        const txReceipt = await blockchainManager.registerFIR(savedData.firId, dataHash);

        console.log('Transaction Success:', txReceipt.transactionHash);

        // Convert BigInts to Strings for JSON response
        const safeReceipt = JSON.parse(JSON.stringify(txReceipt, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        res.json({
            success: true,
            message: 'FIR Registered Successfully',
            firId: savedData.firId,
            firebaseId: savedData.firebaseId,
            transactionHash: safeReceipt.transactionHash,
            blockNumber: safeReceipt.blockNumber,
            dataHash: dataHash
        });

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


app.get('/api/firs', async (req, res) => {
    try {
        const firs = await firebaseManager.getAllFIRs();
        res.json({ success: true, count: firs.length, data: firs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

import nodemailer from 'nodemailer';

// ... (existing imports)

// In-memory OTP Store (for demo purposes)
const otpStore = new Map();

// Email Transporter (Mock or Real)
const transporter = nodemailer.createTransport({
    // Replace with real SMTP credentials for production
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: 'mock_user',
        pass: 'mock_pass'
    }
});

// Helper to send email
async function sendOTPEmail(email, otp) {
    console.log(`\n[EMAIL SERVICE] ---------------------------------------------------`);
    console.log(`To: ${email}`);
    console.log(`Subject: TOP SECRET: Your Access Code`);
    console.log(`Body: Your verification code is: ${otp}`);
    console.log(`-------------------------------------------------------------------\n`);

    // In a real scenario, we would use transporter.sendMail(...)
    // await transporter.sendMail({ from: "police@secure.gov", to: email, subject: "Access Code", text: `Code: ${otp}` });
    return true;
}

app.post('/api/auth/request-otp', async (req, res) => {
    const { badgeId, password } = req.body;

    // 1. Verify Basic Credentials
    if (badgeId === 'ADMIN' && password === 'admin') {
        // 2. Generate OTP (Fixed for Demo)
        const otp = "12345";
        const email = "lohithashwa51@gmail.com"; // Official Police Admin Email

        // 3. Store OTP
        otpStore.set(badgeId, otp);

        // 4. Send Email
        await sendOTPEmail(email, otp);

        res.json({ success: true, message: 'OTP sent to official email', emailMasked: 'lo*******@gmail.com' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Badge ID or Reference Code' });
    }
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { badgeId, otp } = req.body;

    if (otpStore.has(badgeId) && otpStore.get(badgeId) === otp) {
        otpStore.delete(badgeId); // One-time use
        res.json({ success: true, token: 'secure_session_token_123' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid OTP Code' });
    }
});

// Emergency Alert Endpoint
app.post('/api/emergency-alert', async (req, res) => {
    console.log('>>> EMERGENCY ALERT RECEIVED');
    try {
        const { type, timestamp, vitals } = req.body;

        console.log(`Emergency Type: ${type}`);
        console.log(`Timestamp: ${timestamp}`);
        console.log('Vitals Data:', vitals);

        // Send SMS notification
        try {
            const smsResponse = await fetch('http://localhost:5001/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `🚨 EMERGENCY ALERT: ${type} detected at ${new Date(timestamp).toLocaleString()}. Heart Rate: ${vitals.health?.heartRate || 'N/A'} bpm, Location: User Device`,
                    number: '+919841092274'
                }),
            });

            console.log('SMS notification sent');
        } catch (smsError) {
            console.error('SMS Error:', smsError.message);
        }

        // Log emergency to database (mock)
        const emergencyLog = {
            id: Date.now().toString(),
            type,
            timestamp,
            vitals,
            status: 'ACTIVE',
            notified: true
        };

        console.log('Emergency logged:', emergencyLog);

        res.json({
            success: true,
            message: 'Emergency alert received and processed',
            emergencyId: emergencyLog.id
        });

    } catch (error) {
        console.error('Emergency Alert Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`E-FIR Server running on http://localhost:${PORT}`);
});
