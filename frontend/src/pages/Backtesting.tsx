import React, { useState } from 'react';
import { backtestApi } from '../api';
import { BacktestResult } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { formatCurrency, formatPct, getChangeColor } from '../utils/formatters';
import { History, Play, AlertCircle } from 'lucide-react';

export const BacktestingPage: React.FC = () => {
  const [universe, setUniverse] = useState('NIFTY50');
  const [strategyName, setStrategyName] = useState('Quality Compounders Backtest');
  const [initialCapital, setInitialCapital] = useState(100000);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBacktest = () => {
    setLoading(true);
    backtestApi.run({ universe, strategy_name: strategyName, initial_capital: initialCapital })
      .then((res) => setResult(res))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-500" />
          <span>Quantitative Backtesting Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Test custom fundamental and technical screening rules against historical price data.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Backtest Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Strategy Name</label>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Universe</label>
            <select
              value={universe}
              onChange={(e) => setUniverse(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="NIFTY50">NIFTY 50 (India)</option>
              <option value="NIFTY100">NIFTY 100 (India)</option>
              <option value="SP500">S&P 500 (US)</option>
              <option value="NASDAQ100">NASDAQ 100 (US)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Initial Capital</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full bg-slate-950/80 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{loading ? 'Simulating Trades...' : 'Run Historical Backtest'}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard label="Initial Capital" value={formatCurrency(result.initial_capital, 'INR')} />
            <MetricCard label="Final Capital" value={formatCurrency(result.final_capital, 'INR')} />
            <MetricCard label="Total Return" value={formatPct(result.total_return_pct)} subValueColor={getChangeColor(result.total_return_pct)} />
            <MetricCard label="Sharpe Ratio" value={result.sharpe_ratio} subValue="Risk-Adjusted" />
            <MetricCard label="Max Drawdown" value={`${result.max_drawdown_pct}%`} subValueColor="text-rose-400" />
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{result.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
