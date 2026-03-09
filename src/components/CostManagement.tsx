import React, { useState } from 'react';
import { Search, Plus, DollarSign, PieChart, TrendingUp, Calendar, Filter, Download, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_COSTS, MOCK_PROJECTS } from '../constants';

export const CostManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalCosts = MOCK_COSTS.reduce((acc, cost) => acc + cost.amount, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'materials': return 'text-blue-500 bg-blue-500/10';
      case 'labor': return 'text-amber-500 bg-amber-500/10';
      case 'equipment': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'materials': return 'Matériaux';
      case 'labor': return 'Main d\'œuvre';
      case 'equipment': return 'Équipement';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Total Dépenses</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalCosts.toLocaleString()} DT</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Matériaux</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {MOCK_COSTS.filter(c => c.category === 'materials').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} DT
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Main d'œuvre</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {MOCK_COSTS.filter(c => c.category === 'labor').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} DT
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Projets Actifs</h3>
          </div>
          <p className="text-3xl font-bold text-white">{MOCK_PROJECTS.length}</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher une dépense..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-xl hover:bg-amber-400 transition-colors">
              <Plus className="w-5 h-5" />
              Nouvelle Dépense
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Projet</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {MOCK_COSTS.map((cost, index) => (
                <motion.tr
                  key={cost.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {cost.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{cost.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-400 text-sm">{cost.projectName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(cost.category)}`}>
                      {getCategoryLabel(cost.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-white">{cost.amount.toLocaleString()} DT</span>
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
