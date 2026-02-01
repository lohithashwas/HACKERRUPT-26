
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Search, Lock, FileText, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";

export function PoliceFIRView() {
    const [firs, setFirs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLevel, setAuthLevel] = useState<'low' | 'high'>('low');
    const [badgeId, setBadgeId] = useState('');
    const [password, setPassword] = useState('');
    const [selectedFIR, setSelectedFIR] = useState<any | null>(null);

    // New OTP State
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState('');
    const [authError, setAuthError] = useState('');

    // Fetch FIRs on Load
    const fetchFIRs = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/firs');
            if (res.data.success) {
                // Sort by date desc
                const sorted = res.data.data.sort((a: any, b: any) =>
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
                setFirs(sorted);
            }
        } catch (e) {
            console.error("Failed to fetch FIRs", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchFIRs();
    }, [isAuthenticated]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');

        if (badgeId === 'POLICE' && password === '1234') {
            // Standard Officer Login (No OTP needed)
            setIsAuthenticated(true);
            setAuthLevel('low');
            return;
        }

        // High Authority Attempt
        if (!otpStep) {
            // Step 1: Request OTP
            try {
                const res = await axios.post('http://localhost:3000/api/auth/request-otp', { badgeId, password });
                if (res.data.success) {
                    setOtpStep(true);
                    setAuthError(`${res.data.message}`);
                }
            } catch (err: any) {
                setAuthError(err.response?.data?.message || 'Authentication Failed');
            }
        } else {
            // Step 2: Verify OTP
            try {
                const res = await axios.post('http://localhost:3000/api/auth/verify-otp', { badgeId, otp });
                if (res.data.success) {
                    setIsAuthenticated(true);
                    setAuthLevel('high');
                }
            } catch (err: any) {
                setAuthError('Invalid Verification Code');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                                <Shield className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Official Police Portal</h2>
                            <p className="text-gray-400 text-sm">Restricted Access • Authorized Personnel Only</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {!otpStep ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-1">BADGE ID</label>
                                        <input
                                            type="text"
                                            value={badgeId}
                                            onChange={e => setBadgeId(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-1">ACCESS CODE</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
                                        Security verification required. Enter the 6-digit code sent to your official email.
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-1">ONE-TIME PASSWORD</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            placeholder="XXXXXX"
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white font-mono text-center tracking-widest text-xl focus:border-blue-500 outline-none"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            )}

                            {authError && <p className="text-xs text-red-500 font-bold text-center">{authError}</p>}

                            <button type="submit" className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded shadow-lg transition-all">
                                {otpStep ? 'VERIFY IDENTITY' : 'ACCESS SECURE TERMINAL'}
                            </button>

                            {otpStep && (
                                <button
                                    type="button"
                                    onClick={() => { setOtpStep(false); setOtp(''); setAuthError(''); }}
                                    className="w-full text-xs text-gray-500 hover:text-gray-300"
                                >
                                    Cancel Verification
                                </button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">FIR Registry</h1>
                        <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-gray-400">SESSION ID:</span>
                            <span className="text-blue-400">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-400">LEVEL:</span>
                            <span className={authLevel === 'high' ? "text-red-400 font-bold" : "text-green-400"}>
                                {authLevel === 'high' ? 'LEVEL 5 (HIGH AUTHORITY)' : 'LEVEL 1 (OFFICER)'}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded text-gray-300">
                    LOGOUT
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List View */}
                <div className="lg:col-span-1 space-y-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Loading Records...</div>
                    ) : firs.map((fir) => (
                        <div
                            key={fir.firId}
                            onClick={() => setSelectedFIR(fir)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-800/50 ${selectedFIR?.firId === fir.firId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/40 border-gray-800'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-white">{fir.firId}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                                    {new Date(fir.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">
                                {authLevel === 'high' ? fir.complainantName : 'REDACTED NAME'}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${fir.incidentType === 'Theft' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {fir.incidentType}
                                </span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Encrypted
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2">
                    {selectedFIR ? (
                        <Card className="bg-gray-900 border-gray-800 h-full min-h-[70vh]">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Case File: {selectedFIR.firId}</h2>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/40 animate-pulse">LIVE FROM BLOCKCHAIN</span>
                                        </div>
                                    </div>
                                    {authLevel !== 'high' && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/20 text-yellow-500 border border-yellow-700/30 rounded text-xs">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>Restricted View</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <Section title="Incident Information">
                                        <GridItem label="Date & Time" value={`${selectedFIR.occurrenceDate} ${selectedFIR.occurrenceTime}`} />
                                        <GridItem label="Location" value={selectedFIR.address} />
                                        <GridItem label="District" value={selectedFIR.districtName} />
                                        <GridItem label="Type" value={selectedFIR.incidentType} />
                                    </Section>

                                    <Section title="Complainant Details (Sensitive)">
                                        {authLevel === 'high' ? (
                                            <>
                                                <GridItem label="Full Name" value={selectedFIR.complainantName} />
                                                <GridItem label="Aadhaar ID" value={selectedFIR.complainantAadhaar} />
                                                <GridItem label="Gender" value={selectedFIR.complainantGender} />
                                                <GridItem label="Contact" value={selectedFIR.complainantPhone} />
                                                <GridItem label="Address" value={selectedFIR.complainantAddress} fullWidth />
                                            </>
                                        ) : (
                                            <div className="col-span-2 p-4 bg-black/30 border border-gray-700 border-dashed rounded flex flex-col items-center justify-center text-gray-500 gap-2">
                                                <EyeOff className="w-6 h-6" />
                                                <span className="text-xs uppercase tracking-widest">Confidential Data Hidden</span>
                                                <span className="text-[10px]">Requires Level 5 Clearance</span>
                                            </div>
                                        )}
                                    </Section>

                                    <Section title="Case Description">
                                        <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded border border-gray-800">
                                            {selectedFIR.description}
                                        </p>
                                    </Section>
                                </div>

                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-600 border border-gray-800 border-dashed rounded-lg bg-gray-900/20">
                            Select a record to decrypt details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Section = ({ title, children }: any) => (
    <div className="mb-6">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 border-l-2 border-blue-500 pl-2">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const GridItem = ({ label, value, fullWidth }: any) => (
    <div className={`${fullWidth ? 'col-span-2' : ''}`}>
        <span className="block text-[10px] text-gray-500 uppercase">{label}</span>
        <span className="block text-sm text-gray-200 font-medium break-words">{value || 'N/A'}</span>
    </div>
);
