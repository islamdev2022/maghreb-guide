"use client";

import { useTransport } from "@/hooks/useMockQueries";
import { Train, Bus, CarFront, Plane, ArrowRight, Clock, MapPin } from "lucide-react";

export default function TransportWidget() {
    const { data: routes, isLoading, error } = useTransport();

    const getIcon = (type: string) => {
        switch (type) {
            case "train": return <Train size={20} className="text-blue-400" />;
            case "bus": return <Bus size={20} className="text-amber-400" />;
            case "shared-taxi": return <CarFront size={20} className="text-emerald-400" />;
            case "flight": return <Plane size={20} className="text-purple-400" />;
            default: return <CarFront size={20} />;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-slate-900/50 rounded-2xl border border-white/5 p-6 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-800 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-slate-800 rounded-xl"></div>
                    <div className="h-20 bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error || !routes) {
        return (
            <div className="w-full bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-2">Smart Transport</h3>
                <p className="text-red-400/80 text-sm">Unable to fetch transport options (Offline).</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Smart Transport Aggregator
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20">
                    Maghreb Network
                </span>
            </div>

            <div className="grid gap-3">
                {routes.map((route) => (
                    <div key={route.id} className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all gap-4">

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="p-3 bg-slate-900 rounded-lg shrink-0">
                                {getIcon(route.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-white font-bold mb-1">
                                    <span>{route.from}</span>
                                    <ArrowRight size={14} className="text-slate-500" />
                                    <span>{route.to}</span>
                                </div>
                                <div className="text-xs text-slate-400 capitalize">{route.operator}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                            <div className="text-left sm:text-right">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200 mb-1">
                                    <Clock size={14} className="text-slate-500" />
                                    {Math.floor(route.estimatedDurationMins / 60)}h {route.estimatedDurationMins % 60}m
                                </div>
                                <div className="text-xs text-slate-400">{route.frequency}</div>
                            </div>
                            <div className="text-right shrink-0 min-w-17.5">
                                <div className="text-lg font-bold text-indigo-400">{route.priceAmt}</div>
                                <div className="text-xs font-medium text-slate-500">{route.currency}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
