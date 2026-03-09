import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { MOCK_PROFITABILITY } from '../constants';

export const ProfitabilityReport: React.FC = () => {
  const sortedData = [...MOCK_PROFITABILITY].sort((a, b) => b.marginPercentage - a.marginPercentage);

  return (
    <div className="space-y-8">
      {/* Overview Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Marge par Projet (%)</h3>
            <p className="text-zinc-400 text-sm">Comparaison de la rentabilité relative</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Target className="w-5 h-5 text-amber-500" />
            <span className="text-amber-500 font-bold">Objectif: 25%</span>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#71717a" domain={[0, 40]} unit="%" />
              <YAxis dataKey="projectName" type="category" stroke="#71717a" width={150} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}%`, 'Marge']}
              />
              <Bar dataKey="marginPercentage" radius={[0, 4, 4, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.marginPercentage >= 25 ? '#10b981' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROFITABILITY.map((project) => (
          <div key={project.projectId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-lg font-bold text-white line-clamp-1">{project.projectName}</h4>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                project.marginPercentage >= 25 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {project.marginPercentage}% Marge
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Chiffre d'Affaires</span>
                <span className="text-white font-medium">{project.revenue.toLocaleString()} DT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Coûts Totaux</span>
                <span className="text-white font-medium">{project.costs.toLocaleString()} DT</span>
              </div>
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400 font-medium">Bénéfice Brut</span>
                <span className="text-amber-500 font-bold text-lg">{project.margin.toLocaleString()} DT</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${project.marginPercentage >= 25 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${(project.marginPercentage / 40) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Performance</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Max 40%</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2 group">
              Analyse détaillée
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-emerald-500 font-bold mb-1">Top Performance</h4>
            <p className="text-zinc-400 text-sm">
              Le projet <span className="text-white font-medium">Appartement Gammarth</span> affiche la meilleure rentabilité ce mois-ci avec une marge de 29.1%.
            </p>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="text-amber-500 font-bold mb-1">Attention Requise</h4>
            <p className="text-zinc-400 text-sm">
              Le projet <span className="text-white font-medium">Bureaux Lac 2</span> est en dessous de l'objectif de 25%. Une revue des coûts de main d'œuvre est recommandée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
