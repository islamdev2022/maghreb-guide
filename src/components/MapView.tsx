"use client";

/**
 * Core Leaflet map component.
 * Dynamically imported with ssr:false because Leaflet needs the `window` object.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { POI, POICategory } from "@/types/poi";
import type { RouteResult } from "@/types/routing";
import { POI_CATEGORY_META } from "@/types/poi";
import { getAllPOIs, savePOIs, saveRoadNetwork, savePOI } from "@/lib/db";
import { SEED_POIS } from "@/data/seed-pois";
import { ALGIERS_ROAD_NETWORK } from "@/data/mock-roads";
import { computeRoute } from "@/lib/routing";
import DownloadPanel from "./DownloadPanel";
import POIFilter from "./POIFilter";

/* ── Fix default Leaflet marker icons ──────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Custom category icons ─────────────────────────────────── */

function categoryIcon(cat: POICategory): L.DivIcon {
    const meta = POI_CATEGORY_META[cat];
    return L.divIcon({
        className: "poi-marker",
        html: `<div style="
      background:${meta.color};
      width:34px;height:34px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;
      border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
    ">${meta.icon}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
    });
}

/* ── Routing click handler component ───────────────────────── */

interface RoutingClickProps {
    isRouting: boolean;
    routeStep: "start" | "end";
    onPoint: (latlng: [number, number]) => void;
}

function RoutingClick({ isRouting, routeStep, onPoint }: RoutingClickProps) {
    useMapEvents({
        click(e) {
            if (isRouting) {
                onPoint([e.latlng.lat, e.latlng.lng]);
            }
        },
    });
    if (!isRouting) return null;
    return (
        <div className="routing-cursor-overlay">
            <div className="routing-instruction">
                {routeStep === "start"
                    ? "📍 Tap to set START point"
                    : "🏁 Tap to set END point"}
            </div>
        </div>
    );
}

/* ── Fit bounds helper ─────────────────────────────────────── */

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) map.fitBounds(bounds, { padding: [40, 40] });
    }, [bounds, map]);
    return null;
}

/* ── Main Map Component ────────────────────────────────────── */

const ALGIERS_CENTER: [number, number] = [36.753, 3.058];
const DEFAULT_ZOOM = 12;

export default function MapView() {
    /* State */
    const [pois, setPois] = useState<POI[]>([]);
    const [activeCategories, setActiveCategories] = useState<Set<POICategory>>(
        new Set(["hotel", "restaurant", "artisan", "cultural"])
    );
    const [showDownload, setShowDownload] = useState(false);
    const [isRouting, setIsRouting] = useState(false);
    const [routeStep, setRouteStep] = useState<"start" | "end">("start");
    const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
    const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
    const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
    const [fitBounds, setFitBounds] = useState<L.LatLngBoundsExpression | null>(null);
    const [isOnline, setIsOnline] = useState(true);
    const seeded = useRef(false);

    /* Seed data on first load */
    useEffect(() => {
        if (seeded.current) return;
        seeded.current = true;

        (async () => {
            // Seed POIs
            const existing = await getAllPOIs();
            if (existing.length === 0) {
                await savePOIs(SEED_POIS);
            }
            // Seed road network
            await saveRoadNetwork(ALGIERS_ROAD_NETWORK);
            // Load POIs from DB
            const all = await getAllPOIs();
            setPois(all);
        })();
    }, []);

    /* Online / offline detector */
    useEffect(() => {
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        setIsOnline(navigator.onLine);
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, []);

    /* Routing logic */
    const handleRoutingPoint = useCallback(
        (latlng: [number, number]) => {
            if (routeStep === "start") {
                setRouteStart(latlng);
                setRouteStep("end");
                setRouteResult(null);
            } else {
                setRouteEnd(latlng);
                setRouteStep("start");
                setIsRouting(false);

                if (routeStart) {
                    const result = computeRoute(
                        ALGIERS_ROAD_NETWORK,
                        routeStart[0],
                        routeStart[1],
                        latlng[0],
                        latlng[1]
                    );
                    setRouteResult(result);

                    if (result.found && result.path.length > 0) {
                        const bounds = L.latLngBounds(
                            result.path.map(([lat, lng]) => [lat, lng])
                        );
                        setFitBounds(bounds);
                    }
                }
            }
        },
        [routeStep, routeStart]
    );

    const clearRoute = () => {
        setRouteStart(null);
        setRouteEnd(null);
        setRouteResult(null);
        setIsRouting(false);
        setRouteStep("start");
    };

    const startRouting = () => {
        clearRoute();
        setIsRouting(true);
    };

    /* POI saving */
    const handleAddPOI = useCallback(
        async (poi: POI) => {
            await savePOI(poi);
            setPois((prev) => [...prev, poi]);
        },
        []
    );

    /* Filtered POIs */
    const filteredPois = pois.filter((p) => activeCategories.has(p.category));

    /* Start marker icon */
    const startIcon = L.divIcon({
        className: "route-marker",
        html: `<div style="background:#22c55e;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    const endIcon = L.divIcon({
        className: "route-marker",
        html: `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);">🏁</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    return (
        <div className="map-wrapper">
            {/* ── Status Bar ────────────────────────────────────────── */}
            <div className={`status-bar ${isOnline ? "online" : "offline"}`}>
                <span className="status-dot" />
                {isOnline ? "Online" : "Offline — using cached data"}
            </div>

            {/* ── Toolbar ───────────────────────────────────────────── */}
            <div className="toolbar">
                <button
                    className="toolbar-btn"
                    onClick={() => setShowDownload(!showDownload)}
                    title="Download region offline"
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    <span>Download</span>
                </button>

                <button
                    className={`toolbar-btn ${isRouting ? "active" : ""}`}
                    onClick={isRouting ? clearRoute : startRouting}
                    title="Calculate route"
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{isRouting ? "Cancel" : "Route"}</span>
                </button>

                <button
                    className="toolbar-btn"
                    onClick={async () => {
                        const id = `poi-custom-${Date.now()}`;
                        // For demo: add POI at center of current map view
                        const lat = ALGIERS_CENTER[0] + (Math.random() - 0.5) * 0.02;
                        const lng = ALGIERS_CENTER[1] + (Math.random() - 0.5) * 0.02;
                        const categories: POICategory[] = [
                            "hotel",
                            "restaurant",
                            "artisan",
                            "cultural",
                        ];
                        const cat = categories[Math.floor(Math.random() * categories.length)];
                        await handleAddPOI({
                            id,
                            name: `Custom POI ${id.slice(-4)}`,
                            category: cat,
                            lat,
                            lng,
                            description: "User-added point of interest",
                        });
                    }}
                    title="Add POI"
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add POI</span>
                </button>
            </div>

            {/* ── POI Category Filter ───────────────────────────────── */}
            <POIFilter
                activeCategories={activeCategories}
                onToggle={(cat: POICategory) => {
                    setActiveCategories((prev) => {
                        const next = new Set(prev);
                        if (next.has(cat)) next.delete(cat);
                        else next.add(cat);
                        return next;
                    });
                }}
            />

            {/* ── Download Panel ────────────────────────────────────── */}
            {showDownload && <DownloadPanel onClose={() => setShowDownload(false)} />}

            {/* ── Route Info ────────────────────────────────────────── */}
            {routeResult && (
                <div className="route-info">
                    {routeResult.found ? (
                        <>
                            <div className="route-info-header">
                                <h3>Route Found</h3>
                                <button onClick={clearRoute} className="close-btn">✕</button>
                            </div>
                            <div className="route-stats">
                                <div>
                                    <span className="stat-label">Distance</span>
                                    <span className="stat-value">
                                        {routeResult.distance >= 1000
                                            ? `${(routeResult.distance / 1000).toFixed(1)} km`
                                            : `${routeResult.distance} m`}
                                    </span>
                                </div>
                                <div>
                                    <span className="stat-label">Est. Time</span>
                                    <span className="stat-value">
                                        {routeResult.duration >= 60
                                            ? `${Math.round(routeResult.duration / 60)} min`
                                            : `${routeResult.duration} s`}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="route-info-header">
                            <h3>No route found</h3>
                            <button onClick={clearRoute} className="close-btn">✕</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Leaflet Map ───────────────────────────────────────── */}
            <MapContainer
                center={ALGIERS_CENTER}
                zoom={DEFAULT_ZOOM}
                className="leaflet-map"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds bounds={fitBounds} />

                <RoutingClick
                    isRouting={isRouting}
                    routeStep={routeStep}
                    onPoint={handleRoutingPoint}
                />

                {/* POI markers */}
                {filteredPois.map((poi) => (
                    <Marker
                        key={poi.id}
                        position={[poi.lat, poi.lng]}
                        icon={categoryIcon(poi.category)}
                    >
                        <Popup>
                            <div className="poi-popup">
                                <h3>{poi.nameFr || poi.name}</h3>
                                <span
                                    className="poi-badge"
                                    style={{ background: POI_CATEGORY_META[poi.category].color }}
                                >
                                    {POI_CATEGORY_META[poi.category].icon}{" "}
                                    {POI_CATEGORY_META[poi.category].labelFr}
                                </span>
                                {poi.description && <p>{poi.description}</p>}
                                {poi.rating && (
                                    <div className="poi-rating">
                                        {"⭐".repeat(Math.round(poi.rating))}
                                        <span>{poi.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {poi.tags && (
                                    <div className="poi-tags">
                                        {poi.tags.map((t) => (
                                            <span key={t} className="poi-tag">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Route start/end markers */}
                {routeStart && <Marker position={routeStart} icon={startIcon} />}
                {routeEnd && <Marker position={routeEnd} icon={endIcon} />}

                {/* Route polyline */}
                {routeResult?.found && routeResult.path.length > 0 && (
                    <Polyline
                        positions={routeResult.path}
                        pathOptions={{
                            color: "#6366f1",
                            weight: 5,
                            opacity: 0.85,
                            dashArray: "10 6",
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
}
