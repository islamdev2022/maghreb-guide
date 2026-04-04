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
    <div className="min-h-screen bg-maghreb-medina overflow-x-hidden relative text-slate-800 flex flex-col items-center justify-center py-20 px-6 md:px-12">
      {/* Dynamic Zellige inspired Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0l30 30-30 30L0 30zM15 15l15 15-15 15L0 30zM45 15l15 15-15 15-15-15z\\' fill=\\'%23c84b31\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]" />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-maghreb-primaryLight/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-maghreb-gold/20 blur-[120px] pointer-events-none" />

      <motion.header
        className="text-center z-10 mb-16 relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-maghreb-primary/20 text-xs font-semibold tracking-widest uppercase text-maghreb-primary shadow-sm">
          Voyage Immersif
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-maghreb-primaryDark mb-6 drop-shadow-sm">
          L'Âme du Maghreb
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          La première application PWA hors-ligne pour découvrir l'authentique beauté de l'Algérie, du Maroc et de la Tunisie.
        </p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {menuItems.map((item, idx) => (
          <motion.div key={idx} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href={item.href} className="flex flex-col h-full bg-white/90 backdrop-blur-xl border border-slate-200 hover:border-maghreb-primary/50 hover:shadow-warm rounded-[2.5rem] p-8 transition-all overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-maghreb-primary/5 rounded-full blur-2xl group-hover:bg-maghreb-primary/10 transition-colors pointer-events-none" />

              <div className="text-maghreb-secondary mb-6 bg-maghreb-sand rounded-2xl w-fit p-4 border border-maghreb-primary/10 group-hover:scale-110 group-hover:text-maghreb-primary transition-all duration-300">
                {item.icon}
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-3 tracking-tight group-hover:text-maghreb-primary transition-colors">{item.title}</h2>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
