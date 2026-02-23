"use client";

import dynamic from "next/dynamic";
import React from "react";

interface MapBoxProps {
    address?: string;
    coordinates?: [number, number]; // [lng, lat]
    zoom?: number;
}

// Dynamically import LeafletMap with no SSR since leaflet requires window
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl bg-gray-50 flex items-center justify-center animate-pulse">
            <div className="text-[#003366] font-bold tracking-widest uppercase text-sm">
                Loading Map...
            </div>
        </div>
    )
});

const MapBox: React.FC<MapBoxProps> = (props) => {
    return (
        <div className="relative w-full h-full">
            <LeafletMap {...props} />
        </div>
    );
};

export default MapBox;
