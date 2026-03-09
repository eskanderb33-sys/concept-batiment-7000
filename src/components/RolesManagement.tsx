import React, { useState } from 'react';
import { Shield, User, ChevronRight, Settings, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_ROLES } from '../constants';
import { TeamMemberRole } from '../types';

interface RolesManagementProps {
  onViewChange: (view: any) => void;
  onSelectMember: (member: TeamMemberRole) => void;
}

export const RolesManagement: React.FC<RolesManagementProps> = ({ onViewChange, onSelectMember }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'architect': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'accountant': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'foreman': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Gestionnaire';
      case 'architect': return 'Architecte';
      case 'accountant': return 'Comptable';
      case 'foreman': return 'Chef de Chantier';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestion des Rôles</h2>
            <p className="text-zinc-400">Définissez les niveaux d'accès et les responsabilités de votre équipe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Sécurité</span>
            </div>
            <p className="text-xs text-zinc-400">Accès restreint par défaut aux données sensibles</p>
          </div>
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Granularité</span>
            </div>
            <p className="text-xs text-zinc-400">Permissions spécifiques par module et par projet</p>
          </div>
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Audit</span>
            </div>
            <p className="text-xs text-zinc-400">Historique des modifications d'accès conservé</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_ROLES.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl hover:border-amber-500/30 transition-all cursor-pointer"
              onClick={() => {
                onSelectMember(member);
                onViewChange('roles-project-access');
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors">{member.staffName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(member.role)}`}>
                      {getRoleLabel(member.role)}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">
                      {member.projectAccess.includes('*') ? 'Accès Total' : `${member.projectAccess.length} Projets`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  {member.permissions.slice(0, 3).map((perm) => (
                    <span key={perm} className="px-2 py-1 bg-zinc-900 text-zinc-500 text-[10px] rounded-md">
                      {perm}
                    </span>
                  ))}
                  {member.permissions.length > 3 && (
                    <span className="text-[10px] text-zinc-600">+{member.permissions.length - 3}</span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Besoin d'un nouveau rôle ?</h3>
        <p className="text-zinc-400 max-w-md mb-6">
          Vous pouvez créer des modèles de rôles personnalisés pour automatiser l'attribution des permissions.
        </p>
        <button className="px-6 py-2 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
          Gérer les modèles de rôles
        </button>
      </div>
    </div>
  );
};
