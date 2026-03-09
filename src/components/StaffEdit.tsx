import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Camera,
  User,
  Briefcase,
  Phone,
  Mail,
  Key,
  DraftingCompass,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { StaffMember } from '../types';

interface StaffEditProps {
  member?: StaffMember;
  onCancel: () => void;
}

export const StaffEdit: React.FC<StaffEditProps> = ({ member, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: member?.nom || '',
    role: member?.role || '',
    email: member?.email || '',
    phone: member?.phone || '',
    salary: member?.salary || 0,
    status: member?.status || 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (member?.id) {
        // Update
        const { error } = await supabase
          .from('equipe')
          .update(formData)
          .eq('id', member.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('equipe')
          .insert([formData]);
        if (error) throw error;
      }

      onCancel();
    } catch (err: any) {
      console.error('Error saving staff member:', err);
      setError('Erreur lors de l\'enregistrement du collaborateur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
          {member ? 'Modifier le Collaborateur' : 'Nouveau Collaborateur'}
        </h1>
        <p className="text-slate-400 mt-2">Gérez les informations et les accès de votre équipe.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Nom complet</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
            <input 
              className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white" 
              placeholder="ex: Jean Dupont" 
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Rôle</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
            <input 
              className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white" 
              placeholder="ex: Architecte" 
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Salaire Mensuel (DT)</label>
          <div className="relative">
            <DraftingCompass className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
            <input 
              className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white" 
              placeholder="ex: 2500" 
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
            <input 
              className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white" 
              placeholder="+216 00 000 000" 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">E-mail professionnel</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
            <input 
              className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white" 
              placeholder="jean.dupont@concept7000.fr" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl mt-4">
          <div className="flex items-center gap-3">
            <Key className="size-5 text-primary" />
            <div>
              <p className="font-bold text-white text-sm">Statut Actif</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Permettre la connexion au système</p>
            </div>
          </div>
          <select 
            className="bg-surface-dark border border-primary/20 rounded-lg px-3 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-primary"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          >
            <option value="active">Actif</option>
            <option value="on-leave">En Congé</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-4 pt-8">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button 
            onClick={onCancel}
            type="button"
            className="px-8 py-4 border border-primary/30 font-semibold rounded-xl hover:bg-primary/10 transition-colors text-white"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};
