import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, MapPin, Phone, StickyNote, X, Send, CheckCircle2, AlertCircle, Clock, Car, UserCheck } from "lucide-react"

// Alert data type
interface Alert {
    id: string
    name: string
    timeAgo: string
    type: string
    severity: 'critical' | 'warning'
    userId: string
    nationality: string
    location: string
    contact: string
    incident: string
    status: 'active' | 'responding' | 'resolved'
}

export function Alerts() {
    const [selectedFilter, setSelectedFilter] = useState<'critical' | 'warning' | 'all'>('critical')
    const [respondModal, setRespondModal] = useState<{ open: boolean; alert: Alert | null }>({ open: false, alert: null })
    const [validateModal, setValidateModal] = useState<{ open: boolean; alert: Alert | null }>({ open: false, alert: null })
    const [responseNote, setResponseNote] = useState('')
    const [selectedUnit, setSelectedUnit] = useState('patrol-1')
    const [estimatedTime, setEstimatedTime] = useState('5')

    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: '1',
            name: 'Priya Lakshmi',
            timeAgo: '2 mins ago',
            type: 'Medical Emergency',
            severity: 'critical',
            userId: 'TUR-2847',
            nationality: 'Indian',
            location: 'Navalur, Chennai',
            contact: '+91 98410 37541',
            incident: 'User injured at OMR Main Road, Ambulance dispatched, requires immediate medical attention.',
            status: 'active'
        },
        {
            id: '2',
            name: 'Ananya Krishnan',
            timeAgo: '5 mins ago',
            type: 'Safety Threat',
            severity: 'critical',
            userId: 'TUR-3192',
            nationality: 'Indian',
            location: 'T. Nagar, Chennai',
            contact: '+91 99625 84732',
            incident: 'User reports being followed by suspicious individual near Ranganathan Street. Police unit dispatched.',
            status: 'active'
        },
        {
            id: '3',
            name: 'Divya Ramachandran',
            timeAgo: '8 mins ago',
            type: 'Accident',
            severity: 'critical',
            userId: 'TUR-4521',
            nationality: 'Indian',
            location: 'Velachery, Chennai',
            contact: '+91 98847 62193',
            incident: 'Two-wheeler accident at Velachery Main Road junction. User conscious but injured. Ambulance en route.',
            status: 'active'
        },
        {
            id: '4',
            name: 'Meera Subramanian',
            timeAgo: '12 mins ago',
            type: 'Suspicious Activity',
            severity: 'warning',
            userId: 'TUR-5638',
            nationality: 'Indian',
            location: 'Anna Nagar, Chennai',
            contact: '+91 97102 45896',
            incident: 'User reports unusual activity near residential area. Patrol unit notified for verification.',
            status: 'active'
        },
        {
            id: '5',
            name: 'Kavya Venkatesh',
            timeAgo: '15 mins ago',
            type: 'Harassment',
            severity: 'warning',
            userId: 'TUR-6742',
            nationality: 'Indian',
            location: 'Adyar, Chennai',
            contact: '+91 96558 73421',
            incident: 'User reports verbal harassment at public transport stop. Requesting police presence for safety.',
            status: 'active'
        }
    ])

    const handleRespond = (alert: Alert) => {
        setRespondModal({ open: true, alert })
        setResponseNote('')
        setSelectedUnit('patrol-1')
        setEstimatedTime('5')
    }

    const handleValidate = (alert: Alert) => {
        setValidateModal({ open: true, alert })
    }

    const submitResponse = () => {
        if (respondModal.alert) {
            setAlerts(alerts.map(a =>
                a.id === respondModal.alert!.id
                    ? { ...a, status: 'responding' as const }
                    : a
            ))
            setRespondModal({ open: false, alert: null })
            // Show success notification (you can add toast here)
            alert(`Response dispatched to ${respondModal.alert.name}!\nUnit: ${selectedUnit}\nETA: ${estimatedTime} mins`)
        }
    }

    const submitValidation = (isValid: boolean) => {
        if (validateModal.alert) {
            if (isValid) {
                setAlerts(alerts.map(a =>
                    a.id === validateModal.alert!.id
                        ? { ...a, status: 'responding' as const }
                        : a
                ))
                alert(`Alert validated for ${validateModal.alert.name}. Status updated to RESPONDING.`)
            } else {
                setAlerts(alerts.filter(a => a.id !== validateModal.alert!.id))
                alert(`Alert marked as false alarm and removed from queue.`)
            }
            setValidateModal({ open: false, alert: null })
        }
    }

    const markAsResolved = (alertId: string) => {
        setAlerts(alerts.map(a =>
            a.id === alertId
                ? { ...a, status: 'resolved' as const }
                : a
        ))
    }

    const filteredAlerts = alerts.filter(alert => {
        if (selectedFilter === 'all') return true
        return alert.severity === selectedFilter
    })

    const activeCount = alerts.filter(a => a.status === 'active').length
    const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
    const warningCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Emergency Alerts</h1>
                    <p className="text-gray-400 text-sm mt-1">Monitor and respond to user emergencies</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-white font-medium">{activeCount} Active</span>
                        </div>
                        <div className="h-4 w-px bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 font-medium">7 Resolved</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Assessment Overview */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6">Risk Assessment Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-t-4 border-t-red-600 bg-dark-card">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">High Risk Areas</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <p className="text-4xl font-bold text-red-500">3</p>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Velachery, Chennai</p>
                        </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-yellow-500 bg-dark-card">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Medium Risk Areas</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <p className="text-4xl font-bold text-yellow-500">7</p>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Weather, Wildlife zone</p>
                        </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-green-500 bg-dark-card">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Safe Areas</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <p className="text-4xl font-bold text-green-500">15</p>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Friendly locations</p>
                        </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-blue-500 bg-dark-card">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Active Users</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <p className="text-4xl font-bold text-blue-500">2800</p>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Live users currently monitor</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* User Details & Active Alerts */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-semibold text-xl text-white">User Details & Active Alerts</h3>
                        <div className="flex bg-gray-900 p-1 rounded-lg self-start">
                            <button
                                onClick={() => setSelectedFilter('critical')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md shadow-sm transition-all ${selectedFilter === 'critical' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Critical ({criticalCount})
                            </button>
                            <button
                                onClick={() => setSelectedFilter('warning')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${selectedFilter === 'warning' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Warning ({warningCount})
                            </button>
                            <button
                                onClick={() => setSelectedFilter('all')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                All ({activeCount})
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Note */}
                        <div className="flex gap-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                            <div className="flex-shrink-0">
                                <StickyNote className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-blue-400 font-bold text-sm mb-1 uppercase tracking-wide">Note</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    For User/Family only 1 user details to be shown.
                                    For other login modules All users details can be shown.
                                </p>
                            </div>
                        </div>

                        {/* Alert Cards */}
                        {filteredAlerts.map((alert) => (
                            <Card
                                key={alert.id}
                                className={`bg-dark-card border-l-4 ${alert.severity === 'critical' ? 'border-l-red-600 shadow-red-900/5' : 'border-l-yellow-500 shadow-yellow-900/5'} border-r-0 border-y-0 border-gray-800 shadow-lg`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                                                <Users className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-xl flex items-center gap-2">
                                                    {alert.name}
                                                    <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400 font-normal border border-gray-700">{alert.timeAgo}</span>
                                                </h4>
                                                <p className={`${alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'} text-sm font-bold uppercase tracking-wide mt-0.5`}>
                                                    {alert.type} - {alert.severity}
                                                </p>
                                            </div>
                                        </div>
                                        {alert.status === 'responding' && (
                                            <span className="px-3 py-1 bg-blue-900/30 border border-blue-500/50 text-blue-400 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                RESPONDING
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">User ID</p>
                                            <p className="text-white font-mono font-medium">{alert.userId}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nationality</p>
                                            <p className="text-white font-medium">{alert.nationality}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Current Location</p>
                                            <div className="flex items-center gap-1.5 text-white font-medium">
                                                <MapPin className={`w-4 h-4 ${alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                                                {alert.location}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Contact</p>
                                            <div className="flex items-center gap-1.5 text-white font-medium">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                {alert.contact}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${alert.severity === 'critical' ? 'bg-red-950/20 border-red-900/20' : 'bg-yellow-950/20 border-yellow-900/20'} border rounded-lg p-4 mb-6`}>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            <span className={`${alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'} font-bold mr-1`}>INCIDENT:</span>
                                            {alert.incident}
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        {alert.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => handleRespond(alert)}
                                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded shadow-lg shadow-blue-900/20 transition-all"
                                                >
                                                    Respond
                                                </button>
                                                <button
                                                    onClick={() => handleValidate(alert)}
                                                    className="px-6 py-2 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded shadow-lg transition-all"
                                                >
                                                    Validate
                                                </button>
                                            </>
                                        )}
                                        {alert.status === 'responding' && (
                                            <button
                                                onClick={() => markAsResolved(alert.id)}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Regional Risk Analysis */}
                <section className="space-y-6">
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg text-white mb-6 border-b border-gray-800 pb-4">Regional Risk Analysis</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-white font-medium">Anna Nagar</h4>
                                        <span className="text-red-500 text-xs font-bold uppercase">High Risk</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500">Weather risk</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-white font-medium">Tambaram</h4>
                                        <span className="text-yellow-500 text-xs font-bold uppercase">Medium</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500">Prone to trees falling</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-white font-medium">Yercaud</h4>
                                        <span className="text-yellow-500 text-xs font-bold uppercase">Medium</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Response Stats */}
                    <Card className="bg-blue-950/20 border-blue-900/30">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg text-white mb-4">Emergency Response Statistics</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-white">4.2m</p>
                                    <p className="text-[10px] text-gray-400 uppercase mt-1">Avg Response Time</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">12</p>
                                    <p className="text-[10px] text-gray-400 uppercase mt-1">Active Teams</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-400">98.7%</p>
                                    <p className="text-[10px] text-gray-400 uppercase mt-1">Success Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

            {/* Respond Modal */}
            {respondModal.open && respondModal.alert && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Send className="w-5 h-5 text-blue-500" />
                                    Dispatch Response
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">Send emergency response to {respondModal.alert.name}</p>
                            </div>
                            <button
                                onClick={() => setRespondModal({ open: false, alert: null })}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Alert Summary */}
                            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-400 font-bold text-sm mb-1">{respondModal.alert.type}</p>
                                        <p className="text-gray-300 text-sm">{respondModal.alert.incident}</p>
                                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            {respondModal.alert.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Response Unit Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Select Response Unit</label>
                                <select
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="patrol-1">Patrol Unit 1 - T. Nagar Station</option>
                                    <option value="patrol-2">Patrol Unit 2 - Velachery Station</option>
                                    <option value="ambulance-1">Ambulance Unit 1 - Apollo Hospital</option>
                                    <option value="ambulance-2">Ambulance Unit 2 - SIMS Hospital</option>
                                    <option value="fire-1">Fire & Rescue Unit - Anna Nagar</option>
                                </select>
                            </div>

                            {/* Estimated Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Arrival Time (minutes)</label>
                                <input
                                    type="number"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(e.target.value)}
                                    min="1"
                                    max="60"
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Response Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Response Notes (Optional)</label>
                                <textarea
                                    value={responseNote}
                                    onChange={(e) => setResponseNote(e.target.value)}
                                    placeholder="Add any additional instructions or notes for the response team..."
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 border-t border-gray-800">
                            <button
                                onClick={submitResponse}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Car className="w-5 h-5" />
                                Dispatch Unit
                            </button>
                            <button
                                onClick={() => setRespondModal({ open: false, alert: null })}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Validate Modal */}
            {validateModal.open && validateModal.alert && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-yellow-500" />
                                    Validate Alert
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">Verify alert authenticity</p>
                            </div>
                            <button
                                onClick={() => setValidateModal({ open: false, alert: null })}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                <h4 className="text-white font-bold mb-2">{validateModal.alert.name}</h4>
                                <p className="text-gray-400 text-sm mb-3">{validateModal.alert.type}</p>
                                <p className="text-gray-300 text-sm">{validateModal.alert.incident}</p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-gray-400 text-sm">Is this alert legitimate and requires action?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => submitValidation(true)}
                                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Confirm Valid
                                    </button>
                                    <button
                                        onClick={() => submitValidation(false)}
                                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        False Alarm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
