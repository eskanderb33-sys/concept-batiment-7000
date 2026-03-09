import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { View, Invoice } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface InvoiceListProps {
  onViewChange: (view: View) => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ onViewChange, onSelectInvoice }) => {
  const [filter, setFilter] = useState('Tous');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ['Tous', 'Payé', 'Impayé', 'Partiel'];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('factures')
        .select(`
          *,
          client:clients (
            nom
          )
        `)
        .order('date_facture', { ascending: false });

      if (error) throw error;
      
      setInvoices(data || []);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError('Erreur lors du chargement des factures. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const clientNom = inv.client?.nom || '';
    if (filter === 'Tous') return true;
    if (filter === 'Payé') return inv.statut_paiement === 'paid';
    if (filter === 'Impayé') return inv.statut_paiement === 'unpaid';
    if (filter === 'Partiel') return inv.statut_paiement === 'partial';
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-white">Factures</h2>
        <p className="text-sm text-slate-400">Gérez vos transactions et paiements</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-none px-6 py-2 rounded-full font-bold text-sm transition-all border",
              filter === f 
                ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/20" 
                : "bg-surface-dark text-slate-400 border-transparent hover:border-primary/30"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            Aucune facture trouvée.
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              onClick={() => onSelectInvoice(invoice)}
              className="bg-surface-dark border border-primary/10 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Facture</span>
                  <h3 className="text-lg font-bold text-white">{invoice.numero}</h3>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  invoice.statut_paiement === 'paid' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  invoice.statut_paiement === 'unpaid' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {invoice.statut_paiement === 'paid' ? 'Payé' : invoice.statut_paiement === 'unpaid' ? 'Impayé' : 'Partiel'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Client</p>
                  <p className="text-sm font-semibold text-white">{invoice.client?.nom || 'Client inconnu'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Date</p>
                  <p className="text-sm font-semibold text-white">{invoice.date_facture}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Montant Total</p>
                  <p className="text-xl font-extrabold text-primary">{invoice.total_ttc?.toLocaleString()} <span className="text-xs">DT</span></p>
                </div>
                <button className="flex items-center gap-1 text-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
                  Détails <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => onViewChange('invoice-create')}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 size-14 bg-primary text-background-dark rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
      >
        <Plus className="size-8 font-bold" />
      </button>
    </div>
  );
};
