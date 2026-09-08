import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Sparkles,
  Calculator,
  PieChart,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Gem,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Briefcase
} from 'lucide-react';
import {
  LONG_TERM_COMPOUNDERS,
  INVESTMENT_MODEL_PORTFOLIOS,
  INVESTMENT_GOLDEN_RULES,
  LongTermStockItem,
  InvestmentModelPortfolio,
  calculateSipWealth,
  calculateLumpsumWealth
} from '../../data/longTermInvestmentData';
import { formatCurrency } from '../../utils/formatters';

interface LongTermInvestmentViewProps {
  onSelectStock?: (ticker: string) => void;
  onCompareReturn?: (ticker: string) => void;
}

export const LongTermInvestmentView: React.FC<LongTermInvestmentViewProps> = ({
  onSelectStock,
  onCompareReturn
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'compounders' | 'model_portfolios' | 'sip_calculator' | 'golden_rules'>('compounders');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStockDetail, setSelectedStockDetail] = useState<LongTermStockItem | null>(null);

  // SIP Calculator State
  const [calcMode, setCalcMode] = useState<'sip' | 'lumpsum'>('sip');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [expectedCagr, setExpectedCagr] = useState<number>(30);
  const [calcDividendYield, setCalcDividendYield] = useState<number>(2.5);

  const sipResult = calculateSipWealth(monthlyAmount, expectedCagr, horizonYears, calcDividendYield);
  const lumpsumResult = calculateLumpsumWealth(lumpsumAmount, expectedCagr, horizonYears, calcDividendYield);

  // Filtered compounders
  const filteredStocks = LONG_TERM_COMPOUNDERS.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'MONOPOLY') return item.moat_type.includes('Monopoly') || item.moat_type.includes('Government');
    if (selectedCategory === 'HIGH_DIVIDEND') return item.dividend_yield >= 2.0;
    if (selectedCategory === 'ZERO_DEBT') return item.debt_to_equity <= 0.05;
    if (selectedCategory === 'TECH_ENERGY') return item.sector.includes('Energy') || item.sector.includes('Electronics') || item.sector.includes('Tech');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Long Term Wealth Mindset */}
      <div className="bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>दीर्घकालिक निवेश वेल्थ क्रिएटर (Long-Term 1–5 Yr Horizon)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-snug">
              No Day-Trading Stress. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Pure 10x Business Compounding.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trading ke daily ups & downs ke bina, India ki sabse strong <strong className="text-amber-300 font-bold">Monopoly & Wide Moat</strong> कंपनियों में निवेश करें (Zero Debt, ROIC &gt; 25%, High FCF, High Dividends) और 3 से 5 साल में अपना पैसा सुरक्षित 2x से 4x कम्पाउंड करें।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-center min-w-[150px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Compounding</span>
              <span className="text-2xl font-black text-amber-400">28% - 35%</span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Annual CAGR</span>
            </div>
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 text-center min-w-[150px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Multiplier</span>
              <span className="text-2xl font-black text-emerald-400">2.1x – 3.5x</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">in 3 - 5 Years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('compounders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'compounders'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🏆 Top 10 Multi-Baggers (1-5 Yr)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('model_portfolios')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'model_portfolios'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>👑 3 Curated Model Portfolios</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sip_calculator')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sip_calculator'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>💰 SIP & Wealth Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('golden_rules')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'golden_rules'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Buffett & Lynch 5 Golden Rules</span>
        </button>
      </div>

      {/* TAB 1: Top 10 Multi-Baggers */}
      {activeSubTab === 'compounders' && (
        <div className="space-y-6">
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">Category Filter:</span>
            {[
              { id: 'ALL', label: 'All 10 Compounders' },
              { id: 'MONOPOLY', label: '👑 Monopolies & Wide Moat' },
              { id: 'ZERO_DEBT', label: '🛡️ Zero Debt Balance Sheet' },
              { id: 'HIGH_DIVIDEND', label: '💰 High Dividend Yield (2% - 6.6%)' },
              { id: 'TECH_ENERGY', label: '⚡ Clean Energy & EMS PLI' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStocks.map((stock) => {
              const upside3Yr = ((stock.target_3yr - stock.current_price) / stock.current_price) * 100;
              const multiplier3Yr = (stock.target_3yr / stock.current_price).toFixed(1);

              return (
                <div
                  key={stock.ticker}
                  className="bg-slate-900/95 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-amber-500/10 flex flex-col justify-between group"
                >
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-slate-100 group-hover:text-amber-300 transition-colors">
                            {stock.ticker}
                          </span>
                          {stock.bse_code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {stock.bse_code}
                            </span>
                          )}
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {stock.moat_rating}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-300 mt-0.5 line-clamp-1">{stock.name}</h4>
                        <span className="text-[10px] text-slate-500">{stock.industry}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Rate</span>
                        <span className="text-base font-black text-slate-100">
                          {formatCurrency(stock.current_price, 'INR')}
                        </span>
                        {stock.dividend_yield > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400 block">
                            +{stock.dividend_yield}% Div Yield
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hindi Summary */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 mb-4">
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                        {stock.thesis_summary_hi}
                      </p>
                    </div>

                    {/* 3-Year Compounding Projection Box */}
                    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 rounded-xl p-3.5 mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">3-Yr Multibagger Target</span>
                        <span className="font-extrabold text-emerald-400">+{upside3Yr.toFixed(0)}% ({multiplier3Yr}x)</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-black text-amber-300">
                          {formatCurrency(stock.target_3yr, 'INR')}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          CAGR: <strong className="text-emerald-400 font-black">+{stock.expected_cagr_3yr}%/yr</strong>
                        </span>
                      </div>
                    </div>

                    {/* Quality & Moat Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 mb-4 text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold block">ROIC %</span>
                        <span className="text-xs font-black text-emerald-400">{stock.roic_pct}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold block">Debt/Equity</span>
                        <span className={`text-xs font-black ${stock.debt_to_equity <= 0.1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {stock.debt_to_equity === 0 ? 'Zero Debt' : `${stock.debt_to_equity}x`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold block">5-Yr Profit CAGR</span>
                        <span className="text-xs font-black text-amber-300">+{stock.profit_cagr_5yr}%</span>
                      </div>
                    </div>

                    {/* Accumulation Buy Zone */}
                    <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-2.5 mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Safe Buy Zone:</span>
                      </div>
                      <span className="text-xs font-black text-slate-200">
                        {formatCurrency(stock.accumulation_zone.min_price, 'INR')} – {formatCurrency(stock.accumulation_zone.max_price, 'INR')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedStockDetail(stock)}
                      className="flex-1 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Full Investment Thesis</span>
                    </button>
                    {onCompareReturn && (
                      <button
                        onClick={() => onCompareReturn(stock.ticker)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
                        title="Compare Historical Return vs Benchmark"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 3 Curated Model Portfolios */}
      {activeSubTab === 'model_portfolios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {INVESTMENT_MODEL_PORTFOLIOS.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider inline-block mb-2">
                      {portfolio.recommended_horizon} Holding
                    </span>
                    <h3 className="text-lg font-black text-slate-100">{portfolio.title}</h3>
                    <p className="text-xs font-semibold text-amber-400/90 mt-0.5">{portfolio.hindi_title}</p>
                    <p className="text-xs text-slate-400 mt-2">{portfolio.subtitle}</p>
                  </div>

                  {/* Return Target Box */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected 3-Yr CAGR</span>
                      <span className="text-xl font-black text-emerald-400">+{portfolio.expected_cagr_3yr}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">3-Yr Wealth Growth</span>
                      <span className="text-xl font-black text-amber-400">{portfolio.expected_3yr_multiplier}x Corpus</span>
                    </div>
                  </div>

                  {/* Holdings Breakdown */}
                  <div className="space-y-2 mb-5">
                    <span className="text-[11px] font-bold text-slate-300 uppercase block tracking-wider">
                      Portfolio Allocation:
                    </span>
                    {portfolio.holdings.map((h) => (
                      <div
                        key={h.ticker}
                        className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-200">{h.ticker}</span>
                          <span className="text-[10px] text-slate-400">({h.name})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            +{h.expected_cagr}% CAGR
                          </span>
                          <span className="font-black text-amber-300">{h.weight_pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Philosophy */}
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Philosophy:</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{portfolio.investment_philosophy}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Risk Profile: <strong className="text-emerald-400 font-bold">{portfolio.risk_profile}</strong></span>
                    <span>Avg Dividend: <strong className="text-amber-300 font-bold">{portfolio.avg_dividend_yield}%</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SIP & Lumpsum Compounding Calculator */}
      {activeSubTab === 'sip_calculator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-100 flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span>Compounding Wealth Simulator (SIP & Lumpsum)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculate your exact corpus growth with high-CAGR compounders and dividend reinvestment.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setCalcMode('sip')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      calcMode === 'sip'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monthly SIP
                  </button>
                  <button
                    onClick={() => setCalcMode('lumpsum')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      calcMode === 'lumpsum'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    One-Time Lumpsum
                  </button>
                </div>
              </div>

              {/* Calculator Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  {/* Amount */}
                  {calcMode === 'sip' ? (
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-300">Monthly SIP Amount</span>
                        <span className="text-amber-400 text-sm font-black">{formatCurrency(monthlyAmount, 'INR')}/mo</span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="100000"
                        step="1000"
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="flex gap-2 mt-2">
                        {[5000, 10000, 25000, 50000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setMonthlyAmount(amt)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              monthlyAmount === amt ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            ₹{(amt / 1000)}k
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-300">One-Time Lumpsum Investment</span>
                        <span className="text-amber-400 text-sm font-black">{formatCurrency(lumpsumAmount, 'INR')}</span>
                      </div>
                      <input
                        type="range"
                        min="25000"
                        max="2000000"
                        step="25000"
                        value={lumpsumAmount}
                        onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="flex gap-2 mt-2">
                        {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setLumpsumAmount(amt)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              lumpsumAmount === amt ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            ₹{(amt / 100000)}L
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Horizon */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-300">Holding Time Horizon</span>
                      <span className="text-emerald-400 text-sm font-black">{horizonYears} Years ({horizonYears * 12} Months)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 5].map((y) => (
                        <button
                          key={y}
                          onClick={() => setHorizonYears(y)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            horizonYears === y
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {y} {y === 1 ? 'Year' : 'Years'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected CAGR */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-300">Expected Annual CAGR</span>
                      <span className="text-amber-400 text-sm font-black">+{expectedCagr}% / Year</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="40"
                      step="1"
                      value={expectedCagr}
                      onChange={(e) => setExpectedCagr(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>15% (Nifty Index)</span>
                      <span>30% (Wide Moat Compounders)</span>
                      <span>40% (Small Cap Multi-Baggers)</span>
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="bg-gradient-to-br from-amber-950/50 via-slate-950 to-emerald-950/50 border border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                      {calcMode === 'sip' ? `SIP Maturity Projection (${horizonYears} Yrs)` : `Lumpsum Wealth Output (${horizonYears} Yrs)`}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-slate-100 mt-1">
                      {formatCurrency(calcMode === 'sip' ? sipResult.futureValue : lumpsumResult.futureValue, 'INR')}
                    </div>
                    <span className="text-xs font-black text-emerald-400 block mt-1">
                      Corpus Multiplier: {calcMode === 'sip' ? sipResult.multiplier : lumpsumResult.multiplier}x
                    </span>

                    <div className="space-y-3 mt-6 pt-5 border-t border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Total Capital Invested:</span>
                        <span className="font-bold text-slate-200">
                          {formatCurrency(calcMode === 'sip' ? sipResult.totalInvested : lumpsumResult.investedAmount, 'INR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Compounded Wealth Gained:</span>
                        <span className="font-black text-emerald-400">
                          +{formatCurrency(calcMode === 'sip' ? sipResult.wealthGained : lumpsumResult.wealthGained, 'INR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Est. Annual Dividend Cashflow:</span>
                        <span className="font-bold text-amber-300">
                          ~{formatCurrency(calcMode === 'sip' ? sipResult.futureValue * 0.025 : lumpsumResult.annualDividendAtMaturity, 'INR')}/yr
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    💡 <strong className="text-amber-300 font-bold">Power of 3-Year Holding:</strong> ₹{calcMode === 'sip' ? `${monthlyAmount.toLocaleString()}/month ki SIP` : `${lumpsumAmount.toLocaleString()} ka Lumpsum`} 30% CAGR compounders me invest karne par aapki wealth <strong>{calcMode === 'sip' ? sipResult.multiplier : lumpsumResult.multiplier} guna</strong> multiply hoti hai.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Buffett & Lynch Golden Rules */}
      {activeSubTab === 'golden_rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INVESTMENT_GOLDEN_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start space-x-4"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex-shrink-0">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-100">{rule.rule}</h4>
                  <span className="text-xs font-bold text-amber-400/90 block mb-1">{rule.hindi}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Full Investment Thesis Modal */}
      {selectedStockDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-100">{selectedStockDetail.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedStockDetail.ticker}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedStockDetail.sector} • {selectedStockDetail.industry}</p>
              </div>
              <button
                onClick={() => setSelectedStockDetail(null)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* In-depth Thesis Hindi */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                दीर्घकालिक निवेश थिसिस (Hindi Investment Thesis):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedStockDetail.thesis_summary_hi}
              </p>
            </div>

            {/* 3 Pillars for Long Term Investment */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">
                Why Invest for 3 - 5 Years? (Key Strengths):
              </span>
              {selectedStockDetail.why_invest_long_term.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Growth Tailwinds */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">
                🚀 Multi-Year Secular Tailwinds:
              </span>
              {selectedStockDetail.key_tailwinds.map((tailwind, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{tailwind}</span>
                </div>
              ))}
            </div>

            {/* Target & Accumulation Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Current Price</span>
                <span className="text-sm font-black text-slate-100">{formatCurrency(selectedStockDetail.current_price, 'INR')}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">1-Yr Target</span>
                <span className="text-sm font-black text-emerald-400">{formatCurrency(selectedStockDetail.target_1yr, 'INR')}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">3-Yr Multibagger</span>
                <span className="text-sm font-black text-amber-300">{formatCurrency(selectedStockDetail.target_3yr, 'INR')}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Dividend Yield</span>
                <span className="text-sm font-black text-emerald-400">{selectedStockDetail.dividend_yield}%</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedStockDetail(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
