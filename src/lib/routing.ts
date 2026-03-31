/**
 * Offline routing engine.
 *
 * Uses a Dijkstra algorithm to find shortest paths through a
 * lightweight road network graph stored in IndexedDB.
 */
import type { RoadNetwork, GraphNode, GraphEdge, RouteResult } from "@/types/routing";

/* ── adjacency list builder ────────────────────────────────────── */

interface AdjEntry {
    to: string;
    weight: number;
    edge: GraphEdge;
}

function buildAdjacencyList(
    network: RoadNetwork
): Map<string, AdjEntry[]> {
    const adj = new Map<string, AdjEntry[]>();
    for (const edge of network.edges) {
        // Bidirectional
        if (!adj.has(edge.from)) adj.set(edge.from, []);
        if (!adj.has(edge.to)) adj.set(edge.to, []);
        adj.get(edge.from)!.push({ to: edge.to, weight: edge.weight, edge });
        adj.get(edge.to)!.push({ to: edge.from, weight: edge.weight, edge });
    }
    return adj;
}

/* ── nearest node ──────────────────────────────────────────────── */

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestNode(nodes: GraphNode[], lat: number, lng: number): GraphNode | null {
    let best: GraphNode | null = null;
    let bestDist = Infinity;
    for (const n of nodes) {
        const d = haversine(lat, lng, n.lat, n.lng);
        if (d < bestDist) {
            bestDist = d;
            best = n;
        }
    }
    return best;
}

/* ── priority queue (min‑heap) for Dijkstra ────────────────────── */

class MinHeap {
    private data: { id: string; cost: number }[] = [];

    push(id: string, cost: number) {
        this.data.push({ id, cost });
        this._bubbleUp(this.data.length - 1);
    }

    pop(): { id: string; cost: number } | undefined {
        if (this.data.length === 0) return undefined;
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this._sinkDown(0);
        }
        return top;
    }

    get size() {
        return this.data.length;
    }

    private _bubbleUp(i: number) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.data[i].cost < this.data[parent].cost) {
                [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
                i = parent;
            } else break;
        }
    }

    private _sinkDown(i: number) {
        const n = this.data.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;
            if (l < n && this.data[l].cost < this.data[smallest].cost) smallest = l;
            if (r < n && this.data[r].cost < this.data[smallest].cost) smallest = r;
            if (smallest !== i) {
                [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                i = smallest;
            } else break;
        }
    }
}

/* ── Dijkstra ──────────────────────────────────────────────────── */

/**
 * Compute the shortest route between two coordinates using an
 * offline road network graph.
 */
export function computeRoute(
    network: RoadNetwork,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
): RouteResult {
    const nodeMap = new Map<string, GraphNode>();
    for (const n of network.nodes) nodeMap.set(n.id, n);

    const startNode = findNearestNode(network.nodes, startLat, startLng);
    const endNode = findNearestNode(network.nodes, endLat, endLng);

    if (!startNode || !endNode) {
        return { found: false, distance: 0, duration: 0, path: [] };
    }

    const adj = buildAdjacencyList(network);
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const heap = new MinHeap();

    dist.set(startNode.id, 0);
    prev.set(startNode.id, null);
    heap.push(startNode.id, 0);

    while (heap.size > 0) {
        const { id: u, cost } = heap.pop()!;
        if (cost > (dist.get(u) ?? Infinity)) continue;
        if (u === endNode.id) break;

        for (const { to: v, weight } of adj.get(u) ?? []) {
            const alt = cost + weight;
            if (alt < (dist.get(v) ?? Infinity)) {
                dist.set(v, alt);
                prev.set(v, u);
                heap.push(v, alt);
            }
        }
    }

    if (!prev.has(endNode.id)) {
        return { found: false, distance: 0, duration: 0, path: [] };
    }

    // Reconstruct path
    const pathIds: string[] = [];
    let cur: string | null = endNode.id;
    while (cur) {
        pathIds.push(cur);
        cur = prev.get(cur) ?? null;
    }
    pathIds.reverse();

    const path: [number, number][] = pathIds.map((id) => {
        const n = nodeMap.get(id)!;
        return [n.lat, n.lng];
    });

    const totalWeight = dist.get(endNode.id) ?? 0;

    // Estimate distance (sum of haversine between consecutive path nodes)
    let totalDist = 0;
    for (let i = 1; i < path.length; i++) {
        totalDist += haversine(path[i - 1][0], path[i - 1][1], path[i][0], path[i][1]);
    }

    return {
        found: true,
        distance: Math.round(totalDist),
        duration: Math.round(totalWeight),
        path,
    };
}
