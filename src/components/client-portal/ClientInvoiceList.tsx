import React from 'react';
import { 
  Receipt, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const ClientInvoiceList: React.FC = () => {
  const invoices = [
    { id: '1', number: 'FAC-2024-015', date: '15 Mai 2024', dueDate: '15 Juin 2024', amount: '8.500', status: 'unpaid', description: 'Acompte Phase 2 - Gros Œuvre' },
    { id: '2', number: 'FAC-2024-010', date: '02 Mai 2024', dueDate: '02 Juin 2024', amount: '12.000', status: 'paid', description: 'Solde Phase 1 - Fondations' },
    { id: '3', number: 'FAC-2024-005', date: '10 Avr 2024', dueDate: '10 Mai 2024', amount: '5.500', status: 'partial', description: 'Études techniques & Plans' },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Mes Factures</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Suivez vos paiements et téléchargez vos justificatifs</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {invoices.map((invoice, idx) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-dark border border-primary/10 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "size-16 rounded-2xl flex items-center justify-center shrink-0",
                invoice.status === 'paid' ? "bg-emerald-500/10 text-emerald-500" :
                invoice.status === 'partial' ? "bg-amber-500/10 text-amber-500" :
                "bg-red-500/10 text-red-500"
              )}>
                <Receipt className="size-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white">{invoice.number}</h3>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    invoice.status === 'paid' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    invoice.status === 'partial' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {invoice.status === 'paid' ? 'Payée' : invoice.status === 'partial' ? 'Partiel' : 'Impayée'}
                  </span>
                </div>
                <p className="text-slate-400 font-bold text-sm">{invoice.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>Émise le {invoice.date}</span>
                  <span className="text-primary/40">•</span>
                  <span className={cn(invoice.status !== 'paid' && "text-amber-500")}>Échéance: {invoice.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:items-end gap-4">
              <p className="text-3xl font-black text-white tracking-tighter">{invoice.amount} <span className="text-sm font-bold opacity-60">DT</span></p>
              
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-primary/20 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                  <Download className="size-4" /> Facture PDF
                </button>
                
                {invoice.status !== 'paid' && (
                  <button className="flex items-center gap-2 px-6 py-2 bg-primary text-background-dark rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
                    <CreditCard className="size-4" /> Payer maintenant
                  </button>
                )}
                
                {invoice.status === 'paid' && (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest px-4">
                    <CheckCircle2 className="size-4" /> Reçu disponible
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
