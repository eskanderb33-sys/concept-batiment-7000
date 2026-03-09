import React from 'react';
import { MessageCircle, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WhatsAppConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientName: string;
  documentType: string;
}

export const WhatsAppConfirmation: React.FC<WhatsAppConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipientName,
  documentType
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-white">Confirmer l'envoi WhatsApp</h3>
                <p className="text-zinc-400">
                  Vous êtes sur le point de partager un <span className="text-white font-bold">{documentType}</span> avec <span className="text-white font-bold">{recipientName}</span>.
                </p>
              </div>

              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4 mb-8">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                <p className="text-xs text-zinc-400">
                  L'application ouvrira WhatsApp Web ou l'application mobile avec un message pré-rempli contenant le lien du document.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-5 h-5" />
                  Confirmer et Ouvrir WhatsApp
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
