"use client";

import { useTransport } from "@/hooks/useMockQueries";
import { Train, Bus, CarFront, Plane, ArrowRight, Clock, MapPin } from "lucide-react";

export default function TransportWidget() {
    const { data: routes, isLoading, error } = useTransport();

    const getIcon = (type: string) => {
        switch (type) {
            case "train": return <Train size={20} className="text-maghreb-secondary" />;
            case "bus": return <Bus size={20} className="text-maghreb-primary" />;
            case "shared-taxi": return <CarFront size={20} className="text-maghreb-olive" />;
            case "flight": return <Plane size={20} className="text-maghreb-gold" />;
            default: return <CarFront size={20} />;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 rounded mb-8"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-slate-100 rounded-2xl"></div>
                    <div className="h-20 bg-slate-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error || !routes) {
        return (
            <div className="w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Transport</h3>
                <p className="text-maghreb-primary text-sm font-medium">Impossible de récupérer les transports (Hors connexion).</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 p-8 shadow-warm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h3 className="text-2xl font-serif font-bold text-maghreb-primaryDark flex items-center gap-2">
                    Comparateur de Trajets
                </h3>
                <span className="text-xs font-bold px-3 py-1.5 bg-maghreb-secondary/10 text-maghreb-secondary rounded-full border border-maghreb-secondary/20 shadow-sm uppercase tracking-widest shrink-0">
                    Réseau Maghreb
                </span>
            </div>

            <div className="grid gap-4">
                {routes.map((route) => (
                    <div key={route.id} className="group flex flex-col sm:flex-row items-center justify-between p-5 bg-white sm:hover:bg-slate-50 rounded-2xl border border-slate-100 hover:border-maghreb-primary/30 transition-all gap-4 shadow-sm">

                        <div className="flex items-center gap-5 w-full sm:w-auto">
                            <div className="p-4 bg-maghreb-medina rounded-xl shrink-0 border border-slate-100">
                                {getIcon(route.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 text-slate-800 font-bold mb-1">
                                    <span>{route.from}</span>
                                    <ArrowRight size={14} className="text-slate-400" />
                                    <span>{route.to}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500 capitalize">{route.operator}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                            <div className="text-left sm:text-right">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 mb-1">
                                    <Clock size={14} className="text-maghreb-primary/60" />
                                    {Math.floor(route.estimatedDurationMins / 60)}h {route.estimatedDurationMins % 60}m
                                </div>
                                <div className="text-xs font-medium text-slate-400">{route.frequency}</div>
                            </div>
                            <div className="text-right shrink-0 min-w-20">
                                <div className="text-xl font-bold text-maghreb-primary">{route.priceAmt}</div>
                                <div className="text-sm font-medium text-slate-500">{route.currency}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
