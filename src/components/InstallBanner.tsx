import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 lg:bottom-8 lg:left-auto lg:right-8 lg:w-96 z-[100]"
        >
          <div className="bg-surface-dark border border-primary/20 rounded-2xl p-4 shadow-2xl shadow-primary/20 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-background-dark">
                <Download className="size-5" />
              </div>
              <div>
                <p className="text-white text-xs font-black uppercase tracking-widest">Installer l'application</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Accès rapide & Mode hors-ligne</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-primary text-background-dark rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Installer
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
