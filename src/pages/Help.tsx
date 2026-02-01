import { Card, CardContent } from "@/components/ui/Card"
import { Book, Map, Shield, Info } from "lucide-react"

export function Help() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-fade-in">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-dark-card border border-gray-800 rounded-xl p-4 overflow-y-auto hidden lg:block">
                <h2 className="text-lg font-bold text-white mb-4 px-2">Contents</h2>
                <nav className="space-y-1">
                    <button onClick={() => scrollToSection('getting-started')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Getting Started</button>
                    <button onClick={() => scrollToSection('dashboard-overview')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Dashboard Overview</button>
                    <button onClick={() => scrollToSection('map-interface')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Map Interface</button>
                    <button onClick={() => scrollToSection('emergency-features')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Emergency Features</button>
                    <button onClick={() => scrollToSection('troubleshooting')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Troubleshooting</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pr-2 pb-10">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Hero */}
                    <section className="text-center py-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-medium mb-4">
                            <Info className="w-3 h-3" />
                            Version 2.1.0
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive user guides and technical reference for the Women Safety Dashboard platform.
                        </p>
                    </section>

                    {/* Quick Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-dark-card border-gray-800 hover:border-red-900/50 transition-colors cursor-pointer" onClick={() => scrollToSection('getting-started')}>
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Book className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Getting Started</h3>
                                <p className="text-sm text-gray-400">Setup guide and initial configuration steps.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-dark-card border-gray-800 hover:border-red-900/50 transition-colors cursor-pointer" onClick={() => scrollToSection('dashboard-overview')}>
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">My Dashboard</h3>
                                <p className="text-sm text-gray-400">Detailed overview of dashboard metrics.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-dark-card border-gray-800 hover:border-red-900/50 transition-colors cursor-pointer" onClick={() => scrollToSection('map-interface')}>
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Map className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Map Features</h3>
                                <p className="text-sm text-gray-400">Using the interactive safety map efficiently.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Getting Started */}
                    <section id="getting-started" className="space-y-6 scroll-mt-20">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <Book className="w-6 h-6 text-red-500" />
                            <h2 className="text-2xl font-bold text-white">Getting Started</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p className="mb-4">
                                Welcome to the Women Safety Dashboard. This platform helps you monitor active safety zones, manage emergency alerts, and analyze regional risks in real-time.
                            </p>
                            <h3 className="text-lg font-semibold text-white mt-6 mb-3">System Requirements</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Modern web browser (Chrome, Firefox, Edge, Safari)</li>
                                <li>Active internet connection for real-time updates</li>
                                <li>Recommended resolution: 1280x720 or higher</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white mt-6 mb-3">User Roles</h3>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                    <h4 className="text-white font-medium mb-2">Admin</h4>
                                    <p className="text-sm text-gray-500">Full access to configuration, user management, and audit logs.</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                    <h4 className="text-white font-medium mb-2">Operator</h4>
                                    <p className="text-sm text-gray-500">Can view alerts, manage incidents, and update safety zones.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dashboard Overview */}
                    <section id="dashboard-overview" className="space-y-6 scroll-mt-20">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <Shield className="w-6 h-6 text-red-500" />
                            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>The main dashboard provides a high-level view of the current safety status.</p>
                            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Key Metrics</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 text-xs">A</div>
                                    <div>
                                        <span className="text-white font-medium block">Active Users</span>
                                        <span className="text-sm">Real-time count of users in monitored zones.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 text-xs">B</div>
                                    <div>
                                        <span className="text-white font-medium block">Safety Score</span>
                                        <span className="text-sm">Aggregate safety rating based on active alerts and coverage.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Map Interface */}
                    <section id="map-interface" className="space-y-6 scroll-mt-20">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <Map className="w-6 h-6 text-red-500" />
                            <h2 className="text-2xl font-bold text-white">Map Interface</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>The interactive map is the core of the platform, showing real-time positions of police stations, hospitals, and active safety zones.</p>

                            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mt-6">
                                <h4 className="text-white font-medium mb-4">Map Legend</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <div className="text-sm text-gray-300">Police Stations</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="text-sm text-gray-300">Hospitals</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                                        <div className="text-sm text-gray-300">Active Alert</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 border-2 border-green-500" />
                                        <div className="text-sm text-gray-300">Safety Zone</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}
