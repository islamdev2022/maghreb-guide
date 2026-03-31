/** A node in the road network graph */
export interface GraphNode {
    id: string;
    lat: number;
    lng: number;
}

/** An edge connecting two nodes */
export interface GraphEdge {
    id: string;
    from: string; // node id
    to: string; // node id
    weight: number; // travel cost in seconds or meters
    distance: number; // meters
    roadType?: string; // e.g. 'primary', 'secondary', 'residential'
    name?: string; // street name
}

/** A lightweight GeoJSON‑ready road network */
export interface RoadNetwork {
    id: string;
    regionId: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
}

/** Computed route result */
export interface RouteResult {
    found: boolean;
    distance: number; // total metres
    duration: number; // estimated seconds
    path: [number, number][]; // [lat, lng][]
    instructions?: string[];
}
