import { useQuery } from "@tanstack/react-query";
import { mockExperiences, mockGuides, mockTransport } from "@/lib/mockData";
import { useTravelStore } from "@/store/useTravelStore";

// Helper to simulate network latency
const simulateNetwork = async <T>(data: T, shouldFail = false): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Network connection failed (Simulated)"));
            } else {
                resolve(data);
            }
        }, 800 + Math.random() * 500); // 800ms - 1.3s delay
    });
};

export function useExperiences() {
    const isOnline = useTravelStore((state) => state.isOnline);

    return useQuery({
        queryKey: ["experiences"],
        queryFn: async () => {
            // If offline, the hook won't fetch successfully (unless cached). Simulating failure.
            if (!isOnline) throw new Error("Offline");
            return simulateNetwork(mockExperiences);
        },
        // We can allow React Query to serve cached data if offline, but refetching throws.
        enabled: true,
    });
}

export function useGuides() {
    const isOnline = useTravelStore((state) => state.isOnline);

    return useQuery({
        queryKey: ["guides"],
        queryFn: async () => {
            if (!isOnline) throw new Error("Offline");
            return simulateNetwork(mockGuides);
        },
    });
}

export function useTransport() {
    const isOnline = useTravelStore((state) => state.isOnline);

    return useQuery({
        queryKey: ["transport"],
        queryFn: async () => {
            if (!isOnline) throw new Error("Offline");
            return simulateNetwork(mockTransport);
        },
    });
}
