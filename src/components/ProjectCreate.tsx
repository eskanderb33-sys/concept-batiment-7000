import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Construction, 
  User, 
  FileText, 
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client, Quote } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ProjectCreateProps {
  onCancel: () => void;
  onSave: (project: any) => void;
}

export const ProjectCreate: React.FC<ProjectCreateProps> = ({ onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const [formData, setFormData] = useState({
    nom: '',
    client_id: '',
    quote_id: '',
    date_debut: new Date().toISOString().split('T')[0],
    budget: 0,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [clientsRes, quotesRes] = await Promise.all([
        supabase.from('clients').select('*').order('nom', { ascending: true }),
        supabase.from('devis').select('*').eq('statut', 'accepted').order('numero', { ascending: true })
      ]);

      if (clientsRes.error) throw clientsRes.error;
      if (quotesRes.error) throw quotesRes.error;

      setClients(clientsRes.data || []);
      setQuotes(quotesRes.data || []);
    } catch (err: any) {
      console.error('Error fetching data for project creation:', err);
      setError('Erreur lors du chargement des données.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) {
      setError('Veuillez sélectionner un client.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reference = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('projets')
        .insert([{
          nom: formData.nom,
          client_id: formData.client_id,
          reference: reference,
          statut: 'design',
          progression: 0,
          budget: formData.budget,
          billed: 0,
          date_debut: formData.date_debut,
          description: formData.description
        }])
        .select()
        .single();

      if (error) throw error;
      onSave(data);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError('Erreur lors de la création du projet.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Annuler
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Nouveau Projet</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom du Projet</label>
            <div className="relative">
              <Construction className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
              <input 
                required
                type="text"
                placeholder="Ex: Villa Gammarth - Phase 2"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className="w-full pl-12 pr-4 h-14 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Client</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                <select 
                  required
                  value={formData.client_id}
                  onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                  className="w-full pl-12 pr-4 h-14 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Devis Associé</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                <select 
                  value={formData.quote_id}
                  onChange={(e) => {
                    const quote = quotes.find(q => q.id === e.target.value);
                    setFormData({
                      ...formData, 
                      quote_id: e.target.value,
                      budget: quote ? quote.total_ttc : formData.budget
                    });
                  }}
                  className="w-full pl-12 pr-4 h-14 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none"
                >
                  <option value="">Sélectionner un devis (optionnel)</option>
                  {quotes.map(quote => (
                    <option key={quote.id} value={quote.id}>{quote.numero} ({quote.total_ttc?.toLocaleString()} DT)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Date de début</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                <input 
                  required
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
                  className="w-full pl-12 pr-4 h-14 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Budget Initial (DT)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">DT</span>
                <input 
                  required
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                  className="w-full pl-12 pr-4 h-14 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description / Notes</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Détails du projet, contraintes spécifiques..."
              className="w-full p-4 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <AlertCircle className="size-5 text-primary shrink-0" />
          <p className="text-xs text-slate-400 font-medium">
            La création du projet initialisera automatiquement les étapes de la timeline (Conception, Approvisionnement, Exécution, Finition, Livraison).
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-6 animate-spin" /> : <Save className="size-6" />}
          {loading ? 'CRÉATION...' : 'Créer le Projet'}
        </button>
      </form>
    </div>
  );
};
