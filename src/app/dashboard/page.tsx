"use client";

import { useState } from "react";
import { useTravelStore } from "@/store/useTravelStore";
import { useExperiences } from "@/hooks/useMockQueries";
import { Map, MapPin, WifiOff, CloudRain, Sun, Calendar, ArrowRight, X, Send, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
    const { context, profile, isOnline, setOnlineStatus } = useTravelStore();
    const { data: experiences, isLoading, error } = useExperiences();

    // Local Filtering
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const categories = ["All", "History", "Nature", "Culture", "Relaxation", "Food"];

    // Modal State
    const [activeBooking, setActiveBooking] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Advanced Recommendation Engine Pipeline
    const filteredExperiences = experiences?.filter((exp) => {
        // Pipeline 1: Context Matching
        const seasonMatch = exp.seasonality.includes("all") || exp.seasonality.includes(context.currentSeason);
        const weatherMatch = context.isRaining ? exp.weatherCondition === "indoor" || exp.weatherCondition === "any" : true;
        const budgetMatch = exp.priceLevel === profile.budget || profile.budget === "high";

        // Pipeline 2: User Explicit Filter
        const categoryMatch = activeCategory === "All" || exp.category.toLowerCase() === activeCategory.toLowerCase();

        return seasonMatch && weatherMatch && budgetMatch && categoryMatch;
    });

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60 } }
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setActiveBooking(null);
            }, 2500);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-maghreb-medina text-slate-800 pb-32">
            {/* HERO SECTION */}
            <div className="relative w-full h-[60vh] min-h-[450px] mb-12 rounded-b-[40px] overflow-hidden shadow-warm">
                {/* Immersive Image */}
                <img
                    src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop"
                    alt="Maghreb landscape"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                {/* Header Content */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10"
                >
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-colors shadow-glass">
                            <span className="sr-only">Retour à l'accueil</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-wide drop-shadow-md">
                            Bonjour, Voyageur
                        </h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOnlineStatus(!isOnline)}
                        className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full border shadow-glass backdrop-blur-md transition-all font-medium ${isOnline ? 'border-white/30 text-white bg-white/20 hover:bg-white/30' : 'border-rose-300 text-rose-100 bg-rose-500/60 hover:bg-rose-500/80'}`}
                    >
                        {isOnline ? "En Ligne" : <><WifiOff size={18} /> Hors Ligne</>}
                    </motion.button>
                </motion.header>

                {/* Glassmorphic Widget at bottom of hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute bottom-8 left-0 w-full px-6 z-10"
                >
                    <div className="max-w-5xl mx-auto p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass flex flex-wrap justify-between items-center gap-6 text-white overflow-hidden relative">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-maghreb-primary/30 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white/20 rounded-full shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                                {context.isRaining ? <CloudRain size={28} className="relative z-10 text-blue-200" /> : <Sun size={28} className="relative z-10 text-maghreb-gold" />}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">Contexte Actuel</p>
                                <p className="text-xl font-serif">{context.isRaining ? "Averses passagères" : "Ensoleillé"}, Idéal pour sortir</p>
                            </div>
                        </div>

                        <div className="h-12 w-px bg-white/20 hidden md:block"></div>

                        <div className="flex gap-8 items-center">
                            <div>
                                <p className="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">Saison</p>
                                <p className="font-medium capitalize text-lg flex items-center gap-2"><Calendar size={16} /> {context.currentSeason}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">Budget</p>
                                <p className="font-medium capitalize text-lg flex items-center gap-1"><span className="text-maghreb-primaryLight font-bold">$</span> {profile.budget}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Dynamic Filter Strip */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide"
                >
                    <Filter size={20} className="text-maghreb-olive shrink-0 ml-2 mr-2" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-6 py-2.5 rounded-full font-semibold transition-all border ${activeCategory === cat
                                ? 'bg-maghreb-primary text-white border-maghreb-primary shadow-warm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-maghreb-primary/50 hover:text-maghreb-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <section>
                    <h2 className="text-3xl font-serif font-bold mb-8 text-slate-800 flex items-center gap-4">
                        Recommandé pour vous
                        <div className="h-px bg-slate-300 flex-1 ml-4" />
                    </h2>

                    <AnimatePresence>
                        {!isOnline && !experiences && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-600 mb-8 flex flex-col items-center"
                            >
                                <WifiOff size={48} className="mb-4 text-rose-400" />
                                <span className="text-2xl font-serif font-bold mb-2">Vous êtes hors ligne.</span>
                                <span className="text-rose-500/80 max-w-md">Connectez-vous pour synchroniser les dernières recommandations. Retournez à la carte pour les régions locales.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading && isOnline && (
                        <div className="flex overflow-x-auto pb-10 gap-6 snap-x snap-mandatory scrollbar-hide">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse bg-slate-200 min-w-[320px] md:min-w-[400px] h-[480px] rounded-[3rem] rounded-b-xl border border-white/5 snap-center"></div>
                            ))}
                        </div>
                    )}

                    {filteredExperiences && (
                        <motion.div
                            initial="hidden" animate="show"
                            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                            className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
                        >
                            {filteredExperiences.map(exp => (
                                <motion.div key={exp.id} variants={cardVariants} className="snap-center shrink-0 w-[85vw] sm:w-[360px] md:w-[420px] group flex flex-col bg-white rounded-moorish border border-slate-100 overflow-hidden hover:border-maghreb-primary/30 transition-all shadow-md hover:shadow-warm relative">
                                    <div className="h-64 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.6 }}
                                            src={exp.imageUrl} alt={exp.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                                            <span className="bg-maghreb-secondary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-white tracking-widest uppercase shadow-sm">
                                                {exp.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col flex-1 relative z-20 bg-white">
                                        <div className="flex items-center gap-1.5 text-maghreb-secondary font-semibold text-sm mb-2">
                                            <MapPin size={16} /> {exp.city}, {exp.country}
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 leading-tight group-hover:text-maghreb-primary transition-colors">{exp.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">{exp.description}</p>

                                        <div className="flex justify-between items-end mt-auto pt-5 border-t border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">À partir de</span>
                                                <span className="text-2xl font-bold text-slate-800">{exp.priceAmount} <span className="text-sm text-slate-500 font-normal">{exp.currency}</span></span>
                                            </div>
                                            <motion.button
                                                onClick={() => setActiveBooking(exp)}
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-maghreb-primary text-white rounded-xl font-bold shadow-md hover:bg-maghreb-primaryLight transition-colors"
                                            >
                                                Réserver
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredExperiences.length === 0 && (
                                <div className="w-full p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                                    <span className="block text-4xl mb-4">🏜️</span>
                                    Aucune recommandation ne correspond à vos critères.
                                </div>
                            )}
                        </motion.div>
                    )}
                </section>

                {/* Interactive Booking Modal */}
                <AnimatePresence>
                    {activeBooking && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-warm relative overflow-hidden"
                            >
                                <button
                                    onClick={() => { setActiveBooking(null); setSubmitSuccess(false); }}
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
                                        <h3 className="text-3xl font-serif font-bold text-slate-800 mb-3 text-center">Demande Envoyée !</h3>
                                        <p className="text-slate-600 text-center max-w-sm">
                                            Votre demande pour <strong className="text-slate-800">{activeBooking.title}</strong> a été enregistrée. Elle sera synchronisée automatiquement.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative z-10 text-slate-800">
                                        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
                                            <img src={activeBooking.imageUrl} className="w-20 h-20 rounded-moorish object-cover shadow-sm" alt="thumb" />
                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-slate-800 pr-8 leading-tight">
                                                    Réserver <span className="text-maghreb-primary">{activeBooking.title}</span>
                                                </h3>
                                                <div className="text-slate-500 flex items-center gap-1.5 text-sm mt-1.5"><MapPin size={14} /> {activeBooking.city}, {activeBooking.country}</div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                                            <div className="flex flex-col sm:flex-row gap-5">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Date souhaitée</label>
                                                    <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Participants</label>
                                                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all appearance-none cursor-pointer">
                                                        <option value="1">1 Personne</option>
                                                        <option value="2">2 Personnes</option>
                                                        <option value="3">3 Personnes</option>
                                                        <option value="4">4+ Personnes</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Exigences ou besoins spécifiques</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Allergies, accessibilité, etc..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-maghreb-primary focus:ring-1 focus:ring-maghreb-primary transition-all resize-none"
                                                />
                                            </div>

                                            <div className="bg-maghreb-sand/50 border border-maghreb-primary/10 rounded-xl p-5 flex justify-between items-center mt-2">
                                                <span className="text-sm font-semibold text-slate-700">Prix estimé</span>
                                                <span className="text-2xl font-bold text-maghreb-primary">{activeBooking.priceAmount} <span className="text-base text-slate-500 font-normal">{activeBooking.currency}</span></span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                disabled={isSubmitting}
                                                type="submit"
                                                className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-maghreb-primary hover:bg-maghreb-primaryLight text-white rounded-xl transition-colors font-bold text-lg disabled:opacity-70 shadow-warm disabled:shadow-none"
                                            >
                                                {isSubmitting ? "Création de la demande..." : "Confirmer la Réservation"}
                                            </motion.button>
                                        </form>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
