import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Extend Leaflet type to include heatLayer
declare module 'leaflet' {
    export function heatLayer(latlngs: any[], options?: any): any;
}

const chennaiCoords: [number, number] = [13.0827, 80.2707];

const riskPoints = [
    // T. Nagar (High Risk)
    [13.0418, 80.2341, 1.0], [13.0425, 80.2355, 0.9], [13.0400, 80.2330, 0.8],
    [13.0410, 80.2345, 0.9], [13.0430, 80.2340, 0.7],

    // Velachery (High Risk)
    [12.9815, 80.2180, 0.9], [12.9825, 80.2190, 0.8], [12.9805, 80.2170, 0.85],
    [12.9790, 80.2200, 0.7],

    // Mylapore (Medium Risk)
    [13.0368, 80.2676, 0.6], [13.0375, 80.2680, 0.5], [13.0350, 80.2670, 0.6],

    // George Town / North Chennai
    [13.0950, 80.2850, 0.8], [13.1000, 80.2900, 0.7], [13.0900, 80.2800, 0.9],

    // Guindy
    [13.0067, 80.2206, 0.5], [13.0100, 80.2250, 0.4],

    // Random Scatter for "Low Risk" areas
    [13.0600, 80.2500, 0.3], [13.0700, 80.2000, 0.2], [12.9600, 80.2500, 0.4],
    [13.0200, 80.2400, 0.3], [13.0500, 80.2800, 0.3],
    [13.0800, 80.2100, 0.4], [13.0000, 80.2600, 0.5]
];

function HeatmapLayer() {
    const map = useMap();

    useEffect(() => {
        // Create heat layer
        const heat = (L as any).heatLayer(riskPoints, {
            radius: 30, // Increased radius
            blur: 20,   // Increased blur
            maxZoom: 12,
            minOpacity: 0.5, // Explicitly set minOpacity
            gradient: {
                0.1: 'purple',
                0.3: 'blue',
                0.5: 'cyan',
                0.7: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        });

        heat.addTo(map);

        return () => {
            // Clean up layer on unmount
            map.removeLayer(heat);
        };
    }, [map]);

    return null;
}

export function CrimeHeatMap() {
    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-800 shadow-xl">
            <MapContainer
                center={chennaiCoords}
                zoom={11}
                style={{ height: "100%", width: "100%", background: '#f0f0f0' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Heatmap overlay */}
                <HeatmapLayer />

            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-5 right-5 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-gray-800 z-[400] text-xs">
                <h4 className="text-white font-bold mb-2">Detailed Risk Spectrum</h4>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_red]"></span>
                        <span className="text-gray-300">Critical (Red)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_yellow]"></span>
                        <span className="text-gray-300">High (Yellow)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]"></span>
                        <span className="text-gray-300">Moderate (Cyan)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_8px_blue]"></span>
                        <span className="text-gray-300">Low (Blue)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_8px_purple]"></span>
                        <span className="text-gray-300">Insignificant (Purple)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
