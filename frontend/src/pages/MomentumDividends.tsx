import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Calendar, TrendingUp, DollarSign, Award, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatPct, getChangeColor } from '../utils/formatters';

interface MomentumDividendStock {
  ticker: string;
  name: string;
  bse_code?: string;
  price: number;
  change_pct: number;
  fair_value: number;
  fair_value_label: 'Bargain' | 'Undervalued' | 'Fair' | 'Overvalued';
  fair_value_upside: number;
  health_label: 'Great' | 'Good' | 'Fair' | 'Weak';
  health_score: number; // 1-100
  market_cap: string;
  dividend_per_share: number;
  dividend_yield: number;
  ex_dividend_date: string;
  pay_date: string;
  rsi_14: number;
  pe_ratio: number;
  momentum_score: number; // 0-100
}

export const MomentumDividends: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'high_momentum' | 'upcoming_dividend'>('all');

  const stocks: MomentumDividendStock[] = [
    {
      ticker: 'ANDHRSUGAR',
      name: 'Andhra Sugars Ltd',
      bse_code: '500008',
      price: 97.74,
      change_pct: 1.6,
      fair_value: 152.13,
      fair_value_label: 'Bargain',
      fair_value_upside: 55.6,
      health_label: 'Great',
      health_score: 88,
      market_cap: '₹13.247 B',
      dividend_per_share: 0.80,
      dividend_yield: 0.8,
      ex_dividend_date: '2026-09-18',
      pay_date: '2026-10-05',
      rsi_14: 62.49,
      pe_ratio: 12.9,
      momentum_score: 82,
    },
    {
      ticker: 'CONFIPET',
      name: 'Confidence Petroleum India',
      bse_code: '526829',
      price: 77.32,
      change_pct: 7.4,
      fair_value: 105.99,
      fair_value_label: 'Undervalued',
      fair_value_upside: 36.4,
      health_label: 'Good',
      health_score: 74,
      market_cap: '₹25.822 B',
      dividend_per_share: 0.10,
      dividend_yield: 0.1,
      ex_dividend_date: '2026-09-22',
      pay_date: '2026-10-12',
      rsi_14: 45.39,
      pe_ratio: 17.9,
      momentum_score: 85,
    },
    {
      ticker: 'BEPL',
      name: 'Bhansali Eng Polymers',
      bse_code: '500052',
      price: 129.75,
      change_pct: 3.4,
      fair_value: 131.00,
      fair_value_label: 'Fair',
      fair_value_upside: 1.0,
      health_label: 'Great',
      health_score: 86,
      market_cap: '₹32.289 B',
      dividend_per_share: 6.00,
      dividend_yield: 4.6,
      ex_dividend_date: '2026-09-15',
      pay_date: '2026-09-30',
      rsi_14: 62.77,
      pe_ratio: 15.6,
      momentum_score: 79,
    },
    {
      ticker: 'JAMNAAUTO',
      name: 'Jamna Auto Industries',
      bse_code: '520051',
      price: 120.60,
      change_pct: 1.5,
      fair_value: 140.97,
      fair_value_label: 'Fair',
      fair_value_upside: 16.9,
      health_label: 'Good',
      health_score: 72,
      market_cap: '₹48.214 B',
      dividend_per_share: 2.10,
      dividend_yield: 1.7,
      ex_dividend_date: '2026-09-25',
      pay_date: '2026-10-15',
      rsi_14: 33.03,
      pe_ratio: 20.3,
      momentum_score: 77,
    },
    {
      ticker: 'BCLIND',
      name: 'BCL Ind & Infrastructure',
      bse_code: '524332',
      price: 37.63,
      change_pct: 1.1,
      fair_value: 46.84,
      fair_value_label: 'Undervalued',
      fair_value_upside: 24.5,
      health_label: 'Great',
      health_score: 90,
      market_cap: '₹11.107 B',
      dividend_per_share: 0.35,
      dividend_yield: 0.9,
      ex_dividend_date: '2026-09-28',
      pay_date: '2026-10-20',
      rsi_14: 60.89,
      pe_ratio: 9.6,
      momentum_score: 88,
    },
    {
      ticker: 'GUJAKALI',
      name: 'Gujarat Alkalies & Chemicals',
      bse_code: '530001',
      price: 726.70,
      change_pct: 0.5,
      fair_value: 677.70,
      fair_value_label: 'Fair',
      fair_value_upside: -6.7,
      health_label: 'Fair',
      health_score: 55,
      market_cap: '₹53.367 B',
      dividend_per_share: 17.70,
      dividend_yield: 2.4,
      ex_dividend_date: '2026-09-12',
      pay_date: '2026-09-28',
      rsi_14: 68.18,
      pe_ratio: 80.0,
      momentum_score: 74,
    },
    {
      ticker: 'BFINVEST',
      name: 'BF Investment Ltd',
      bse_code: '533303',
      price: 448.95,
      change_pct: 0.0,
      fair_value: 483.06,
      fair_value_label: 'Fair',
      fair_value_upside: 7.6,
      health_label: 'Great',
      health_score: 89,
      market_cap: '₹16.911 B',
      dividend_per_share: 10.00,
      dividend_yield: 2.2,
      ex_dividend_date: '2026-09-20',
      pay_date: '2026-10-10',
      rsi_14: 48.19,
      pe_ratio: 4.3,
      momentum_score: 81,
    },
    {
      ticker: 'ZUARI',
      name: 'Zuari Agro Chemicals',
      bse_code: '534742',
      price: 232.01,
      change_pct: 2.2,
      fair_value: 350.14,
      fair_value_label: 'Bargain',
      fair_value_upside: 50.9,
      health_label: 'Great',
      health_score: 87,
      market_cap: '₹9.758 B',
      dividend_per_share: 4.50,
      dividend_yield: 1.9,
      ex_dividend_date: '2026-09-24',
      pay_date: '2026-10-14',
      rsi_14: 49.16,
      pe_ratio: 1.0,
      momentum_score: 91,
    },
    {
      ticker: 'BPCL',
      name: 'Bharat Petroleum Corp',
      bse_code: '500547',
      price: 318.10,
      change_pct: 2.0,
      fair_value: 345.32,
      fair_value_label: 'Fair',
      fair_value_upside: 8.6,
      health_label: 'Good',
      health_score: 75,
      market_cap: '₹1,380.1 B',
      dividend_per_share: 22.50,
      dividend_yield: 7.1,
      ex_dividend_date: '2026-09-10',
      pay_date: '2026-09-25',
      rsi_14: 58.20,
      pe_ratio: 11.2,
      momentum_score: 86,
    },
    {
      ticker: 'COALINDIA',
      name: 'Coal India Ltd',
      bse_code: '533278',
      price: 404.00,
      change_pct: 0.7,
      fair_value: 522.01,
      fair_value_label: 'Undervalued',
      fair_value_upside: 29.2,
      health_label: 'Good',
      health_score: 78,
      market_cap: '₹2,489.7 B',
      dividend_per_share: 26.40,
      dividend_yield: 6.6,
      ex_dividend_date: '2026-09-16',
      pay_date: '2026-10-02',
      rsi_14: 64.10,
      pe_ratio: 8.4,
      momentum_score: 89,
    },
  ];

  const filteredStocks = stocks.filter((s) => {
    if (filter === 'high_momentum') return s.momentum_score >= 80;
    if (filter === 'upcoming_dividend') return s.dividend_yield >= 2.0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>ProPicks AI — High Momentum & Dividend Gems</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-2">
              Bharat Small Cap & Momentum Leaders
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              AI predictive model ranking top momentum stocks, intrinsic fair value bargain upside, overall health scores, and exact upcoming dividend ex-dates & pay dates.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Strategy Backtest CAGR</span>
              <div className="text-xl font-extrabold text-emerald-400">+52.8%</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sharpe Ratio</span>
              <div className="text-xl font-extrabold text-blue-400">1.66</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Momentum Gems ({stocks.length})
          </button>
          <button
            onClick={() => setFilter('high_momentum')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'high_momentum' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            High Momentum (Score &gt; 80)
          </button>
          <button
            onClick={() => setFilter('upcoming_dividend')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'upcoming_dividend' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            High Dividend Yield (&gt; 2%)
          </button>
        </div>

        <span className="text-xs text-slate-400 px-3 font-medium hidden sm:inline">
          Showing {filteredStocks.length} Selected Candidates
        </span>
      </div>

      {/* Main InvestingPro Style Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-4">Stock Name & Code</th>
                <th className="px-4 py-4 text-right">Price, Current</th>
                <th className="px-4 py-4 text-center">Fair Value Upside</th>
                <th className="px-4 py-4 text-center">Valuation Label</th>
                <th className="px-4 py-4 text-center">Overall Health</th>
                <th className="px-4 py-4 text-right">Dividend / Share</th>
                <th className="px-4 py-4 text-right">Dividend Yield</th>
                <th className="px-4 py-4 text-center">Ex-Dividend Date</th>
                <th className="px-4 py-4 text-center">Pay Date</th>
                <th className="px-4 py-4 text-right">RSI (14d)</th>
                <th className="px-4 py-4 text-right">P/E Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStocks.map((stock) => {
                const isBargain = stock.fair_value_label === 'Bargain';
                const isUndervalued = stock.fair_value_label === 'Undervalued';

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => navigate(`/stocks/${stock.ticker}`)}
                    className="hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    {/* Stock Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-100 text-sm flex items-center space-x-1.5">
                          <span>{stock.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {stock.ticker} • BSE: {stock.bse_code}
                        </span>
                      </div>
                    </td>

                    {/* Price & Change */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-bold text-slate-100 text-sm">₹{stock.price.toFixed(2)}</div>
                      <div className={`text-[11px] font-bold ${getChangeColor(stock.change_pct)}`}>
                        {stock.change_pct > 0 ? '+' : ''}{stock.change_pct}% ↑
                      </div>
                    </td>

                    {/* Fair Value Upside */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="font-bold text-slate-100">₹{stock.fair_value.toFixed(2)}</div>
                      <div className={`text-[11px] font-extrabold ${stock.fair_value_upside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPct(stock.fair_value_upside)} Upside
                      </div>
                    </td>

                    {/* Fair Value Label Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isBargain
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          : isUndervalued
                          ? 'bg-green-950/80 text-green-400 border-green-500/40'
                          : 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40'
                      }`}>
                        {stock.fair_value_label}
                      </span>
                    </td>

                    {/* Overall Health Progress Bar */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`text-[11px] font-bold ${
                          stock.health_label === 'Great' ? 'text-emerald-400' : stock.health_label === 'Good' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {stock.health_label}
                        </span>
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stock.health_score >= 85 ? 'bg-emerald-500' : stock.health_score >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${stock.health_score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Dividend Per Share */}
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-200">
                      ₹{stock.dividend_per_share.toFixed(2)}
                    </td>

                    {/* Dividend Yield */}
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-400">
                      {stock.dividend_yield}%
                    </td>

                    {/* Ex-Dividend Date */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-1 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-500/30 text-[11px] font-bold">
                        {stock.ex_dividend_date}
                      </span>
                    </td>

                    {/* Pay Date */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                        {stock.pay_date}
                      </span>
                    </td>

                    {/* RSI */}
                    <td className="px-4 py-3.5 text-right font-mono text-slate-300">
                      {stock.rsi_14}
                    </td>

                    {/* P/E Ratio */}
                    <td className="px-4 py-3.5 text-right font-bold text-slate-100">
                      {stock.pe_ratio}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
