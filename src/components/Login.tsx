import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
  onSwitchToClient: () => void;
}

const ADMIN_EMAIL = 'eskanderb33@gmail.com';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToClient }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Brute force protection state
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const storedLockout = localStorage.getItem('admin_lockout_until');
    const storedAttempts = localStorage.getItem('admin_login_attempts');
    
    if (storedLockout) {
      const until = parseInt(storedLockout, 10);
      if (until > Date.now()) {
        setLockoutUntil(until);
      } else {
        localStorage.removeItem('admin_lockout_until');
        localStorage.removeItem('admin_login_attempts');
      }
    }
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutUntil) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          setLockoutUntil(null);
          setAttempts(0);
          localStorage.removeItem('admin_lockout_until');
          localStorage.removeItem('admin_login_attempts');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutUntil && lockoutUntil > Date.now()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Brute force check
      if (attempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_TIME;
        setLockoutUntil(until);
        localStorage.setItem('admin_lockout_until', until.toString());
        throw new Error('Trop de tentatives. Réessayez dans 15 minutes.');
      }

      // 2. Strict Email Check (Pre-auth)
      if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        // Delay to prevent timing attacks
        await new Promise(resolve => setTimeout(resolve, 3000));
        throw new Error('Accès refusé. Identifiants incorrects.');
      }

      // 3. Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Increment attempts
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('admin_login_attempts', newAttempts.toString());
        
        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_TIME;
          setLockoutUntil(until);
          localStorage.setItem('admin_lockout_until', until.toString());
        }

        // Delay to prevent brute force
        await new Promise(resolve => setTimeout(resolve, 3000));
        throw new Error('Accès refusé. Identifiants incorrects.');
      }

      // 4. Post-auth Email Verification (Double check)
      if (data.user?.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 3000));
        throw new Error('Accès refusé. Identifiants incorrects.');
      }

      // Success
      setAttempts(0);
      localStorage.removeItem('admin_login_attempts');
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] flex flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="size-20 bg-surface-dark border-2 border-primary rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-primary/20 group hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="size-10 text-primary -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-primary text-xs font-black tracking-[0.4em] uppercase">Concept Bâtiment 7000</h2>
            <h1 className="text-white text-5xl font-black tracking-tighter">Administration</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Accès sécurisé au panneau de contrôle</p>
          </div>
        </div>

        <form 
          className="flex flex-col gap-6 bg-surface-dark/40 p-10 rounded-3xl border border-primary/10 backdrop-blur-xl shadow-2xl"
          onSubmit={handleSubmit}
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold"
              >
                <AlertCircle className="size-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
            {lockoutUntil && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3 text-amber-500 text-xs font-bold"
              >
                <Clock className="size-4 shrink-0" />
                <p>Trop de tentatives. Réessayez dans {formatTime(timeLeft)}.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Adresse E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors size-5" />
              <input 
                className="w-full pl-12 pr-4 h-16 rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold placeholder:text-slate-700 disabled:opacity-50" 
                placeholder="admin@concept7000.fr" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!lockoutUntil}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Mot de passe</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors size-5" />
              <input 
                className="w-full pl-12 pr-12 h-16 rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold placeholder:text-slate-700 disabled:opacity-50" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!lockoutUntil}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                disabled={loading || !!lockoutUntil}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button 
            className="w-full h-16 bg-primary text-background-dark font-black text-sm tracking-[0.2em] uppercase rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
            disabled={loading || !!lockoutUntil}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Se connecter
                <ChevronRight className="size-5" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-primary/10">
            <button 
              type="button"
              onClick={onSwitchToClient}
              className="w-full text-[10px] text-primary hover:underline font-black uppercase tracking-[0.3em]"
            >
              Accéder à l'Espace Client
            </button>
          </div>
        </form>

        <div className="text-center space-y-6">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2024 Concept Bâtiment 7000. Tous droits réservés.
          </p>
          <div className="flex justify-center gap-8">
            <button className="text-[10px] text-slate-500 hover:text-primary font-black uppercase tracking-[0.2em] transition-colors">Assistance</button>
            <button className="text-[10px] text-slate-500 hover:text-primary font-black uppercase tracking-[0.2em] transition-colors">Confidentialité</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
