import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2, 
  MessageCircle, 
  Calendar, 
  User, 
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Quote } from '../types';

interface QuoteDetailProps {
  quote: Quote;
  onBack: () => void;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ quote, onBack }) => {
  const tvaRate = 0.19;
  const tvaAmount = (quote.sous_total || 0) * tvaRate;
  const totalTTC = quote.total_ttc;

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

  const shareOnWhatsApp = () => {
    const text = `Bonjour, voici votre devis ${quote.numero} pour un montant de ${totalTTC?.toLocaleString('fr-FR')} DT TTC.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Retour aux devis
        </button>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all">
            <Printer className="size-5" />
          </button>
          <button className="p-3 rounded-xl bg-surface-dark border border-primary/10 text-slate-400 hover:text-primary transition-all">
            <Download className="size-5" />
          </button>
          <button 
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-black uppercase tracking-widest text-xs"
          >
            <MessageCircle className="size-5" />
            WhatsApp
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <Share2 className="size-4" />
            Partager
          </button>
        </div>
      </div>

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
                  <h1 className="text-3xl font-black text-white tracking-tighter">{quote.numero}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mt-2 ${getStatusColor(quote.statut)}`}>
                    {quote.statut}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Date d'émission</p>
                  <p className="text-white font-bold flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    {new Date(quote.date_devis).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {quote.date_expiration && (
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Date d'expiration</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      {new Date(quote.date_expiration).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right space-y-6">
              <div>
                <p className="text-primary text-xs font-black tracking-[0.3em] uppercase mb-1">Émetteur</p>
                <h2 className="text-white text-xl font-black tracking-tight">Concept Bâtiment 7000</h2>
                <p className="text-slate-500 text-sm font-bold">Tunis, Tunisie</p>
              </div>
              <div>
                <p className="text-primary text-xs font-black tracking-[0.3em] uppercase mb-1">Destinataire</p>
                <h2 className="text-white text-xl font-black tracking-tight">{quote.client?.nom || 'Client'}</h2>
                <p className="text-slate-500 text-sm font-bold flex items-center justify-end gap-2">
                  <MapPin className="size-4 text-primary" />
                  {quote.client?.adresse || 'Adresse non spécifiée'}
                </p>
              </div>
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
                <th className="text-right pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Prix Unitaire</th>
                <th className="text-right pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {quote.lignes?.map((item, i) => (
                <tr key={i} className="group">
                  <td className="py-6">
                    <p className="text-white font-bold">{item.description}</p>
                  </td>
                  <td className="py-6 text-center text-slate-300 font-bold">{item.quantity}</td>
                  <td className="py-6 text-right text-slate-300 font-bold">{item.unitPrice.toLocaleString('fr-FR')} DT</td>
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
                <span className="font-bold">{(quote.sous_total || 0).toLocaleString('fr-FR')} DT</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">TVA (19%)</span>
                <span className="font-bold">{tvaAmount.toLocaleString('fr-FR')} DT</span>
              </div>
              <div className="pt-4 border-t border-primary/20 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Total TTC</span>
                <span className="text-3xl font-black text-white tracking-tighter">
                  {quote.total_ttc?.toLocaleString('fr-FR')} DT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`size-10 rounded-full flex items-center justify-center ${quote.statut === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
              {quote.statut === 'accepted' ? <CheckCircle2 className="size-6" /> : <Clock className="size-6" />}
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-widest">Statut: {quote.statut}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {quote.statut === 'sent' && (
              <>
                <button className="px-6 py-3 rounded-xl border border-rose-500/20 text-rose-400 font-black uppercase tracking-widest text-[10px] hover:bg-rose-500/10 transition-all">
                  Refuser
                </button>
                <button className="px-6 py-3 rounded-xl bg-emerald-500 text-background-dark font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20">
                  Accepter le devis
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
