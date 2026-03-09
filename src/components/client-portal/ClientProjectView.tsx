import React from 'react';
import { 
  Construction, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Image as ImageIcon,
  ChevronRight,
  MapPin,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const ClientProjectView: React.FC = () => {
  const project = {
    name: "Villa Carthage - Rénovation Complète",
    reference: "PRJ-2024-001",
    location: "Sidi Bou Saïd, Tunis",
    progression: 65,
    status: "execution",
    milestones: [
      { id: '1', title: 'Fondations & Terrassement', date: '12 Mars 2024', status: 'completed' },
      { id: '2', title: 'Gros Œuvre - Phase 1', date: '05 Avril 2024', status: 'completed' },
      { id: '3', title: 'Installation Structures Métalliques', date: '20 Mai 2024', status: 'completed' },
      { id: '4', title: 'Second Œuvre & Électricité', date: '15 Juin 2024', status: 'in-progress' },
      { id: '5', title: 'Finitions & Peinture', date: '10 Juillet 2024', status: 'upcoming' },
    ],
    gallery: [
      "https://picsum.photos/seed/const1/800/600",
      "https://picsum.photos/seed/const2/800/600",
      "https://picsum.photos/seed/const3/800/600",
      "https://picsum.photos/seed/const4/800/600",
    ]
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 lg:p-8 space-y-10 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary bg-primary/5 self-start px-4 py-1.5 rounded-full border border-primary/10">
            <Construction className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Projet en cours</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
            {project.name}
          </h1>
          <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {project.location}
            </div>
            <div className="flex items-center gap-2">
              <Info className="size-4 text-primary" />
              Réf: {project.reference}
            </div>
          </div>
        </div>
        <div className="bg-surface-dark border border-primary/10 rounded-3xl p-6 min-w-[240px] text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Progression Totale</p>
          <p className="text-5xl font-black text-primary tracking-tighter">{project.progression}%</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Calendar className="size-6 text-primary" />
              Chronologie du Chantier
            </h2>
            <div className="relative space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/10">
              {project.milestones.map((m, idx) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-16 group"
                >
                  <div className={cn(
                    "absolute left-0 top-0 size-14 rounded-2xl flex items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-xl",
                    m.status === 'completed' ? "bg-emerald-500 text-background-dark" :
                    m.status === 'in-progress' ? "bg-primary text-background-dark animate-pulse" :
                    "bg-surface-dark text-slate-600 border border-primary/10"
                  )}>
                    {m.status === 'completed' ? <CheckCircle2 className="size-6" /> : <Clock className="size-6" />}
                  </div>
                  <div className={cn(
                    "p-6 rounded-3xl border transition-all",
                    m.status === 'in-progress' ? "bg-primary/5 border-primary/30" : "bg-surface-dark border-primary/5"
                  )}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn(
                        "font-black text-lg",
                        m.status === 'upcoming' ? "text-slate-500" : "text-white"
                      )}>
                        {m.title}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        m.status === 'completed' ? "text-emerald-500" :
                        m.status === 'in-progress' ? "text-primary" :
                        "text-slate-600"
                      )}>
                        {m.status === 'completed' ? 'Terminé' : m.status === 'in-progress' ? 'En cours' : 'À venir'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-10">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <ImageIcon className="size-6 text-primary" />
              Photos du Chantier
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="aspect-video rounded-3xl overflow-hidden border border-primary/10 relative group cursor-pointer"
                >
                  <img src={img} alt="Chantier" className="size-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Mise à jour du 20 Mai 2024</p>
                  </div>
                </motion.div>
              ))}
              <button className="w-full py-4 bg-surface-dark border border-primary/10 rounded-2xl text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all">
                Voir toutes les photos
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
