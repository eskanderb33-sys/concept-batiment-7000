import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Clock, 
  Plus, 
  CheckCircle2,
  ArrowRight,
  Construction,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { View } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface DashboardProps {
  onViewChange: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState({
    quotesCount: 0,
    pendingCount: 0,
    totalInvoiced: 0,
    projectsCount: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [quotesRes, pendingRes, facturesRes, projectsRes] = await Promise.all([
        supabase.from('devis').select('id', { count: 'exact' }),
        supabase.from('factures').select('id', { count: 'exact' }).eq('statut_paiement', 'unpaid'),
        supabase.from('factures').select('total_ttc'),
        supabase.from('projets').select('id', { count: 'exact' })
      ]);

      if (quotesRes.error) throw quotesRes.error;
      if (pendingRes.error) throw pendingRes.error;
      if (facturesRes.error) throw facturesRes.error;
      if (projectsRes.error) throw projectsRes.error;

      const totalInvoiced = facturesRes.data?.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0) || 0;

      setStatsData({
        quotesCount: quotesRes.count || 0,
        pendingCount: pendingRes.count || 0,
        totalInvoiced,
        projectsCount: projectsRes.count || 0
      });

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Erreur lors du chargement du tableau de bord.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Devis ce mois', value: statsData.quotesCount.toString(), trend: '+15%', trendUp: true, icon: FileText },
    { label: 'En attente', value: statsData.pendingCount.toString(), trend: '-2%', trendUp: false, icon: Clock },
    { label: 'Total Facturé', value: statsData.totalInvoiced.toLocaleString(), unit: 'DT', trend: '+22%', trendUp: true, icon: Wallet },
    { label: 'Projets en cours', value: statsData.projectsCount.toString(), status: 'Stable', icon: Construction },
  ];

  const activities = [
    { id: 1, title: 'Facture #2024-085 Payée', client: 'Résidence Carthage', amount: '12.400 DT', time: 'Il y a 2h', success: true },
    { id: 2, title: 'Nouveau Devis Créé', client: 'Villa Gammarth', amount: '45.000 DT', time: 'Il y a 5h', success: false },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Vue d'ensemble</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded uppercase tracking-wider">Mai 2024</span>
        </div>
        <p className="text-slate-400 text-sm mb-6">Bienvenue dans votre espace de gestion luxury.</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 mb-6">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-dark border border-primary/10 p-5 rounded-2xl shadow-sm group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  <stat.icon className="size-5" />
                </div>
                {stat.trend && (
                  <span className={stat.trendUp ? "text-emerald-500 text-xs font-bold flex items-center gap-0.5" : "text-amber-500 text-xs font-bold flex items-center gap-0.5"}>
                    {stat.trend} {stat.trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  </span>
                )}
                {stat.status && <span className="text-slate-500 text-xs font-bold">{stat.status}</span>}
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-white text-3xl font-bold">{stat.value}</p>
                {stat.unit && <p className="text-primary text-sm font-bold">{stat.unit}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={() => onViewChange('quote-create')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-95"
          >
            <Plus className="size-5" />
            <span>Nouveau Devis</span>
          </button>
          <button 
            onClick={() => onViewChange('client-add')}
            className="flex items-center justify-center gap-2 bg-surface-dark hover:bg-primary/10 text-white font-bold py-4 px-6 rounded-xl border border-primary/20 transition-all active:scale-95"
          >
            <Plus className="size-5" />
            <span>Nouveau Client</span>
          </button>
          <button 
            onClick={() => onViewChange('invoice-create')}
            className="flex items-center justify-center gap-2 bg-surface-dark hover:bg-primary/10 text-white font-bold py-4 px-6 rounded-xl border border-primary/20 transition-all active:scale-95"
          >
            <Plus className="size-5" />
            <span>Nouvelle Facture</span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">Activités Récentes</h3>
          <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="size-4" />
          </button>
        </div>
        <div className="bg-surface-dark rounded-2xl border border-primary/10 overflow-hidden divide-y divide-primary/5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-4 gap-4 hover:bg-primary/5 transition-colors cursor-pointer group">
              <div className={cn(
                "size-10 rounded-xl flex items-center justify-center",
                activity.success ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
              )}>
                {activity.success ? <CheckCircle2 className="size-5" /> : <FileText className="size-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{activity.title}</p>
                <p className="text-xs text-slate-400">Client: {activity.client}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{activity.amount}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
