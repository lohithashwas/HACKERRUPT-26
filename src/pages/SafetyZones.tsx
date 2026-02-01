import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Popup, Circle, useMap, Polygon, Polyline } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/Card";
import { AlertTriangle, ShieldCheck, Construction, LocateFixed, MousePointerClick, Square, Circle as CircleIcon, X, Map as MapIcon, Siren } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Zone {
    id: string;
    center: [number, number];
    radius?: number;
    color: string;
    name: string;
    description: string;
    type: 'circle' | 'polygon' | 'rectangle';
    coordinates?: [number, number][];
}

function DrawingManager({ onZoneCreated, color }: { onZoneCreated: (zone: any) => void, color: string }) {
    const map = useMap();
    const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

    useEffect(() => {
        map.addLayer(featureGroupRef.current);

        map.on(L.Draw.Event.CREATED, (e: any) => {
            const layer = e.layer;
            const type = e.layerType;

            let newZone: any = {
                id: Math.random().toString(36).substr(2, 9),
                color: color,
                name: "New Geofence Area",
                description: "Manually drawn safety zone",
                type: type
            };

            if (type === 'circle') {
                const center = layer.getLatLng();
                newZone.center = [center.lat, center.lng];
                newZone.radius = layer.getRadius();
            } else if (type === 'polygon' || type === 'rectangle') {
                const latlngs = layer.getLatLngs()[0];
                newZone.coordinates = latlngs.map((ll: any) => [ll.lat, ll.lng]);
                // For simplified display, use center of first few points
                newZone.center = [latlngs[0].lat, latlngs[0].lng];
            }

            onZoneCreated(newZone);
            featureGroupRef.current.clearLayers(); // Clear the temporary drawing layer
        });

        return () => {
            map.off(L.Draw.Event.CREATED);
        };
    }, [map, color, onZoneCreated]);

    return null;
}

// ... (DrawingManager similar)

