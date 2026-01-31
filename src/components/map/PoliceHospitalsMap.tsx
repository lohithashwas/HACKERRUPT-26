import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// TODO: Replace with valid token from environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZS13aWxzb24iLCJhIjoiY2w5cW1nOG1mMDJmNTNvcG53a25yMG9uayJ9.0kXaaP-1vJ5vQ9g8FqX4fA';

interface PoliceHospitalsMapProps {
    filter: 'all' | 'police' | 'hospital';
}

export function PoliceHospitalsMap({ filter }: PoliceHospitalsMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [lng] = useState(91.8933);
    const [lat] = useState(25.5788);
    const [zoom] = useState(7);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
        };
    }, [lng, lat, zoom]);

    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const policeStations = [
            { coords: [91.88, 25.57], title: "Shillong Police Station" },
            { coords: [91.95, 25.60], title: "Laitumkhrah PS" },
        ];

        const hospitals = [
            { coords: [91.90, 25.58], title: "Civil Hospital" },
            { coords: [91.87, 25.59], title: "Nazareth Hospital" },
        ];

        // Add Police Markers if filter matches
        if (filter === 'all' || filter === 'police') {
            policeStations.forEach(station => {
                const el = document.createElement('div');
                el.className = 'w-4 h-4 bg-blue-500 rounded-sm shadow-lg shadow-blue-500/50 cursor-pointer hover:scale-125 transition-transform';

                const marker = new mapboxgl.Marker(el)
                    .setLngLat(station.coords as [number, number])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3 class="font-bold text-sm">${station.title}</h3><p class="text-xs text-gray-400">Police Station</p>`
                    ))
                    .addTo(map.current!);
                markersRef.current.push(marker);
            });
        }

        // Add Hospital Markers if filter matches
        if (filter === 'all' || filter === 'hospital') {
            hospitals.forEach(hospital => {
                const el = document.createElement('div');
                el.className = 'w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 cursor-pointer hover:scale-125 transition-transform';

                const marker = new mapboxgl.Marker(el)
                    .setLngLat(hospital.coords as [number, number])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3 class="font-bold text-sm">${hospital.title}</h3><p class="text-xs text-gray-400">Hospital</p>`
                    ))
                    .addTo(map.current!);
                markersRef.current.push(marker);
            });
        }

    }, [filter, lng, lat]); // Re-run when filter changes

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Legend Overlay */}
            <div className="absolute right-6 bottom-6 bg-black/90 backdrop-blur-xl rounded-xl border border-gray-700 p-4 shadow-2xl min-w-[280px]">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white text-lg">Emergency Services</h4>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="mb-4">
                    <h5 className="text-white/80 text-sm font-semibold mb-2">Service Types</h5>
                    <div className="space-y-2">
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${filter === 'police' || filter === 'all' ? 'bg-white/5' : 'opacity-50'}`}>
                            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                <span className="sr-only">Police</span>
                            </div>
                            <span className="text-white text-sm">Police Stations</span>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${filter === 'hospital' || filter === 'all' ? 'bg-white/5' : 'opacity-50'}`}>
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="sr-only">Hospital</span>
                            </div>
                            <span className="text-white text-sm">Hospitals</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                    <div className="text-xs text-white/60 text-center">
                        <span className="font-medium">Coverage:</span> All 11 districts of Meghalaya
                    </div>
                </div>
            </div>
        </div>
    );
}
