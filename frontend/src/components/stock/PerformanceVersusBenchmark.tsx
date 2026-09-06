import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Info,
  DollarSign,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  BarChart2,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import {
  getStockPerformance,
  StockPerformanceProfile,
  PerformanceDataPoint,
  INSG20_STRATEGY_PERFORMANCE
} from '../../data/backtestPerformanceData';
import { InvestingProPortfolioTable } from './InvestingProPortfolioTable';

interface Props {
  selectedTicker?: string;
  onSelectStock?: (ticker: string) => void;
}

export const PerformanceVersusBenchmark: React.FC<Props> = ({
  selectedTicker = 'INSG20',
  onSelectStock,
}) => {
  const [currentTicker, setCurrentTicker] = useState<string>(selectedTicker);
  const [timeframe, setTimeframe] = useState<'1Y' | '5Y' | 'Max'>('Max');
  const [simulatedAmount, setSimulatedAmount] = useState<number>(10000);
  const [unitMode, setUnitMode] = useState<'pct' | 'currency'>('pct');
  const [showTooltipInfo, setShowTooltipInfo] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'overview' | 'portfolio' | 'about'>('overview');

  // Load performance profile for selected ticker (or INSG20)
  const profile: StockPerformanceProfile = getStockPerformance(currentTicker);
  const tfData = profile.timeframes[timeframe];

  // Recalculate chart data points based on simulated investment amount
  const chartData = tfData.data.map((p) => ({
    ...p,
    strategy_val_sim: Math.round(simulatedAmount * (1 + p.strategy_return_pct / 100)),
    benchmark_val_sim: Math.round(simulatedAmount * (1 + p.benchmark_return_pct / 100)),
  }));

  const isINSG20 = currentTicker === 'INSG20';

  const stockList = [
    { ticker: 'ANDHRSUGAR', name: 'Andhra Sugars Ltd', bse: '500008', pe: 12.9 },
    { ticker: 'CONFIPET', name: 'Confidence Petroleum India', bse: '526829', pe: 17.9 },
    { ticker: 'BEPL', name: 'Bhansali Eng Polymers', bse: '500052', pe: 15.6 },
    { ticker: 'JAMNAAUTO', name: 'Jamna Auto', bse: '500216', pe: 20.3 },
    { ticker: 'BCLIND', name: 'BCL Ind & Infrastructure', bse: '524332', pe: 9.6 },
    { ticker: 'GUJALKALI', name: 'Gujarat Alkalies & Chemicals', bse: '530001', pe: 80.0 },
    { ticker: 'ZUARI', name: 'Zuari Agro Chemicals', bse: '534742', pe: 1.0 },
    { ticker: 'COALINDIA', name: 'Coal India Ltd', bse: '533278', pe: 8.4 },
    { ticker: 'BPCL', name: 'Bharat Petroleum Corp', bse: '500547', pe: 11.2 },
    { ticker: 'RECLTD', name: 'REC Limited', bse: '532955', pe: 5.2 },
    { ticker: 'TATAMOTORS', name: 'Tata Motors Limited', bse: '500570', pe: 14.8 },
  ];

  const handleStockClick = (t: string) => {
    setCurrentTicker(t);
    if (onSelectStock) onSelectStock(t);
  };

  return (
    <div className="space-y-6">
      {/* Top Pro Promotional Alert Banner (as in screenshot) */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-slate-200 shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            ⚡ Trading earnings & breakout reports? Check real-time exit/entry signals on ProPicks live feed.
          </span>
        </div>
        <button
          onClick={() => setCurrentTicker('INSG20')}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[11px] transition-colors"
        >
          View INSG20 Basket
        </button>
      </div>

      {/* Sub Navigation Tabs (Overview / Portfolio / About) as in InvestingPro */}
      <div className="flex items-center space-x-6 border-b border-slate-800 text-sm font-bold">
        <button
          onClick={() => setSubTab('overview')}
          className={`pb-3 transition-all relative ${
            subTab === 'overview'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSubTab('portfolio')}
          className={`pb-3 transition-all relative ${
            subTab === 'portfolio'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setSubTab('about')}
          className={`pb-3 transition-all relative ${
            subTab === 'about'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          About Strategy
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW (EXACT SCREENSHOT LAYOUT) */}
      {subTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Column (3 Cols) */}
          <div className="lg:col-span-3 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            {/* Header Area */}
            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-black text-slate-100">
                    Performance Versus Benchmark
                  </h2>
                  <span className="text-xs text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    <span>{profile.name}</span>
                  </span>
                </div>

                {/* Stock Selector Pill if user viewing specific stock */}
                {!isINSG20 && (
                  <button
                    onClick={() => setCurrentTicker('INSG20')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-bold border border-slate-700 transition-colors"
                  >
                    ← Back to INSG20 Strategy
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                This historical backtest of{' '}
                <strong className="text-slate-200">{profile.name}</strong> shows how the
                strategy's stock selections would have performed over time. Our AI stock rating
                system is powered by a predictive model trained on over 50 financial signals to
                identify stocks most likely to outperform the market.
              </p>
            </div>

            {/* Controls Bar: Timeframe Buttons (1Y, 5Y, Max) + Simulated Capital Input + % / ₹ Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              {/* Timeframe Buttons */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['1Y', '5Y', 'Max'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Simulation on [ 10000 ] + % / ₹ Toggle */}
              <div className="flex items-center space-x-2.5">
                <span className="text-xs text-slate-400 font-semibold">Simulated on</span>
                <div className="relative">
                  <input
                    type="number"
                    value={simulatedAmount}
                    onChange={(e) => setSimulatedAmount(Math.max(100, Number(e.target.value)))}
                    className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* % vs ₹ toggle buttons */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setUnitMode('pct')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      unitMode === 'pct'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setUnitMode('currency')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      unitMode === 'currency'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ₹
                  </button>
                </div>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center space-x-6 text-xs font-bold pt-1">
              <div className="flex items-center space-x-2 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>
                  {profile.ticker}{' '}
                  <strong className="text-rose-400">
                    {tfData.total_return_pct >= 0 ? '+' : ''}
                    {tfData.total_return_pct.toLocaleString()}%
                  </strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>
                  NIFTY Smallcap 100{' '}
                  <strong className="text-slate-300">
                    +{tfData.benchmark_return_pct.toLocaleString()}%
                  </strong>
                </span>
              </div>
            </div>

            {/* Main Interactive Chart (Exact Crimson/Red Gradient vs Grey Benchmark Line) */}
            <div className="h-[320px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="strategyRedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    orientation="right"
                    tickFormatter={(v) =>
                      unitMode === 'pct' ? `${v.toLocaleString()}%` : `₹${v.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: string) => {
                      if (unitMode === 'currency') {
                        return [`₹${Number(val).toLocaleString()}`, name === 'strategy_val_sim' ? profile.name : 'NIFTY Smallcap 100'];
                      }
                      return [`+${Number(val).toLocaleString()}%`, name === 'strategy_return_pct' ? profile.name : 'NIFTY Smallcap 100'];
                    }}
                  />
                  {/* Benchmark Grey Line */}
                  <Area
                    type="monotone"
                    dataKey={unitMode === 'pct' ? 'benchmark_return_pct' : 'benchmark_val_sim'}
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fillOpacity={0}
                    name="NIFTY Smallcap 100"
                  />
                  {/* Strategy / Stock Red Line with Area Gradient */}
                  <Area
                    type="monotone"
                    dataKey={unitMode === 'pct' ? 'strategy_return_pct' : 'strategy_val_sim'}
                    stroke="#f43f5e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#strategyRedGrad)"
                    name={profile.name}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Year-by-Year Return Mini Bars at bottom (as in screenshot) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-2">
                {profile.yearly_bars.map((bar) => (
                  <div key={bar.year} className="flex flex-col items-center space-y-1">
                    <div className="h-6 w-3 bg-slate-800 rounded-sm overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full bg-rose-500 rounded-sm"
                        style={{ height: `${Math.min(100, Math.max(10, bar.strategy_pct / 1.5))}%` }}
                      />
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{bar.year}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-6 w-3 bg-slate-800 rounded-sm overflow-hidden flex flex-col justify-end">
                    <div className="w-full bg-rose-500 rounded-sm h-full" />
                  </div>
                  <span className="text-amber-400 font-mono text-[10px] font-bold">Today</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-500 pt-1">Past returns do not guarantee future results.</p>

            {/* THE 5 KPI METRIC CARDS (Exact Match to Screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {/* Card 1: Total Return */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Return ({timeframe === 'Max' ? '7Y' : timeframe})
                </span>
                <div className="text-xl font-black text-emerald-400 mt-2">
                  +{tfData.total_return_pct.toLocaleString()}%
                </div>
              </div>

              {/* Card 2: Outperformance */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Outperformance over NIFTY Smallcap 100
                </span>
                <div className="text-xl font-black text-emerald-400 mt-2">
                  +{tfData.outperformance_pct.toLocaleString()}%
                </div>
              </div>

              {/* Card 3: Annualized Return (CAGR) with Highlight Red Box & Tooltip Popup */}
              <div className="bg-slate-950 p-4 rounded-xl border-2 border-rose-500/80 shadow-lg shadow-rose-950/30 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Annualized Return
                  </span>
                  <HelpCircle
                    onMouseEnter={() => setShowTooltipInfo(true)}
                    onMouseLeave={() => setShowTooltipInfo(false)}
                    className="w-3.5 h-3.5 text-rose-400 cursor-pointer shrink-0"
                  />
                </div>

                <div className="text-xl font-black text-emerald-400 mt-2">
                  +{tfData.cagr_pct.toFixed(1)}%
                </div>

                {/* Tooltip Hover Box matching screenshot */}
                {showTooltipInfo && (
                  <div className="absolute -top-16 left-0 right-0 bg-blue-600 text-white p-2.5 rounded-lg text-[10px] leading-tight shadow-xl z-50">
                    Represents the portfolio's average annualized return, given as a percentage. It illustrates yearly performance irrespective of the total backtest duration.
                  </div>
                )}
              </div>

              {/* Card 4: Sharpe Ratio */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sharpe Ratio
                </span>
                <div className="text-xl font-black text-slate-100 mt-2">
                  {tfData.sharpe_ratio}
                </div>
              </div>

              {/* Card 5: Risk */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Risk
                </span>
                <div className="text-xl font-black text-emerald-400 mt-2">
                  {tfData.risk}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Current Stocks in INSG20 Sidebar (Exact match to screenshot) */}
          <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                  Current Stocks in INSG20
                </h3>
              </div>

              {/* Mini Table: Name & P/E Ratio */}
              <div className="divide-y divide-slate-800">
                <div className="flex items-center justify-between py-2 text-[10px] font-bold text-slate-500 uppercase">
                  <span>Name</span>
                  <span>P/E Ratio</span>
                </div>

                {stockList.map((stk) => {
                  const isSelected = currentTicker === stk.ticker;
                  return (
                    <div
                      key={stk.ticker}
                      onClick={() => handleStockClick(stk.ticker)}
                      className={`flex items-center justify-between py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <BarChart2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-100 block truncate">
                            {stk.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {stk.ticker} • {stk.bse}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-200 shrink-0">
                        {stk.pe.toFixed(1)}x
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => setCurrentTicker('INSG20')}
                className="text-xs text-blue-400 hover:underline font-bold"
              >
                View All Strategy Holdings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PORTFOLIO HOLDINGS & METRICS */}
      {subTab === 'portfolio' && (
        <InvestingProPortfolioTable
          onSelectStockForReturn={(t) => {
            setCurrentTicker(t);
            setSubTab('overview');
          }}
          onSelectStockForProReport={(t) => {
            if (onSelectStock) onSelectStock(t);
          }}
        />
      )}

      {/* SUB-TAB 3: ABOUT THE STRATEGY & AI SIGNALS */}
      {subTab === 'about' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="space-y-2 border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-100">
              About Bharat Small Cap & Momentum Gems (INSG20)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              INSG20 is an autonomous, quantitative AI model engineered to discover high-conviction, undervalued small and mid-cap Indian compounders before institutional discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-400 block">50+ Financial Signals</span>
              <p className="text-slate-400 leading-relaxed">
                Combines Piotroski F-Score, Altman Z-Score, Free Cash Flow Yield, ROIC, and Debt-to-Equity thresholds to eliminate manipulation risk.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-400 block">Monthly Rebalancing</span>
              <p className="text-slate-400 leading-relaxed">
                Re-allocates weight every month on the 1st, trimming winners near fair value and adding fresh turnaround candidates.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-purple-400 block">Alpha Generation</span>
              <p className="text-slate-400 leading-relaxed">
                Delivers +52.8% Annualized CAGR over a 7-year backtested period with a Sharpe Ratio of 1.66.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
