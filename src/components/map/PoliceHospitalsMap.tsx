import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// TODO: Replace with valid token from environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZS13aWxzb24iLCJhIjoiY2w5cW1nOG1mMDJmNTNvcG53a25yMG9uayJ9.0kXaaP-1vJ5vQ9g8FqX4fA';

export function PoliceHospitalsMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
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

        map.current.on('load', () => {
            // Add dummy data for Police Stations
            // In a real app, fetch from API
            const policeStations = [
                { coords: [91.88, 25.57], title: "Shillong Police Station" },
                { coords: [91.95, 25.60], title: "Laitumkhrah PS" },
            ];

            // Add markers
            policeStations.forEach(station => {
                const el = document.createElement('div');
                el.className = 'w-4 h-4 bg-blue-500 rounded-sm shadow-lg shadow-blue-500/50 cursor-pointer hover:scale-125 transition-transform';

                new mapboxgl.Marker(el)
                    .setLngLat(station.coords as [number, number])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3 class="font-bold text-sm">${station.title}</h3><p class="text-xs text-gray-400">Police Station</p>`
                    ))
                    .addTo(map.current!);
            });

            const hospitals = [
                { coords: [91.90, 25.58], title: "Civil Hospital" },
                { coords: [91.87, 25.59], title: "Nazareth Hospital" },
            ];

            hospitals.forEach(hospital => {
                const el = document.createElement('div');
                el.className = 'w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 cursor-pointer hover:scale-125 transition-transform';

                new mapboxgl.Marker(el)
                    .setLngLat(hospital.coords as [number, number])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3 class="font-bold text-sm">${hospital.title}</h3><p class="text-xs text-gray-400">Hospital</p>`
                    ))
                    .addTo(map.current!);
            });
        });

        return () => map.current?.remove();
    }, [lng, lat, zoom]);

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Legend Overlay */}
            <div className="absolute right-6 bottom-6 bg-dark-card/90 backdrop-blur-xl rounded-xl border border-gray-700 p-4 shadow-2xl min-w-[200px]">
                <h4 className="font-bold text-white text-sm mb-3">Emergency Services</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                        <span className="text-xs text-gray-300">Police Stations</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-xs text-gray-300">Hospitals</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
