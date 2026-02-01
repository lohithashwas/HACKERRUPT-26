import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Camera,
    Activity,
    Zap,
    Mic,
    Siren,
    MapPin,
    Radio,
    FileText
} from "lucide-react";

// Mock Camera Data
const CAMERAS = [
    { id: 'CAM-101', location: 'T. Nagar Junction', status: 'LIVE', lat: 13.0418, lng: 80.2341, type: 'Traffic' },
    { id: 'CAM-102', location: 'Marina Beach Loop', status: 'LIVE', lat: 13.0500, lng: 80.2800, type: 'Public' },
    { id: 'DRONE-X1', location: 'Patrol Sector 4', status: 'AIRBORNE', lat: 12.9800, lng: 80.2200, type: 'Drone' },
    { id: 'CAM-104', location: 'Velachery Main Rd', status: 'MAINTENANCE', lat: 12.9700, lng: 80.2100, type: 'Traffic' },
];

const MOCK_EVENTS = [
    { time: 'now', message: 'Motion detected in Sector 4', type: 'alert' },
    { time: '2m ago', message: 'Vehicle loitering at Gate B', type: 'warning' },
    { time: '5m ago', message: 'Scheduled patrol completed', type: 'info' },
    { time: '12m ago', message: 'Crowd density normal', type: 'info' },
];

