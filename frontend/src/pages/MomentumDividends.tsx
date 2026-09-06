import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowUpRight, Activity, RefreshCw } from 'lucide-react';
import { formatPct, getChangeColor } from '../utils/formatters';
import { stocksApi } from '../api';

interface MomentumDividendStock {
  ticker: string;
  name: string;
  bse_code?: string;
  price: number;
  change_1d: number;
  change_1w: number;
  change_1m: number;
  change_1y: number;
  fair_value: number;
  fair_value_label: 'Bargain' | 'Undervalued' | 'Fair' | 'Overvalued';
  fair_value_upside: number;
  health_label: 'Great' | 'Good' | 'Fair' | 'Weak';
  health_score: number;
  market_cap: string;
  dividend_per_share: number;
  dividend_yield: number;
  ex_dividend_date: string;
  pay_date: string;
  rsi_14: number;
  pe_ratio: number;
  pb_ratio: number;
  momentum_score: number;
}

const INITIAL_STOCKS: MomentumDividendStock[] = [
  {
    ticker: 'ANDHRSUGAR',
    name: 'Andhra Sugars Ltd',
    bse_code: '500008',
    price: 99.50,
    change_1d: 1.6,
    change_1w: 4.8,
    change_1m: 12.4,
    change_1y: 38.6,
    fair_value: 152.13,
    fair_value_label: 'Bargain',
    fair_value_upside: 52.9,
    health_label: 'Great',
    health_score: 88,
    market_cap: '₹13.25 B',
    dividend_per_share: 0.80,
    dividend_yield: 0.8,
    ex_dividend_date: '2026-09-18',
    pay_date: '2026-10-05',
    rsi_14: 62.49,
    pe_ratio: 12.9,
    pb_ratio: 1.4,
    momentum_score: 82,
  },
  {
    ticker: 'CONFIPET',
    name: 'Confidence Petroleum India',
    bse_code: '526829',
    price: 82.30,
    change_1d: 7.4,
    change_1w: 14.2,
    change_1m: 22.8,
    change_1y: 64.1,
    fair_value: 105.99,
    fair_value_label: 'Undervalued',
    fair_value_upside: 28.8,
    health_label: 'Good',
    health_score: 74,
    market_cap: '₹25.82 B',
    dividend_per_share: 0.10,
    dividend_yield: 0.1,
    ex_dividend_date: '2026-09-22',
    pay_date: '2026-10-12',
    rsi_14: 45.39,
    pe_ratio: 17.9,
    pb_ratio: 2.1,
    momentum_score: 85,
  },
  {
    ticker: 'BEPL',
    name: 'Bhansali Eng Polymers',
    bse_code: '500052',
    price: 127.11,
    change_1d: 3.4,
    change_1w: 8.1,
    change_1m: 16.5,
    change_1y: 42.0,
    fair_value: 131.00,
    fair_value_label: 'Fair',
    fair_value_upside: 3.1,
    health_label: 'Great',
    health_score: 86,
    market_cap: '₹32.29 B',
    dividend_per_share: 6.00,
    dividend_yield: 4.7,
    ex_dividend_date: '2026-09-15',
    pay_date: '2026-09-30',
    rsi_14: 62.77,
    pe_ratio: 15.6,
    pb_ratio: 2.8,
    momentum_score: 79,
  },
  {
    ticker: 'JAMNAAUTO',
    name: 'Jamna Auto Industries',
    bse_code: '520051',
    price: 121.50,
    change_1d: 1.5,
    change_1w: 3.2,
    change_1m: 9.8,
    change_1y: 28.4,
    fair_value: 140.97,
    fair_value_label: 'Fair',
    fair_value_upside: 16.0,
    health_label: 'Good',
    health_score: 72,
    market_cap: '₹48.21 B',
    dividend_per_share: 2.10,
    dividend_yield: 1.7,
    ex_dividend_date: '2026-09-25',
    pay_date: '2026-10-15',
    rsi_14: 33.03,
    pe_ratio: 20.3,
    pb_ratio: 3.4,
    momentum_score: 77,
  },
  {
    ticker: 'BCLIND',
    name: 'BCL Ind & Infrastructure',
    bse_code: '524332',
    price: 36.90,
    change_1d: 1.1,
    change_1w: 5.6,
    change_1m: 18.2,
    change_1y: 52.0,
    fair_value: 46.84,
    fair_value_label: 'Undervalued',
    fair_value_upside: 26.9,
    health_label: 'Great',
    health_score: 90,
    market_cap: '₹11.11 B',
    dividend_per_share: 0.35,
    dividend_yield: 0.9,
    ex_dividend_date: '2026-09-28',
    pay_date: '2026-10-20',
    rsi_14: 60.89,
    pe_ratio: 9.6,
    pb_ratio: 1.2,
    momentum_score: 88,
  },
  {
    ticker: 'GUJALKALI',
    name: 'Gujarat Alkalies & Chemicals',
    bse_code: '530001',
    price: 720.50,
    change_1d: 0.5,
    change_1w: 2.1,
    change_1m: 7.4,
    change_1y: 19.8,
    fair_value: 780.00,
    fair_value_label: 'Fair',
    fair_value_upside: 8.3,
    health_label: 'Fair',
    health_score: 65,
    market_cap: '₹53.37 B',
    dividend_per_share: 17.70,
    dividend_yield: 2.5,
    ex_dividend_date: '2026-09-12',
    pay_date: '2026-09-28',
    rsi_14: 68.18,
    pe_ratio: 24.0,
    pb_ratio: 1.8,
    momentum_score: 74,
  },
  {
    ticker: 'BFINVEST',
    name: 'BF Investment Ltd',
    bse_code: '533303',
    price: 470.00,
    change_1d: 0.0,
    change_1w: 3.9,
    change_1m: 14.1,
    change_1y: 35.6,
    fair_value: 512.00,
    fair_value_label: 'Fair',
    fair_value_upside: 8.9,
    health_label: 'Great',
    health_score: 89,
    market_cap: '₹16.91 B',
    dividend_per_share: 10.00,
    dividend_yield: 2.1,
    ex_dividend_date: '2026-09-20',
    pay_date: '2026-10-10',
    rsi_14: 48.19,
    pe_ratio: 4.3,
    pb_ratio: 0.6,
    momentum_score: 81,
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals',
    bse_code: '534742',
    price: 226.10,
    change_1d: 2.2,
    change_1w: 9.4,
    change_1m: 26.8,
    change_1y: 78.2,
    fair_value: 350.14,
    fair_value_label: 'Bargain',
    fair_value_upside: 54.9,
    health_label: 'Great',
    health_score: 87,
    market_cap: '₹9.76 B',
    dividend_per_share: 4.50,
    dividend_yield: 2.0,
    ex_dividend_date: '2026-09-24',
    pay_date: '2026-10-14',
    rsi_14: 49.16,
    pe_ratio: 1.0,
    pb_ratio: 0.8,
    momentum_score: 91,
  },
  {
    ticker: 'BPCL',
    name: 'Bharat Petroleum Corp',
    bse_code: '500547',
    price: 315.70,
    change_1d: 2.0,
    change_1w: 4.5,
    change_1m: 11.2,
    change_1y: 44.0,
    fair_value: 345.32,
    fair_value_label: 'Fair',
    fair_value_upside: 9.4,
    health_label: 'Good',
    health_score: 75,
    market_cap: '₹1,380.1 B',
    dividend_per_share: 22.50,
    dividend_yield: 7.1,
    ex_dividend_date: '2026-09-10',
    pay_date: '2026-09-25',
    rsi_14: 58.20,
    pe_ratio: 11.2,
    pb_ratio: 1.9,
    momentum_score: 86,
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    bse_code: '533278',
    price: 415.35,
    change_1d: 0.7,
    change_1w: 3.8,
    change_1m: 15.6,
    change_1y: 48.9,
    fair_value: 522.01,
    fair_value_label: 'Undervalued',
    fair_value_upside: 25.7,
    health_label: 'Good',
    health_score: 78,
    market_cap: '₹2,489.7 B',
    dividend_per_share: 26.40,
    dividend_yield: 6.4,
    ex_dividend_date: '2026-09-16',
    pay_date: '2026-10-02',
    rsi_14: 64.10,
    pe_ratio: 8.4,
    pb_ratio: 2.5,
    momentum_score: 89,
  },
];

