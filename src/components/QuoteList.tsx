import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  ChevronRight,
  Calendar,
  User,
  MoreVertical,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { Quote } from '../types';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

interface QuoteListProps {
  onViewChange: (view: any) => void;
  onSelectQuote: (quote: Quote) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({ onViewChange, onSelectQuote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          client:clients (
            nom
          )
        `)
        .order('date_devis', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (err: any) {
      console.error('Error fetching quotes:', err);
      setError('Erreur lors du chargement des devis.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'refused': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'sent': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'expired': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'draft': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="size-3" />;
      case 'refused': return <XCircle className="size-3" />;
      case 'sent': return <Send className="size-3" />;
      case 'expired': return <Clock className="size-3" />;
      case 'draft': return <AlertCircle className="size-3" />;
      default: return <FileText className="size-3" />;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const clientName = quote.client?.nom || '';
    const matchesSearch = quote.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 size-5" />
          <input 
            type="text"
            placeholder="Rechercher un devis ou un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-surface-dark border border-primary/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-dark border border-primary/10 rounded-xl p-1">
            {['all', 'draft', 'sent', 'accepted', 'refused'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? 'bg-primary text-background-dark' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Tous' : status}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => onViewChange('quote-create')}
            className="h-12 px-6 bg-primary text-background-dark rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Nouveau Devis
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredQuotes.map((quote) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectQuote(quote)}
            className="group bg-surface-dark/40 border border-primary/5 rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="size-5 text-primary" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <FileText className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-black tracking-tight">{quote.numero}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getStatusColor(quote.statut)}`}>
                      {getStatusIcon(quote.statut)}
                      {quote.statut}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      {quote.client?.nom}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {new Date(quote.date_devis).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8">
                <div className="text-right">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Montant Total</p>
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {quote.total_ttc?.toLocaleString('fr-FR')} DT
                  </p>
                </div>
                <button className="size-10 rounded-xl bg-surface-dark border border-primary/10 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all">
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