export default function Surveillance() {
    const [activeCam, setActiveCam] = useState(CAMERAS[0]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [broadcasting, setBroadcasting] = useState(false);
    const [spotlight, setSpotlight] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate new events
    useEffect(() => {
        const eventTimer = setInterval(() => {
            const newEvent = {
                time: 'now',
                message: `AI Object Scan: ${Math.random() > 0.5 ? 'Person' : 'Vehicle'} ID-${Math.floor(Math.random() * 1000)}`,
                type: 'info'
            };
            setEvents(prev => [newEvent, ...prev.slice(0, 5)]);
        }, 5000);
        return () => clearInterval(eventTimer);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in text-white p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        SURVEILLANCE GRID <span className="text-xs px-2 py-1 bg-red-600 rounded animate-pulse">LIVE</span>
                    </h1>
                    <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm font-mono">
                        SECURE CONNECTION • 256-BIT ENCRYPTION
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <Siren className="w-5 h-5 animate-bounce" />
                        <span className="font-bold text-sm">THREAT LEVEL: MODERATE</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">

                {/* Main Feed (Larger) */}
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                    <Card className="flex-1 bg-black border-zinc-800 overflow-hidden relative group rounded-2xl border-2 border-zinc-800 hover:border-blue-900/50 transition-colors shadow-2xl">
                        {/* Simulated Camera Image with Pan Effect */}
                        <div
                            className="absolute top-0 left-0 w-[110%] h-[110%] bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-all duration-[20s] ease-linear"
                            style={{
                                animation: 'pan-camera 30s infinite alternate linear',
                                filter: spotlight ? 'brightness(1.5) contrast(1.2)' : 'brightness(0.8) contrast(1.1) grayscale(0.2)'
                            }}
                        ></div>

                        {/* Broadcasting Overlay */}
                        {broadcasting && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
                                <div className="text-center animate-pulse">
                                    <Mic className="w-24 h-24 text-red-500 mx-auto opacity-80" />
                                    <h2 className="text-4xl font-bold text-red-500 mt-4 tracking-widest">BROADCASTING</h2>
                                </div>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10"></div>

                        {/* Overlays */}
                        <div className="relative z-20 p-6 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="bg-red-600/90 text-white px-3 py-1 rounded-sm font-bold font-mono text-xs flex items-center gap-2 shadow-lg">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    REC {currentTime}
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <span className="text-xs font-mono text-green-400">FPS: 60</span>
                                    <span className="text-xs font-mono text-green-400">ISO: 800</span>
                                </div>
                            </div>

                            {/* Center Crosshair */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full flex items-center justify-center pointer-events-none">
                                <div className="w-1 h-3 bg-red-500/50 absolute top-0 left-1/2 -translate-x-1/2"></div>
                                <div className="w-1 h-3 bg-red-500/50 absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                                <div className="w-3 h-1 bg-red-500/50 absolute left-0 top-1/2 -translate-y-1/2"></div>
                                <div className="w-3 h-1 bg-red-500/50 absolute right-0 top-1/2 -translate-y-1/2"></div>
                                <span className="text-[10px] text-red-500/70 mt-32 font-mono tracking-widest">AI SCANNING</span>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">{activeCam.id}</h2>
                                    <p className="text-blue-400 font-mono flex items-center gap-2 text-sm mt-1 bg-black/60 w-fit px-2 py-1 rounded">
                                        <MapPin className="w-3 h-3" />
                                        {activeCam.location}
                                    </p>
                                </div>
                                <div className="flex gap-4 items-center bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-md">
                                    <Activity className="w-12 h-6 text-green-500 opacity-80" />
                                </div>
                            </div>
                        </div>

                        {/* Scanlines Effect */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Live Event Log */}
                    <Card className="bg-zinc-900/80 border-zinc-800 flex-1 overflow-hidden flex flex-col">
                        <CardHeader className="py-4 border-b border-zinc-700 bg-zinc-900">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3 h-3" /> AI Event Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0 font-mono text-xs">
                            {events.map((ev, i) => (
                                <div key={i} className="p-3 border-b border-zinc-800/50 flex gap-2 hover:bg-white/5 transition-colors">
                                    <span className="text-gray-500 select-none">[{ev.time}]</span>
                                    <span className={ev.type === 'alert' ? 'text-red-400 font-bold' : ev.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}>
                                        {ev.message}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Camera Selector */}
                    <Card className="bg-zinc-900 border-zinc-800 max-h-[250px] overflow-y-auto custom-scrollbar">
                        <CardHeader className="py-3 bg-zinc-900 sticky top-0 z-10">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">Feeds</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 p-2 pt-0">
                            {CAMERAS.map((cam) => (
                                <div
                                    key={cam.id}
                                    onClick={() => setActiveCam(cam)}
                                    className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between group ${activeCam.id === cam.id ? 'bg-blue-600/20 border-blue-500' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${cam.status === 'LIVE' ? 'bg-green-500 shadow-[0_0_8px_lime]' : cam.status === 'AIRBORNE' ? 'bg-orange-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${activeCam.id === cam.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{cam.id}</h4>
                                        </div>
                                    </div>
                                    {cam.type === 'Drone' ? <Radio className="w-3 h-3 text-orange-400" /> : <Camera className="w-3 h-3 text-gray-500" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setBroadcasting(!broadcasting)}
                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${broadcasting ? 'bg-red-600 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                        >
                            <Mic className={`w-6 h-6 ${broadcasting ? 'text-white animate-pulse' : 'text-blue-500'}`} />
                            <span className={`text-[10px] font-bold uppercase ${broadcasting ? 'text-white' : 'text-gray-400'}`}>
                                {broadcasting ? 'LIVE ON AIR' : 'Broadcast'}
                            </span>
                        </button>
                        <button
                            onClick={() => setSpotlight(!spotlight)}
                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${spotlight ? 'bg-yellow-500 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                        >
                            <Zap className={`w-6 h-6 ${spotlight ? 'text-black' : 'text-yellow-500'}`} />
                            <span className={`text-[10px] font-bold uppercase ${spotlight ? 'text-black' : 'text-gray-400'}`}>
                                {spotlight ? 'Light ON' : 'Spotlight'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pan-camera {
                    0% { transform: scale(1.1) translate(0, 0); }
                    25% { transform: scale(1.1) translate(-2%, 1%); }
                    50% { transform: scale(1.1) translate(-1%, -2%); }
                    75% { transform: scale(1.1) translate(2%, -1%); }
                    100% { transform: scale(1.1) translate(0, 0); }
                }
            `}</style>
        </div>
    );
}
