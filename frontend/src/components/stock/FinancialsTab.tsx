import React from 'react';
import { FundamentalChart } from '../charts/FundamentalChart';

interface FinancialsTabProps {
  ticker: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ ticker }) => {
  const chartData = [
    { year: '2020', revenue: 160000, netIncome: 32000, fcf: 28000 },
    { year: '2021', revenue: 180000, netIncome: 36000, fcf: 31000 },
    { year: '2022', revenue: 200000, netIncome: 40000, fcf: 35000 },
    { year: '2023', revenue: 225000, netIncome: 43000, fcf: 38000 },
    { year: '2024', revenue: 240000, netIncome: 46000, fcf: 42000 },
  ];

  return (
    <div className="space-y-6">
      <FundamentalChart data={chartData} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Historical Income Statement (Cr / Millions)</h3>
        <table className="w-full text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2 text-left">Metric</th>
              <th className="py-2 text-right">FY 2020</th>
              <th className="py-2 text-right">FY 2021</th>
              <th className="py-2 text-right">FY 2022</th>
              <th className="py-2 text-right">FY 2023</th>
              <th className="py-2 text-right">FY 2024</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <tr>
              <td className="py-2 font-bold text-slate-100">Revenue</td>
              <td className="py-2 text-right">160,000</td>
              <td className="py-2 text-right">180,000</td>
              <td className="py-2 text-right">200,000</td>
              <td className="py-2 text-right">225,000</td>
              <td className="py-2 text-right font-bold text-blue-400">240,000</td>
            </tr>
            <tr>
              <td className="py-2">Gross Profit</td>
              <td className="py-2 text-right">61,600</td>
              <td className="py-2 text-right">69,300</td>
              <td className="py-2 text-right">77,000</td>
              <td className="py-2 text-right">86,625</td>
              <td className="py-2 text-right">92,400</td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-slate-100">Operating Income (EBIT)</td>
              <td className="py-2 text-right">40,000</td>
              <td className="py-2 text-right">45,000</td>
              <td className="py-2 text-right">50,000</td>
              <td className="py-2 text-right">56,250</td>
              <td className="py-2 text-right font-bold text-slate-100">60,000</td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-emerald-400">Net Income</td>
              <td className="py-2 text-right">32,000</td>
              <td className="py-2 text-right">36,000</td>
              <td className="py-2 text-right">40,000</td>
              <td className="py-2 text-right">43,000</td>
              <td className="py-2 text-right font-bold text-emerald-400">46,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
