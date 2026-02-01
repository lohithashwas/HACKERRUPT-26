import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Search, Filter, Download, AlertTriangle, Eye, X, Activity, MapPin, Smartphone, Clock } from "lucide-react"
import { fetchEmergencyAuditLogs, type EmergencyAuditLog } from "@/services/firebaseService"
import { toast } from "sonner"

interface Log {
    id: number
    timestamp: Date
    actor: 'Admin' | 'Police' | 'Authority' | 'System'
    action: string
    details: string
    status: 'Success' | 'Failed' | 'Pending' | 'Warning'
}

export function AuditLogs() {
    // Existing System Logs State
    const [logs, setLogs] = useState<Log[]>([])
    const [filterActor, setFilterActor] = useState<string>('all')
    const [filterAction, setFilterAction] = useState<string>('all')

    // New Emergency Logs State
    const [emergencyLogs, setEmergencyLogs] = useState<EmergencyAuditLog[]>([])
    const [selectedEmergencyLog, setSelectedEmergencyLog] = useState<EmergencyAuditLog | null>(null)
    const [isLoadingEmergency, setIsLoadingEmergency] = useState(true)

    // Fetch Emergency Logs from Firebase
    useEffect(() => {
        const loadEmergencyLogs = async () => {
            try {
                setIsLoadingEmergency(true)
                const data = await fetchEmergencyAuditLogs()
                // Convert object to array and sort by timestamp (newest first)
                const logsArray = Object.values(data).sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
                setEmergencyLogs(logsArray)
            } catch (error) {
                console.error("Failed to fetch emergency logs:", error)
                toast.error("Failed to load emergency audit logs")
            } finally {
                setIsLoadingEmergency(false)
            }
        }

        loadEmergencyLogs()
        // Set up polling for real-time-like updates (every 5 seconds)
        const interval = setInterval(loadEmergencyLogs, 5000)
        return () => clearInterval(interval)
    }, [])

    // Generate mock data for System Logs on mount (Existing Logic)
    useEffect(() => {
        const actors = ['Admin', 'Police', 'Authority', 'System'] as const
        const actions = ['ACK_ALERT', 'RESOLVE_ALERT', 'LOGIN', 'LOGOUT', 'GEOFENCE_UPDATE', 'USER_CREATE', 'ZONE_DELETE', 'EXPORT_DATA']
        const statuses = ['Success', 'Failed', 'Pending', 'Warning'] as const

        const newLogs: Log[] = []
        for (let i = 0; i < 50; i++) {
            const date = new Date(Date.now() - i * 3600 * 1000)
            const actor = actors[Math.floor(Math.random() * actors.length)]
            const action = actions[Math.floor(Math.random() * actions.length)]
            const status = statuses[Math.floor(Math.random() * statuses.length)]

            let details = ''
            switch (action) {
                case 'LOGIN': details = 'User authentication successful'; break;
                case 'LOGOUT': details = 'User session terminated'; break;
                case 'GEOFENCE_UPDATE': details = `Updated safety zone ${Math.floor(Math.random() * 5) + 1}`; break;
                case 'ACK_ALERT': details = `Alert TUR-${Math.floor(Math.random() * 9999) + 1000} acknowledged`; break;
                case 'RESOLVE_ALERT': details = `Emergency TUR-${Math.floor(Math.random() * 9999) + 1000} resolved`; break;
                case 'USER_CREATE': details = 'New user account created'; break;
                case 'ZONE_DELETE': details = `Safety zone ${Math.floor(Math.random() * 5) + 1} deleted`; break;
                case 'EXPORT_DATA': details = 'System data exported to CSV'; break;
                default: details = 'System operation completed';
            }

            newLogs.push({ id: i, timestamp: date, actor, action, details, status })
        }
        setLogs(newLogs)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Success': return 'text-green-400 bg-green-500/10 border-green-500/20'
            case 'Failed': return 'text-red-400 bg-red-500/10 border-red-500/20'
            case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            case 'Warning': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
        }
    }

    const getEmergencyStatusColor = (status: string) => {
        switch (status) {
            case 'TRIGGERED': return 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse'
            case 'CONFIRMED': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
            case 'CANCELLED': return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
        }
    }

    const filteredLogs = logs.filter(log =>
        (filterActor === 'all' || log.actor === filterActor) &&
        (filterAction === 'all' || log.action === filterAction)
    )

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Audit Logs & Emergency Records</h1>
                    <p className="text-gray-400 text-sm mt-1">Comprehensive audit trail of system events and emergency alerts</p>
                </div>
            </div>

            {/* Emergency Logs Section (New) */}
            <Card className="bg-dark-card border-red-900/30">
                <CardHeader className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white">Emergency Audit Logs</CardTitle>
                                <p className="text-sm text-gray-400">Real-time emergency events from database</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-xs text-red-400 font-medium">Live Feed</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Timestamp</th>
                                    <th className="px-6 py-4 font-medium">Log ID</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Location</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {isLoadingEmergency ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Loading emergency logs...
                                        </td>
                                    </tr>
                                ) : emergencyLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No emergency logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    emergencyLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-red-500/5 transition-colors group">
                                            <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-gray-300">
                                                {log.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${log.type === 'SOS'
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {log.type === 'SOS' ? <AlertTriangle className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getEmergencyStatusColor(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 max-w-[200px] truncate">
                                                {log.location?.address || `${log.location?.latitude?.toFixed(4)}, ${log.location?.longitude?.toFixed(4)}`}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedEmergencyLog(log)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                    title="View Full Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Existing System Logs Section */}
            <Card className="bg-dark-card border-gray-800">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-semibold text-xl text-white">System Audit Trail</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-500 text-sm font-medium">System Active</span>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <select
                                    value={filterActor}
                                    onChange={(e) => setFilterActor(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg focus:ring-red-500 focus:border-red-500 appearance-none min-w-[130px]"
                                >
                                    <option value="all">All Actors</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Police">Police</option>
                                    <option value="Authority">Authority</option>
                                    <option value="System">System</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <select
                                    value={filterAction}
                                    onChange={(e) => setFilterAction(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 text-white text-xs rounded-lg focus:ring-red-500 focus:border-red-500 appearance-none min-w-[140px]"
                                >
                                    <option value="all">All Actions</option>
                                    <option value="ACK_ALERT">ACK_ALERT</option>
                                    <option value="RESOLVE_ALERT">RESOLVE_ALERT</option>
                                    <option value="LOGIN">LOGIN</option>
                                    <option value="GEOFENCE_UPDATE">GEOFENCE_UPDATE</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-800">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Timestamp</th>
                                    <th className="px-4 py-3 font-medium">Actor</th>
                                    <th className="px-4 py-3 font-medium">Action</th>
                                    <th className="px-4 py-3 font-medium">Details</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                                            {log.timestamp.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {log.actor}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white">
                                            {log.action}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {log.details}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Emergency Log Modal */}
            {selectedEmergencyLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-4xl bg-zinc-950 border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <CardHeader className="border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    Emergency Event Details
                                    <span className="text-sm font-normal text-zinc-500 font-mono">#{selectedEmergencyLog.id}</span>
                                </CardTitle>
                            </div>
                            <button
                                onClick={() => setSelectedEmergencyLog(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">Status</div>
                                    <div className={`text-lg font-bold ${selectedEmergencyLog.status === 'TRIGGERED' ? 'text-red-500' :
                                            selectedEmergencyLog.status === 'CONFIRMED' ? 'text-orange-500' : 'text-gray-500'
                                        }`}>
                                        {selectedEmergencyLog.status}
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">Type</div>
                                    <div className="text-lg font-bold text-white flex items-center gap-2">
                                        {selectedEmergencyLog.type === 'SOS' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Activity className="w-4 h-4 text-yellow-500" />}
                                        {selectedEmergencyLog.type}
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">Response Time</div>
                                    <div className="text-lg font-bold text-blue-400">
                                        {selectedEmergencyLog.responseTime ? `${selectedEmergencyLog.responseTime}s` : 'N/A'}
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">User Action</div>
                                    <div className="text-lg font-bold text-white text-xs sm:text-sm md:text-base truncate" title={selectedEmergencyLog.userAction}>
                                        {selectedEmergencyLog.userAction || 'Pending...'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Vitals Data */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-red-500" />
                                        Recorded Vitals
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                                            <span className="text-zinc-400">Heart Rate</span>
                                            <span className="text-white font-mono font-bold">{selectedEmergencyLog.vitals.heartRate} BPM</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                                            <span className="text-zinc-400">SpO2</span>
                                            <span className="text-white font-mono font-bold">{selectedEmergencyLog.vitals.spo2}%</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                                            <span className="text-zinc-400">Temperature</span>
                                            <span className="text-white font-mono font-bold">{selectedEmergencyLog.vitals.temperature}°C</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400">Humidity</span>
                                            <span className="text-white font-mono font-bold">{selectedEmergencyLog.vitals.humidity}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Data */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        Location Details
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
                                        <div className="flex flex-col pb-2 border-b border-zinc-800">
                                            <span className="text-zinc-400 text-xs mb-1">Address</span>
                                            <span className="text-white text-sm">{selectedEmergencyLog.location?.address || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                                            <span className="text-zinc-400">Coordinates</span>
                                            <span className="text-white font-mono text-xs">
                                                {selectedEmergencyLog.location?.latitude?.toFixed(6)}, {selectedEmergencyLog.location?.longitude?.toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400">Accuracy</span>
                                            <span className="text-white font-mono">{selectedEmergencyLog.location?.accuracy?.toFixed(1)}m</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Device Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-purple-500" />
                                        Device Information
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-2 text-sm">
                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                            <span className="text-zinc-500">Platform</span>
                                            <span className="text-zinc-300">{selectedEmergencyLog.deviceInfo?.platform || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                            <span className="text-zinc-500">Browser</span>
                                            <span className="text-zinc-300 truncate" title={selectedEmergencyLog.deviceInfo?.userAgent}>{selectedEmergencyLog.deviceInfo?.userAgent || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                            <span className="text-zinc-500">Timezone</span>
                                            <span className="text-zinc-300">{selectedEmergencyLog.deviceInfo?.timezone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-500" />
                                        Timeline
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3 relative">
                                        <div className="absolute left-4 top-4 bottom-4 w-px bg-zinc-800"></div>

                                        <div className="relative pl-6">
                                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-zinc-900"></div>
                                            <div className="text-xs text-zinc-500">Emergency Triggered</div>
                                            <div className="text-sm text-white font-mono">{new Date(selectedEmergencyLog.timestamp).toLocaleString()}</div>
                                        </div>

                                        {selectedEmergencyLog.notificationsSent?.timestamp && (
                                            <div className="relative pl-6">
                                                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-zinc-900"></div>
                                                <div className="text-xs text-zinc-500">Notifications Sent</div>
                                                <div className="text-sm text-white font-mono">{new Date(selectedEmergencyLog.notificationsSent.timestamp).toLocaleString()}</div>
                                            </div>
                                        )}

                                        {selectedEmergencyLog.location?.timestamp && (
                                            <div className="relative pl-6">
                                                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-zinc-900"></div>
                                                <div className="text-xs text-zinc-500">Last Location Update</div>
                                                <div className="text-sm text-white font-mono">{new Date(selectedEmergencyLog.location.timestamp).toLocaleString()}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Raw JSON Data Dropdown (Optional/Advanced) */}
                            <details className="group bg-zinc-950 rounded-lg border border-zinc-900">
                                <summary className="cursor-pointer p-4 font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-2 select-none">
                                    <span>View Raw Audit JSON</span>
                                </summary>
                                <div className="p-4 pt-0 border-t border-zinc-900 mt-2 bg-black/50 overflow-x-auto">
                                    <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-all">
                                        {JSON.stringify(selectedEmergencyLog, null, 2)}
                                    </pre>
                                </div>
                            </details>

                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
