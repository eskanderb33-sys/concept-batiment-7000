import React, { useState } from 'react';
import { Search, Plus, Package, AlertTriangle, ArrowUpRight, History, Filter, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_STOCK } from '../constants';

export const StockManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStock = MOCK_STOCK.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Total Articles</h3>
          </div>
          <p className="text-3xl font-bold text-white">{MOCK_STOCK.length}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Alertes Stock Bas</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {MOCK_STOCK.filter(item => item.quantity <= item.minQuantity).length}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Dernier Mouvement</h3>
          </div>
          <p className="text-3xl font-bold text-white">Aujourd'hui</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'inventaire..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-xl hover:bg-amber-400 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter Article
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider text-center">Quantité</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Dernier Réappro.</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredStock.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="font-medium text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${item.quantity <= item.minQuantity ? 'text-red-500' : 'text-white'}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.minQuantity ? (
                      <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                        <AlertTriangle className="w-4 h-4" />
                        Stock Bas
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                        <ArrowUpRight className="w-4 h-4" />
                        Optimal
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {item.lastRestock || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
