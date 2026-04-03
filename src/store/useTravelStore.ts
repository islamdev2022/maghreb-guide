import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetLevel, Seasonality, WeatherCondition } from "@/lib/mockData";

export interface UserProfile {
    budget: BudgetLevel;
    travelStyle: "solo" | "family" | "couple" | "friends";
    interests: string[];
}

export interface DynamicContext {
    currentSeason: Seasonality;
    currentWeather: WeatherCondition;
    isRamadan: boolean;
    isRaining: boolean;
    isHot: boolean;
}

interface TravelState {
    // Network
    isOnline: boolean;
    setOnlineStatus: (status: boolean) => void;

    // Profile
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;

    // Context
    context: DynamicContext;
    updateContext: (updates: Partial<DynamicContext>) => void;
}

export const useTravelStore = create<TravelState>()(
    persist(
        (set) => ({
            isOnline: true, // Default to online for prototype demo
            setOnlineStatus: (status) => set({ isOnline: status }),

            profile: {
                budget: "medium",
                travelStyle: "solo",
                interests: ["cultural", "gastronomy"],
            },
            updateProfile: (updates) =>
                set((state) => ({ profile: { ...state.profile, ...updates } })),

            context: {
                currentSeason: "spring",
                currentWeather: "outdoor",
                isRamadan: false,
                isRaining: false,
                isHot: false,
            },
            updateContext: (updates) =>
                set((state) => ({ context: { ...state.context, ...updates } })),
        }),
        {
            name: "smart-maghreb-storage",
            partialize: (state) => ({ profile: state.profile, context: state.context }), // Don't persist network state
        }
    )
);
