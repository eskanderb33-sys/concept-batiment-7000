import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Euro, 
  CheckCircle2,
  ChevronRight,
  User,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { Invoice } from '../types';

interface PaymentRecordProps {
  invoice: Invoice;
  onBack: () => void;
  onSave: (payment: any) => void;
}

export const PaymentRecord: React.FC<PaymentRecordProps> = ({ invoice, onBack, onSave }) => {
  const [amount, setAmount] = useState((invoice.total_ttc || 0).toString());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<'cash' | 'transfer' | 'check'>('transfer');
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      date,
      method,
      reference
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="size-4" />
        Annuler
      </button>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter">Enregistrer un paiement</h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          Pour la facture <span className="text-primary">{invoice.numero}</span>
        </p>
      </div>

      <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Montant du paiement</label>
              <div className="relative group">
                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors size-5" />
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 h-16 rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Date du paiement</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors size-5" />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 h-16 rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Méthode de paiement</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'transfer', label: 'Virement', icon: <CreditCard className="size-5" /> },
                { id: 'cash', label: 'Espèces', icon: <Euro className="size-5" /> },
                { id: 'check', label: 'Chèque', icon: <FileText className="size-5" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    method === m.id 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-background-dark/50 border-primary/10 text-slate-500 hover:border-primary/30'
                  }`}
                >
                  {m.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Référence / Note</label>
            <textarea 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Virement reçu le 12/03..."
              className="w-full p-4 min-h-[100px] rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold placeholder:text-slate-700 resize-none"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full h-16 bg-primary text-background-dark font-black text-sm tracking-[0.2em] uppercase rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              Enregistrer le paiement
              <ChevronRight className="size-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Invoice Summary Card */}
      <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User className="size-6" />
          </div>
          <div>
            <p className="text-white font-bold">{invoice.client?.nom || 'Client'}</p>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Client</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-xl">{(invoice.total_ttc || 0).toLocaleString('fr-FR')} DT</p>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Facturé</p>
        </div>
      </div>
    </div>
  );
};
