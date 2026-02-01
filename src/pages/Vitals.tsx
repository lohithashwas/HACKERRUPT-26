import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, Heart, Thermometer, Wind, Zap, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Database, RefreshCw, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchVitalsData, saveEmergencyAuditLog, updateEmergencyLogStatus, type EmergencyAuditLog } from '@/services/firebaseService';
import { toast } from 'sonner';

interface VitalsData {
    health: {
        heartRate: number;
        humidity: number;
        spo2: number;
        temperature: number;
        [key: string]: any;
    };
    motion: {
        accelMag: number;
        gx: number;
        gy: number;
        gyroMag: number;
        gz: number;
        [key: string]: any;
    };
    status: {
        SOS: boolean;
        gyroLED: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}

export function Vitals() {
    const [vitalsData, setVitalsData] = useState<VitalsData>({
        health: {
            heartRate: 0,
            humidity: 0,
            spo2: 0,
            temperature: 0
        },
        motion: {
            accelMag: 0,
            gx: 0,
            gy: 0,
            gyroMag: 0,
            gz: 0
        },
        status: {
            SOS: false,
            gyroLED: false
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Emergency alert state
    const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [emergencyType, setEmergencyType] = useState<'SOS' | 'Motion' | null>(null);
    const [isEmergencyReported, setIsEmergencyReported] = useState(false);
    const [currentEmergencyLogId, setCurrentEmergencyLogId] = useState<string | null>(null);
    const [emergencyStartTime, setEmergencyStartTime] = useState<number | null>(null);

    // Vitals history - store past 3 readings
    const [vitalsHistory, setVitalsHistory] = useState<Array<{
        timestamp: string;
        health: VitalsData['health'];
        motion: VitalsData['motion'];
    }>>([]);

    // Location tracking
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number;
        longitude: number;
        accuracy: number;
        timestamp: number;
    } | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const previousSOSRef = useRef(false);
    const previousMotionRef = useRef(false);

    // Get device location
    const getDeviceLocation = (): Promise<{
        latitude: number;
        longitude: number;
        accuracy: number;
        timestamp: number;
        address?: string;
    }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };

                    // Try to get address from reverse geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
                        );
                        const data = await response.json();
                        resolve({
                            ...location,
                            address: data.display_name || 'Unknown Location'
                        });
                    } catch (error) {
                        console.error('Error getting address:', error);
                        resolve({
                            ...location,
                            address: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                        });
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    };

