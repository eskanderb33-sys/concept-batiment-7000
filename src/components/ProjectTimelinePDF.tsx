import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Printer,
  Construction,
  CheckCircle2
} from 'lucide-react';
import { Project } from '../types';

interface ProjectTimelinePDFProps {
  project: Project;
  onBack: () => void;
}

export const ProjectTimelinePDF: React.FC<ProjectTimelinePDFProps> = ({ project, onBack }) => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Retour
        </button>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all">
            <Printer className="size-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <Download className="size-4" />
            Télécharger PDF
          </button>
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-3xl p-12 shadow-2xl space-y-12 min-h-[1000px]">
        {/* PDF Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Concept Bâtiment 7000</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-1">Rapport de Progression du Projet</p>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-900">{project.reference}</p>
            <p className="text-slate-500 text-sm font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Détails du Projet</h3>
            <div className="space-y-1">
              <p className="text-xl font-black">{project.name}</p>
              <p className="text-slate-500 font-bold">Client: {project.clientName}</p>
            </div>
          </div>
          <div className="space-y-4 text-right">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Statut Global</h3>
            <div className="space-y-1">
              <p className="text-3xl font-black text-slate-900">{project.progression}%</p>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Complété</p>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b border-slate-100 pb-2">Timeline des Étapes</h3>
          
          <div className="space-y-6">
            {[
              { label: 'Conception', status: 'Terminé', date: '12/01/2024' },
              { label: 'Approvisionnement', status: 'Terminé', date: '05/02/2024' },
              { label: 'Exécution', status: 'En cours', date: 'En cours' },
              { label: 'Finition', status: 'À venir', date: '-' },
              { label: 'Livraison', status: 'À venir', date: '-' }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  step.status === 'Terminé' ? 'bg-emerald-500 text-white' : 
                  step.status === 'En cours' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step.status === 'Terminé' ? <CheckCircle2 className="size-6" /> : <div className="size-3 rounded-full bg-current" />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900">{step.label}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{step.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Document généré par Concept Bâtiment 7000 • www.concept7000.tn
          </p>
        </div>
      </div>
    </div>
  );
};
