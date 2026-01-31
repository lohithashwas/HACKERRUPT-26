import { PoliceHospitalsMap } from "@/components/map/PoliceHospitalsMap"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, Shield, Clock, AlertTriangle, RefreshCw } from "lucide-react"

export function Dashboard() {
    return (
        <div className="space-y-8 animate-fade-in">

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Map and Filters */}
                <div className="flex-1 space-y-6">
                    {/* Map Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Police Stations & Hospitals</h2>
                            <p className="text-gray-400 text-sm">Real-time emergency services coverage</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-green-500">Live Data</span>
                            </div>
                            <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <PoliceHospitalsMap />
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
