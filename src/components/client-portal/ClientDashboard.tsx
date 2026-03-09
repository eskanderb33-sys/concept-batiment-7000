import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Construction,
  Wallet,
  Receipt,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { View } from '../../types';

interface ClientDashboardProps {
  onViewChange: (view: View) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Devis en attente', value: '2', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', view: 'client-quotes' as View },
    { label: 'Projets actifs', value: '1', icon: Construction, color: 'text-primary', bg: 'bg-primary/10', view: 'client-projects' as View },
    { label: 'Factures impayées', value: '1', icon: Receipt, color: 'text-red-500', bg: 'bg-red-500/10', view: 'client-invoices' as View },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-10 pb-32">
      <header className="flex flex-col gap-2">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-primary"
        >
          <LayoutDashboard className="size-5" />
          <span className="text-xs font-black uppercase tracking-[0.4em]">Tableau de bord client</span>
        </motion.div>
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
          Bienvenue, <span className="text-primary">M. Ahmed Mansour</span>
        </h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
          Voici l'état d'avancement de vos projets et documents
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onViewChange(stat.view)}
            className="bg-surface-dark border border-primary/10 rounded-3xl p-8 text-left group hover:border-primary/40 transition-all shadow-xl hover:shadow-primary/5"
          >
            <div className={cn("size-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="size-7" />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              <div className="size-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all">
                <ArrowRight className="size-5" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-dark border border-primary/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Dernière Mise à Jour Projet</h2>
            <button 
              onClick={() => onViewChange('client-projects')}
              className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="bg-background-dark/50 rounded-2xl p-6 border border-primary/5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-white text-lg">Villa Carthage - Rénovation</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Réf: PRJ-2024-001</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                En Exécution
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Progression</span>
                <span className="text-primary">65%</span>
              </div>
              <div className="w-full bg-surface-dark h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%] shadow-[0_0_10px_rgba(212,175,53,0.3)]" />
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-xs italic">
              <Clock className="size-4" />
              Dernière étape: Installation structures métalliques terminée
            </div>
          </div>
        </section>

        <section className="bg-surface-dark border border-primary/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Action Requise</h2>
            <span className="size-6 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-bounce">1</span>
          </div>
          <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                <FileText className="size-6" />
              </div>
              <div>
                <h3 className="font-black text-white">Nouveau Devis à Valider</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">DEV-2024-042 • 12.500 DT</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Le devis pour l'extension de la terrasse est prêt. Veuillez le consulter et nous donner votre accord pour lancer les travaux.
            </p>
            <button 
              onClick={() => onViewChange('client-quotes')}
              className="w-full py-4 bg-amber-500 text-background-dark font-black rounded-xl hover:brightness-110 transition-all active:scale-95"
            >
              CONSULTER LE DEVIS
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
