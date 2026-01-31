import { useState } from "react"
import { PoliceHospitalsMap } from "@/components/map/PoliceHospitalsMap"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, Shield, Clock, AlertTriangle, RefreshCw } from "lucide-react"

export function Dashboard() {
    const [filter, setFilter] = useState<'all' | 'police' | 'hospital'>('all')

    return (
        <div className="space-y-8 animate-fade-in">

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Map and Filters */}
                <div className="flex-1 space-y-6">
                    {/* Filter Options */}
                    <div className="rounded-xl border border-gray-800 bg-dark-card p-6 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-white">Emergency Services Filter</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-xs font-medium">Live Data</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400 text-sm font-medium">Show:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as 'all' | 'police' | 'hospital')}
                                    className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 min-w-[160px]"
                                >
                                    <option value="all">🏥 All Services</option>
                                    <option value="police">🚔 Police Stations</option>
                                    <option value="hospital">🏥 Hospitals</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className="text-blue-400 font-bold">82</span>
                                    <span className="text-gray-400">Police</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span className="text-red-400 font-bold">342</span>
                                    <span className="text-gray-400">Hospitals</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Police Stations & Hospitals</h2>
                            <p className="text-gray-400 text-sm">Real-time emergency services coverage</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                                <RefreshCw className="w-3.5 h-3.5" />
                                Refresh Map
                            </button>
                        </div>
                    </div>

                    <PoliceHospitalsMap filter={filter} />
                </div>

                {/* Right Side: Metrics */}
                <div className="w-full xl:w-80 space-y-6">
                    {/* Active Users */}
                    <Card className="border-l-4 border-l-red-600">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">+12.5%</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
                                <p className="text-2xl font-bold text-white">2,847</p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full w-[75%]" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Safety Score */}
                    <Card className="border-l-4 border-l-blue-600">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Safety Score</h3>
                                <p className="text-2xl font-bold text-white">98%</p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[98%]" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response Time */}
                    <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-400 text-sm font-medium">Avg Response</h3>
                                <p className="text-2xl font-bold text-white">1.2m</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Alerts */}
                    <Card className="bg-red-900/10 border-red-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                <span className="text-red-400 font-bold text-sm">CRITICAL ALERT</span>
                            </div>
                            <p className="text-white font-medium">3 Active Emergencies</p>
                            <p className="text-xs text-gray-500 mt-1">Requiring immediate attention in Shillong area.</p>
                            <button className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                                View Details
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
