"use client";

import { useState } from "react";
import { useTravelStore } from "@/store/useTravelStore";
import { useExperiences } from "@/hooks/useMockQueries";
import { Map, MapPin, WifiOff, CloudRain, Sun, Calendar, ArrowRight, X, Send, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#0a0f1e] text-slate-200 overflow-x-hidden relative pb-32">
            <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-end mb-8 border-b border-white/10 pb-6 relative z-10"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 mb-2">My Maghreb Dashboard</h1>
                    <p className="text-slate-400">Hyper-personalized AI recommendations based on your local context.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOnlineStatus(!isOnline)}
                    className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${isOnline ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20' : 'border-rose-500/50 text-rose-400 bg-rose-500/10 shadow-rose-500/20'}`}
                >
                    {isOnline ? "Online Mode" : <><WifiOff size={18} /> Offline Mode</>}
                </motion.button>
            </motion.header>

            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-10 p-1 bg-linear-to-br from-white/10 to-transparent rounded-3xl relative z-10 shadow-lg"
            >
                <div className="p-6 bg-slate-900/90 backdrop-blur-xl rounded-[23px] border border-white/5">
                    <h2 className="text-xl font-bold mb-5 text-indigo-300 flex items-center gap-2">
                        <Map className="text-indigo-500" /> Active Context Engine
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Season", value: context.currentSeason, icon: <Calendar size={18} className="text-blue-400" /> },
                            { label: "Weather", value: context.isRaining ? "Raining" : "Pleasant", icon: context.isRaining ? <CloudRain size={18} className="text-slate-400" /> : <Sun size={18} className="text-amber-400" /> },
                            { label: "Budget", value: profile.budget, icon: <span className="text-green-400 font-bold">$</span> },
                            { label: "Culture", value: "Standard", icon: <span className="text-purple-400 font-bold">★</span> }
                        ].map((ctx, i) => (
                            <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                                <span className="text-sm text-slate-500 block mb-2">{ctx.label}</span>
                                <span className="text-lg font-semibold capitalize flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
                                    {ctx.icon} {ctx.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Dynamic Filter Strip */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide relative z-10"
            >
                <Filter size={20} className="text-slate-500 shrink-0 ml-2 mr-1" />
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 px-5 py-2 rounded-full font-semibold transition-all border ${activeCategory === cat
                                ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                : 'bg-slate-800/50 text-slate-400 border-white/5 hover:border-white/20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            <section className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                    Daily Curated Itinerary
                    <div className="h-px bg-white/10 flex-1 ml-4" />
                </h2>

                <AnimatePresence>
                    {!isOnline && !experiences && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-8 text-center bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 mb-8 flex flex-col items-center backdrop-blur-md"
                        >
                            <WifiOff size={48} className="mb-4 text-rose-500" />
                            <span className="text-xl font-bold block mb-2">You are offline.</span>
                            <span className="text-rose-200">Connect to synchronize the latest AI recommendations. Return to the Map for locally cached regions.</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading && isOnline && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-slate-800/50 h-100 rounded-3xl border border-white/5"></div>
                        ))}
                    </div>
                )}

                {filteredExperiences && (
                    <motion.div
                        initial="hidden" animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredExperiences.map(exp => (
                            <motion.div key={exp.id} variants={cardVariants} className="group flex flex-col bg-slate-900/60 rounded-3xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all backdrop-blur-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                                <div className="h-56 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        src={exp.imageUrl} alt={exp.title}
                                        className="w-full h-full object-cover transition-transform duration-700"
                                    />
                                    <span className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-widest uppercase border border-white/10 shadow-lg">
                                        {exp.category}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col flex-1 relative z-20 -mt-12">
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{exp.title}</h3>
                                    <div className="flex items-center gap-1.5 text-indigo-400 font-medium text-sm mb-4">
                                        <MapPin size={16} /> {exp.city}, {exp.country}
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">{exp.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Estimated</span>
                                            <span className="text-xl font-bold text-white">{exp.priceAmount} <span className="text-sm text-slate-500 font-normal">{exp.currency}</span></span>
                                        </div>
                                        <motion.button
                                            onClick={() => setActiveBooking(exp)}
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-colors"
                                        >
                                            Book <ArrowRight size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {filteredExperiences.length === 0 && (
                            <div className="col-span-full p-12 text-center bg-slate-900/50 rounded-3xl border border-white/5 text-slate-400">
                                <span className="block text-4xl mb-4">🏜️</span>
                                No recommendations match your exact context right now. Try adjusting your profile budget.
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1e]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-xl w-full shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
                        >
                            <button
                                onClick={() => { setActiveBooking(null); setSubmitSuccess(false); }}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 z-20"
                            >
                                <X size={20} />
                            </button>

                            {submitSuccess ? (
                                <div className="flex flex-col items-center py-10 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                                        className="w-20 h-20 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full mb-6"
                                    >
                                        <Send size={40} />
                                    </motion.div>
                                    <h3 className="text-3xl font-bold text-white mb-3">Booking Requested!</h3>
                                    <p className="text-slate-400 text-center max-w-sm">
                                        Your request for <strong className="text-white">{activeBooking.title}</strong> has been secured locally. It will automatically sync once you return online.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                        <img src={activeBooking.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="thumb" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white pr-8 leading-tight">
                                                Reserve <span className="text-indigo-400">{activeBooking.title}</span>
                                            </h3>
                                            <div className="text-slate-400 text-sm mt-1">{activeBooking.city}, {activeBooking.country}</div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Available Date</label>
                                                <input type="date" required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Participants</label>
                                                <select required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer">
                                                    <option value="1">1 Person</option>
                                                    <option value="2">2 People</option>
                                                    <option value="3">3 People</option>
                                                    <option value="4">4+ People</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Dietary Needs or Special Requests</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Let our local partner know if you have any allergies or specific needs..."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                            />
                                        </div>

                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex justify-between items-center mt-2">
                                            <span className="text-sm font-medium text-indigo-300">Total Price Estimate</span>
                                            <span className="text-xl font-bold text-white">{activeBooking.priceAmount} <span className="text-base text-slate-400 font-normal">{activeBooking.currency}</span></span>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors font-bold text-lg border border-indigo-400 disabled:opacity-70 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:shadow-none"
                                        >
                                            {isSubmitting ? "Generating Request..." : "Confirm Secure Booking"}
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
