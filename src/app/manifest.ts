import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Smart Offline GPS — Maghreb",
        short_name: "OfflineGPS",
        description:
            "Offline GPS & maps for the Maghreb region — Algeria, Morocco, Tunisia. Download map tiles, browse POIs, and navigate without internet.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0f1e",
        theme_color: "#6366f1",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
