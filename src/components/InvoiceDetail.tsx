import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  CreditCard,
  Plus,
  History,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Invoice } from '../types';

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onRecordPayment: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onBack, onRecordPayment }) => {
  const tvaRate = 0.19;
  const tvaAmount = (invoice.sous_total || 0) * tvaRate;
  const totalTTC = invoice.total_ttc;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'unpaid': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'partial': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Retour aux factures
        </button>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all">
            <Printer className="size-5" />
          </button>
          <button className="p-3 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all">
            <Download className="size-5" />
          </button>
          <button 
            onClick={onRecordPayment}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Enregistrer un paiement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl overflow-hidden backdrop-blur-xl">
            {/* Header Section */}
            <div className="p-8 border-b border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-background-dark shadow-xl shadow-primary/20">
                      <FileText className="size-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-white tracking-tighter">{invoice.numero}</h1>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mt-2 ${getStatusColor(invoice.statut_paiement)}`}>
                        {invoice.statut_paiement === 'paid' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                        {invoice.statut_paiement}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Date de facture</p>
                      <p className="text-white font-bold flex items-center gap-2">
                        <Calendar className="size-4 text-primary" />
                        {new Date(invoice.date_facture).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Échéance</p>
                      <p className="text-white font-bold flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        {new Date(invoice.date_echeance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-primary text-xs font-black tracking-[0.3em] uppercase mb-1">Client</p>
                  <h2 className="text-white text-xl font-black tracking-tight">{invoice.client?.nom || 'Client'}</h2>
                  <p className="text-slate-500 text-sm font-bold flex items-center justify-end gap-2 mt-2">
                    <MapPin className="size-4 text-primary" />
                    {invoice.client?.adresse || 'Adresse non spécifiée'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="text-left pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Description</th>
                    <th className="text-center pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Qté</th>
                    <th className="text-right pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {invoice.lignes?.map((item, i) => (
                    <tr key={i} className="group">
                      <td className="py-6">
                        <p className="text-white font-bold">{item.description}</p>
                      </td>
                      <td className="py-6 text-center text-slate-300 font-bold">{item.quantity}</td>
                      <td className="py-6 text-right text-white font-black">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} DT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="p-8 bg-background-dark/50 border-t border-primary/10">
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Total HT</span>
                    <span className="font-bold">{(invoice.sous_total || 0).toLocaleString('fr-FR')} DT</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">TVA (19%)</span>
                    <span className="font-bold">{tvaAmount.toLocaleString('fr-FR')} DT</span>
                  </div>
                  <div className="pt-4 border-t border-primary/20 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Total TTC</span>
                    <span className="text-3xl font-black text-white tracking-tighter">
                      {totalTTC?.toLocaleString('fr-FR')} DT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Payment History */}
          <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="size-5" />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Historique des paiements</h3>
            </div>

            <div className="space-y-4">
              {invoice.paiements && invoice.paiements.length > 0 ? (
                invoice.paiements.map((payment) => (
                  <div key={payment.id} className="p-4 rounded-2xl bg-background-dark/50 border border-primary/5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold">{payment.amount.toLocaleString('fr-FR')} DT</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                        {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                      </p>
                    </div>
                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Aucun paiement enregistré</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-primary/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Reste à payer</span>
                <span className="text-white font-black">
                  {(totalTTC - (invoice.paiements?.reduce((acc, p) => acc + p.amount, 0) || 0)).toLocaleString('fr-FR')} DT
                </span>
              </div>
              <div className="w-full h-2 bg-background-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${((invoice.paiements?.reduce((acc, p) => acc + p.amount, 0) || 0) / totalTTC) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-2xl bg-background-dark/50 border border-primary/5 text-left flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-primary" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Envoyer un rappel</span>
                </div>
                <ArrowRight className="size-4 text-slate-500 group-hover:text-primary transition-all" />
              </button>
              <button className="w-full p-4 rounded-2xl bg-background-dark/50 border border-primary/5 text-left flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Générer un avoir</span>
                </div>
                <ArrowRight className="size-4 text-slate-500 group-hover:text-primary transition-all" />
              </button>
              <button 
                className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex items-center justify-between group hover:bg-emerald-500/20 transition-all"
                onClick={() => {
                  // In a real app, this would trigger an update
                  alert('Facture marquée comme payée');
                }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Marquer comme payée</span>
                </div>
                <ArrowRight className="size-4 text-emerald-500/50 group-hover:text-emerald-500 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
