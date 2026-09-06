import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface FundamentalChartProps {
  data: Array<{ year: string | number; revenue: number; netIncome: number; fcf: number }>;
}

export const FundamentalChart: React.FC<FundamentalChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Trends (Cr / Millions)</h4>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="netIncome" name="Net Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="fcf" name="Free Cash Flow" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
