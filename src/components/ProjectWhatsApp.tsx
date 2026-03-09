import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  User, 
  Construction,
  CheckCircle2
} from 'lucide-react';
import { Project } from '../types';
import { WhatsAppConfirmation } from './WhatsAppConfirmation';

interface ProjectWhatsAppProps {
  project: Project;
  onBack: () => void;
}

export const ProjectWhatsApp: React.FC<ProjectWhatsAppProps> = ({ project, onBack }) => {
  const [message, setMessage] = useState(`Bonjour ${project.clientName},\n\nVoici une mise à jour pour votre projet "${project.name}" (${project.reference}).\n\nProgression actuelle : ${project.progression}%\nStatut : En cours d'exécution.\n\nNous avançons comme prévu sur les étapes de gros œuvre.\n\nCordialement,\nL'équipe Concept Bâtiment 7000`);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSend = () => {
    setShowConfirmation(true);
  };

  const confirmSend = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <WhatsAppConfirmation 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSend}
        recipientName={project.clientName}
        documentType="Mise à jour de projet"
      />
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" />
          Retour
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Partage WhatsApp</h2>
      </div>

      <div className="bg-surface-dark/40 border border-primary/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
        <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
          <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <p className="text-white font-bold">Partager avec {project.clientName}</p>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Mise à jour du projet</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message à envoyer</label>
          <textarea 
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-6 bg-background-dark border border-primary/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none leading-relaxed"
          />
        </div>

        <button 
          onClick={handleSend}
          className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-emerald-500/20"
        >
          <Send className="size-6" />
          Envoyer via WhatsApp
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
        <Construction className="size-5 text-primary shrink-0" />
        <p className="text-xs text-slate-400 font-medium">
          Le message inclut automatiquement les détails de progression du projet pour tenir le client informé en un clic.
        </p>
      </div>
    </div>
  );
};