    // Create alarm sound
    useEffect(() => {
        // Create audio context for alarm sound
        audioRef.current = new Audio();
        audioRef.current.loop = true;

        // Create a simple beep sound using Web Audio API
        const createBeepSound = () => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

            oscillator.start();

            setTimeout(() => {
                oscillator.stop();
            }, 200);
        };

        // Store the beep function
        (audioRef.current as any).playBeep = createBeepSound;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    // Handle emergency detection
    useEffect(() => {
        const isSOSActive = vitalsData.status.SOS;
        const isMotionActive = vitalsData.status.gyroLED;

        // Trigger emergency if either status is true and dialog is not already showing
        if ((isSOSActive || isMotionActive) && !showEmergencyDialog && !isEmergencyReported) {
            // Determine which type triggered (prioritize SOS)
            const emergType = isSOSActive ? 'SOS' : 'Motion';

            // Only trigger if this is a new emergency (state changed from false to true)
            const isNewSOS = isSOSActive && !previousSOSRef.current;
            const isNewMotion = isMotionActive && !previousMotionRef.current;

            if (isNewSOS || isNewMotion) {
                console.log('🚨 EMERGENCY DETECTED:', emergType, {
                    SOS: isSOSActive,
                    Motion: isMotionActive,
                    previousSOS: previousSOSRef.current,
                    previousMotion: previousMotionRef.current
                });

                // Create emergency audit log with location
                const logId = `emergency_${Date.now()}`;
                const startTime = Date.now();

                setCurrentEmergencyLogId(logId);
                setEmergencyStartTime(startTime);

                // Get device location and save audit log
                (async () => {
                    let locationData = {
                        address: 'Location unavailable'
                    };

                    try {
                        const location = await getDeviceLocation();
                        locationData = {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            accuracy: location.accuracy,
                            address: location.address || 'Unknown Location',
                            timestamp: new Date(location.timestamp).toISOString()
                        };
                        setCurrentLocation(location);
                        console.log('Device location obtained:', locationData);
                    } catch (error) {
                        console.error('Failed to get device location:', error);
                    }

                    // Get device and browser information
                    const deviceInfo = {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        language: navigator.language,
                        screenResolution: `${window.screen.width}x${window.screen.height}`,
                        windowSize: `${window.innerWidth}x${window.innerHeight}`,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        online: navigator.onLine
                    };

                    // Save initial audit log to Firebase with past 3 vitals
                    const auditLog: EmergencyAuditLog = {
                        id: logId,
                        timestamp: new Date().toISOString(),
                        type: emergType,
                        status: 'TRIGGERED',
                        vitals: {
                            heartRate: vitalsData.health.heartRate,
                            spo2: vitalsData.health.spo2,
                            temperature: vitalsData.health.temperature,
                            humidity: vitalsData.health.humidity
                        },
                        motion: {
                            accelMag: vitalsData.motion.accelMag,
                            gyroMag: vitalsData.motion.gyroMag,
                            gx: vitalsData.motion.gx,
                            gy: vitalsData.motion.gy,
                            gz: vitalsData.motion.gz
                        },
                        location: locationData as any,
                        deviceInfo,
                        vitalsHistory: vitalsHistory.map(entry => ({
                            timestamp: entry.timestamp,
                            heartRate: entry.health.heartRate,
                            spo2: entry.health.spo2,
                            temperature: entry.health.temperature,
                            humidity: entry.health.humidity,
                            accelMag: entry.motion.accelMag,
                            gyroMag: entry.motion.gyroMag
                        }))
                    };

                    // Save to Firebase
                    saveEmergencyAuditLog(auditLog).catch(error => {
                        console.error('Failed to save emergency audit log:', error);
                    });

                    console.log('Emergency audit log created:', {
                        logId,
                        type: emergType,
                        location: locationData,
                        deviceInfo,
                        vitalsHistory: vitalsHistory.length,
                        past3Vitals: auditLog.vitalsHistory
                    });
                })();

                // Play alarm sound
                if (audioRef.current && (audioRef.current as any).playBeep) {
                    const playInterval = setInterval(() => {
                        (audioRef.current as any).playBeep();
                    }, 1000);

                    // Stop after 10 seconds
                    setTimeout(() => {
                        clearInterval(playInterval);
                    }, 10000);
                }

                // Show emergency dialog
                setEmergencyType(emergType);
                setShowEmergencyDialog(true);
                setCountdown(10);
                setIsEmergencyReported(false);

                // Start countdown
                countdownIntervalRef.current = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            // Time's up - report emergency
                            handleEmergencyConfirm();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }

        // Update previous values
        previousSOSRef.current = vitalsData.status.SOS;
        previousMotionRef.current = vitalsData.status.gyroLED;
    }, [vitalsData.status.SOS, vitalsData.status.gyroLED, showEmergencyDialog, isEmergencyReported]);

    // Cleanup countdown on unmount
    useEffect(() => {
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, []);

    const handleEmergencyConfirm = async () => {
        // Clear countdown
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        setShowEmergencyDialog(false);
        setIsEmergencyReported(true);

        // Calculate response time
        const responseTime = emergencyStartTime ? Math.floor((Date.now() - emergencyStartTime) / 1000) : 10;
        const userAction = countdown > 0 ? 'MANUALLY_CONFIRMED' : 'AUTO_CONFIRMED';

        // Update audit log status in Firebase
        if (currentEmergencyLogId) {
            try {
                await updateEmergencyLogStatus(currentEmergencyLogId, 'CONFIRMED', userAction);
                console.log('Emergency audit log updated to CONFIRMED');
            } catch (error) {
                console.error('Failed to update emergency audit log:', error);
            }
        }

        // Report emergency
        toast.error(`🚨 EMERGENCY REPORTED: ${emergencyType} Alert!`, {
            duration: 10000,
        });

        // Send emergency notification to backend
        try {
            const notificationTimestamp = new Date().toISOString();

            await fetch('http://localhost:3001/api/emergency-alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: emergencyType,
                    timestamp: notificationTimestamp,
                    vitals: vitalsData,
                    logId: currentEmergencyLogId,
                    responseTime,
                    userAction
                }),
            });

            toast.success('Emergency services have been notified!');
        } catch (error) {
            console.error('Error sending emergency alert:', error);
        }
    };

