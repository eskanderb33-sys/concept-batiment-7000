import React, { useState } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, Briefcase, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface SupplierAddProps {
  onBack: () => void;
}

export const SupplierAdd: React.FC<SupplierAddProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    address: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Supplier added:', formData);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la liste
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-2xl font-bold text-white">Nouveau Fournisseur</h2>
          <p className="text-zinc-400">Ajoutez un nouveau partenaire à votre réseau</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom de l'entreprise / Contact
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="Ex: BatiPro S.A."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Spécialité
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                <option value="">Sélectionner une spécialité</option>
                <option value="Gros Œuvre">Gros Œuvre</option>
                <option value="Second Œuvre">Second Œuvre</option>
                <option value="Électricité">Électricité</option>
                <option value="Plomberie">Plomberie</option>
                <option value="Finition & Déco">Finition & Déco</option>
                <option value="Matériaux">Matériaux</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </label>
              <input
                required
                type="tel"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="+216 -- --- ---"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="contact@entreprise.tn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="Adresse complète"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-zinc-400">Notes & Observations</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                placeholder="Informations complémentaires..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Save className="w-5 h-5" />
              Enregistrer le fournisseur
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
