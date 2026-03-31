import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, Serwist } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis & { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined };

const TILE_CACHE_NAME = "offline-map-tiles";

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // Cache OpenStreetMap tiles with CacheFirst strategy
        {
            matcher: ({ url }: { url: URL }) => {
                return (
                    url.hostname.includes("tile.openstreetmap.org") ||
                    url.hostname.includes("a.tile.openstreetmap.org") ||
                    url.hostname.includes("b.tile.openstreetmap.org") ||
                    url.hostname.includes("c.tile.openstreetmap.org")
                );
            },
            handler: new CacheFirst({
                cacheName: TILE_CACHE_NAME,
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 50000,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    }),
                ],
            }),
        },
        // Default caching for the rest of the app
        ...defaultCache,
    ],
});

serwist.addEventListeners();
