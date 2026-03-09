import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ClientAddProps {
  onCancel: () => void;
}

export const ClientAdd: React.FC<ClientAddProps> = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    notes: ''
  });

  useEffect(() => {
    // Check if supabase client is properly initialized
    // Note: supabase client doesn't expose the URL directly in a standard way, 
    // but we can log the object to see its internal state or just a confirmation.
    console.log('ClientAdd mounted. Supabase client:', supabase);
    // If you want to log the URL specifically, you'd need to access the private property or just log what we know
    console.log('Attempting to connect to Supabase...');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) {
      setError('Le nom est obligatoire.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Submitting form data to Supabase:', formData);
      
      const { data, error: supabaseError } = await supabase
        .from('clients')
        .insert([formData]);

      if (supabaseError) {
        console.error('Supabase insert error details:', supabaseError);
        throw supabaseError;
      }
      
      console.log('Insert successful:', data);
      onCancel();
    } catch (err: any) {
      console.error('Full error object caught in handleSubmit:', err);
      // Show full error details on screen as requested
      const detailedErrorMessage = err.message || JSON.stringify(err);
      setError(`Erreur Supabase: ${detailedErrorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">Ajouter un Client</h1>
        <p className="text-slate-400 mt-2">Veuillez renseigner les informations détaillées du nouveau client.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Nom complet</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full h-14 bg-surface-dark border border-primary/20 rounded-xl pl-12 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Ex: Jean Dupont" 
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Téléphone</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full h-14 bg-surface-dark border border-primary/20 rounded-xl pl-12 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                placeholder="+216 00 000 000" 
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full h-14 bg-surface-dark border border-primary/20 rounded-xl pl-12 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                placeholder="jean.dupont@email.com" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Adresse</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-4 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <textarea 
              className="w-full min-h-[100px] bg-surface-dark border border-primary/20 rounded-xl pl-12 pr-4 pt-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
              placeholder="123 Rue de la Construction, Tunis"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Notes & Observations</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-4 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <textarea 
              className="w-full min-h-[120px] bg-surface-dark border border-primary/20 rounded-xl pl-12 pr-4 pt-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
              placeholder="Informations complémentaires sur le projet ou le client..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            {loading ? 'Enregistrement...' : 'Enregistrer le client'}
          </button>
          <button 
            onClick={onCancel}
            type="button"
            className="w-full text-slate-500 hover:text-primary font-medium transition-colors"
          >
            Annuler les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
