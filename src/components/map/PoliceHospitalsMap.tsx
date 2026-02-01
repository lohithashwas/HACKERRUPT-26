import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const policeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface PoliceHospitalsMapProps {
    filter: 'all' | 'police' | 'hospital';
}

export function PoliceHospitalsMap({ filter }: PoliceHospitalsMapProps) {
    const [stats, setStats] = useState({ police: 0, hospital: 0 });

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

    const hospitals = [
        { coords: [13.0805, 80.2737] as [number, number], title: "Rajiv Gandhi Govt General Hospital" },
        { coords: [13.0645, 80.2533] as [number, number], title: "Apollo Hospital, Greams Road" },
        { coords: [13.0232, 80.1842] as [number, number], title: "MIOT International, Manapakkam" },
        { coords: [13.0031, 80.2520] as [number, number], title: "Fortis Malar Hospital, Adyar" },
        { coords: [13.0850, 80.1650] as [number, number], title: "Madras Medical Mission (MMM)" },
        { coords: [13.0494, 80.2106] as [number, number], title: "SIMS Hospital, Vadapalani" },
        { coords: [12.9442, 80.2167] as [number, number], title: "Dr. Kamakshi Memorial Hospital" },
        { coords: [13.0333, 80.2500] as [number, number], title: "Kauvery Hospital, Alwarpet" },
        { coords: [13.0772, 80.2239] as [number, number], title: "Billroth Hospital, Shenoy Nagar" },
        { coords: [13.0358, 80.1542] as [number, number], title: "Sri Ramachandra Medical Centre" },
        { coords: [13.0480, 80.2110] as [number, number], title: "Vijaya Hospital, Vadapalani" },
        { coords: [13.0672, 80.2369] as [number, number], title: "Mehta Multispeciality, Chetpet" },
        { coords: [13.0720, 80.2310] as [number, number], title: "MGM Healthcare, Aminjikarai" },
        { coords: [13.1100, 80.2200] as [number, number], title: "St. Isabel's Hospital" },
        { coords: [13.0200, 80.2600] as [number, number], title: "Sanctuary Hospital" }
    ];

    useEffect(() => {
        setStats({
            police: policeStations.length,
            hospital: hospitals.length
        });
    }, []);

    const showPolice = filter === 'all' || filter === 'police';
    const showHospitals = filter === 'all' || filter === 'hospital';

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl z-0">
            <MapContainer
                center={[13.0500, 80.2400]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                {/* Dark Theme Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {showPolice && policeStations.map((station, idx) => (
                    <Marker key={`police-${idx}`} position={station.coords} icon={policeIcon}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-sm text-blue-600">{station.title}</h3>
                                <p className="text-xs text-gray-600">Police Station</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {showHospitals && hospitals.map((hospital, idx) => (
                    <Marker key={`hospital-${idx}`} position={hospital.coords} icon={hospitalIcon}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-sm text-red-600">{hospital.title}</h3>
                                <p className="text-xs text-gray-600">Hospital</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute right-6 bottom-6 bg-black/90 backdrop-blur-xl rounded-xl border border-gray-700 p-4 shadow-2xl min-w-[280px] z-[1000]">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white text-lg">Emergency Services</h4>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="mb-4">
                    <h5 className="text-white/80 text-sm font-semibold mb-2">Service Types</h5>
                    <div className="space-y-2">
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${showPolice ? 'bg-white/5' : 'opacity-50'}`}>
                            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                <span className="sr-only">Police</span>
                            </div>
                            <span className="text-white text-sm">Police Stations</span>
                            <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{stats.police}</span>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${showHospitals ? 'bg-white/5' : 'opacity-50'}`}>
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="sr-only">Hospital</span>
                            </div>
                            <span className="text-white text-sm">Hospitals</span>
                            <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">{stats.hospital}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                    <div className="text-xs text-white/60 text-center">
                        <span className="font-medium">Coverage:</span> Chennai City Limits
                    </div>
                </div>
            </div>
        </div>
    );
}
