import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Construction, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, View } from '../types';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

interface ProjectListProps {
  onViewChange: (view: View) => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onViewChange, onSelectProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projets')
        .select(`
          *,
          client:clients (
            nom
          )
        `)
        .order('nom', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError('Erreur lors du chargement des projets.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'execution': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'design': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'execution': return 'En cours';
      case 'design': return 'Conception';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(p => {
    const clientNom = p.client?.nom || '';
    return p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
           clientNom.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 size-5" />
          <input 
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-surface-dark border border-primary/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-dark border border-primary/10 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-primary text-background-dark" : "text-slate-500 hover:text-white"
              )}
            >
              <LayoutGrid className="size-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-primary text-background-dark" : "text-slate-500 hover:text-white"
              )}
            >
              <List className="size-5" />
            </button>
          </div>
          
          <button 
            onClick={() => onViewChange('project-create')}
            className="h-12 px-6 bg-primary text-background-dark rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Nouveau Projet
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectProject(project)}
            className="group bg-surface-dark/40 border border-primary/5 rounded-3xl p-6 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="size-6 text-primary" />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Construction className="size-7" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-black tracking-tight group-hover:text-primary transition-colors">{project.nom}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{project.reference} • {project.client?.nom}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                    getStatusColor(project.statut)
                  )}>
                    {project.statut === 'completed' ? <CheckCircle2 className="size-3" /> : 
                     project.statut === 'execution' ? <Clock className="size-3" /> : <AlertCircle className="size-3" />}
                    {getStatusLabel(project.statut)}
                  </span>
                  <span className="text-white font-black text-lg">{project.progression}%</span>
                </div>
                <div className="h-2 bg-background-dark rounded-full overflow-hidden border border-primary/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progression}%` }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(212,175,53,0.3)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Budget</p>
                  <p className="text-white font-bold">{project.budget?.toLocaleString('fr-FR')} DT</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Facturé</p>
                  <p className="text-primary font-bold">{project.billed?.toLocaleString('fr-FR')} DT</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
