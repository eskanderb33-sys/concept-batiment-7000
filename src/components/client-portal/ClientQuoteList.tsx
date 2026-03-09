import React from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronRight,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const ClientQuoteList: React.FC = () => {
  const quotes = [
    { id: '1', number: 'DEV-2024-042', date: '24 Mai 2024', amount: '12.500', status: 'pending', description: 'Extension Terrasse & Pergola' },
    { id: '2', number: 'DEV-2024-038', date: '10 Mai 2024', amount: '4.200', status: 'accepted', description: 'Rénovation Éclairage Jardin' },
    { id: '3', number: 'DEV-2024-035', date: '28 Avr 2024', amount: '8.900', status: 'rejected', description: 'Piscine à débordement' },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full p-4 lg:p-8 space-y-8 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Mes Devis</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Consultez, validez ou refusez vos propositions commerciales</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {quotes.map((quote, idx) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-dark border border-primary/10 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "size-16 rounded-2xl flex items-center justify-center shrink-0",
                quote.status === 'accepted' ? "bg-emerald-500/10 text-emerald-500" :
                quote.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                "bg-amber-500/10 text-amber-500"
              )}>
                <FileText className="size-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white">{quote.number}</h3>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    quote.status === 'accepted' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    quote.status === 'rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {quote.status === 'accepted' ? 'Accepté' : quote.status === 'rejected' ? 'Refusé' : 'En attente'}
                  </span>
                </div>
                <p className="text-slate-400 font-bold text-sm">{quote.description}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Émis le {quote.date}</p>
              </div>
            </div>

            <div className="flex flex-col lg:items-end gap-4">
              <p className="text-3xl font-black text-primary tracking-tighter">{quote.amount} <span className="text-sm font-bold opacity-60">DT</span></p>
              
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-primary/20 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                  <Download className="size-4" /> PDF
                </button>
                
                {quote.status === 'pending' && (
                  <>
                    <button className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-background-dark rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95">
                      <CheckCircle2 className="size-4" /> Accepter
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95">
                      <XCircle className="size-4" /> Refuser
                    </button>
                  </>
                )}
                
                {quote.status !== 'pending' && (
                  <button className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                    <Eye className="size-4" /> Détails
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
