const FIREBASE_HOST = "https://esp-data-26ccf-default-rtdb.asia-southeast1.firebasedatabase.app/";
const FIREBASE_AUTH = atob('b3JhMnRpWVljb3RqTFp6R1NnNGZnTnlSTmZ1cXV6NHZ1UThYZGxLcg==');

export interface FirebaseVitalsData {
    health?: {
        heartRate?: number;
        humidity?: number;
        spo2?: number;
        temperature?: number;
        [key: string]: any; // Allow additional health parameters
    };
    motion?: {
        accelMag?: number;
        gx?: number;
        gy?: number;
        gyroMag?: number;
        gz?: number;
        [key: string]: any; // Allow additional motion parameters
    };
    status?: {
        SOS?: boolean;
        gyroLED?: boolean;
        [key: string]: any; // Allow additional status parameters
    };
    [key: string]: any; // Allow additional top-level parameters
}

/**
 * Fetch vitals data from Firebase Realtime Database
 */
export async function fetchVitalsData(): Promise<FirebaseVitalsData> {
    try {
        const response = await fetch(`${FIREBASE_HOST}.json?auth=${FIREBASE_AUTH}`);

        if (!response.ok) {
            throw new Error(`Firebase fetch failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Firebase data received:', data);

        return data || {};
    } catch (error) {
        console.error('Error fetching Firebase data:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time updates from Firebase
 * Uses Server-Sent Events (SSE) for real-time streaming
 */
export function subscribeToVitalsData(
    onData: (data: FirebaseVitalsData) => void,
    onError?: (error: Error) => void
): () => void {
    const eventSource = new EventSource(`${FIREBASE_HOST}.json?auth=${FIREBASE_AUTH}`);

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Firebase real-time update:', data);
            onData(data);
        } catch (error) {
            console.error('Error parsing Firebase data:', error);
            if (onError) {
                onError(error as Error);
            }
        }
    };

    eventSource.onerror = (error) => {
        console.error('Firebase EventSource error:', error);
        if (onError) {
            onError(new Error('Firebase connection error'));
        }
    };

    // Return cleanup function
    return () => {
        eventSource.close();
    };
}

/**
 * Fetch data from a specific path in Firebase
 */
export async function fetchFirebasePath(path: string): Promise<any> {
    try {
        const url = `${FIREBASE_HOST}${path}.json?auth=${FIREBASE_AUTH}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Firebase fetch failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Firebase data from ${path}:`, data);

        return data;
    } catch (error) {
        console.error(`Error fetching Firebase path ${path}:`, error);
        throw error;
    }
}

/**
 * Update data in Firebase
 */
export async function updateFirebaseData(path: string, data: any): Promise<void> {
    try {
        const url = `${FIREBASE_HOST}${path}.json?auth=${FIREBASE_AUTH}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Firebase update failed: ${response.statusText}`);
        }


        console.log(`Firebase data updated at ${path}`);
    } catch (error) {
        console.error(`Error updating Firebase path ${path}:`, error);
        throw error;
    }
}

/**
 * Emergency Audit Log Interface
 */
export interface EmergencyAuditLog {
    id: string;
    timestamp: string;
    type: 'SOS' | 'Motion';
    status: 'TRIGGERED' | 'CONFIRMED' | 'CANCELLED';
    vitals: {
        heartRate?: number;
        spo2?: number;
        temperature?: number;
        humidity?: number;
    };
    motion: {
        accelMag?: number;
        gyroMag?: number;
        gx?: number;
        gy?: number;
        gz?: number;
    };
    location?: {
        latitude?: number;
        longitude?: number;
        accuracy?: number;
        address?: string;
        timestamp?: string;
    };
    deviceInfo?: {
        userAgent?: string;
        platform?: string;
        language?: string;
        screenResolution?: string;
        windowSize?: string;
        timezone?: string;
        online?: boolean;
    };
    vitalsHistory?: Array<{
        timestamp: string;
        heartRate?: number;
        spo2?: number;
        temperature?: number;
        humidity?: number;
        accelMag?: number;
        gyroMag?: number;
    }>;
    userAction?: 'AUTO_CONFIRMED' | 'MANUALLY_CONFIRMED' | 'CANCELLED';
    responseTime?: number; // seconds
    notificationsSent?: {
        sms: boolean;
        backend: boolean;
        timestamp: string;
    };
}

/**
 * Save emergency audit log to Firebase
 */
export async function saveEmergencyAuditLog(log: EmergencyAuditLog): Promise<void> {
    try {
        const url = `${FIREBASE_HOST}emergencyLogs/${log.id}.json?auth=${FIREBASE_AUTH}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });

        if (!response.ok) {
            throw new Error(`Failed to save emergency log: ${response.statusText}`);
        }

        console.log('Emergency audit log saved to Firebase:', log.id);
    } catch (error) {
        console.error('Error saving emergency audit log:', error);
        throw error;
    }
}

/**
 * Fetch all emergency audit logs from Firebase
 */
export async function fetchEmergencyAuditLogs(): Promise<Record<string, EmergencyAuditLog>> {
    try {
        const url = `${FIREBASE_HOST}emergencyLogs.json?auth=${FIREBASE_AUTH}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch emergency logs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Emergency audit logs fetched:', data);

        return data || {};
    } catch (error) {
        console.error('Error fetching emergency audit logs:', error);
        throw error;
    }
}

/**
 * Update emergency audit log status
 */
export async function updateEmergencyLogStatus(
    logId: string,
    status: 'TRIGGERED' | 'CONFIRMED' | 'CANCELLED',
    userAction?: 'AUTO_CONFIRMED' | 'MANUALLY_CONFIRMED' | 'CANCELLED'
): Promise<void> {
    try {
        const url = `${FIREBASE_HOST}emergencyLogs/${logId}.json?auth=${FIREBASE_AUTH}`;

        // First fetch the existing log
        const fetchResponse = await fetch(url);
        if (!fetchResponse.ok) {
            throw new Error('Emergency log not found');
        }

        const existingLog = await fetchResponse.json();

        // Update the log
        const updatedLog = {
            ...existingLog,
            status,
            userAction: userAction || existingLog.userAction,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLog),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update emergency log: ${updateResponse.statusText}`);
        }

        console.log('Emergency log status updated:', logId, status);
    } catch (error) {
        console.error('Error updating emergency log status:', error);
        throw error;
    }
}
