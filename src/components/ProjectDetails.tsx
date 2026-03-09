import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Wallet, 
  Receipt, 
  Plus, 
  Share2, 
  Save,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project, View } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
  onViewChange: (view: View) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack, onViewChange }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projets')
        .select(`
          *,
          client:clients (
            nom,
            adresse
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      console.error('Error fetching project details:', err);
      setError('Erreur lors du chargement des détails du projet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !project) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="size-12 text-rose-500 mx-auto" />
        <p className="text-white font-bold">{error || 'Projet non trouvé'}</p>
        <button onClick={onBack} className="text-primary font-bold">Retour</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 shrink-0">
          <div className="aspect-square rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 relative group">
            <img 
              src={project.image || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80"} 
              alt={project.nom} 
              className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className={cn(
                "px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg",
                project.statut === 'En cours' ? "bg-amber-500 text-background-dark" :
                project.statut === 'Terminé' ? "bg-emerald-500 text-background-dark" :
                "bg-primary text-background-dark"
              )}>
                {project.statut}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">
            <span>Réf: {project.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
            {project.nom}
          </h1>
          <div className="flex items-center gap-3 text-primary bg-primary/5 self-start px-4 py-2 rounded-xl border border-primary/10">
            <User className="size-4" />
            <p className="text-sm font-black uppercase tracking-widest">Client: {project.client?.nom || 'Client inconnu'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-dark border border-primary/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="size-32" />
            </div>
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <p className="text-white font-black text-2xl tracking-tight mb-1">Progression globale</p>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Phase d'exécution en cours</p>
              </div>
              <p className="text-primary text-4xl font-black">{project.progression}%</p>
            </div>
            <div className="w-full bg-background-dark rounded-full h-4 p-1 border border-primary/10 relative z-10">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(212,175,53,0.4)]" 
                style={{ width: `${project.progression}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Budget Total', value: project.budget || 0, icon: Wallet },
              { label: 'Montant Facturé', value: 0, icon: Receipt },
              { label: 'Solde Restant', value: project.budget || 0, icon: Clock, highlight: true },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-dark border border-primary/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className={cn(
                  "text-2xl font-black tracking-tight",
                  stat.highlight ? "text-primary" : "text-white"
                )}>
                  {stat.value.toLocaleString()} <span className="text-xs font-bold opacity-60">DT</span>
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Étapes du Projet</h3>
              <button className="text-primary text-sm font-black uppercase tracking-widest hover:underline">Modifier</button>
            </div>
            <div className="space-y-4">
              {[
                { id: '1', title: 'Fondations', status: 'completed', date: '12 Mai' },
                { id: '2', title: 'Élévation Murs', status: 'in-progress', date: '25 Mai' },
                { id: '3', title: 'Toiture', status: 'pending', date: '10 Juin' }
              ].map((m) => (
                <div key={m.id} className={cn(
                  "flex items-center justify-between p-6 bg-surface-dark border rounded-3xl transition-all group",
                  m.status === 'completed' ? "border-emerald-500/20 bg-emerald-500/5" : "border-primary/20 bg-primary/5"
                )}>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "p-3 rounded-2xl shadow-lg",
                      m.status === 'completed' ? "bg-emerald-500 text-background-dark" : "bg-primary text-background-dark"
                    )}>
                      {m.status === 'completed' ? <CheckCircle2 className="size-6" /> : <Clock className="size-6" />}
                    </div>
                    <div>
                      <p className="font-black text-lg text-white group-hover:text-primary transition-colors">{m.title}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    m.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {m.status === 'completed' ? 'Complété' : 'En cours'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Galerie Photos</h3>
              <button className="text-primary flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:underline">
                <Plus className="size-4" /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-primary/10 group cursor-pointer relative">
                  <img src={`https://picsum.photos/seed/const${i}/800/800`} alt="Gallery" className="size-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="size-8 text-white" />
                  </div>
                </div>
              ))}
              <button className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-2xl hover:border-primary/50 transition-all bg-primary/5 group">
                <Plus className="size-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-primary text-[10px] font-black uppercase tracking-widest mt-2">Importer</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-surface-dark border border-primary/10 rounded-3xl space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Actions de gestion</h4>
            <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Save className="size-5" /> Enregistrer
            </button>
            <button 
              onClick={() => onViewChange('project-whatsapp')}
              className="w-full bg-[#25D366] hover:brightness-110 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/10 transition-all active:scale-95"
            >
              <Share2 className="size-5" /> WhatsApp
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-surface-dark border border-primary/20 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <ArrowLeft className="size-5" /> Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
