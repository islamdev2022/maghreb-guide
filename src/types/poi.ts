/** POI category types */
export type POICategory = "hotel" | "restaurant" | "artisan" | "cultural";

/** A single Point of Interest */
export interface POI {
    id: string;
    name: string;
    nameAr?: string; // Arabic name
    nameFr?: string; // French name
    category: POICategory;
    lat: number;
    lng: number;
    description?: string;
    address?: string;
    phone?: string;
    rating?: number; // 0-5
    image?: string;
    tags?: string[];
}

/** Bounding box for region downloads */
export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}

/** Downloadable region definition */
export interface OfflineRegion {
    id: string;
    name: string;
    nameFr?: string;
    nameAr?: string;
    country: "algeria" | "morocco" | "tunisia";
    bounds: BoundingBox;
    zoomMin: number;
    zoomMax: number;
    estimatedTiles?: number;
    downloadedAt?: string; // ISO date
    sizeBytes?: number;
}

/** Category metadata for UI rendering */
export const POI_CATEGORY_META: Record<
    POICategory,
    { label: string; labelFr: string; icon: string; color: string }
> = {
    hotel: {
        label: "Hotels",
        labelFr: "Hôtels",
        icon: "🏨",
        color: "#6366f1",
    },
    restaurant: {
        label: "Restaurants",
        labelFr: "Restaurants",
        icon: "🍽️",
        color: "#f59e0b",
    },
    artisan: {
        label: "Local Artisans",
        labelFr: "Artisans locaux",
        icon: "🎨",
        color: "#10b981",
    },
    cultural: {
        label: "Cultural Sites",
        labelFr: "Sites culturels",
        icon: "🕌",
        color: "#ec4899",
    },
};