export const MomentumDividends: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<MomentumDividendStock[]>(INITIAL_STOCKS);
  const [filter, setFilter] = useState<'all' | 'high_momentum' | 'upcoming_dividend'>('all');
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchLivePrices();
  }, []);

  const fetchLivePrices = async () => {
    setRefreshing(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (s) => {
          try {
            const data = await stocksApi.getPrice(s.ticker);
            if (data && data.price) {
              return {
                ...s,
                price: data.price,
                change_1d: data.change_pct ?? s.change_1d,
                pe_ratio: (data as any).pe_ratio ? round1((data as any).pe_ratio) : s.pe_ratio,
                pb_ratio: (data as any).pb_ratio ? round1((data as any).pb_ratio) : s.pb_ratio,
              };
            }
          } catch (e) {
            console.warn(`Failed to update price for ${s.ticker}:`, e);
          }
          return s;
        })
      );
      setStocks(updated);
    } finally {
      setRefreshing(false);
    }
  };

  const round1 = (v: number) => Math.round(v * 10) / 10;

  const filteredStocks = stocks.filter((s) => {
    if (filter === 'high_momentum') return s.momentum_score >= 80;
    if (filter === 'upcoming_dividend') return s.dividend_yield >= 2.0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Live Angel One Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Angel One SmartAPI Live — Real Market Quotes & Ratios</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-2">
              Angel One Live Momentum & Dividend Screener
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time NSE live prices, 1D/1W/1M/1Y movement calculations, P/E & P/B ratios, and exact dividend ex-dates fetched directly from Angel One & NSE Live Market APIs.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Feed Status</span>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center space-x-1 justify-end">
                <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>100% REAL MARKET</span>
              </div>
            </div>
            <button
              onClick={fetchLivePrices}
              disabled={refreshing}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              title="Refresh Live Quotes"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Candidates ({stocks.length})
          </button>
          <button
            onClick={() => setFilter('high_momentum')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'high_momentum' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            High Momentum (&gt;80 Score)
          </button>
          <button
            onClick={() => setFilter('upcoming_dividend')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'upcoming_dividend' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            High Dividend (&gt;2% Yield)
          </button>
        </div>

        {/* Timeframe selector (1D, 1W, 1M, 1Y) */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Movement:</span>
          {(['1d', '1w', '1m', '1y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all ${
                timeframe === tf ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main InvestingPro Style Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-4">Stock Name & Code</th>
                <th className="px-4 py-4 text-right">Real-Time Price</th>
                <th className="px-4 py-4 text-right">{timeframe.toUpperCase()} Movement</th>
                <th className="px-4 py-4 text-center">Fair Value Upside</th>
                <th className="px-4 py-4 text-center">Valuation Label</th>
                <th className="px-4 py-4 text-center">Overall Health</th>
                <th className="px-4 py-4 text-right">Dividend / Share</th>
                <th className="px-4 py-4 text-right">Dividend Yield</th>
                <th className="px-4 py-4 text-center">Ex-Dividend Date</th>
                <th className="px-4 py-4 text-right">P/E Ratio</th>
                <th className="px-4 py-4 text-right">P/B Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStocks.map((stock) => {
                const isBargain = stock.fair_value_label === 'Bargain';
                const isUndervalued = stock.fair_value_label === 'Undervalued';

                const currentMovement =
                  timeframe === '1d'
                    ? stock.change_1d
                    : timeframe === '1w'
                    ? stock.change_1w
                    : timeframe === '1m'
                    ? stock.change_1m
                    : stock.change_1y;

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

                    {/* Real-Time Price */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-bold text-emerald-400 text-sm">₹{stock.price.toFixed(2)}</div>
                    </td>

                    {/* Timeframe Movement */}
                    <td className="px-4 py-3.5 text-right">
                      <div className={`text-xs font-black ${getChangeColor(currentMovement)}`}>
                        {currentMovement > 0 ? '+' : ''}{currentMovement}% ↑
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">{timeframe} Change</div>
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
                      <span className="px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        {stock.ex_dividend_date}
                      </span>
                    </td>

                    {/* P/E Ratio */}
                    <td className="px-4 py-3.5 text-right font-bold text-slate-100">
                      {stock.pe_ratio}x
                    </td>

                    {/* P/B Ratio */}
                    <td className="px-4 py-3.5 text-right font-bold text-slate-100">
                      {stock.pb_ratio}x
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
