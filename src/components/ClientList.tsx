import React, { useEffect, useState } from 'react';
import { 
  UserPlus, 
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { View, Client } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ClientListProps {
  onViewChange: (view: View) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ onViewChange }) => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError('Erreur lors du chargement des clients. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white">Liste des Clients</h2>
          <p className="text-sm text-slate-400">{clients.length} clients enregistrés</p>
        </div>
        <button 
          onClick={() => onViewChange('client-add')}
          className="bg-primary hover:bg-primary/90 text-background-dark p-2 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <UserPlus className="size-6" />
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-dark border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all text-white"
        />
      </div>

      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucun client trouvé.
          </div>
        ) : (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-surface-dark p-4 rounded-2xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-background-dark transition-all">
                  {client.nom.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">{client.nom}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider">
                      <Phone className="size-3" /> {client.telephone}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider">
                      <MapPin className="size-3" /> {client.adresse}
                    </div>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center h-10 px-4 rounded-xl bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-background-dark transition-all gap-1">
                Détails <ChevronRight className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
