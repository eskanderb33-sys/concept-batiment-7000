import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Briefcase, MoreVertical, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Supplier } from '../types';
import { MOCK_SUPPLIERS } from '../constants';

interface SupplierListProps {
  onViewChange: (view: any) => void;
}

export const SupplierList: React.FC<SupplierListProps> = ({ onViewChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = MOCK_SUPPLIERS.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => onViewChange('supplier-add')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau Fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-amber-500" />
              </div>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
              {supplier.name}
            </h3>
            <p className="text-amber-500 text-sm font-medium mb-4">{supplier.specialty}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>{supplier.email}</span>
              </div>
              {supplier.address && (
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.address}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
              <button className="text-zinc-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
                Voir l'historique
                <ExternalLink className="w-4 h-4" />
              </button>
              <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    PRJ
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
