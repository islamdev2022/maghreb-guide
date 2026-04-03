"use client";

import TransportWidget from "@/components/TransportWidget";

export default function TransportHub() {
    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-[#0a0f1e] text-slate-200 flex flex-col items-center justify-center">
            <header className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-3">Maghreb Mobility</h1>
                <p className="text-slate-400 max-w-xl mx-auto">Compare local transport options bridging major hubs. Prices and times are dynamically generated from realistic local schedules.</p>
            </header>

            <TransportWidget />
        </div>
    );
}
