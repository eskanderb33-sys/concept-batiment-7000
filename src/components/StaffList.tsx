import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  UserPlus, 
  Search,
  MoreVertical,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { View, StaffMember } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface StaffListProps {
  onViewChange: (view: View) => void;
}

export const StaffList: React.FC<StaffListProps> = ({ onViewChange }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ['Tous', 'Architectes', 'Chefs de Chantier', 'Designers'];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipe')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError('Erreur lors du chargement de l\'équipe.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.nom.toLowerCase().includes(search.toLowerCase()) || 
                         member.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Tous' || member.role.includes(filter.slice(0, -1));
    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Gestion du Personnel</h2>
        <p className="text-sm text-slate-400">{staff.length} membres d'équipe actifs</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="sticky top-[73px] bg-background-dark z-10 py-2 space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-dark border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all text-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex h-9 items-center justify-center px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                filter === f 
                  ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/20" 
                  : "bg-surface-dark text-slate-400 border-transparent hover:border-primary/30"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-surface-dark p-5 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-5 group hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-black">
                    {member.nom.charAt(0)}
                  </div>
                  <span className={cn(
                    "absolute bottom-0 right-0 size-4 rounded-full border-2 border-surface-dark",
                    member.status === 'active' ? "bg-green-500" : member.status === 'on-leave' ? "bg-amber-500" : "bg-slate-500"
                  )} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{member.nom}</h3>
                  <div className="flex items-center gap-1 text-primary text-xs font-medium">
                    <Briefcase className="size-3" />
                    {member.role}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-bold mt-1 text-slate-500">
                    {member.status === 'active' ? 'Actif' : member.status === 'on-leave' ? 'En Congé' : 'Inactif'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{member.salary?.toLocaleString() || 0} DT</p>
                <p className="text-[10px] text-slate-500 uppercase">Mensuel</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs font-bold transition-all hover:bg-[#25D366]/20 active:scale-95">
                <MessageSquare className="size-4" /> WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold transition-all hover:bg-primary/20 active:scale-95">
                <Phone className="size-4" /> Appeler
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onViewChange('staff-edit')}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 size-14 bg-primary text-background-dark rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
      >
        <UserPlus className="size-6" />
      </button>
    </div>
  );
};
