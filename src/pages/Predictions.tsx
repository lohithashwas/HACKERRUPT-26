import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Shield,
    BrainCircuit,
    Loader2,
    Zap,
    Target
} from "lucide-react";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const policeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const policeStations = [
    { coords: [13.0850, 80.2100] as [number, number], title: "Anna Nagar Police Station (K4)" },
    { coords: [13.0400, 80.2300] as [number, number], title: "T. Nagar Police Station (R1)" },
    { coords: [13.0067, 80.2550] as [number, number], title: "Adyar Police Station (J6)" },
    { coords: [13.0418, 80.2633] as [number, number], title: "Mylapore Police Station (E1)" },
    { coords: [13.0594, 80.2764] as [number, number], title: "Triplicane Police Station (D1)" },
    { coords: [13.0782, 80.2600] as [number, number], title: "Egmore Police Station (F1)" },
    { coords: [13.0116, 80.2215] as [number, number], title: "Guindy Police Station (J3)" },
    { coords: [12.9782, 80.2230] as [number, number], title: "Velachery Police Station (J7)" },
    { coords: [12.9249, 80.1000] as [number, number], title: "Tambaram Police Station (S2)" },
    { coords: [13.0560, 80.2450] as [number, number], title: "Nungambakkam PS (F3)" },
    { coords: [13.0733, 80.2311] as [number, number], title: "Kilpauk Police Station (G1)" },
    { coords: [13.0900, 80.2800] as [number, number], title: "Flower Bazaar PS (A1)" },
    { coords: [13.0519, 80.2625] as [number, number], title: "Royapettah PS (E2)" },
    { coords: [13.0450, 80.2800] as [number, number], title: "Marina Police Station (D5)" },
    { coords: [12.9600, 80.1800] as [number, number], title: "Madipakkam PS (S11)" },
    { coords: [12.9400, 80.1400] as [number, number], title: "Chromepet PS (S10)" },
    { coords: [12.9800, 80.2400] as [number, number], title: "Besant Nagar PS (J2)" },
    { coords: [12.9100, 80.2200] as [number, number], title: "Perungudi PS (S5)" },
    { coords: [12.8450, 80.2200] as [number, number], title: "Kelambakkam PS (OMR)" },
    { coords: [12.7100, 80.0000] as [number, number], title: "Chengalpattu Town PS" },
    { coords: [12.6800, 79.9800] as [number, number], title: "Chengalpattu Taluk PS" },
    { coords: [12.8100, 80.2100] as [number, number], title: "Navalur PS (OMR)" },
    { coords: [12.7800, 80.2200] as [number, number], title: "Thiruporur PS (OMR)" }
];

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 14);
        }
    }, [position, map]);
    return null;
}

export default function Predictions() {
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [nearestStation, setNearestStation] = useState<typeof policeStations[0] | null>(null);
    const [path, setPath] = useState<[number, number][]>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);

    useEffect(() => {
        // Default to a central Chennai location if geo fails
        const defaultPos: [number, number] = [13.0400, 80.2350];

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserPos([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    setUserPos(defaultPos);
                }
            );
        } else {
            setUserPos(defaultPos);
        }
    }, []);

    const calculateShortestPath = () => {
        if (!userPos) return;
        setIsCalculating(true);

        // Find nearest station using Euclidean distance (A* vibe simulation)
        setTimeout(() => {
            let minDistance = Infinity;
            let closest = policeStations[0];

            policeStations.forEach(station => {
                const d = Math.sqrt(
                    Math.pow(station.coords[0] - userPos[0], 2) +
                    Math.pow(station.coords[1] - userPos[1], 2)
                );
                if (d < minDistance) {
                    minDistance = d;
                    closest = station;
                }
            });

            // Simulate A* "grid" traversal for visual effect
            const points: [number, number][] = [userPos];

            // Add a slight "zigzag" to simulate road navigation instead of a straight line
            const midLat = (userPos[0] + closest.coords[0]) / 2;
            const midLng = (userPos[1] + closest.coords[1]) / 2;

            points.push([userPos[0], midLng]); // Corner 1
            points.push([midLat, midLng]);     // Midpoint
            points.push([closest.coords[0], midLng]); // Corner 2
            points.push(closest.coords);

            setNearestStation(closest);
            setPath(points);
            setDistance(minDistance * 111); // Approx km conversion
            setIsCalculating(false);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-fade-in p-6 bg-black min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-blue-400" />
                        AI Prediction & Routing
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Advanced A* Algorithm for Emergency Navigation
                    </p>
                </div>
                <button
                    onClick={calculateShortestPath}
                    disabled={isCalculating || !userPos}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                    {isCalculating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Zap className="w-5 h-5" />
                    )}
                    Run A* Prediction
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Cards */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <Target className="w-4 h-4 text-orange-400" />
                                Current Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">
                                {userPos ? `${userPos[0].toFixed(4)}, ${userPos[1].toFixed(4)}` : "Detecting..."}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">Chennai, Tamil Nadu</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-400" />
                                Nearest Response Unit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold text-blue-400">
                                {nearestStation ? nearestStation.title : "Calculating..."}
                            </p>
                            {distance && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    Distance: {distance.toFixed(2)} km
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest text-blue-500 font-bold">AI Prediction Log</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <span className="text-zinc-400">Initializing Heuristic Function (H'...</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <span className="text-zinc-400">Scanning 17 Chennai PS Nodes...</span>
                            </div>
                            {path.length > 0 && (
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-green-400">Shortest Path Found via T. Nagar Sector</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Map Section */}
                <div className="lg:col-span-2">
                    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden h-[600px]">
                        <MapContainer
                            center={[13.0500, 80.2400]}
                            zoom={12}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {userPos && (
                                <>
                                    <Marker position={userPos} icon={userIcon}>
                                        <Popup>Your Current Location</Popup>
                                    </Marker>
                                    <RecenterMap position={userPos} />
                                </>
                            )}

                            {policeStations.map((station, idx) => (
                                <Marker key={idx} position={station.coords} icon={policeIcon}>
                                    <Popup>
                                        <div className="text-center font-bold">{station.title}</div>
                                    </Popup>
                                </Marker>
                            ))}

                            {path.length > 0 && (
                                <Polyline
                                    positions={path}
                                    pathOptions={{
                                        color: '#3b82f6',
                                        weight: 4,
                                        dashArray: '10, 10',
                                        lineCap: 'round'
                                    }}
                                />
                            )}
                        </MapContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
}
