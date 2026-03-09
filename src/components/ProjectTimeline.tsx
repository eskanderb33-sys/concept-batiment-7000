import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Circle,
  Construction,
  FileText,
  Truck,
  Sparkles,
  PackageCheck,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface ProjectTimelineProps {
  project: Project;
  onBack: () => void;
  onExportPDF: () => void;
  onShareWhatsApp: () => void;
}

const STAGES = [
  { id: 'design', label: 'Conception', icon: FileText, description: 'Plans, études et validations techniques' },
  { id: 'procurement', label: 'Approvisionnement', icon: Truck, description: 'Commande et réception des matériaux' },
  { id: 'execution', label: 'Exécution', icon: Construction, description: 'Gros œuvre et travaux principaux' },
  { id: 'finishing', label: 'Finition', icon: Sparkles, description: 'Peinture, revêtements et détails' },
  { id: 'delivered', label: 'Livraison', icon: PackageCheck, description: 'Remise des clés et réception finale' }
];

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  project, 
  onBack, 
  onExportPDF, 
  onShareWhatsApp 
}) => {
  // Mock current stage for visualization
  const currentStageIndex = 2; // Execution

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Retour aux projets
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={onExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <Download className="size-4" />
            Exporter PDF
          </button>
          <button 
            onClick={onShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <MessageSquare className="size-4" />
            Partager WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-8 backdrop-blur-xl space-y-12">
        <div className="flex items-center gap-6">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
            <Construction className="size-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{project.name}</h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Timeline du Projet • {project.reference}</p>
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line for Mobile, Horizontal for Desktop? Let's stick to a clean vertical list for clarity */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-primary/10" />

          <div className="space-y-12 relative">
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isUpcoming = index > currentStageIndex;

              return (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-8 group"
                >
                  <div className={cn(
                    "relative z-10 size-16 rounded-2xl flex items-center justify-center border transition-all duration-500",
                    isCompleted ? "bg-emerald-500 text-background-dark border-emerald-500 shadow-lg shadow-emerald-500/20" :
                    isCurrent ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/20 scale-110" :
                    "bg-background-dark text-slate-600 border-primary/10"
                  )}>
                    <stage.icon className="size-8" />
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 size-6 rounded-full bg-emerald-500 border-4 border-background-dark flex items-center justify-center">
                        <CheckCircle2 className="size-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "text-lg font-black uppercase tracking-tight transition-colors",
                        isUpcoming ? "text-slate-600" : "text-white"
                      )}>
                        {stage.label}
                      </h3>
                      {isCurrent && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 animate-pulse">
                          Étape Actuelle
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm font-medium leading-relaxed",
                      isUpcoming ? "text-slate-700" : "text-slate-400"
                    )}>
                      {stage.description}
                    </p>
                    
                    {!isUpcoming && (
                      <div className="mt-4 flex items-center gap-4">
                        <div className="h-1 flex-1 bg-background-dark rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full transition-all duration-1000",
                            isCompleted ? "w-full bg-emerald-500" : "w-1/2 bg-primary"
                          )} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase">
                          {isCompleted ? '100%' : '50%'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4">Statistiques Clés</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-background-dark/50 border border-primary/5">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Jours écoulés</p>
              <p className="text-2xl font-black text-white">45</p>
            </div>
            <div className="p-4 rounded-2xl bg-background-dark/50 border border-primary/5">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Retard estimé</p>
              <p className="text-2xl font-black text-rose-500">0j</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Prochaine Étape</h3>
            <p className="text-slate-400 text-sm font-bold">Finition & Peinture</p>
          </div>
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
