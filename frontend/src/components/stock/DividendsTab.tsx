import React, { useEffect, useState } from 'react';
import { DividendRecord } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatters';

interface DividendsTabProps {
  ticker: string;
}

export const DividendsTab: React.FC<DividendsTabProps> = ({ ticker }) => {
  const [records, setRecords] = useState<DividendRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getDividends(ticker)
      .then((res) => setRecords(res))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (records.length === 0) return <div className="text-xs text-slate-400">No dividend history recorded for {ticker}.</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Historical Dividend Distributions</h3>
      <table className="w-full text-xs text-slate-300">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold text-left">
            <th className="py-2.5 px-3">Ex-Date</th>
            <th className="py-2.5 px-3">Pay Date</th>
            <th className="py-2.5 px-3 text-right">Amount</th>
            <th className="py-2.5 px-3 text-right">Yield</th>
            <th className="py-2.5 px-3 text-right">Payout Ratio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {records.map((r, i) => (
            <tr key={i}>
              <td className="py-2.5 px-3 font-semibold text-slate-100">{r.ex_date}</td>
              <td className="py-2.5 px-3 text-slate-400">{r.pay_date}</td>
              <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatCurrency(r.amount, 'INR')}</td>
              <td className="py-2.5 px-3 text-right text-slate-200">{r.dividend_yield}%</td>
              <td className="py-2.5 px-3 text-right text-slate-400">{r.payout_ratio ? `${r.payout_ratio}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
