"use client";

import { useState } from "react";
import { useGuides } from "@/hooks/useMockQueries";
import { Search, Star, Languages, MessageSquare, Briefcase, CalendarCheck, CalendarX, X, Send } from "lucide-react";
import { useTravelStore } from "@/store/useTravelStore";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-[#0a0f1e] text-slate-200 relative overflow-x-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.header
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 border-b border-indigo-500/20 pb-6 relative z-10"
            >
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 mb-3">Local Maghreb Directory</h1>
                <p className="text-slate-400 max-w-2xl text-lg">Connect directly with vetted local artisans, desert guides, and historians. Our network works seamlessly even in cached offline mode.</p>
            </motion.header>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10 flex gap-4 relative z-10">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search guides, cities, or specialties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!isOnline && !guides}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                    />
                </div>
            </motion.div>

            {isLoading && (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-slate-800/80 h-45 rounded-3xl border border-white/5 shadow-md"></div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {!isLoading && !filteredGuides && !isOnline && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-md">
                        <p className="text-slate-400">Offline mode active. Connect to download the directory index.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredGuides && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 relative z-10">
                    {filteredGuides.map(guide => (
                        <motion.div key={guide.id} variants={itemVariants} className="group relative flex flex-col md:flex-row bg-slate-900/60 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all p-8 gap-8">

                            <div className="shrink-0 flex flex-col items-center">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                                    <img src={guide.avatarUrl} alt={guide.name} className="relative w-28 h-28 rounded-full border-2 border-slate-700 group-hover:border-indigo-400 object-cover mb-4 transition-colors" />
                                </div>
                                <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                                    <Star size={16} className="fill-current" /> {guide.rating} <span className="text-slate-400 text-xs ml-1 font-medium">({guide.reviews})</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            {guide.name}
                                            {guide.availability ?
                                                <span className="flex items-center text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wider"><CalendarCheck size={12} className="mr-1.5" /> Available</span> :
                                                <span className="flex items-center text-xs px-2.5 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full font-bold uppercase tracking-wider"><CalendarX size={12} className="mr-1.5" /> Booked</span>
                                            }
                                        </h2>
                                        <p className="text-indigo-400 font-medium text-sm mt-1">{guide.baseCity}, {guide.country}</p>
                                    </div>
                                    <div className="text-right bg-slate-800/50 px-4 py-2 rounded-2xl border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                                        <span className="text-2xl font-bold text-white block leading-none">{guide.hourlyRate} <span className="text-sm font-medium text-slate-400">{guide.currency} / hr</span></span>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm flex-1">
                                    <div className="flex items-start gap-3 text-slate-300">
                                        <Briefcase size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                        <div className="flex flex-wrap gap-2">
                                            {guide.specialties.map(s => <span key={s} className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 font-medium">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Languages size={18} className="text-slate-500 shrink-0" />
                                        <span className="font-medium">{guide.languages.join(" • ")}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-4 border-t border-white/5 pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveModal({ type: 'contact', guide })}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold text-sm border border-white/5 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]"
                                    >
                                        <MessageSquare size={16} /> Contact
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: guide.availability ? 1.05 : 1 }} whileTap={{ scale: guide.availability ? 0.95 : 1 }}
                                        disabled={!guide.availability}
                                        onClick={() => setActiveModal({ type: 'booking', guide })}
                                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800/50 disabled:text-slate-600 disabled:border-slate-800 text-white rounded-xl transition-colors font-bold border border-indigo-400 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]"
                                    >
                                        Request Booking
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredGuides.length === 0 && (
                        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-white/5 text-slate-400 backdrop-blur-md">
                            No local experts found matching "{searchTerm}".
                        </div>
                    )}
                </motion.div>
            )}

            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1e]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(99,102,241,0.15)] relative"
                        >
                            <button
                                onClick={() => { setActiveModal(null); setSubmitSuccess(false); }}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>

                            {submitSuccess ? (
                                <div className="flex flex-col items-center py-10">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full mb-4">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-slate-400 text-center">
                                        {activeModal.guide.name} has been notified and will reply to your device locally as soon as possible.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-2 pr-8 leading-tight">
                                        {activeModal.type === "contact" ? "Send a Message to" : "Request Booking with"} <span className="text-indigo-400">{activeModal.guide.name}</span>
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
                                        {activeModal.type === "contact" ? "Ask about their localized craft, custom tour details, or language preferences." : `Mock a booking for their services at ${activeModal.guide.hourlyRate} ${activeModal.guide.currency}/hr.`}
                                    </p>

                                    <form onSubmit={handleFakeSubmit} className="flex flex-col gap-4">
                                        {activeModal.type === "booking" && (
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Date</label>
                                                    <input type="date" required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Hours</label>
                                                    <input type="number" min="1" max="12" placeholder="Ex: 4" required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">
                                                {activeModal.type === "contact" ? "Your Message" : "Additional Requests"}
                                            </label>
                                            <textarea
                                                required={activeModal.type === "contact"}
                                                rows={4}
                                                placeholder={activeModal.type === "contact" ? "Hi there, I'd like to ask..." : "Do you provide off-road transportation?"}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                            />
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors font-bold border border-indigo-400 disabled:opacity-70 disabled:cursor-wait"
                                        >
                                            {isSubmitting ? "Processing..." : activeModal.type === "contact" ? "Send Message" : "Confirm Booking Hold"}
                                        </motion.button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
