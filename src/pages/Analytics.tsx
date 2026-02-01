import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Shield,
    Users,
    Clock,
    MapPin,
    AlertCircle,
    TrendingUp,
    Activity,
    UserCheck
} from "lucide-react";
import { CrimeHeatMap } from "../components/maps/CrimeHeatMap";

// Mock Data for Women Safety Analysis (Chennai Context)
const crimeStatsData = [
    { name: 'Mon', reports: 12, resolved: 10 },
    { name: 'Tue', reports: 18, resolved: 15 },
    { name: 'Wed', reports: 15, resolved: 14 },
    { name: 'Thu', reports: 22, resolved: 18 },
    { name: 'Fri', reports: 30, resolved: 25 },
    { name: 'Sat', reports: 28, resolved: 24 },
    { name: 'Sun', reports: 14, resolved: 12 },
];

const areaRiskData = [
    { name: 'T. Nagar', risk: 85, color: '#ef4444' },
    { name: 'Anna Nagar', risk: 40, color: '#22c55e' },
    { name: 'Mylapore', risk: 65, color: '#eab308' },
    { name: 'Adyar', risk: 30, color: '#22c55e' },
    { name: 'Velachery', risk: 75, color: '#f97316' },
];

const timeDistributionData = [
    { time: '12am-4am', cases: 5 },
    { time: '4am-8am', cases: 8 },
    { time: '8am-12pm', cases: 15 },
    { time: '12pm-4pm', cases: 20 },
    { time: '4pm-8pm', cases: 45 },
    { time: '8pm-12am', cases: 35 },
];

const incidentTypeData = [
    { name: 'Harassment', value: 45 },
    { name: 'Suspicious Activity', value: 25 },
    { name: 'Physical Distress', value: 15 },
    { name: 'Theft/Snatching', value: 15 },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f43f5e'];

export default function Analytics() {
    return (
        <div className="space-y-8 animate-fade-in p-6 bg-black min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Women Safety Analytics Dashboard</h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-pink-500" />
                        Real-time insights and trend analysis for Chennai Metropolitan Area
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-pink-500" />
                        <div>
                            <p className="text-[10px] uppercase text-pink-500 font-bold">Active Shield Users</p>
                            <p className="text-xl font-bold">12,458</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Response Rate</p>
                                <h3 className="text-2xl font-bold text-white">98.4%</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3" /> +2.1% this week
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-500/10 rounded-xl">
                                <Users className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Total Incidents</p>
                                <h3 className="text-2xl font-bold text-white">1,245</h3>
                                <p className="text-xs text-zinc-500 mt-1">Last 30 days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Clock className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Avg Response Time</p>
                                <h3 className="text-2xl font-bold text-white">3.4 min</h3>
                                <p className="text-xs text-zinc-500 mt-1">Chennai City Average</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">High Risk Areas</p>
                                <h3 className="text-2xl font-bold text-white">12</h3>
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Requiring immediate patrol
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Incident Trends */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Incident vs Resolution Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={crimeStatsData}>
                                <defs>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis dataKey="name" stroke="#71717a" />
                                <YAxis stroke="#71717a" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" />
                                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Heat Map Summary */}
                <Card className="bg-zinc-900/50 border-zinc-800 col-span-1 lg:col-span-1 min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            Live Crime Heatmap
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] p-2">
                        <CrimeHeatMap />
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Incident Distribution Pie */}
                <Card className="md:col-span-1 bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Incident Nature</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incidentTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {incidentTypeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                            {incidentTypeData.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-zinc-400 capitalize">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Time Distribution Area Chart */}
                <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            Incidents by Time of Day
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeDistributionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis dataKey="time" stroke="#71717a" />
                                <YAxis stroke="#71717a" />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                                <Area type="stepAfter" dataKey="cases" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
