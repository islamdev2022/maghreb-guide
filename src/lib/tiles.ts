/**
 * Tile download utility.
 *
 * Given a bounding box and zoom range, enumerates every tile URL and
 * fetches them so the Service Worker's CacheFirst strategy caches each one.
 *
 * Includes safety limits to avoid downloading too many tiles.
 */
import type { BoundingBox } from "@/types/poi";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/* ── helpers ───────────────────────────────────────────────────── */

/** Convert lat/lng to OSM X/Y tile coordinate at a given zoom */
function lngToTileX(lng: number, zoom: number): number {
    return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
}

function latToTileY(lat: number, zoom: number): number {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
}

/** Count total tiles for a bounding box across zoom levels */
export function estimateTileCount(
    bounds: BoundingBox,
    zoomMin: number,
    zoomMax: number
): number {
    let total = 0;
    for (let z = zoomMin; z <= zoomMax; z++) {
        const xMin = lngToTileX(bounds.west, z);
        const xMax = lngToTileX(bounds.east, z);
        const yMin = latToTileY(bounds.north, z); // note: y is inverted
        const yMax = latToTileY(bounds.south, z);
        total += (xMax - xMin + 1) * (yMax - yMin + 1);
    }
    return total;
}

/* ── main downloader ───────────────────────────────────────────── */

/** Maximum tiles we allow a single download session to fetch */
const MAX_TILES = 25_000;

/** How many tiles to fetch concurrently */
const CONCURRENCY = 6;

export interface DownloadProgress {
    total: number;
    done: number;
    failed: number;
    percent: number;
}

/**
 * Downloads all tiles within the given bounding box and zoom range.
 *
 * @returns An async generator that yields DownloadProgress updates.
 */
export async function* downloadTiles(
    bounds: BoundingBox,
    zoomMin: number,
    zoomMax: number
): AsyncGenerator<DownloadProgress> {
    const totalTiles = estimateTileCount(bounds, zoomMin, zoomMax);

    if (totalTiles > MAX_TILES) {
        throw new Error(
            `Too many tiles (${totalTiles.toLocaleString()}). Maximum is ${MAX_TILES.toLocaleString()}. ` +
            `Reduce your zoom range or bounding box.`
        );
    }

    // Collect all tile URLs
    const urls: string[] = [];
    for (let z = zoomMin; z <= zoomMax; z++) {
        const xMin = lngToTileX(bounds.west, z);
        const xMax = lngToTileX(bounds.east, z);
        const yMin = latToTileY(bounds.north, z);
        const yMax = latToTileY(bounds.south, z);
        for (let x = xMin; x <= xMax; x++) {
            for (let y = yMin; y <= yMax; y++) {
                urls.push(TILE_URL.replace("{z}", `${z}`).replace("{x}", `${x}`).replace("{y}", `${y}`));
            }
        }
    }

    let done = 0;
    let failed = 0;

    const fetchTile = async (url: string) => {
        try {
            await fetch(url, { mode: "cors" });
        } catch {
            failed++;
        } finally {
            done++;
        }
    };

    // Process in batches of CONCURRENCY
    for (let i = 0; i < urls.length; i += CONCURRENCY) {
        const batch = urls.slice(i, i + CONCURRENCY).map(fetchTile);
        await Promise.all(batch);
        yield {
            total: totalTiles,
            done,
            failed,
            percent: Math.round((done / totalTiles) * 100),
        };
    }
}
