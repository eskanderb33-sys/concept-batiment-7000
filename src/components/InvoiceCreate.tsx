import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Eye,
  User,
  Calendar,
  FileText,
  ChevronDown,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client, InvoiceItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface InvoiceCreateProps {
  onCancel: () => void;
}

export const InvoiceCreate: React.FC<InvoiceCreateProps> = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [invoiceData, setInvoiceData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Prestation de Gros Œuvre - Phase 1', quantity: 1, unitPrice: 12500 },
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
    if (!invoiceData.clientId) {
      setError('Veuillez sélectionner un client.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = clients.find(c => c.id === invoiceData.clientId);
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase
        .from('factures')
        .insert([{
          numero: invoiceNumber,
          client_id: invoiceData.clientId,
          devis_id: null, // Not linked to a quote in this simple create
          date_facture: invoiceData.date,
          date_echeance: invoiceData.dueDate,
          statut_paiement: 'unpaid',
          sous_total: subtotal,
          tva: tva,
          total_ttc: total,
          lignes: items,
          paiements: [] // Initialized as empty array
        }]);

      if (error) throw error;
      onCancel();
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError('Erreur lors de la création de la facture. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (clientsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 pb-32">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <section className="bg-surface-dark border border-primary/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <User className="size-5 text-primary" />
          Informations Générales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-400 ml-1">Sélectionner le Client</span>
              <div className="relative">
                <select 
                  value={invoiceData.clientId}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientId: e.target.value })}
                  className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option disabled value="">Choisir un client de la base de données</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-primary pointer-events-none" />
              </div>
            </label>
          </div>
          <div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-400 ml-1">Date de Facturation</span>
              <div className="relative">
                <input 
                  className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary [color-scheme:dark]" 
                  type="date" 
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                />
              </div>
            </label>
          </div>
          <div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-400 ml-1">Date d'Échéance</span>
              <div className="relative">
                <input 
                  className="w-full h-14 bg-background-dark border border-primary/20 rounded-xl px-4 text-white focus:ring-2 focus:ring-primary [color-scheme:dark]" 
                  type="date" 
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-surface-dark border border-primary/10 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <FileText className="size-5 text-primary" />
            Détails des Articles
          </h2>
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all active:scale-95"
          >
            <Plus className="size-4" />
            Ajouter un article
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-primary/10">
                <th className="pb-4 font-bold">Description</th>
                <th className="pb-4 font-bold w-24">Quantité</th>
                <th className="pb-4 font-bold w-40">Prix Unitaire</th>
                <th className="pb-4 font-bold w-40 text-right">Total HT</th>
                <th className="pb-4 font-bold w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4 pr-4">
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-white placeholder:text-slate-600" 
                      type="text" 
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-white" 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-white" 
                      type="number" 
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-4 text-right font-bold text-white">
                    {(item.quantity * item.unitPrice).toLocaleString()} DT
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 md:col-start-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-sm font-medium uppercase tracking-wider">Sous-total HT</span>
            <span className="font-bold text-white">{subtotal.toLocaleString()} DT</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-sm font-medium uppercase tracking-wider">TVA (19%)</span>
            <span className="font-bold text-primary/80">{tva.toLocaleString()} DT</span>
          </div>
          <div className="pt-4 border-t border-primary/20 flex justify-between items-center">
            <span className="text-lg font-extrabold text-white uppercase tracking-widest">Total TTC</span>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">{total.toLocaleString()} DT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-background-dark font-black text-lg py-5 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-6 animate-spin" /> : <FileText className="size-6" />}
          {loading ? 'CRÉATION...' : 'GÉNÉRER LA FACTURE'}
        </button>
        <button 
          onClick={onCancel}
          className="px-10 flex items-center justify-center gap-2 bg-surface-dark border border-primary/20 text-white font-bold py-5 rounded-2xl hover:bg-primary/10 transition-all active:scale-[0.98]"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};
