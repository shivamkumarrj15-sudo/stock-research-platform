import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketOverview, ScreenerResult } from '../types';
import { marketApi, screenerApi } from '../api';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { DataTable, Column } from '../components/common/DataTable';
import { formatCurrency, getChangeColor, getScoreColor } from '../utils/formatters';
import { TrendingUp, Award, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [topQuality, setTopQuality] = useState<ScreenerResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    marketApi.getOverview().then(setOverview).catch(() => {});
    screenerApi.getRanking('top-quality').then(setTopQuality).catch(() => {});
  }, []);

  const qualityColumns: Column<ScreenerResult>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.name}</span> },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price, 'INR') },
    { key: 'change_pct', header: 'Change', align: 'right', render: (row) => <span className={getChangeColor(row.change_pct)}>{row.change_pct}%</span> },
    { key: 'overall_score', header: 'Score', align: 'center', render: (row) => <span className={`font-black ${getScoreColor(row.overall_score)}`}>{row.overall_score}</span> },
    { key: 'roic', header: 'ROIC %', align: 'right', render: (row) => row.roic ? `${row.roic}%` : '—' },
  ];

  return (
    <div className="space-y-6">
      <DemoDataBanner />

      {/* Indices Bar */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {overview.indices.map((idx) => (
            <div key={idx.ticker} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{idx.name}</span>
              <div className="text-base font-extrabold text-slate-100 mt-1">{idx.value.toLocaleString()}</div>
              <span className={`text-xs font-bold mt-0.5 ${getChangeColor(idx.change_pct)}`}>
                {idx.change_pct > 0 ? '+' : ''}{idx.change_pct}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hero Quick Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Stock Research Terminal v1.0</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100">Find & Analyze High-Quality Stocks with AI</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Evaluate fundamentals, valuation multiples, Piotroski health scores, technical trends, and macroeconomic risk factors in seconds.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/screener')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
          >
            <span>Launch Screener</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/ai-research')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Top Quality Ranked Candidates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">Top Quality Ranked Candidates</h3>
          </div>
          <button onClick={() => navigate('/screener')} className="text-xs text-blue-400 hover:underline font-semibold">
            View All in Screener →
          </button>
        </div>
        <DataTable
          columns={qualityColumns}
          data={topQuality}
          onRowClick={(row) => navigate(`/stocks/${row.ticker}`)}
        />
      </div>
    </div>
  );
};
