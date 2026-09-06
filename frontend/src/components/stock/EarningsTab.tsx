import React, { useEffect, useState } from 'react';
import { EarningsRecord } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface EarningsTabProps {
  ticker: string;
}

export const EarningsTab: React.FC<EarningsTabProps> = ({ ticker }) => {
  const [records, setRecords] = useState<EarningsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getEarnings(ticker)
      .then((res) => setRecords(res))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quarterly Earnings Surprise & Revisions</h3>
      <table className="w-full text-xs text-slate-300">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold text-left">
            <th className="py-2.5 px-3">Date</th>
            <th className="py-2.5 px-3">Period</th>
            <th className="py-2.5 px-3 text-right">EPS Actual</th>
            <th className="py-2.5 px-3 text-right">EPS Estimate</th>
            <th className="py-2.5 px-3 text-right">EPS Surprise</th>
            <th className="py-2.5 px-3 text-center">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {records.map((r, i) => (
            <tr key={i}>
              <td className="py-2.5 px-3 font-semibold text-slate-100">{r.earnings_date}</td>
              <td className="py-2.5 px-3 text-slate-400">Q{r.fiscal_quarter} FY{r.fiscal_year}</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-100">{r.eps_actual ?? '—'}</td>
              <td className="py-2.5 px-3 text-right text-slate-400">{r.eps_estimate ?? '—'}</td>
              <td className={`py-2.5 px-3 text-right font-bold ${r.eps_surprise_pct && r.eps_surprise_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {r.eps_surprise_pct ? `${r.eps_surprise_pct > 0 ? '+' : ''}${r.eps_surprise_pct}%` : '—'}
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                  r.result === 'beat' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                  r.result === 'miss' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {r.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
