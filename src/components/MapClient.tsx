"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically import MapView with SSR disabled.
 * Leaflet requires the `window` / `document` objects which are
 * unavailable during server-side rendering.
 */
const MapView = dynamic(() => import("@/components/MapView"), {
    ssr: false,
    loading: () => (
        <div className="map-loading">
            <div className="map-loading-spinner" />
            <span className="map-loading-text">Loading map…</span>
        </div>
    ),
});

export default function MapClient() {
    return <MapView />;
}
