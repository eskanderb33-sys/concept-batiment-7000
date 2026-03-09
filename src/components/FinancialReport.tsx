import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { MOCK_FINANCIAL_DATA } from '../constants';

export const FinancialReport: React.FC = () => {
  const totalRevenue = MOCK_FINANCIAL_DATA.reduce((acc, d) => acc + d.revenue, 0);
  const totalExpenses = MOCK_FINANCIAL_DATA.reduce((acc, d) => acc + d.expenses, 0);
  const totalProfit = MOCK_FINANCIAL_DATA.reduce((acc, d) => acc + d.profit, 0);
  const avgProfitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Revenu Total</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()} DT</p>
          <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% vs semestre précédent
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Dépenses Totales</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalExpenses.toLocaleString()} DT</p>
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.2% vs semestre précédent
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Bénéfice Net</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalProfit.toLocaleString()} DT</p>
          <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +15.3% vs semestre précédent
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-zinc-400 font-medium">Marge Moyenne</h3>
          </div>
          <p className="text-3xl font-bold text-white">{avgProfitMargin.toFixed(1)}%</p>
          <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2.1% vs semestre précédent
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Revenus vs Dépenses</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FINANCIAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenu" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Évolution du Profit</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_FINANCIAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">Détails Mensuels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Mois</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Revenu</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Dépenses</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Marge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {MOCK_FINANCIAL_DATA.map((data) => (
                <tr key={data.month} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{data.month}</td>
                  <td className="px-6 py-4 text-zinc-300">{data.revenue.toLocaleString()} DT</td>
                  <td className="px-6 py-4 text-zinc-300">{data.expenses.toLocaleString()} DT</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-500">+{data.profit.toLocaleString()} DT</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-md">
                      {((data.profit / data.revenue) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
