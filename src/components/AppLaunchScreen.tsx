import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Construction } from 'lucide-react';

interface AppLaunchScreenProps {
  onComplete: () => void;
}

export const AppLaunchScreen: React.FC<AppLaunchScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/20 rotate-12">
          <Construction className="w-16 h-16 text-zinc-950 -rotate-12" />
        </div>
        
        {/* Animated rings */}
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-amber-500 rounded-3xl"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
          CONCEPT <span className="text-amber-500">7000</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
          Architecture & Management
        </p>
      </motion.div>

      <div className="absolute bottom-12 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-1/2 h-full bg-amber-500"
        />
      </div>
    </div>
  );
};
