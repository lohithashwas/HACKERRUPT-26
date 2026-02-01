import { useState } from "react"
import { PoliceHospitalsMap } from "@/components/map/PoliceHospitalsMap"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, Shield, Clock, AlertTriangle, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Dashboard() {
    const { t } = useLanguage()
    const [filter, setFilter] = useState<'all' | 'police' | 'hospital'>('all')

    return (
        <div className="space-y-8 animate-fade-in">

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Map and Filters */}
                <div className="flex-1 space-y-6">
                    {/* Filter Options */}
                    <div className="rounded-xl border border-gray-800 bg-dark-card p-6 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-white">{t('dashboard.emergencyServicesFilter')}</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-xs font-medium">{t('dashboard.liveData')}</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400 text-sm font-medium">{t('dashboard.show')}</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as 'all' | 'police' | 'hospital')}
                                    className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 min-w-[160px]"
                                >
                                    <option value="all">{t('dashboard.allServices')}</option>
                                    <option value="police">{t('dashboard.policeStations')}</option>
                                    <option value="hospital">{t('dashboard.hospitals')}</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className="text-blue-400 font-bold">82</span>
                                    <span className="text-gray-400">{t('dashboard.police')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span className="text-red-400 font-bold">342</span>
                                    <span className="text-gray-400">{t('dashboard.hospitalsLabel')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('dashboard.policeHospitalsTitle')}</h2>
                            <p className="text-gray-400 text-sm">{t('dashboard.realTimeEmergency')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                                <RefreshCw className="w-3.5 h-3.5" />
                                {t('dashboard.refreshMap')}
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
                                <h3 className="text-gray-400 text-sm font-medium">{t('dashboard.activeUsers')}</h3>
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
                                <h3 className="text-gray-400 text-sm font-medium">{t('dashboard.safetyScore')}</h3>
                                <p className="text-2xl font-bold text-white">88%</p>
                            </div>
                            <div className="mt-4 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[88%]" />
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
                                <h3 className="text-gray-400 text-sm font-medium">{t('dashboard.avgResponse')}</h3>
                                <p className="text-2xl font-bold text-white">4.8m</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Alerts */}
                    <Card className="bg-red-900/10 border-red-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                <span className="text-red-400 font-bold text-sm">{t('dashboard.criticalAlert')}</span>
                            </div>
                            <p className="text-white font-medium">3 {t('dashboard.activeEmergencies')}</p>
                            <p className="text-xs text-gray-500 mt-1">T. Nagar, Adyar & Velachery areas requiring immediate response</p>
                            <button className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                                {t('dashboard.viewDetails')}
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
