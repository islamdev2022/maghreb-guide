"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Compass, BookOpen, Navigation } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const menuItems = [
    { title: "Dynamic Dashboard", icon: <Compass size={32} />, href: "/dashboard", desc: "Contextual AI recommendations based on weather and season.", color: "from-blue-500 to-cyan-400" },
    { title: "Offline GPS Map", icon: <Map size={32} />, href: "/map", desc: "Navigate the Maghreb natively with cached offline maps.", color: "from-emerald-500 to-green-400" },
    { title: "Artisan Directory", icon: <BookOpen size={32} />, href: "/directory", desc: "Connect with verified local guides and craftspeople.", color: "from-amber-500 to-orange-400" },
    { title: "Transport Hub", icon: <Navigation size={32} />, href: "/transport", desc: "Smart aggregation of local louages, buses, and trains.", color: "from-purple-500 to-indigo-400" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-x-hidden relative text-slate-200 flex flex-col items-center justify-center py-24 px-6 md:px-12">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <motion.header
        className="text-center z-10 mb-16 relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-indigo-300">
          High-Fidelity Prototype
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-200 to-indigo-400 mb-6 drop-shadow-sm">
          Maghreb Mobility
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate offline-first PWA for discovering the authentic beauty of Algeria, Morocco, and Tunisia.
        </p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {menuItems.map((item, idx) => (
          <motion.div key={idx} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href={item.href} className="flex flex-col h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 rounded-3xl p-8 transition-all overflow-hidden relative group">
              <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${item.color} opacity-70`} />
              <div className="absolute -right-8 -top-8 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full w-32 h-32 blur-2xl transition-opacity duration-500 pointer-events-none" />

              <div className="text-white mb-6 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{item.title}</h2>
              <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
