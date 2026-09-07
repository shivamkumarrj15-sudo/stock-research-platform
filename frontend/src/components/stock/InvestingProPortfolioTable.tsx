import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  FileText,
  Search,
  Filter,
  Layers,
  Award,
  DollarSign,
  Download,
  Info,
  Building,
  Check,
  Activity,
  RefreshCw
} from 'lucide-react';
import {
  INVESTING_PRO_PORTFOLIO,
  PortfolioStockItem
} from '../../data/investingProPortfolioData';
import { resolveSymbolAndQuote } from '../../api/liveMarketFetcher';
import { stocksApi } from '../../api';

interface InvestingProPortfolioTableProps {
  onSelectStockForReturn?: (ticker: string) => void;
  onSelectStockForProReport?: (ticker: string) => void;
}

export const InvestingProPortfolioTable: React.FC<InvestingProPortfolioTableProps> = ({
  onSelectStockForReturn,
  onSelectStockForProReport,
}) => {
  const [stocks, setStocks] = useState<PortfolioStockItem[]>(INVESTING_PRO_PORTFOLIO);
  const [filterType, setFilterType] = useState<'all' | 'undervalued' | 'high_yield' | 'great_health' | 'high_upside'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTickers, setSelectedTickers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof PortfolioStockItem>('fair_value_upside_pct');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down'>>({});
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Live Auto-Refresh every 5 seconds (Angel One SmartAPI / Live Market Feed)
  useEffect(() => {
    const refreshTablePrices = async () => {
      setIsRefreshing(true);
      try {
        const updated = await Promise.all(
          stocks.map(async (stk) => {
            try {
              let p = stk.price;
              let ch1d = stk.change_1d;
              try {
                const res = await stocksApi.getPrice(stk.ticker);
                if (res && res.price > 0) {
                  p = res.price;
                  ch1d = res.change_pct ?? ch1d;
                }
              } catch (e) {
                const live = await resolveSymbolAndQuote(stk.ticker);
                if (live && live.price > 0) {
                  p = live.price;
                  ch1d = live.change_pct ?? ch1d;
                }
              }

              let dir: 'up' | 'down' | null = null;
              if (p > stk.price) dir = 'up';
              else if (p < stk.price) dir = 'down';

              if (dir) {
                setFlashMap((prev) => ({ ...prev, [stk.ticker]: dir }));
                setTimeout(() => {
                  setFlashMap((prev) => ({ ...prev, [stk.ticker]: undefined as any }));
                }, 1800);
              }

              const fvUpside = stk.fair_value_price > 0 ? Math.round(((stk.fair_value_price - p) / p) * 1000) / 10 : stk.fair_value_upside_pct;
              const fvGauge = Math.min(100, Math.max(5, Math.round(50 + fvUpside * 1.1)));

              return {
                ...stk,
                price: p,
                change_1d: ch1d,
                fair_value_upside_pct: fvUpside,
                fair_value_gauge_pct: fvGauge,
              };
            } catch (err) {
              return stk;
            }
          })
        );
        setStocks(updated);
        setLastRefreshedTime(new Date().toLocaleTimeString());
      } finally {
        setIsRefreshing(false);
      }
    };

    const interval = setInterval(refreshTablePrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  const filteredStocks = stocks.filter((stk) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        stk.name.toLowerCase().includes(q) ||
        stk.ticker.toLowerCase().includes(q) ||
        stk.bse_code.includes(q) ||
        stk.sector.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category filter
    if (filterType === 'undervalued') return stk.fair_value_label === 'Undervalued';
    if (filterType === 'high_yield') return stk.dividend_yield >= 4.0;
    if (filterType === 'great_health') return stk.health_label === 'Great';
    if (filterType === 'high_upside') return stk.fair_value_upside_pct >= 20.0;
    return true;
  });

  // Sorting
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
  });

  const handleSort = (field: keyof PortfolioStockItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleToggleSelect = (ticker: string) => {
    const next = new Set(selectedTickers);
    if (next.has(ticker)) next.delete(ticker);
    else next.add(ticker);
    setSelectedTickers(next);
  };

  const handleSelectAll = () => {
    if (selectedTickers.size === sortedStocks.length) {
      setSelectedTickers(new Set());
    } else {
      setSelectedTickers(new Set(sortedStocks.map((s) => s.ticker)));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Ticker', 'Name', 'BSE Code', 'Price (INR)', '1D Change (%)', 'Fair Value (INR)', 'FV Upside (%)', 'FV Label', 'Analyst Target (INR)', 'Analyst Upside (%)', 'Health Label', 'Market Cap (B)', 'Dividend Per Share (INR)', 'Dividend Yield (%)', 'Sector'];
    const rows = sortedStocks.map((s) => [
      s.ticker,
      `"${s.name}"`,
      s.bse_code,
      s.price,
      s.change_1d,
      s.fair_value_price,
      s.fair_value_upside_pct,
      s.fair_value_label,
      s.analyst_target_price,
      s.analyst_target_upside_pct,
      s.health_label,
      s.market_cap_b,
      s.dividend_per_share,
      s.dividend_yield,
      `"${s.sector}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investingpro_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 font-sans">
      {/* Top Header Summary & Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              InvestingPro Portfolio Holdings & Valuation Multiples
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              {sortedStocks.length} Equities
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
              <Activity className="w-3 h-3 animate-spin text-emerald-400" />
              <span>Live Auto-Stream {lastRefreshedTime}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-model Fair Value calculations, analyst consensus targets, 3-zone health ratings, and cash dividend yields.
          </p>
        </div>

        {/* Action button: Export */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs font-bold transition-all shadow-md"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs">
        <div className="border-r border-slate-800 pr-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Fair Value Upside</span>
          <span className="text-base font-black text-emerald-400">+18.4%</span>
          <span className="text-[10px] text-slate-500 block">10 / 19 Undervalued</span>
        </div>
        <div className="border-r border-slate-800 pr-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Dividend Yield</span>
          <span className="text-base font-black text-amber-400">4.6%</span>
          <span className="text-[10px] text-slate-500 block">Highest: HINDPETRO 9.3%</span>
        </div>
        <div className="border-r border-slate-800 pr-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Top Fair Value Gem</span>
          <span className="text-base font-black text-blue-400">WIPRO (+41.6%)</span>
          <span className="text-[10px] text-slate-500 block">Target ₹254.77</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">High Conviction Analyst Pick</span>
          <span className="text-base font-black text-purple-400">TATAMOTORS (+36.4%)</span>
          <span className="text-[10px] text-slate-500 block">Target ₹425.00</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Equities' },
            { id: 'undervalued', label: '🔥 Undervalued' },
            { id: 'high_yield', label: '💰 High Yield (>4%)' },
            { id: 'great_health', label: '🛡️ Great Health' },
            { id: 'high_upside', label: '🚀 High Upside (>20%)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock, symbol, BSE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main InvestingPro Exact Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0b1324] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-3 py-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={selectedTickers.size > 0 && selectedTickers.size === sortedStocks.length}
                  onChange={handleSelectAll}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th
                onClick={() => handleSort('name')}
                className="px-4 py-3 cursor-pointer hover:text-slate-200"
              >
                Company {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('price')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-200"
              >
                Price {sortField === 'price' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('change_1d')}
                className="px-3 py-3 text-center cursor-pointer hover:text-slate-200"
              >
                1D Change {sortField === 'change_1d' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('fair_value_upside_pct')}
                className="px-4 py-3 text-center cursor-pointer hover:text-slate-200 min-w-[180px]"
              >
                InvestingPro Fair Value {sortField === 'fair_value_upside_pct' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('analyst_target_upside_pct')}
                className="px-4 py-3 text-center cursor-pointer hover:text-slate-200 min-w-[170px]"
              >
                Analyst Target Price {sortField === 'analyst_target_upside_pct' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('health_gauge_pct')}
                className="px-4 py-3 text-center cursor-pointer hover:text-slate-200 min-w-[130px]"
              >
                Financial Health {sortField === 'health_gauge_pct' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('market_cap_num')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-200"
              >
                Market Cap {sortField === 'market_cap_num' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('dividend_per_share')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-200"
              >
                Div / Share {sortField === 'dividend_per_share' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('dividend_yield')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-200"
              >
                Div Yield {sortField === 'dividend_yield' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedStocks.map((stock) => {
              const isSelected = selectedTickers.has(stock.ticker);
              const isPositive1D = stock.change_1d >= 0;
              const isPositiveFV = stock.fair_value_upside_pct >= 0;
              const isPositiveAnalyst = stock.analyst_target_upside_pct >= 0;

              return (
                <tr
                  key={stock.ticker}
                  className={`hover:bg-slate-800/60 transition-colors ${
                    isSelected ? 'bg-blue-950/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(stock.ticker)}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Company Name & BSE Code */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[10px] text-amber-400 shrink-0">
                        {stock.ticker.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-100 text-xs flex items-center gap-1.5">
                          <span>{stock.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {stock.subtext || stock.bse_code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Price with Live Flash */}
                  <td
                    className={`px-3 py-3 text-right font-mono font-bold transition-all duration-300 ${
                      flashMap[stock.ticker] === 'up'
                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                        : flashMap[stock.ticker] === 'down'
                        ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                        : 'text-slate-100'
                    }`}
                  >
                    ₹{stock.price >= 1000 ? stock.price.toLocaleString() : stock.price.toFixed(2)}
                  </td>

                  {/* 1D Change % */}
                  <td
                    className={`px-3 py-3 text-center font-mono transition-all duration-300 ${
                      flashMap[stock.ticker] === 'up'
                        ? 'bg-emerald-500/20'
                        : flashMap[stock.ticker] === 'down'
                        ? 'bg-rose-500/20'
                        : ''
                    }`}
                  >
                    <span
                      className={`inline-flex items-center font-bold text-[11px] ${
                        isPositive1D ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {Math.abs(stock.change_1d).toFixed(1)}% {isPositive1D ? '↑' : '↓'}
                    </span>
                  </td>

                  {/* InvestingPro Fair Value (Target Price + Upside + Slider Gauge) */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-between w-full text-[11px]">
                        <span className="font-bold text-slate-200">
                          ₹{stock.fair_value_price >= 1000 ? stock.fair_value_price.toLocaleString() : stock.fair_value_price.toFixed(2)}
                        </span>
                        <span
                          className={`font-black text-[10px] ${
                            isPositiveFV ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {stock.fair_value_upside_pct >= 0 ? `${stock.fair_value_upside_pct}% Upside` : `${Math.abs(stock.fair_value_upside_pct)}% Downside`}
                        </span>
                      </div>

                      {/* Micro-Slider Gauge */}
                      <div className="w-full flex items-center space-x-2 mt-1">
                        <span className={`text-[9px] font-bold uppercase w-16 ${
                          stock.fair_value_label === 'Undervalued'
                            ? 'text-emerald-400'
                            : stock.fair_value_label === 'Overvalued'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}>
                          {stock.fair_value_label}
                        </span>

                        <div className="relative flex-1 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full">
                          {/* Indicator needle marker */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border border-white rounded-full shadow"
                            style={{ left: `${stock.fair_value_gauge_pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Analyst Target Price (Price + Upside + Slider Gauge) */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-between w-full text-[11px]">
                        <span className="font-bold text-slate-200">
                          ₹{stock.analyst_target_price >= 1000 ? stock.analyst_target_price.toLocaleString() : stock.analyst_target_price.toFixed(2)}
                        </span>
                        <span
                          className={`font-black text-[10px] ${
                            isPositiveAnalyst ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {stock.analyst_target_upside_pct >= 0 ? `${stock.analyst_target_upside_pct}% Upside` : `${Math.abs(stock.analyst_target_upside_pct)}% Downside`}
                        </span>
                      </div>

                      {/* Micro-Slider Gauge */}
                      <div className="w-full flex items-center space-x-2 mt-1">
                        <span className={`text-[9px] font-bold uppercase w-16 ${
                          stock.analyst_target_label === 'Undervalued'
                            ? 'text-emerald-400'
                            : stock.analyst_target_label === 'Overvalued'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}>
                          {stock.analyst_target_label}
                        </span>

                        <div className="relative flex-1 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full">
                          {/* Indicator needle marker */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border border-white rounded-full shadow"
                            style={{ left: `${stock.analyst_target_gauge_pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Financial Health 3-Zone Bar + Needle */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-extrabold mb-1 ${
                        stock.health_label === 'Great'
                          ? 'text-emerald-400'
                          : stock.health_label === 'Good'
                          ? 'text-green-400'
                          : stock.health_label === 'Fair'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {stock.health_label}
                      </span>

                      <div className="relative w-20 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full">
                        {/* Needle triangle indicator */}
                        <div
                          className="absolute -top-1 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-white"
                          style={{ left: `${stock.health_gauge_pct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="px-3 py-3 text-right font-mono text-slate-300 font-semibold">
                    {stock.market_cap_b}
                  </td>

                  {/* Dividend / Share */}
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-200">
                    ₹{stock.dividend_per_share}
                  </td>

                  {/* Dividend Yield */}
                  <td className="px-3 py-3 text-right font-mono font-black">
                    <span className={stock.dividend_yield >= 5.0 ? 'text-emerald-400' : 'text-slate-300'}>
                      {stock.dividend_yield.toFixed(1)}%
                    </span>
                  </td>

                  {/* Row Actions */}
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {onSelectStockForReturn && (
                        <button
                          onClick={() => onSelectStockForReturn(stock.ticker)}
                          className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
                          title="View Return vs Benchmark"
                        >
                          <LineChart className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onSelectStockForProReport && (
                        <button
                          onClick={() => onSelectStockForProReport(stock.ticker)}
                          className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 transition-colors"
                          title="View Full Pro Research Dossier"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
