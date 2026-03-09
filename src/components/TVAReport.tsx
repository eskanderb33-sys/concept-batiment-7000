import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  PieChart,
  Wallet,
  Landmark,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

export const TVAReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    paidTVA: 0,
    pendingTVA: 0
  });

  useEffect(() => {
    fetchTVAData();
  }, []);

  const fetchTVAData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('factures')
        .select(`
          *,
          clients (
            nom
          )
        `)
        .order('date_facture', { ascending: false });

      if (error) throw error;

      const totalHT = data?.reduce((sum, inv) => sum + (inv.sous_total || 0), 0) || 0;
      const totalTTC = data?.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0) || 0;
      const totalTVA = totalTTC - totalHT;
      
      const paidInvoices = data?.filter(inv => inv.statut_paiement === 'paid') || [];
      const paidTTC = paidInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0);
      const paidHT = paidInvoices.reduce((sum, inv) => sum + (inv.sous_total || 0), 0);
      const paidTVA = paidTTC - paidHT;
      
      const pendingTVA = totalTVA - paidTVA;

      setInvoices(data || []);
      setStats({
        totalHT,
        totalTVA,
        totalTTC,
        paidTVA,
        pendingTVA
      });
    } catch (err: any) {
      console.error('Error fetching TVA data:', err);
      setError('Erreur lors du chargement des données TVA.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const displayStats = [
    { label: "Total Chiffre d'Affaires HT", value: stats.totalHT.toLocaleString(), unit: "DT", icon: Wallet },
    { label: "TVA Collectée (19%)", value: stats.totalTVA.toLocaleString(), unit: "DT", icon: Landmark },
    { label: "Total TTC", value: stats.totalTTC.toLocaleString(), unit: "DT", icon: Receipt, primary: true },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button className="whitespace-nowrap px-6 py-2 rounded-xl bg-primary text-background-dark text-sm font-black shadow-lg shadow-primary/20">Année en cours</button>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-95">
          <Download className="size-4" />
          Exporter
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle className="size-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayStats.map((stat, idx) => (
          <div key={stat.label} className={cn(
            "bg-surface-dark border border-primary/10 rounded-2xl p-6 shadow-sm group hover:border-primary/30 transition-all",
            stat.primary && "border-l-4 border-l-primary"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <stat.icon className="size-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className={cn(
              "text-3xl font-black tracking-tight",
              stat.primary ? "text-white" : "text-primary"
            )}>
              {stat.value} <span className="text-sm font-bold opacity-60">DT</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-5 bg-surface-dark border border-primary/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">TVA Encaissée</span>
          </div>
          <span className="text-lg font-black text-emerald-500">{stats.paidTVA.toLocaleString()} DT</span>
        </div>
        <div className="flex items-center justify-between p-5 bg-surface-dark border border-primary/5 rounded-2xl group hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="size-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">TVA en Attente</span>
          </div>
          <span className="text-lg font-black text-amber-500">{stats.pendingTVA.toLocaleString()} DT</span>
        </div>
      </div>

      <div className="bg-surface-dark border border-primary/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-xl text-white uppercase tracking-tighter">Détails des Factures</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-dark/50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-6 py-5">N° Facture</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Client</th>
                <th className="px-6 py-5 text-right">HT</th>
                <th className="px-6 py-5 text-right">TVA (19%)</th>
                <th className="px-6 py-5 text-right">Total TTC</th>
                <th className="px-6 py-5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5 font-black text-white">{inv.numero}</td>
                  <td className="px-6 py-5 text-slate-400 font-medium">{new Date(inv.date_facture).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-white font-bold">{inv.clients?.nom}</td>
                  <td className="px-6 py-5 text-right font-bold text-slate-400">{inv.sous_total?.toLocaleString()} DT</td>
                  <td className="px-6 py-5 text-right text-primary font-black">{(inv.total_ttc - inv.sous_total)?.toLocaleString()} DT</td>
                  <td className="px-6 py-5 text-right font-black text-white">{inv.total_ttc?.toLocaleString()} DT</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      inv.statut_paiement === 'paid' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {inv.statut_paiement === 'paid' ? 'Payée' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
