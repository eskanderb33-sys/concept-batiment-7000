import React, { useState } from 'react';
import { ArrowLeft, Shield, Check, X, Search, Construction, Lock, Unlock, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { TeamMemberRole, Project } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface RolesProjectAccessProps {
  member: TeamMemberRole;
  onBack: () => void;
}

export const RolesProjectAccess: React.FC<RolesProjectAccessProps> = ({ member, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessList, setAccessList] = useState<string[]>(member.projectAccess);

  const toggleAccess = (projectId: string) => {
    if (accessList.includes('*')) return; // Admin has total access
    
    setAccessList(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };

  const filteredProjects = MOCK_PROJECTS.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la gestion des rôles
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{member.staffName}</h2>
              <p className="text-zinc-400">Accès Granulaire par Projet</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
              member.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}>
              <Lock className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">{member.role}</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Sélection des Projets</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {member.role === 'admin' ? (
            <div className="p-12 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-3xl flex flex-col items-center text-center">
              <Unlock className="w-12 h-12 text-emerald-500 mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Accès Illimité</h4>
              <p className="text-zinc-400 max-w-md">
                En tant qu'administrateur, {member.staffName} a automatiquement accès à tous les projets actuels et futurs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const hasAccess = accessList.includes(project.id);
                return (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleAccess(project.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      hasAccess 
                        ? 'bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-500/20' 
                        : 'bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        hasAccess ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        <Construction className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-bold transition-colors ${hasAccess ? 'text-white' : 'text-zinc-400'}`}>
                          {project.nom}
                        </h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                          REF: {project.reference}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      hasAccess ? 'bg-emerald-500 text-white' : 'bg-zinc-700 text-zinc-500'
                    }`}>
                      {hasAccess ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-8 border-t border-zinc-800">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                console.log('Saving access for', member.staffName, accessList);
                onBack();
              }}
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