function ZoneMap({ adminMode = false, navigationMode = false, pathFound = false }: { adminMode?: boolean, navigationMode?: boolean, pathFound?: boolean }) {
    // ... (existing state)
    // Redefine zones and state to ensuring it's not lost or use existing if easier. 
    // I will rewrite the whole ZoneMap function block to be safe.

    const [zones, setZones] = useState<Zone[]>([
        {
            id: 'z1',
            center: [13.0604, 80.2496],
            radius: 800,
            color: '#22c55e',
            name: "Marina Beach Safe Zone",
            description: "High security & tourist friendly",
            type: 'circle'
        },
        {
            id: 'z2',
            center: [12.9800, 80.2000],
            radius: 600,
            color: '#ef4444',
            name: "Flood Risk (Guindy)",
            description: "Low-lying area prone to waterlogging",
            type: 'circle'
        },
        {
            id: 'z3',
            center: [13.0300, 80.2100],
            radius: 500,
            color: '#eab308',
            name: "Metro Construction",
            description: "Active metro work ongoing",
            type: 'circle'
        }
    ]);

    const [selectedColor, setSelectedColor] = useState('#ef4444');
    const [drawingMode, setDrawingMode] = useState<'polygon' | 'circle' | 'rectangle' | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    const handleZoneCreated = (newZone: Zone) => {
        setZones(prev => [...prev, newZone]);
        setDrawingMode(null);
    };

    const startDrawing = (mode: 'polygon' | 'circle' | 'rectangle') => {
        setDrawingMode(mode);
        if (!mapRef.current) return;

        const mapInstance = mapRef.current as any;
        let drawHandler;
        const drawOptions = {
            shapeOptions: {
                color: selectedColor,
                fillColor: selectedColor,
                fillOpacity: 0.2
            }
        };

        if (mode === 'polygon') {
            drawHandler = new L.Draw.Polygon(mapInstance, drawOptions);
        } else if (mode === 'circle') {
            drawHandler = new L.Draw.Circle(mapInstance, drawOptions);
        } else if (mode === 'rectangle') {
            drawHandler = new L.Draw.Rectangle(mapInstance, drawOptions);
        }

        if (drawHandler) {
            drawHandler.enable();
        }
    };

    const clearAllZones = () => {
        setZones([]);
    };

    return (
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-gray-700 z-0 shadow-2xl">
            <MapContainer
                center={[13.0400, 80.2400]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Mock Safe Route for Navigation Mode */}
                {pathFound && (
                    <Polyline
                        positions={[
                            [13.0100, 80.2300], // Start near Guindy
                            [13.0200, 80.2350],
                            [13.0250, 80.2320], // Avoid T. Nagar
                            [13.0300, 80.2250],
                            [13.0350, 80.2200],
                            [13.0400, 80.2150], // End near Mylapore
                        ]}
                        pathOptions={{ color: '#4ade80', weight: 5, dashArray: '1, 0', opacity: 0.9, lineCap: 'round' }}
                    />
                )}

                {/* Pulse Effect for User Location Mock */}
                {pathFound && (
                    <Circle center={[13.0100, 80.2300]} radius={100} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.5 }} className="animate-pulse" />
                )}

                {adminMode && <DrawingManager onZoneCreated={handleZoneCreated} color={selectedColor} />}

                {zones.map((zone) => {
                    if (zone.type === 'circle') {
                        return (
                            <Circle
                                key={zone.id}
                                center={zone.center}
                                radius={zone.radius || 500}
                                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.15 }}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold text-sm" style={{ color: zone.color }}>{zone.name}</h3>
                                        <p className="text-xs text-gray-600">{zone.description}</p>
                                    </div>
                                </Popup>
                            </Circle>
                        );
                    } else if (zone.type === 'polygon' || zone.type === 'rectangle') {
                        return (
                            <Polygon
                                key={zone.id}
                                positions={zone.coordinates || []}
                                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.15 }}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold text-sm" style={{ color: zone.color }}>{zone.name}</h3>
                                        <p className="text-xs text-gray-600">{zone.description}</p>
                                    </div>
                                </Popup>
                            </Polygon>
                        );
                    }
                    return null;
                })}
            </MapContainer>

            {/* Legend Overlay - Compact */}
            <div className="absolute left-4 bottom-4 bg-black/80 backdrop-blur-md rounded-lg border border-gray-800 p-3 shadow-lg z-[400] text-xs">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></div>
                        <span className="text-gray-300">Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_5px_yellow]"></div>
                        <span className="text-gray-300">Caution</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div>
                        <span className="text-gray-300">Danger</span>
                    </div>
                </div>
            </div>

            {/* Admin Drawing Tools Overlay */}
            {adminMode && (
                <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-xl rounded-xl border border-gray-700 p-3 shadow-xl z-[1000]">
                    <div className="flex gap-2 justify-center mb-3">
                        <button
                            onClick={() => setSelectedColor('#ef4444')}
                            className={`w-6 h-6 rounded-full bg-red-500 border-2 transition-transform hover:scale-110 ${selectedColor === '#ef4444' ? 'border-white' : 'border-transparent'}`}
                        ></button>
                        <button
                            onClick={() => setSelectedColor('#eab308')}
                            className={`w-6 h-6 rounded-full bg-yellow-500 border-2 transition-transform hover:scale-110 ${selectedColor === '#eab308' ? 'border-white' : 'border-transparent'}`}
                        ></button>
                        <button
                            onClick={() => setSelectedColor('#22c55e')}
                            className={`w-6 h-6 rounded-full bg-green-500 border-2 transition-transform hover:scale-110 ${selectedColor === '#22c55e' ? 'border-white' : 'border-transparent'}`}
                        ></button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => startDrawing('polygon')} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><MousePointerClick className="w-4 h-4 text-white" /></button>
                        <button onClick={() => startDrawing('circle')} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><CircleIcon className="w-4 h-4 text-white" /></button>
                        <button onClick={() => startDrawing('rectangle')} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><Square className="w-4 h-4 text-white" /></button>
                        <button onClick={clearAllZones} className="p-2 bg-red-900/50 rounded hover:bg-red-900"><X className="w-4 h-4 text-red-200" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Update exported component signature
export function SafetyZones({ adminMode = false }: { adminMode?: boolean }) {
    const [navigationMode, setNavigationMode] = useState(false);
    const [pathFound, setPathFound] = useState(false);

    const handleFindPath = () => {
        setPathFound(true);
        // In a real app, calculate path avoiding zones here
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Geofence Section Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Configure and monitor geofenced safety areas</p>
                </div>
                <div className="flex gap-3">
                    {!adminMode && (
                        <button
                            onClick={() => setNavigationMode(!navigationMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${navigationMode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                            <MapIcon className="w-4 h-4" />
                            {navigationMode ? 'Exit Navigation' : 'Safe Route Navigation'}
                        </button>
                    )}

                    {adminMode && (
                        <div>
                            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                <MapIcon className="w-4 h-4" />
                                Create New Zone
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Overlay for User */}
            {navigationMode && (
                <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-xl mb-6 animate-slide-in">
                    <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                        <MapIcon className="w-4 h-4" /> Safe Path Finder
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <input type="text" placeholder="Current Location (GPS)" className="w-full bg-black/50 border border-blue-500/20 rounded p-2 text-sm text-white" disabled value="Anna University, Chennai" />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            <input type="text" placeholder="Enter Destination" className="w-full bg-black/50 border border-blue-500/20 rounded p-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
                        </div>
                        <button
                            onClick={handleFindPath}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded text-sm font-bold shadow-lg shadow-blue-900/20"
                        >
                            Find Safe Route
                        </button>
                    </div>
                    {pathFound && (
                        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded flex items-center gap-3 text-green-400 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>Route Optimized: 12 mins • <b>Avoided 2 High Risk Zones</b> • Safety Score: 98%</span>
                        </div>
                    )}
                </div>
            )}

            {/* Map Section */}
            <section>
                <Card className="bg-dark-card border-gray-800">
                    <CardContent className="p-0 sm:p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-0 pt-6 sm:pt-0">
                            <div>
                                <h3 className="font-semibold text-xl text-white">Interactive Zone Map</h3>
                                <p className="text-gray-400 text-sm">
                                    {adminMode ? "Click and drag to create new safety zones" : "View active safety zones in your area"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 w-fit">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-green-500">Live Tracking</span>
                            </div>
                        </div>
                        <ZoneMap adminMode={adminMode} navigationMode={navigationMode} pathFound={pathFound} />
                    </CardContent>
                </Card>
            </section>

            {/* Regional Risk Alerts */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Regional Risk Alerts</h2>
                        <p className="text-gray-400 text-sm">Real-time risk assessments for regions</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                        <span className="text-red-400 text-xs font-medium">3 Active Alerts</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* High Risk */}
                    <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Anna Nagar</h4>
                                <p className="text-red-400 text-xs font-bold uppercase">High Risk</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Flash flood warning in effect. Heavy rainfall expected.</p>
                        <div className="flex justify-between text-xs text-gray-500 border-t border-red-900/20 pt-3">
                            <span>Updated: 5 min ago</span>
                            <span className="text-red-400 font-medium">12 users affected</span>
                        </div>
                    </div>

                    {/* Medium Risk */}
                    <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                                <Construction className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">West Mambalam</h4>
                                <p className="text-yellow-500 text-xs font-bold uppercase">Medium Risk</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Road construction ongoing. Traffic delays expected.</p>
                        <div className="flex justify-between text-xs text-gray-500 border-t border-yellow-900/20 pt-3">
                            <span>Updated: 15 min ago</span>
                            <span className="text-yellow-500 font-medium">5 users affected</span>
                        </div>
                    </div>

                    {/* Low Risk */}
                    <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">East Tambaram</h4>
                                <p className="text-green-500 text-xs font-bold uppercase">Low Risk</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">All clear. Normal user activities can proceed.</p>
                        <div className="flex justify-between text-xs text-gray-500 border-t border-green-900/20 pt-3">
                            <span>Updated: 2 min ago</span>
                            <span className="text-green-500 font-medium">45 users in area</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Safety Zones */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6">Active Safety Zones</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Zone 1 */}
                    <Card className="border-l-4 border-l-red-600 bg-red-900/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                                        <Siren className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Flood Risk Area</h3>
                                        <p className="text-red-400 text-xs font-medium">High Risk Zone</p>
                                    </div>
                                </div>
                                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-medium border border-red-500/20">Active</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Users Inside:</span>
                                    <span className="text-white font-bold">12</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Alert Level:</span>
                                    <span className="text-red-400 font-bold">Critical</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Coverage Area:</span>
                                    <span className="text-white font-medium">2.5 km radius</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white font-medium">Adyar, Chennai</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-gray-500">2 min ago</span>
                                </div>
                            </div>

                            {/* Risk Factors */}
                            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                <h4 className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Risk Factors
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• Heavy rainfall expected (150mm+)</li>
                                    <li>• Low-lying area prone to flooding</li>
                                    <li>• Poor drainage infrastructure</li>
                                </ul>
                            </div>

                            {/* Emergency Contacts */}
                            <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h4 className="text-blue-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Emergency Contacts
                                </h4>
                                <div className="text-xs text-gray-300 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Police:</span>
                                        <span className="text-white font-medium">100</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Disaster Mgmt:</span>
                                        <span className="text-white font-medium">1070</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                <h4 className="text-yellow-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Safety Recommendations
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• Avoid traveling through this area</li>
                                    <li>• Move to higher ground immediately</li>
                                    <li>• Keep emergency kit ready</li>
                                </ul>
                            </div>
                            <div className="mt-6">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Zone Details
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Zone 2 */}
                    <Card className="border-l-4 border-l-yellow-500 bg-yellow-900/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-900/20">
                                        <Construction className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Construction Area</h3>
                                        <p className="text-yellow-500 text-xs font-medium">Medium Risk Zone</p>
                                    </div>
                                </div>
                                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded font-medium border border-yellow-500/20">Active</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Users Inside:</span>
                                    <span className="text-white font-bold">5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Alert Level:</span>
                                    <span className="text-yellow-500 font-bold">Caution</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Coverage Area:</span>
                                    <span className="text-white font-medium">1.8 km radius</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white font-medium">T. Nagar, Chennai</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-gray-500">5 min ago</span>
                                </div>
                            </div>

                            {/* Risk Factors */}
                            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                <h4 className="text-yellow-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Risk Factors
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• Active construction work ongoing</li>
                                    <li>• Heavy machinery in operation</li>
                                    <li>• Temporary road diversions</li>
                                </ul>
                            </div>

                            {/* Emergency Contacts */}
                            <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h4 className="text-blue-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Emergency Contacts
                                </h4>
                                <div className="text-xs text-gray-300 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Police:</span>
                                        <span className="text-white font-medium">100</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Site Manager:</span>
                                        <span className="text-white font-medium">+91 98410 92274</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <h4 className="text-blue-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Safety Recommendations
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• Use designated pedestrian paths</li>
                                    <li>• Wear safety gear if entering area</li>
                                    <li>• Follow traffic diversion signs</li>
                                </ul>
                            </div>
                            <div className="mt-6">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Zone Details
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Zone 3 */}
                    <Card className="border-l-4 border-l-green-500 bg-green-900/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                        <LocateFixed className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Tourist Center</h3>
                                        <p className="text-green-500 text-xs font-medium">Safe Zone</p>
                                    </div>
                                </div>
                                <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded font-medium border border-green-500/20">Active</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Users Inside:</span>
                                    <span className="text-white font-bold">45</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Alert Level:</span>
                                    <span className="text-green-500 font-bold">Safe</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Coverage Area:</span>
                                    <span className="text-white font-medium">3.2 km radius</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white font-medium">Marina Beach, Chennai</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-gray-500">1 min ago</span>
                                </div>
                            </div>

                            {/* Safety Features */}
                            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                <h4 className="text-green-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Safety Features
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• 24/7 police patrol active</li>
                                    <li>• CCTV surveillance coverage</li>
                                    <li>• Well-lit public spaces</li>
                                    <li>• Emergency help points available</li>
                                </ul>
                            </div>

                            {/* Emergency Contacts */}
                            <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h4 className="text-blue-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Emergency Contacts
                                </h4>
                                <div className="text-xs text-gray-300 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Police:</span>
                                        <span className="text-white font-medium">100</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tourist Help:</span>
                                        <span className="text-white font-medium">1363</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ambulance:</span>
                                        <span className="text-white font-medium">108</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                <h4 className="text-green-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Recommendations
                                </h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• Safe for solo travelers</li>
                                    <li>• Stay within designated tourist areas</li>
                                    <li>• Keep valuables secure</li>
                                </ul>
                            </div>
                            <div className="mt-6">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Zone Details
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Zone Statistics */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6">Zone Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">High Risk Zones</p>
                                    <p className="text-2xl font-bold text-white">3</p>
                                </div>
                            </div>
                            <p className="text-red-400 text-xs font-medium">2 with active alerts</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                                    <Construction className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Medium Risk Zones</p>
                                    <p className="text-2xl font-bold text-white">7</p>
                                </div>
                            </div>
                            <p className="text-yellow-500 text-xs font-medium">Construction & Wildlife areas</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Safe Zones</p>
                                    <p className="text-2xl font-bold text-white">15</p>
                                </div>
                            </div>
                            <p className="text-green-500 text-xs font-medium">Tourist friendly locations</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                    <LocateFixed className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-medium">Total Coverage</p>
                                    <p className="text-2xl font-bold text-white">85%</p>
                                </div>
                            </div>
                            <p className="text-blue-500 text-xs font-medium">Of Chennai Metropolitan Area</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
