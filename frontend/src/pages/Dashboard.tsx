import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketOverview, ScreenerResult } from '../types';
import { marketApi, screenerApi } from '../api';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { DataTable, Column } from '../components/common/DataTable';
import { formatCurrency, getChangeColor, getScoreColor } from '../utils/formatters';
import {
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  ArrowRight,
  AlertOctagon,
  Calendar,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import {
  STOCK_EXIT_RADAR,
  DAILY_MAJOR_MARKET_EVENTS,
  getAllExitAlerts,
  getDailyMajorEvents
} from '../data/newsAndEventsData';

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

  const exitAlerts = getAllExitAlerts().slice(0, 4);
  const todayAndUpcomingEvents = getDailyMajorEvents().slice(0, 3);

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
            Live news tracking, automated opposite catalyst exit alerts, Piotroski health scores, multi-timeframe charts, and daily high-impact macro market calendar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/propicks-ai')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch ProPicks AI</span>
          </button>
          <button
            onClick={() => navigate('/ai-research')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            Ask WarrenAI Copilot
          </button>
        </div>
      </div>

      {/* TWO COLUMN WIDGET: LIVE NEWS EXIT RADAR & DAILY HIGH-IMPACT MACRO EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* WIDGET 1: PROPICKS NEWS & EXIT RADAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                🚨 Live News & Exit Radar (ProPicks)
              </h3>
            </div>
            <button
              onClick={() => navigate('/propicks-ai')}
              className="text-xs text-purple-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>View Full Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {exitAlerts.map((item) => (
              <div
                key={item.ticker}
                onClick={() => navigate('/propicks-ai')}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-xs">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.ticker})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.exit_reason}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    item.status === 'CAUTION_WATCH'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {item.status === 'CAUTION_WATCH' ? '⚠️ CAUTION' : '🟢 HOLD'}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">SL: ₹{item.stop_loss_price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 2: TODAY & UPCOMING MAJOR MARKET EVENTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                📅 Today & Major Market Triggers
              </h3>
            </div>
            <button
              onClick={() => navigate('/propicks-ai')}
              className="text-xs text-blue-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAndUpcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate('/propicks-ai')}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/30 p-3 rounded-xl space-y-1.5 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                      evt.day_label === 'TODAY'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                    }`}>
                      {evt.day_label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{evt.timing}</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-rose-400" />
                    <span>{evt.impact}</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{evt.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{evt.summary}</p>
              </div>
            ))}
          </div>
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
