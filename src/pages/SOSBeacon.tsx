import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { RadioTower, Send, PhoneCall, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import axios from 'axios';

export default function SOSBeacon() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const sendSOS = async () => {
        setIsLoading(true);
        setStatus('sending');
        setStatusMessage('Initiating Broadcast Protocol...');

        try {
            // Trigger both SMS and Call simultaneously
            const [smsResponse, callResponse] = await Promise.allSettled([
                axios.post('http://localhost:5001/send-sms'),
                axios.post('http://localhost:5001/initiate-call')
            ]);

            // Check results
            let successMsg = [];
            if (smsResponse.status === 'fulfilled' && smsResponse.value.data.status === 'success') {
                successMsg.push("SMS Sent");
            }
            if (callResponse.status === 'fulfilled' && callResponse.value.data.status === 'success') {
                successMsg.push("Voice Call Initiated");
            }

            if (successMsg.length > 0) {
                setStatus('success');
                setStatusMessage(`Emergency Active: ${successMsg.join(' & ')}`);
            } else {
                // If both failed
                const errorDetail = smsResponse.status === 'rejected' ? smsResponse.reason.message : 'Unknown Error';
                throw new Error(errorDetail);
            }

        } catch (error: any) {
            console.error('SOS Failed:', error);
            setStatus('error');
            setStatusMessage('Connection Failed. Ensure Server is running on Port 5001.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-6 bg-black min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Pulse Effect */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-1000 ${status === 'sending' ? 'bg-red-600/20 animate-pulse' :
                    status === 'success' ? 'bg-green-600/20' :
                        status === 'error' ? 'bg-orange-600/20' : 'bg-blue-600/5'
                    }`} />
            </div>

            <div className="relative z-10 w-full max-w-2xl text-center space-y-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-4">
                        <RadioTower className="w-10 h-10 text-red-500" />
                        SOS Beacon
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Immediate Emergency Assistance & Beacon Activation
                    </p>
                </div>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm shadow-2xl overflow-hidden">
                    <CardHeader className="bg-zinc-900/80 border-b border-zinc-800 pb-6">
                        <CardTitle className="text-2xl text-white">Emergency Broadcast</CardTitle>
                        <CardDescription className="text-zinc-400">
                            This will instantly send an emergency SMS with your live location to all registered contacts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 flex flex-col items-center gap-8">

                        {/* The Big Red Button */}
                        <button
                            onClick={sendSOS}
                            disabled={isLoading || status === 'success'}
                            className={`
                                group relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95
                                ${status === 'success'
                                    ? 'bg-green-900/20 border-green-500 cursor-default'
                                    : 'bg-red-600 hover:bg-red-700 border-red-400 hover:border-red-300 shadow-[0_0_50px_rgba(220,38,38,0.5)]'
                                }
                                ${isLoading ? 'animate-pulse' : ''}
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-20 h-20 text-white animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle2 className="w-20 h-20 text-green-500" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Send className="w-16 h-16 text-white mb-2" />
                                    <span className="text-xl font-bold text-white uppercase tracking-wider">ACTIVATE</span>
                                </div>
                            )}

                            {/* Ripple Effect Rings */}
                            {status === 'sending' && (
                                <>
                                    <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping" />
                                    <div className="absolute -inset-4 rounded-full border-2 border-red-500/30 animate-pulse delay-75" />
                                </>
                            )}
                        </button>

                        {/* Status Message */}
                        <div className={`text-center space-y-2 p-4 rounded-xl w-full transition-all ${status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                            status === 'success' ? 'bg-green-500/10 border border-green-500/20' : ''
                            }`}>
                            {status === 'idle' && (
                                <p className="text-zinc-500 text-sm">Tap the button above in case of emergency.</p>
                            )}
                            {status === 'sending' && (
                                <p className="text-red-400 font-bold animate-pulse">Transmitting Emergency Signal...</p>
                            )}
                            {status === 'success' && (
                                <div className="flex flex-col items-center text-green-400">
                                    <p className="font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Beacon Activated
                                    </p>
                                    <p className="text-sm opacity-80 mt-1">{statusMessage}</p>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="flex flex-col items-center text-red-400">
                                    <p className="font-bold flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Transmission Failed
                                    </p>
                                    <p className="text-sm opacity-80 mt-1">{statusMessage}</p>
                                    <p className="text-xs text-zinc-500 mt-2">Ensure the SMS Server is running on Port 5000.</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                            <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center gap-3">
                                <PhoneCall className="w-5 h-5 text-blue-400" />
                                <div className="text-left">
                                    <p className="text-xs text-gray-400">Direct Line</p>
                                    <p className="font-bold">1091 - Women Help</p>
                                </div>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center gap-3">
                                <Shield className="w-5 h-5 text-purple-400" />
                                <div className="text-left">
                                    <p className="text-xs text-gray-400">Nearest Patrol</p>
                                    <p className="font-bold">Searching...</p>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
