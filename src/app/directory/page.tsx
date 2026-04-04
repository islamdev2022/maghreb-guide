"use client";

import { useState } from "react";
import { useGuides } from "@/hooks/useMockQueries";
import { Search, Star, Languages, MessageSquare, Briefcase, CalendarCheck, CalendarX, X, Send, WifiOff, MapPin, ChevronLeft } from "lucide-react";
import { useTravelStore } from "@/store/useTravelStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Directory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeModal, setActiveModal] = useState<{ type: "contact" | "booking"; guide: any } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const { data: guides, isLoading } = useGuides();
    const { isOnline } = useTravelStore();

    const filteredGuides = guides?.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        g.baseCity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.3 } }
    };

    const handleFakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setActiveModal(null);
            }, 2000);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-maghreb-medina text-slate-800 pb-32">

            {/* Header Area */}
            <div className="relative pt-12 pb-12 px-6">
                <div className="absolute inset-0 z-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0l30 30-30 30L0 30zM15 15l15 15-15 15L0 30zM45 15l15 15-15 15-15-15z\\' fill=\\'%23c84b31\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-maghreb-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 text-maghreb-primary hover:text-maghreb-primaryDark font-bold text-sm bg-white p-2 rounded-full border border-maghreb-primary/20 shadow-sm transition-all hover:pr-4">
                        <span className="p-1.5 bg-maghreb-primary/10 rounded-full"><ChevronLeft size={16} /></span>
                        Accueil
                    </Link>
                    <motion.header
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-10 pb-6 border-b border-maghreb-primary/10"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-maghreb-primaryDark mb-4">Artisans & Guides</h1>
                        <p className="text-slate-500 max-w-2xl text-lg font-medium">Rencontrez des experts locaux vérifiés. Des guides du désert aux maîtres artisans, notre réseau reste accessible même hors connexion.</p>
                    </motion.header>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-12 relative z-10">
                        <div className="relative flex-1 group shadow-sm rounded-full">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-maghreb-primary/70 group-focus-within:text-maghreb-primary transition-colors">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher par nom, ville, spécialité..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={!isOnline && !guides}
                                className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-full text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maghreb-primary/30 focus:border-maghreb-primary/50 transition-all disabled:opacity-50 shadow-inner"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-white h-[450px] rounded-[2.5rem] rounded-b-xl border border-slate-100 shadow-sm"></div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {!isLoading && !filteredGuides && !isOnline && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                            <WifiOff size={48} className="mx-auto mb-4 text-slate-300" />
                            <p className="text-slate-500 font-medium text-lg">Mode hors ligne actif. Connectez-vous pour télécharger l'annuaire.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {filteredGuides && (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredGuides.map(guide => (
                            <motion.div key={guide.id} variants={itemVariants} className="group relative flex flex-col bg-white rounded-[2.5rem] rounded-b-xl border border-slate-100 overflow-hidden hover:border-maghreb-primary/30 hover:shadow-warm transition-all duration-300">

                                <div className="h-48 relative overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent z-10" />
                                    <div className="absolute inset-0 z-0 opacity10 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5z\\' fill=\\'%23c84b31\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]" />
                                    <img src="https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=500" alt="Cover" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-100" />

                                    <div className="absolute top-4 left-4 z-20">
                                        {guide.availability ?
                                            <span className="flex items-center text-[10px] px-3 py-1.5 bg-white/90 backdrop-blur-md text-maghreb-olive border border-white/20 rounded-full font-bold uppercase tracking-widest shadow-sm"><CalendarCheck size={12} className="mr-1.5" /> Disponible</span> :
                                            <span className="flex items-center text-[10px] px-3 py-1.5 bg-slate-800/80 backdrop-blur-md text-slate-300 border border-slate-600/50 rounded-full font-bold uppercase tracking-widest shadow-sm"><CalendarX size={12} className="mr-1.5" /> Occupé</span>
                                        }
                                    </div>
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="flex items-center gap-1.5 bg-maghreb-gold/90 backdrop-blur-md text-white font-bold px-3 py-1.5 text-xs rounded-full shadow-sm">
                                            <Star size={12} className="fill-current" /> {guide.rating}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1 relative z-20 pt-0">
                                    <div className="flex justify-between items-end mb-4 -mt-10 relative z-30">
                                        <div className="relative">
                                            <img src={guide.avatarUrl} alt={guide.name} className="relative w-20 h-20 rounded-2xl border-4 border-white object-cover bg-white shadow-sm" />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-slate-800 block leading-none">{guide.hourlyRate} <span className="text-sm font-medium text-slate-500">{guide.currency} / h</span></span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-1 leading-tight group-hover:text-maghreb-primary transition-colors">
                                            {guide.name}
                                        </h2>
                                        <p className="text-maghreb-secondary font-semibold text-sm flex items-center gap-1.5"><MapPin size={14} /> {guide.baseCity}, {guide.country}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-3 gap-x-6 text-sm flex-1 mb-6">
                                        <div className="flex items-start gap-3">
                                            <Briefcase size={16} className="text-maghreb-primary/60 shrink-0 mt-0.5" />
                                            <div className="flex flex-wrap gap-2 text-slate-600 font-medium">
                                                {guide.specialties.map(s => <span key={s} className="px-2.5 py-1 bg-maghreb-sand rounded-lg text-slate-700">{s}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Languages size={16} className="text-maghreb-primary/60 shrink-0" />
                                            <span className="font-medium text-slate-600">{guide.languages.join(" • ")}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveModal({ type: 'contact', guide })}
                                            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors font-bold text-sm border border-slate-200 shadow-sm"
                                        >
                                            <MessageSquare size={16} /> Contacter
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: guide.availability ? 1.05 : 1 }} whileTap={{ scale: guide.availability ? 0.95 : 1 }}
                                            disabled={!guide.availability}
                                            onClick={() => setActiveModal({ type: 'booking', guide })}
                                            className="flex-[1.5] flex justify-center items-center gap-2 px-4 py-3 bg-maghreb-primary hover:bg-maghreb-primaryLight disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none text-white rounded-xl transition-colors font-bold text-sm shadow-md"
                                        >
                                            Réserver
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {filteredGuides.length === 0 && (
                            <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 shadow-sm">
                                <span className="block text-4xl mb-4">🔍</span>
                                Aucun expert local ne correspond à "{searchTerm}".
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-warm relative overflow-hidden"
                        >
                            <button
                                onClick={() => { setActiveModal(null); setSubmitSuccess(false); }}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-20"
                            >
                                <X size={20} />
                            </button>

                            {submitSuccess ? (
                                <div className="flex flex-col items-center py-10 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                                        className="w-20 h-20 bg-maghreb-olive/20 text-maghreb-olive flex items-center justify-center rounded-full mb-6"
                                    >
                                        <Send size={40} />
                                    </motion.div>
                                    <h3 className="text-3xl font-serif font-bold text-slate-800 mb-3 text-center">Message Envoyé !</h3>
                                    <p className="text-slate-600 text-center">
                                        <strong className="text-slate-800">{activeModal.guide.name}</strong> a été notifié(e) et vous répondra dès que possible.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative z-10 text-slate-800">
                                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2 pr-8 leading-tight">
                                        {activeModal.type === "contact" ? "Contacter" : "Réserver avec"} <span className="text-maghreb-primary">{activeModal.guide.name}</span>
                                    </h3>
                                    <p className="text-slate-500 font-medium text-sm mb-6 pb-6 border-b border-slate-100">
                                        {activeModal.type === "contact" ? "Posez vos questions sur son artisanat ou ses visites sur-mesure." : `Simulez une réservation à ${activeModal.guide.hourlyRate} ${activeModal.guide.currency}/h.`}
                                    </p>

                                    <form onSubmit={handleFakeSubmit} className="flex flex-col gap-5">
                                        {activeModal.type === "booking" && (
                                            <div className="flex gap-5">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Date</label>
                                                    <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Heures</label>
                                                    <input type="number" min="1" max="12" placeholder="Ex: 4" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all" />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                                                {activeModal.type === "contact" ? "Votre Message" : "Demandes Spéciales"}
                                            </label>
                                            <textarea
                                                required={activeModal.type === "contact"}
                                                rows={4}
                                                placeholder={activeModal.type === "contact" ? "Bonjour, je souhaiterais..." : "Avez-vous un véhicule adapté ?"}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all resize-none"
                                            />
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-maghreb-primary hover:bg-maghreb-primaryLight text-white rounded-xl transition-colors font-bold text-lg disabled:opacity-70 shadow-warm disabled:shadow-none"
                                        >
                                            {isSubmitting ? "Traitement..." : activeModal.type === "contact" ? "Envoyer le Message" : "Confirmer la Réservation"}
                                        </motion.button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
