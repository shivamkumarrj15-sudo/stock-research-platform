import React, { useEffect, useState } from 'react';
import { Portfolio as PortfolioType } from '../types';
import { portfolioApi } from '../api';
import { DataTable, Column } from '../components/common/DataTable';
import { MetricCard } from '../components/common/MetricCard';
import { formatCurrency, formatPct, getChangeColor } from '../utils/formatters';
import { Briefcase, Bot, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Portfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<PortfolioType[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    portfolioApi.getAll().then((res) => {
      setPortfolios(res);
      if (res.length > 0) {
        portfolioApi.getAnalysis(res[0].id).then(setAnalysis).catch(() => {});
      }
    });
  }, []);

  const p = portfolios[0];

  const columns: Column<any>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.stock.ticker}</span> },
    { key: 'quantity', header: 'Qty', align: 'right', render: (row) => row.quantity },
    { key: 'buy_price', header: 'Buy Price', align: 'right', render: (row) => formatCurrency(row.buy_price, 'INR') },
    { key: 'current_price', header: 'Current', align: 'right', render: (row) => formatCurrency(row.current_price, 'INR') },
    { key: 'current_value', header: 'Current Value', align: 'right', render: (row) => formatCurrency(row.current_value, 'INR') },
    { key: 'pnl', header: 'P&L', align: 'right', render: (row) => <span className={getChangeColor(row.pnl)}>{formatCurrency(row.pnl, 'INR')} ({formatPct(row.pnl_pct)})</span> },
    { key: 'weight_pct', header: 'Weight %', align: 'right', render: (row) => `${row.weight_pct}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <span>Portfolio Research Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track P&L, sector concentration, and automated AI portfolio risk analysis.</p>
        </div>
      </div>

      {p && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Total Invested" value={formatCurrency(p.total_invested, p.currency)} />
          <MetricCard label="Current Value" value={formatCurrency(p.total_current_value, p.currency)} />
          <MetricCard
            label="Total P&L"
            value={formatCurrency(p.total_pnl, p.currency)}
            subValue={formatPct(p.total_pnl_pct)}
            subValueColor={getChangeColor(p.total_pnl)}
          />
          <MetricCard label="Holdings" value={p.positions.length} />
        </div>
      )}

      {p && (
        <DataTable
          columns={columns}
          data={p.positions}
          onRowClick={(row) => navigate(`/stocks/${row.stock.ticker}`)}
        />
      )}

      {/* AI Portfolio Risk Analysis */}
      {analysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI Portfolio Risk & Concentration Audit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 block flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Top Portfolio Risks
              </span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {analysis.top_risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block">AI Optimization Recommendations</span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {analysis.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
