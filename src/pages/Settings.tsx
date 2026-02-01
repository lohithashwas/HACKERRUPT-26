import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
    Globe, Bell, Server, Database, Save, Monitor, Moon, Activity, CheckCircle, XCircle,
    Shield, Lock, Key, Users, MapPin, Smartphone, Mail, Clock, HardDrive, Wifi,
    AlertTriangle, Settings as SettingsIcon, RefreshCw, Download, Upload, Trash2
} from "lucide-react"

export function Settings() {
    const [soundAlerts, setSoundAlerts] = useState(true)
    const [desktopNotifs, setDesktopNotifs] = useState(true)
    const [emailAlerts, setEmailAlerts] = useState(false)
    const [smsAlerts, setSmsAlerts] = useState(true)
    const [locationTracking, setLocationTracking] = useState(true)
    const [autoBackup, setAutoBackup] = useState(true)
    const [twoFactorAuth, setTwoFactorAuth] = useState(false)

    // Simulated Status
    const [statuses, setStatuses] = useState({
        db: 'checking',
        api: 'checking',
        auth: 'checking',
        mapbox: 'checking',
        sms: 'checking',
        email: 'checking'
    })

    const [systemInfo, setSystemInfo] = useState({
        version: 'PROTECT-R v2.5.0',
        build: 'Build 2026.01.31',
        uptime: '15 days, 7 hours',
        activeUsers: 1247,
        totalAlerts: 3842,
        storageUsed: '2.3 GB',
        storageTotal: '10 GB'
    })

    useEffect(() => {
        // Simulate status checks
        const checkStatus = (key: keyof typeof statuses, delay: number, status: 'online' | 'offline' = 'online') => {
            setTimeout(() => {
                setStatuses(prev => ({ ...prev, [key]: status }))
            }, delay)
        }

        checkStatus('mapbox', 800)
        checkStatus('auth', 1200)
        checkStatus('sms', 1800)
        checkStatus('email', 2200)
        checkStatus('api', 2800)
        checkStatus('db', 3200)
    }, [])

    const StatusIndicator = ({ status, label, subtext, icon: Icon }: { status: string, label: string, subtext: string, icon: any }) => {
        let statusIcon = <Activity className="w-4 h-4 text-gray-400 animate-pulse" />
        let text = 'Checking...'
        let textColor = 'text-gray-400'
        let bgColor = 'bg-gray-900/50'

        if (status === 'online') {
            statusIcon = <CheckCircle className="w-4 h-4 text-green-500" />
            text = 'Active'
            textColor = 'text-green-400'
            bgColor = 'bg-green-900/10'
        } else if (status === 'offline') {
            statusIcon = <XCircle className="w-4 h-4 text-red-500" />
            text = 'Offline'
            textColor = 'text-red-400'
            bgColor = 'bg-red-900/10'
        }

        return (
            <div className={`p-4 ${bgColor} rounded-xl border ${status === 'online' ? 'border-green-900/30' : status === 'offline' ? 'border-red-900/30' : 'border-gray-800'} transition-all`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${status === 'online' ? 'bg-green-500/20' : status === 'offline' ? 'bg-red-500/20' : 'bg-gray-800'}`}>
                        <Icon className={`w-4 h-4 ${status === 'online' ? 'text-green-500' : status === 'offline' ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{label}</h4>
                        <p className={`text-xs font-medium ${textColor}`}>{text}</p>
                    </div>
                    {statusIcon}
                </div>
                <p className="text-gray-500 text-xs mt-2">{subtext}</p>
            </div>
        )
    }

    const ToggleSwitch = ({ enabled, onChange, label, description }: { enabled: boolean, onChange: () => void, label: string, description: string }) => (
        <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">{label}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{description}</p>
            </div>
            <div
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-red-600' : 'bg-gray-700'}`}
                onClick={onChange}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    )

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <SettingsIcon className="w-8 h-8 text-red-500" />
                        System Settings
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Configure system preferences, security, and integrations</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-gray-700">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Status
                    </button>
                    <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm shadow-lg shadow-red-900/20">
                        <Save className="w-4 h-4" />
                        Save All Changes
                    </button>
                </div>
            </div>

            {/* System Overview */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-red-500" />
                    System Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-900/30">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Active Users</p>
                                    <p className="text-2xl font-bold text-white">{systemInfo.activeUsers.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-900/30">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/20 rounded-xl">
                                    <Bell className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Total Alerts</p>
                                    <p className="text-2xl font-bold text-white">{systemInfo.totalAlerts.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-900/30">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">System Uptime</p>
                                    <p className="text-lg font-bold text-white">{systemInfo.uptime}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border-orange-900/30">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-500/20 rounded-xl">
                                    <HardDrive className="w-6 h-6 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Storage Used</p>
                                    <p className="text-xl font-bold text-white">{systemInfo.storageUsed} <span className="text-sm text-gray-500">/ {systemInfo.storageTotal}</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* System Status */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Server className="w-5 h-5 text-red-500" />
                    Service Status
                </h2>
                <Card className="bg-dark-card border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatusIndicator status={statuses.db} label="Database" subtext="MongoDB Atlas • Chennai Region" icon={Database} />
                            <StatusIndicator status={statuses.api} label="API Server" subtext="Node.js • Port 3000 • 99.9% uptime" icon={Server} />
                            <StatusIndicator status={statuses.auth} label="Authentication" subtext="JWT Tokens • Secure Sessions" icon={Lock} />
                            <StatusIndicator status={statuses.mapbox} label="Map Services" subtext="Leaflet + OpenStreetMap" icon={MapPin} />
                            <StatusIndicator status={statuses.sms} label="SMS Gateway" subtext="Twilio Integration • India" icon={Smartphone} />
                            <StatusIndicator status={statuses.email} label="Email Service" subtext="Nodemailer SMTP • Active" icon={Mail} />
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                                    <SettingsIcon className="w-4 h-4 text-gray-400" />
                                    System Version
                                </h4>
                                <p className="text-gray-400 text-xs mt-1">{systemInfo.version}</p>
                                <p className="text-gray-500 text-xs">{systemInfo.build}</p>
                            </div>
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-green-400" />
                                    Network Status
                                </h4>
                                <p className="text-green-400 text-xs mt-1 font-medium">Connected</p>
                                <p className="text-gray-500 text-xs">Latency: 45ms</p>
                            </div>
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    Security Status
                                </h4>
                                <p className="text-blue-400 text-xs mt-1 font-medium">Protected</p>
                                <p className="text-gray-500 text-xs">SSL/TLS Enabled</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Security Settings */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    Security & Privacy
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-dark-card border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ToggleSwitch
                                enabled={twoFactorAuth}
                                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                                label="Two-Factor Authentication (2FA)"
                                description="Require OTP for high-security access"
                            />
                            <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                <h4 className="font-semibold text-white text-sm mb-2">Session Timeout</h4>
                                <select className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>Never</option>
                                </select>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-red-900/30">
                                <Key className="w-4 h-4" />
                                Change Password
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="bg-dark-card border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Privacy Controls
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ToggleSwitch
                                enabled={locationTracking}
                                onChange={() => setLocationTracking(!locationTracking)}
                                label="Location Tracking"
                                description="Allow app to access your GPS location"
                            />
                            <ToggleSwitch
                                enabled={autoBackup}
                                onChange={() => setAutoBackup(!autoBackup)}
                                label="Automatic Backups"
                                description="Daily backup of user data and settings"
                            />
                            <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                <h4 className="font-semibold text-white text-sm mb-2">Data Retention</h4>
                                <select className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2">
                                    <option>30 days</option>
                                    <option>90 days</option>
                                    <option>1 year</option>
                                    <option>Forever</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Notifications */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-500" />
                    Notifications & Alerts
                </h2>
                <Card className="bg-dark-card border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ToggleSwitch
                                enabled={soundAlerts}
                                onChange={() => setSoundAlerts(!soundAlerts)}
                                label="Sound Alerts"
                                description="Play audio for emergency notifications"
                            />
                            <ToggleSwitch
                                enabled={desktopNotifs}
                                onChange={() => setDesktopNotifs(!desktopNotifs)}
                                label="Desktop Notifications"
                                description="Show browser push notifications"
                            />
                            <ToggleSwitch
                                enabled={emailAlerts}
                                onChange={() => setEmailAlerts(!emailAlerts)}
                                label="Email Alerts"
                                description="Send critical alerts to registered email"
                            />
                            <ToggleSwitch
                                enabled={smsAlerts}
                                onChange={() => setSmsAlerts(!smsAlerts)}
                                label="SMS Alerts"
                                description="Send emergency SMS to registered number"
                            />
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h4 className="font-semibold text-white text-sm mb-3">Alert Priority Levels</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="p-3 bg-red-900/10 rounded-lg border border-red-900/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <span className="text-red-400 font-semibold text-sm">Critical</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">All channels enabled</p>
                                </div>
                                <div className="p-3 bg-yellow-900/10 rounded-lg border border-yellow-900/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Bell className="w-4 h-4 text-yellow-500" />
                                        <span className="text-yellow-400 font-semibold text-sm">High</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">Push + Sound only</p>
                                </div>
                                <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-900/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Bell className="w-4 h-4 text-blue-500" />
                                        <span className="text-blue-400 font-semibold text-sm">Normal</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">Silent notifications</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Appearance */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-red-500" />
                    Appearance & Display
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                                <div>
                                    <h3 className="font-semibold text-white">Theme Preference</h3>
                                    <p className="text-gray-400 text-sm">Currently using Dark Mode</p>
                                </div>
                                <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                    <Moon className="w-5 h-5 text-blue-400" />
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color</label>
                                <div className="flex gap-3">
                                    <button className="w-10 h-10 rounded-lg bg-red-600 border-2 border-white shadow-lg"></button>
                                    <button className="w-10 h-10 rounded-lg bg-blue-600 border-2 border-transparent hover:border-white transition-colors"></button>
                                    <button className="w-10 h-10 rounded-lg bg-green-600 border-2 border-transparent hover:border-white transition-colors"></button>
                                    <button className="w-10 h-10 rounded-lg bg-purple-600 border-2 border-transparent hover:border-white transition-colors"></button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block pl-10 p-2.5">
                                        <option value="en">English</option>
                                        <option value="hi">Hindi (हिंदी)</option>
                                        <option value="ta">Tamil (தமிழ்)</option>
                                        <option value="te">Telugu (తెలుగు)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Date Format</label>
                                <select className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2">
                                    <option>DD/MM/YYYY</option>
                                    <option>MM/DD/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Advanced Configuration */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-red-500" />
                    Advanced Configuration
                </h2>
                <Card className="bg-dark-card border-gray-800">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Backend API Endpoint</label>
                                <input type="text" value="http://localhost:3000" readOnly className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">WebSocket Server</label>
                                <input type="text" value="ws://localhost:3000/socket" readOnly className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Database Connection</label>
                                <input type="text" value="mongodb://localhost:27017/protect-r" readOnly className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Data Refresh Interval</label>
                                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                                    <option>Real-time (WebSocket)</option>
                                    <option>30 seconds</option>
                                    <option>1 minute</option>
                                    <option>5 minutes</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-800">
                            <h4 className="font-semibold text-white text-sm mb-3">Data Management</h4>
                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Download className="w-4 h-4" />
                                    Export Data
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Import Data
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg border border-gray-700 transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                    Clear Cache
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 text-sm font-medium rounded-lg border border-red-900/30 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                    Reset All Settings
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
