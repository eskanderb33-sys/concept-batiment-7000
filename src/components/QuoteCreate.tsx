import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  ChevronDown,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Client, InvoiceItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface QuoteCreateProps {
  onCancel: () => void;
}

export const QuoteCreate: React.FC<QuoteCreateProps> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  
  const [quoteData, setQuoteData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Service de consultation luxe - Design', quantity: 1, unitPrice: 1200 },
  ]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setClientsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('nom', { ascending: true });
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const tva = subtotal * 0.19;
  const total = subtotal + tva;

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async () => {
    if (!quoteData.clientId) {
      setError('Veuillez sélectionner un client.');
      setStep(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = clients.find(c => c.id === quoteData.clientId);
      const quoteNumber = `DEV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase
        .from('devis')
        .insert([{
          numero: quoteNumber,
          client_id: quoteData.clientId,
          date_devis: quoteData.date,
          date_expiration: quoteData.expiryDate,
          description: quoteData.description,
          statut: 'draft',
          sous_total: subtotal,
          tva: tva,
          total_ttc: total,
          lignes: items // Stored as JSON
        }]);

      if (error) throw error;
      onCancel();
    } catch (err: any) {
      console.error('Error creating quote:', err);
      setError('Erreur lors de la création du devis. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-surface-dark border border-primary/10 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Client</label>
          <div className="relative">
            <select 
              value={quoteData.clientId}
              onChange={(e) => setQuoteData({ ...quoteData, clientId: e.target.value })}
              className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option disabled value="">Rechercher ou sélectionner un client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-primary pointer-events-none" />
          </div>
          {clientsLoading && <p className="text-[10px] text-primary animate-pulse">Chargement des clients...</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Date du devis</label>
            <input 
              className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary [color-scheme:dark]" 
              type="date" 
              value={quoteData.date}
              onChange={(e) => setQuoteData({ ...quoteData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Date d'expiration</label>
            <input 
              className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary [color-scheme:dark]" 
              type="date" 
              value={quoteData.expiryDate}
              onChange={(e) => setQuoteData({ ...quoteData, expiryDate: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Description du projet</label>
          <textarea 
            className="w-full bg-background-dark border border-primary/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary min-h-[120px] outline-none" 
            placeholder="Décrivez les spécificités du projet..."
            value={quoteData.description}
            onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
          />
        </div>
      </div>
      <button 
        onClick={() => setStep(2)}
        className="w-full h-16 bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
      >
        Continuer vers les articles
        <ChevronRight className="size-5" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-surface-dark border border-primary/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Articles du devis</h3>
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-primary/20"
          >
            <Plus className="size-4" /> Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-background-dark/50 border border-primary/5 p-5 rounded-2xl space-y-4 group">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <input 
                  className="w-full bg-transparent border-none p-0 text-white font-medium focus:ring-0" 
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Description de l'article"
                />
              </div>
              <div className="flex flex-wrap items-end gap-6">
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Quantité</label>
                  <div className="flex items-center bg-background-dark rounded-lg p-1 border border-primary/10">
                    <button 
                      onClick={() => handleUpdateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                      className="size-7 flex items-center justify-center rounded bg-surface-dark text-white"
                    >-</button>
                    <input 
                      className="w-8 text-center bg-transparent border-none p-0 text-sm font-bold focus:ring-0" 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                    <button 
                      onClick={() => handleUpdateItem(item.id, 'quantity', item.quantity + 1)}
                      className="size-7 flex items-center justify-center rounded bg-surface-dark text-white"
                    >+</button>
                  </div>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Prix Unitaire (DT)</label>
                  <input 
                    className="w-full bg-transparent border-b border-primary/10 pb-1 text-white font-bold focus:ring-0 focus:border-primary transition-all" 
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total</label>
                  <span className="text-primary font-bold">{(item.quantity * item.unitPrice).toLocaleString()} DT</span>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors pb-1"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-primary/10 space-y-3">
          <div className="flex justify-between text-sm text-slate-400">
            <span className="uppercase tracking-widest font-semibold">Sous-total</span>
            <span className="font-bold text-white">{subtotal.toLocaleString()} DT</span>
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span className="uppercase tracking-widest font-semibold">TVA (19%)</span>
            <span className="font-bold text-white">{tva.toLocaleString()} DT</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-black text-white uppercase tracking-widest">Total TTC</span>
            <span className="text-2xl font-black text-primary">{total.toLocaleString()} DT</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="flex-1 h-16 bg-surface-dark border border-primary/20 text-white font-bold rounded-2xl active:scale-95 transition-all">Retour</button>
        <button onClick={() => setStep(3)} className="flex-[2] h-16 bg-primary text-background-dark font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">Continuer</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-primary/10 aspect-[1/1.414] p-8 flex flex-col text-slate-900 dark:text-white">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1">
            <div className="size-12 bg-primary flex items-center justify-center rounded-xl mb-4">
              <FileText className="size-6 text-background-dark" />
            </div>
            <h4 className="text-xl font-black">CONCEPT 7000</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Construction & Design</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light text-primary uppercase tracking-tighter mb-2">Devis</h1>
            <p className="text-xs text-slate-500 font-bold italic">Brouillon</p>
            <p className="text-xs text-slate-500">Date : {quoteData.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">Émetteur</p>
            <p className="text-xs font-bold">Concept Bâtiment 7000</p>
            <p className="text-xs text-slate-500">Tunis, Tunisie</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">Destinataire</p>
            <p className="text-xs font-bold">{clients.find(c => c.id === quoteData.clientId)?.nom || 'Client non sélectionné'}</p>
            <p className="text-xs text-slate-500">{clients.find(c => c.id === quoteData.clientId)?.adresse || ''}</p>
          </div>
        </div>

        <div className="flex-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="py-4 font-black text-primary uppercase tracking-widest">Description</th>
                <th className="py-4 font-black text-primary text-center uppercase tracking-widest">Qté</th>
                <th className="py-4 font-black text-primary text-right uppercase tracking-widest">Prix Unitaire</th>
                <th className="py-4 font-black text-primary text-right uppercase tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="py-5 font-bold">{item.description}</td>
                  <td className="py-5 text-center">{item.quantity}</td>
                  <td className="py-5 text-right">{item.unitPrice.toLocaleString()} DT</td>
                  <td className="py-5 text-right font-black">{(item.quantity * item.unitPrice).toLocaleString()} DT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-primary/20">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Sous-total</span>
                <span className="text-slate-900 dark:text-white">{subtotal.toLocaleString()} DT</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">TVA (19%)</span>
                <span className="text-slate-900 dark:text-white">{tva.toLocaleString()} DT</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-primary pt-3">
                <span className="text-sm font-black text-primary uppercase tracking-widest">TOTAL TTC</span>
                <span className="text-xl font-black text-primary">{total.toLocaleString()} DT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-background-dark py-5 rounded-2xl font-black shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
          {loading ? 'Enregistrement...' : 'Enregistrer le Devis'}
        </button>
        <button 
          onClick={() => setStep(2)}
          className="flex items-center justify-center gap-2 bg-surface-dark text-white py-5 rounded-2xl font-bold border border-primary/20 hover:bg-primary/10 transition-all active:scale-95"
        >
          Retour à l'édition
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white leading-tight">Nouveau Devis</h2>
            <p className="text-slate-400 text-sm">
              {step === 1 ? 'Étape 1: Détails du client et du projet' : 
               step === 2 ? 'Étape 2: Articles & Tarification' : 
               'Étape 3: Aperçu & Actions'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-primary mb-1">Progression: {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Étape {step} sur 3</p>
          </div>
        </div>
        <div className="w-full bg-surface-dark h-2 rounded-full overflow-hidden border border-primary/10">
          <motion.div 
            className="bg-primary h-full shadow-[0_0_15px_rgba(212,175,53,0.5)]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
