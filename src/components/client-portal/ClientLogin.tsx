import React from 'react';
import { 
  Mail, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClientLoginProps {
  onLogin: () => void;
  onSwitchToAdmin: () => void;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({ onLogin, onSwitchToAdmin }) => {
  const [email, setEmail] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
      // Simulate magic link verification after a delay
      setTimeout(() => {
        onLogin();
      }, 2000);
    }
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
            <h1 className="text-white text-5xl font-black tracking-tighter">Espace Client</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Accès sécurisé par lien magique</p>
          </div>
        </div>

        <div className="bg-surface-dark/40 p-10 rounded-3xl border border-primary/10 backdrop-blur-xl shadow-2xl">
          {!isSent ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-white text-[10px] font-black uppercase tracking-[0.2em] ml-1">Votre Adresse E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors size-5" />
                  <input 
                    className="w-full pl-12 pr-4 h-16 rounded-2xl border border-primary/10 bg-background-dark/50 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold placeholder:text-slate-700" 
                    placeholder="votre@email.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                className="w-full h-16 bg-primary text-background-dark font-black text-sm tracking-[0.2em] uppercase rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2" 
                type="submit"
              >
                Recevoir le lien
                <ChevronRight className="size-5" />
              </button>

              <div className="pt-4 border-t border-primary/10">
                <button 
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="w-full text-[10px] text-primary hover:underline font-black uppercase tracking-[0.3em]"
                >
                  Accès Administration
                </button>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Send className="size-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-xl">Lien envoyé !</h3>
                <p className="text-slate-400 text-sm">
                  Nous avons envoyé un lien de connexion à <span className="text-primary font-bold">{email}</span>. 
                  Veuillez vérifier votre boîte de réception.
                </p>
              </div>
              <div className="pt-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Redirection automatique en cours...
                </p>
              </div>
            </motion.div>
          )}
        </div>

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