    const handleEmergencyCancel = async () => {
        // Clear countdown
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        setShowEmergencyDialog(false);
        setIsEmergencyReported(false);

        // Update audit log status in Firebase
        if (currentEmergencyLogId) {
            try {
                await updateEmergencyLogStatus(currentEmergencyLogId, 'CANCELLED', 'CANCELLED');
                console.log('Emergency audit log updated to CANCELLED');
            } catch (error) {
                console.error('Failed to update emergency audit log:', error);
            }
        }

        toast.info('Emergency alert cancelled - marked as accidental trigger');
    };

    // Fetch data from Firebase
    const loadFirebaseData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchVitalsData();

            if (data) {
                // Merge Firebase data with default structure
                const mergedData: VitalsData = {
                    health: {
                        heartRate: data.health?.heartRate ?? 0,
                        humidity: data.health?.humidity ?? 0,
                        spo2: data.health?.spo2 ?? 0,
                        temperature: data.health?.temperature ?? 0,
                        ...(data.health || {})
                    },
                    motion: {
                        accelMag: data.motion?.accelMag ?? 0,
                        gx: data.motion?.gx ?? 0,
                        gy: data.motion?.gy ?? 0,
                        gyroMag: data.motion?.gyroMag ?? 0,
                        gz: data.motion?.gz ?? 0,
                        ...(data.motion || {})
                    },
                    status: {
                        SOS: data.status?.SOS ?? false,
                        gyroLED: data.status?.gyroLED ?? false,
                        ...(data.status || {})
                    },
                    ...(data || {})
                };

                console.log('Firebase data fetched:', {
                    SOS: data.status?.SOS,
                    gyroLED: data.status?.gyroLED,
                    rawStatus: data.status,
                    timestamp: new Date().toISOString()
                });

                // Update vitals history - keep last 3 readings
                setVitalsHistory(prev => {
                    const newEntry = {
                        timestamp: new Date().toISOString(),
                        health: mergedData.health,
                        motion: mergedData.motion
                    };
                    const updated = [newEntry, ...prev].slice(0, 3);
                    return updated;
                });

                setVitalsData(mergedData);
                setLastUpdate(new Date());
                setIsConnected(true);
            }
        } catch (error) {
            console.error('Error loading Firebase data:', error);
            setIsConnected(false);
            toast.error('Failed to fetch vitals data from Firebase');
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on mount and set up auto-refresh
    useEffect(() => {
        loadFirebaseData();

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            loadFirebaseData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getHeartRateStatus = (hr: number) => {
        if (hr < 60) return { status: 'Low', color: 'text-blue-400', bg: 'bg-blue-500/10' };
        if (hr > 100) return { status: 'High', color: 'text-red-400', bg: 'bg-red-500/10' };
        return { status: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10' };
    };

    const getSpo2Status = (spo2: number) => {
        if (spo2 < 95) return { status: 'Low', color: 'text-red-400', bg: 'bg-red-500/10' };
        return { status: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10' };
    };

    const getTempStatus = (temp: number) => {
        if (temp < 36.1) return { status: 'Low', color: 'text-blue-400', bg: 'bg-blue-500/10' };
        if (temp > 37.2) return { status: 'High', color: 'text-red-400', bg: 'bg-red-500/10' };
        return { status: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10' };
    };

    const hrStatus = getHeartRateStatus(vitalsData.health.heartRate);
    const spo2Status = getSpo2Status(vitalsData.health.spo2);
    const tempStatus = getTempStatus(vitalsData.health.temperature);

    // Get additional parameters
    const additionalHealthParams = Object.keys(vitalsData.health).filter(
        key => !['heartRate', 'humidity', 'spo2', 'temperature'].includes(key)
    );

    const additionalMotionParams = Object.keys(vitalsData.motion).filter(
        key => !['accelMag', 'gx', 'gy', 'gyroMag', 'gz'].includes(key)
    );

    const additionalStatusParams = Object.keys(vitalsData.status).filter(
        key => !['SOS', 'gyroLED'].includes(key)
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Emergency Alert Dialog */}
            {showEmergencyDialog && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <Card className="max-w-md w-full border-4 border-red-600 bg-red-900/20 animate-pulse">
                        <CardContent className="p-8">
                            <div className="text-center space-y-6">
                                {/* Alert Icon */}
                                <div className="flex justify-center">
                                    <div className="p-6 bg-red-600 rounded-full animate-bounce">
                                        <AlertTriangle className="w-16 h-16 text-white" />
                                    </div>
                                </div>

                                {/* Alert Title */}
                                <div>
                                    <h2 className="text-3xl font-bold text-red-400 mb-2">
                                        🚨 EMERGENCY ALERT
                                    </h2>
                                    <p className="text-xl text-white font-semibold">
                                        {emergencyType === 'SOS' ? 'SOS Signal Detected' : 'Motion Alert Triggered'}
                                    </p>
                                </div>

                                {/* Countdown */}
                                <div className="space-y-2">
                                    <div className="text-6xl font-bold text-white">
                                        {countdown}
                                    </div>
                                    <p className="text-gray-300">
                                        Emergency will be reported in {countdown} seconds
                                    </p>
                                </div>

                                {/* Question */}
                                <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                                    <p className="text-yellow-300 font-semibold text-lg">
                                        Was this triggered by accident?
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleEmergencyCancel}
                                        className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="w-6 h-6" />
                                        Yes, Cancel Alert
                                    </button>
                                    <button
                                        onClick={handleEmergencyConfirm}
                                        className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Bell className="w-6 h-6" />
                                        No, Send Help!
                                    </button>
                                </div>

                                {/* Info */}
                                <p className="text-sm text-gray-400">
                                    If you don't respond, emergency services will be automatically notified
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-red-500" />
                        Health Vitals Monitor
                    </h1>
                    <p className="text-gray-400 mt-2">Real-time health and motion tracking from Firebase</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                        )}></div>
                        <span className={cn(
                            "text-sm font-medium",
                            isConnected ? "text-green-400" : "text-red-400"
                        )}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <button
                        onClick={loadFirebaseData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Last Update */}
            {lastUpdate && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
            )}

            {/* Status Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SOS Status */}
                <Card className={cn(
                    "border-l-4",
                    vitalsData.status.SOS ? "border-l-red-600 bg-red-900/10" : "border-l-green-600 bg-green-900/10"
                )}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {vitalsData.status.SOS ? (
                                    <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                                ) : (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">SOS Status</h3>
                                    <p className={cn(
                                        "text-xl font-bold",
                                        vitalsData.status.SOS ? "text-red-400" : "text-green-400"
                                    )}>
                                        {vitalsData.status.SOS ? 'EMERGENCY' : 'Safe'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gyro LED Status */}
                <Card className={cn(
                    "border-l-4",
                    vitalsData.status.gyroLED ? "border-l-yellow-600 bg-yellow-900/10" : "border-l-gray-600"
                )}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className={cn(
                                    "w-6 h-6",
                                    vitalsData.status.gyroLED ? "text-yellow-500 animate-pulse" : "text-gray-500"
                                )} />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Motion Alert</h3>
                                    <p className={cn(
                                        "text-xl font-bold",
                                        vitalsData.status.gyroLED ? "text-yellow-400" : "text-gray-400"
                                    )}>
                                        {vitalsData.status.gyroLED ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Status Parameters */}
            {additionalStatusParams.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Additional Status Parameters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {additionalStatusParams.map(param => (
                            <Card key={param}>
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">{param}</h3>
                                    <p className="text-lg font-bold text-white">
                                        {String(vitalsData.status[param])}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Health Vitals */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Health Vitals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Heart Rate */}
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
                                    <Heart className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded", hrStatus.bg, hrStatus.color)}>
                                    {hrStatus.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Heart Rate</h3>
                                <p className="text-3xl font-bold text-white">
                                    {vitalsData.health.heartRate.toFixed(0)}
                                    <span className="text-lg text-gray-400 ml-1">bpm</span>
                                </p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-red-600 h-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, (vitalsData.health.heartRate / 120) * 100)}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SpO2 */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                                    <Wind className="w-6 h-6 text-white" />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded", spo2Status.bg, spo2Status.color)}>
                                    {spo2Status.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Blood Oxygen</h3>
                                <p className="text-3xl font-bold text-white">
                                    {vitalsData.health.spo2.toFixed(1)}
                                    <span className="text-lg text-gray-400 ml-1">%</span>
                                </p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300"
                                    style={{ width: `${vitalsData.health.spo2}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Temperature */}
                    <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                                    <Thermometer className="w-6 h-6 text-white" />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded", tempStatus.bg, tempStatus.color)}>
                                    {tempStatus.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Temperature</h3>
                                <p className="text-3xl font-bold text-white">
                                    {vitalsData.health.temperature.toFixed(2)}
                                    <span className="text-lg text-gray-400 ml-1">°C</span>
                                </p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-orange-500 h-full transition-all duration-300"
                                    style={{ width: `${((vitalsData.health.temperature - 35) / 5) * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Humidity */}
                    <Card className="border-l-4 border-l-cyan-500">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-cyan-600 rounded-xl shadow-lg shadow-cyan-600/20">
                                    <Wind className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Humidity</h3>
                                <p className="text-3xl font-bold text-white">
                                    {vitalsData.health.humidity.toFixed(1)}
                                    <span className="text-lg text-gray-400 ml-1">%</span>
                                </p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-cyan-600 h-full transition-all duration-300"
                                    style={{ width: `${vitalsData.health.humidity}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Additional Health Parameters */}
            {additionalHealthParams.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Additional Health Parameters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {additionalHealthParams.map(param => (
                            <Card key={param} className="border-l-4 border-l-purple-500">
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">{param}</h3>
                                    <p className="text-2xl font-bold text-white">
                                        {typeof vitalsData.health[param] === 'number'
                                            ? vitalsData.health[param].toFixed(2)
                                            : String(vitalsData.health[param])
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Motion Sensors */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Motion Sensors
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Accelerometer */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                                Accelerometer
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Magnitude</span>
                                    <span className="text-white font-mono font-bold">
                                        {vitalsData.motion.accelMag.toFixed(5)} g
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-purple-600 h-full transition-all duration-300"
                                        style={{ width: `${Math.min(100, vitalsData.motion.accelMag * 50)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gyroscope */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-pink-500" />
                                Gyroscope
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Magnitude</span>
                                    <span className="text-white font-mono font-bold">
                                        {vitalsData.motion.gyroMag.toFixed(5)} °/s
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-pink-600 h-full transition-all duration-300"
                                        style={{ width: `${Math.min(100, vitalsData.motion.gyroMag * 20)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Detailed Motion Data */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Motion Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Gyroscope X */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Gyro X-axis</span>
                                <span className="text-white font-mono text-sm font-bold">
                                    {vitalsData.motion.gx.toFixed(5)}°/s
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-red-500 h-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.abs(vitalsData.motion.gx) * 20)}%` }}
                                />
                            </div>
                        </div>

                        {/* Gyroscope Y */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Gyro Y-axis</span>
                                <span className="text-white font-mono text-sm font-bold">
                                    {vitalsData.motion.gy.toFixed(5)}°/s
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.abs(vitalsData.motion.gy) * 20)}%` }}
                                />
                            </div>
                        </div>

                        {/* Gyroscope Z */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Gyro Z-axis</span>
                                <span className="text-white font-mono text-sm font-bold">
                                    {vitalsData.motion.gz.toFixed(5)}°/s
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.abs(vitalsData.motion.gz) * 20)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Motion Parameters */}
            {additionalMotionParams.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Additional Motion Parameters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {additionalMotionParams.map(param => (
                            <Card key={param}>
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">{param}</h3>
                                    <p className="text-lg font-bold text-white">
                                        {typeof vitalsData.motion[param] === 'number'
                                            ? vitalsData.motion[param].toFixed(5)
                                            : String(vitalsData.motion[param])
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
