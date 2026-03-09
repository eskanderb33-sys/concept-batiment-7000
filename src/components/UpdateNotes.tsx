import React from 'react';
import { ArrowLeft, Sparkles, Calendar, ChevronRight, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_UPDATE_NOTES } from '../constants';

interface UpdateNotesProps {
  onBack: () => void;
}

export const UpdateNotes: React.FC<UpdateNotesProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Rocket className="w-4 h-4 text-amber-500" />
          <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">Version 2.1.0 Stable</span>
        </div>
      </div>

      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">Quoi de neuf ?</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Découvrez les dernières fonctionnalités et améliorations apportées à votre outil de gestion Concept 7000.
        </p>
      </div>

      <div className="space-y-8">
        {MOCK_UPDATE_NOTES.map((note, index) => (
          <motion.div
            key={note.version}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-white">v{note.version}</span>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {note.date}
                </div>
              </div>
              {index === 0 && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                  Actuel
                </span>
              )}
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                {note.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 group-hover:scale-150 transition-transform" />
                    <p className="text-zinc-300 group-hover:text-white transition-colors">{change}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl p-12 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Une suggestion ?</h3>
        <p className="text-zinc-500 mb-6">Nous améliorons constamment l'application grâce à vos retours.</p>
        <button className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors">
          Contacter le support
        </button>
      </div>
    </div>
  );
};
