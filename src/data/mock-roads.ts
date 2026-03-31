/**
 * Mock road network graph for Algiers.
 * In production this would be generated from OSM .pbf extracts.
 */
import type { RoadNetwork } from "@/types/routing";

export const ALGIERS_ROAD_NETWORK: RoadNetwork = {
    id: "road-dz-algiers",
    regionId: "dz-algiers",
    nodes: [
        { id: "n1", lat: 36.7538, lng: 3.0588 }, // El Aurassi
        { id: "n2", lat: 36.7600, lng: 3.0550 },
        { id: "n3", lat: 36.7650, lng: 3.0530 },
        { id: "n4", lat: 36.7700, lng: 3.0500 },
        { id: "n5", lat: 36.7750, lng: 3.0520 },
        { id: "n6", lat: 36.7800, lng: 3.0560 },
        { id: "n7", lat: 36.7853, lng: 3.0596 }, // Casbah
        { id: "n8", lat: 36.7856, lng: 3.0558 }, // La Pêcherie
        { id: "n9", lat: 36.7750, lng: 3.0600 },
        { id: "n10", lat: 36.7700, lng: 3.0650 },
        { id: "n11", lat: 36.7650, lng: 3.0700 },
        { id: "n12", lat: 36.7800, lng: 3.0650 },
        { id: "n13", lat: 36.7720, lng: 3.0480 },
        { id: "n14", lat: 36.7680, lng: 3.0620 },
        { id: "n15", lat: 36.7580, lng: 3.0530 },
    ],
    edges: [
        // Main route up the hill
        { id: "e1", from: "n1", to: "n2", weight: 45, distance: 700, roadType: "primary", name: "Rue Didouche Mourad" },
        { id: "e2", from: "n2", to: "n3", weight: 35, distance: 550, roadType: "primary" },
        { id: "e3", from: "n3", to: "n4", weight: 40, distance: 600, roadType: "primary" },
        { id: "e4", from: "n4", to: "n5", weight: 30, distance: 500, roadType: "secondary" },
        { id: "e5", from: "n5", to: "n6", weight: 35, distance: 550, roadType: "secondary" },
        { id: "e6", from: "n6", to: "n7", weight: 40, distance: 600, roadType: "primary", name: "Rue de la Casbah" },
        { id: "e7", from: "n6", to: "n8", weight: 30, distance: 400, roadType: "secondary" },
        // Coastal road
        { id: "e8", from: "n1", to: "n15", weight: 30, distance: 500, roadType: "primary" },
        { id: "e9", from: "n15", to: "n13", weight: 40, distance: 600, roadType: "primary" },
        { id: "e10", from: "n13", to: "n4", weight: 25, distance: 350, roadType: "secondary" },
        // Cross streets
        { id: "e11", from: "n2", to: "n14", weight: 20, distance: 300, roadType: "residential" },
        { id: "e12", from: "n14", to: "n10", weight: 25, distance: 400, roadType: "residential" },
        { id: "e13", from: "n10", to: "n11", weight: 35, distance: 550, roadType: "residential" },
        { id: "e14", from: "n9", to: "n5", weight: 30, distance: 450, roadType: "secondary" },
        { id: "e15", from: "n9", to: "n12", weight: 35, distance: 500, roadType: "secondary" },
        { id: "e16", from: "n12", to: "n6", weight: 25, distance: 350, roadType: "secondary" },
        { id: "e17", from: "n3", to: "n14", weight: 25, distance: 400, roadType: "residential" },
        { id: "e18", from: "n10", to: "n9", weight: 30, distance: 450, roadType: "residential" },
        { id: "e19", from: "n7", to: "n8", weight: 20, distance: 300, roadType: "primary", name: "Boulevard Front de Mer" },
    ],
};
