/**
 * IndexedDB storage layer using localforage.
 * Provides typed wrappers for POIs, route networks, and region metadata.
 */
import localforage from "localforage";
import type { POI, OfflineRegion } from "@/types/poi";
import type { RoadNetwork } from "@/types/routing";

/* ── stores ────────────────────────────────────────────────────── */

const poiStore = localforage.createInstance({
    name: "offlineGPS",
    storeName: "pois",
    description: "Points of Interest",
});

const regionStore = localforage.createInstance({
    name: "offlineGPS",
    storeName: "regions",
    description: "Downloaded region metadata",
});

const routeStore = localforage.createInstance({
    name: "offlineGPS",
    storeName: "routeNetworks",
    description: "Road network graphs for offline routing",
});

/* ── POI helpers ───────────────────────────────────────────────── */

export async function savePOI(poi: POI): Promise<void> {
    await poiStore.setItem(poi.id, poi);
}

export async function savePOIs(pois: POI[]): Promise<void> {
    await Promise.all(pois.map((p) => poiStore.setItem(p.id, p)));
}

export async function getPOI(id: string): Promise<POI | null> {
    return poiStore.getItem<POI>(id);
}

export async function getAllPOIs(): Promise<POI[]> {
    const items: POI[] = [];
    await poiStore.iterate<POI, void>((value) => {
        items.push(value);
    });
    return items;
}

export async function deletePOI(id: string): Promise<void> {
    await poiStore.removeItem(id);
}

export async function clearPOIs(): Promise<void> {
    await poiStore.clear();
}

/* ── Region helpers ────────────────────────────────────────────── */

export async function saveRegion(region: OfflineRegion): Promise<void> {
    await regionStore.setItem(region.id, region);
}

export async function getRegion(id: string): Promise<OfflineRegion | null> {
    return regionStore.getItem<OfflineRegion>(id);
}

export async function getAllRegions(): Promise<OfflineRegion[]> {
    const items: OfflineRegion[] = [];
    await regionStore.iterate<OfflineRegion, void>((value) => {
        items.push(value);
    });
    return items;
}

export async function deleteRegion(id: string): Promise<void> {
    await regionStore.removeItem(id);
}

/* ── Road‑network helpers ──────────────────────────────────────── */

export async function saveRoadNetwork(network: RoadNetwork): Promise<void> {
    await routeStore.setItem(network.id, network);
}

export async function getRoadNetwork(
    id: string
): Promise<RoadNetwork | null> {
    return routeStore.getItem<RoadNetwork>(id);
}

export async function getAllRoadNetworks(): Promise<RoadNetwork[]> {
    const items: RoadNetwork[] = [];
    await routeStore.iterate<RoadNetwork, void>((value) => {
        items.push(value);
    });
    return items;
}

export async function deleteRoadNetwork(id: string): Promise<void> {
    await routeStore.removeItem(id);
}
