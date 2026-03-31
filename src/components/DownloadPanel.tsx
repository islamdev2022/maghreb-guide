"use client";

/**
 * Offline tile download panel.
 * Lists predefined Maghreb regions and allows the user to download
 * map tiles for offline use.
 */

import { useState } from "react";
import { REGIONS } from "@/data/regions";
import { downloadTiles, estimateTileCount, type DownloadProgress } from "@/lib/tiles";
import { saveRegion } from "@/lib/db";

interface DownloadPanelProps {
    onClose: () => void;
}

const COUNTRY_LABELS: Record<string, { name: string; flag: string }> = {
    algeria: { name: "Algeria 🇩🇿", flag: "🇩🇿" },
    morocco: { name: "Morocco 🇲🇦", flag: "🇲🇦" },
    tunisia: { name: "Tunisia 🇹🇳", flag: "🇹🇳" },
};

export default function DownloadPanel({ onClose }: DownloadPanelProps) {
    const [downloading, setDownloading] = useState<string | null>(null);
    const [progress, setProgress] = useState<DownloadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const handleDownload = async (regionId: string) => {
        const region = REGIONS.find((r) => r.id === regionId);
        if (!region) return;

        setDownloading(regionId);
        setError(null);
        setProgress(null);

        try {
            const gen = downloadTiles(region.bounds, region.zoomMin, region.zoomMax);
            let lastProgress: DownloadProgress | null = null;

            for await (const p of gen) {
                lastProgress = p;
                setProgress(p);
            }

            // Save region metadata
            await saveRegion({
                ...region,
                downloadedAt: new Date().toISOString(),
                estimatedTiles: lastProgress?.total ?? 0,
            });

            setCompleted((prev) => new Set(prev).add(regionId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Download failed");
        } finally {
            setDownloading(null);
        }
    };

    const grouped = REGIONS.reduce(
        (acc, r) => {
            if (!acc[r.country]) acc[r.country] = [];
            acc[r.country].push(r);
            return acc;
        },
        {} as Record<string, typeof REGIONS>
    );

    return (
        <div className="download-panel">
            <div className="download-panel-header">
                <h2>📥 Download Regions</h2>
                <button onClick={onClose} className="close-btn">✕</button>
            </div>

            <p className="download-desc">
                Download map tiles for offline use. Tiles are cached directly in your
                browser and will be available without internet.
            </p>

            {error && <div className="download-error">{error}</div>}

            <div className="download-regions">
                {Object.entries(grouped).map(([country, regions]) => (
                    <div key={country} className="region-group">
                        <h3 className="region-country">
                            {COUNTRY_LABELS[country]?.name ?? country}
                        </h3>
                        {regions.map((r) => {
                            const tileCount = estimateTileCount(
                                r.bounds,
                                r.zoomMin,
                                r.zoomMax
                            );
                            const isDownloading = downloading === r.id;
                            const isDone = completed.has(r.id);

                            return (
                                <div
                                    key={r.id}
                                    className={`region-card ${isDone ? "completed" : ""} ${isDownloading ? "active" : ""}`}
                                >
                                    <div className="region-info">
                                        <span className="region-name">
                                            {r.nameFr || r.name}
                                            {r.nameAr && (
                                                <span className="region-ar"> ({r.nameAr})</span>
                                            )}
                                        </span>
                                        <span className="region-meta">
                                            ~{tileCount.toLocaleString()} tiles · Zoom {r.zoomMin}-
                                            {r.zoomMax}
                                        </span>
                                    </div>

                                    {isDownloading && progress ? (
                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${progress.percent}%` }}
                                                />
                                            </div>
                                            <span className="progress-text">
                                                {progress.done}/{progress.total} ({progress.percent}%)
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            className={`download-btn ${isDone ? "done" : ""}`}
                                            disabled={!!downloading}
                                            onClick={() => handleDownload(r.id)}
                                        >
                                            {isDone ? "✓ Cached" : "Download"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
