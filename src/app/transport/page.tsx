"use client";

import TransportWidget from "@/components/TransportWidget";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TransportHub() {
    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-maghreb-medina text-slate-800 flex flex-col pt-12">
            {/* Dynamic Zellige inspired Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0l30 30-30 30L0 30zM15 15l15 15-15 15L0 30zM45 15l15 15-15 15-15-15z\\' fill=\\'%23c84b31\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]" />

            <div className="relative z-10 w-full">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 text-maghreb-primary hover:text-maghreb-primaryDark font-bold text-sm bg-white p-2 rounded-full border border-maghreb-primary/20 shadow-sm transition-all hover:pr-4">
                    <span className="p-1.5 bg-maghreb-primary/10 rounded-full"><ChevronLeft size={16} /></span>
                    Accueil
                </Link>

                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-serif font-bold text-maghreb-primaryDark mb-4">Mobilité Maghreb</h1>
                    <p className="text-slate-600 max-w-xl mx-auto font-medium">Comparez les options de transport locales reliant les grands centres. Les prix et les heures sont générés dynamiquement par rapport aux horaires locaux.</p>
                </header>

                <div className="flex justify-center">
                    <TransportWidget />
                </div>
            </div>
        </div>
    );
}
