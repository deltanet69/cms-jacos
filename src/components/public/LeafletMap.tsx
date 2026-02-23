"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LeafletMapProps {
    address?: string;
    coordinates?: [number, number]; // [lng, lat]
    zoom?: number;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
    address = "Jl. Raya Condet No.5, Balekambang, Kec. Kramat jati, Jakarta Timur",
    coordinates = [106.8548889, -6.2820202],
    zoom = 15
}) => {
    // Convert [Lng, Lat] to [Lat, Lng] for Leaflet
    const position: [number, number] = [coordinates[1], coordinates[0]];

    const customIcon = L.divIcon({
        className: 'bg-transparent border-none', // Override default styles
        html: `<div style="width: 40px; height: 40px; background-color: #003366; border-radius: 50%; border: 4px solid #FFCC00; box-shadow: 0 0 20px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Bottom center
        popupAnchor: [0, -42]
    });

    return (
        <div className="relative w-full h-full group">
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                className="overflow-hidden"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
                            <h3 style={{ margin: "0 0 5px", color: "#003366", fontWeight: "bold" }}>JACOS</h3>
                            <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: 1.4 }}>{address}</p>
                            <a href="https://maps.app.goo.gl/GVNYvArfRdyJYDK38" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "10px", color: "#003366", fontWeight: "bold", textDecoration: "none", fontSize: "12px", borderBottom: "2px solid #FFCC00" }}>Open in Google Maps</a>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Overlay hint */}
            <div className="absolute top-6 left-6 z-[1000] hidden md:block pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2 rounded-2xl shadow-xl pointer-events-auto transition-transform hover:scale-105">
                    <p className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">Interactive Map</p>
                </div>
            </div>

            <div className="absolute bottom-16 right-6 z-[1000] hidden md:block pointer-events-none">
                <a href="https://maps.app.goo.gl/GVNYvArfRdyJYDK38" target="_blank" rel="noopener noreferrer" className="bg-[#003366] hover:bg-[#FFCC00] text-white hover:text-[#003366] transition-colors border border-white/20 px-6 py-3 rounded-full shadow-2xl pointer-events-auto flex items-center gap-2 font-bold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    Get Directions
                </a>
            </div>
        </div>
    );
};

export default LeafletMap;
