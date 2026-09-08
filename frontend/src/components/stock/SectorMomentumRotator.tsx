import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Cpu,
  Truck,
  Building,
  Sprout,
  Coins,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Activity,
  Target,
  DollarSign,
  Compass,
  ArrowRightLeft,
  Flame,
  BarChart3,
  Scale
} from 'lucide-react';
import {
  SECTOR_CATEGORIES,
  FRESH_MOMENTUM_STOCKS,
  AUTO_EXIT_ALERTS,
  SectorCategory,
  FreshSectorPick,
  AutoExitAlert
} from '../../data/smcAndSectorData';

interface Props {
  onSelectStockForReport?: (ticker: string) => void;
  onSelectStockForReturn?: (ticker: string) => void;
}

export const SectorMomentumRotator: React.FC<Props> = ({
  onSelectStockForReport,
  onSelectStockForReturn,
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('defense_aerospace');
  const [selectedStockForSMC, setSelectedStockForSMC] = useState<FreshSectorPick | null>(FRESH_MOMENTUM_STOCKS[0]);
  const [viewMode, setViewMode] = useState<'SECTORS' | 'FRESH_BUYS' | 'AUTO_EXITS'>('FRESH_BUYS');

  const selectedSector = SECTOR_CATEGORIES.find((s) => s.id === selectedSectorId) || SECTOR_CATEGORIES[0];
  const sectorStocks = FRESH_MOMENTUM_STOCKS.filter((s) => s.sector_id === selectedSectorId);

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Truck': return <Truck className="w-4 h-4 text-blue-400" />;
      case 'Building': return <Building className="w-4 h-4 text-purple-400" />;
      case 'Sprout': return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'Coins': return <Coins className="w-4 h-4 text-amber-400" />;
      default: return <TrendingUp className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                Institutional SMC & Sector Alpha Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">Smart Money Concepts + Fresh Multi-Baggers</span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <span>🚀 Sector Momentum & High-Return Buy/Exit Radar</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pehle se return de chuke overvalued stocks ko <strong className="text-rose-400">Exit</strong> karein aur fresh institutional <strong className="text-emerald-400">SMC Order Block Demand Zones</strong> me high-return + high-dividend sector leaders me invest karein.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('FRESH_BUYS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'FRESH_BUYS'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Buys Tomorrow</span>
            </button>
            <button
              onClick={() => setViewMode('SECTORS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'SECTORS'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sector Allocator</span>
            </button>
            <button
              onClick={() => setViewMode('AUTO_EXITS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'AUTO_EXITS'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>🚨 Auto-Exit Radar ({AUTO_EXIT_ALERTS.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: FRESH BUYS TOMORROW (HIGH RETURN + HIGH DIVIDEND + SMC LIQUIDITY) */}
      {viewMode === 'FRESH_BUYS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FRESH_MOMENTUM_STOCKS.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => setSelectedStockForSMC(stock)}
                className={`bg-slate-900/90 border rounded-2xl p-5 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 ${
                  selectedStockForSMC?.ticker === stock.ticker
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-900'
                    : 'border-slate-800'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-100">{stock.ticker}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        BSE: {stock.bse_code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{stock.name}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    stock.action_signal === 'FRESH_BUY_TOMORROW'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {stock.signal_badge}
                  </span>
                </div>

                {/* Price & Target Row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 my-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Live Price</span>
                    <span className="text-sm font-black text-slate-100">₹{stock.price.toFixed(2)}</span>
                    <span className={`text-[10px] font-bold block ${stock.change_1d >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.change_1d >= 0 ? '+' : ''}{stock.change_1d}%
                    </span>
                  </div>
                  <div className="border-x border-slate-800">
                    <span className="text-[10px] text-emerald-400 block font-semibold">SMC Target</span>
                    <span className="text-sm font-black text-emerald-400">₹{stock.target_price.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-emerald-400 block">+{stock.fair_value_upside}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 block font-semibold">Dividend</span>
                    <span className="text-sm font-black text-amber-400">{stock.dividend_yield}%</span>
                    <span className="text-[10px] text-slate-400 block">₹{stock.dividend_per_share}/sh</span>
                  </div>
                </div>

                {/* SMC Highlights Bar */}
                <div className="space-y-2 text-xs my-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SMC Order Block:</span>
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">
                      ₹{stock.smc.order_block_zone.low} - ₹{stock.smc.order_block_zone.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Smart Money Score:</span>
                    <span className="font-bold text-emerald-400">{stock.smc.smart_money_accumulation_score}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Risk/Reward Ratio:</span>
                    <span className="font-mono text-amber-400 font-bold">{stock.smc.risk_reward_ratio}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectStockForReturn) onSelectStockForReturn(stock.ticker);
                    }}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors text-center"
                  >
                    Compare Return
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectStockForReport) onSelectStockForReport(stock.ticker);
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-colors text-center border border-slate-700"
                  >
                    Full SMC Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Stock SMC Deep Dive Dashboard */}
          {selectedStockForSMC && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                    SMC
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                      <span>{selectedStockForSMC.name} ({selectedStockForSMC.ticker})</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {selectedStockForSMC.smc.market_structure}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sector: <span className="text-slate-200 font-semibold">{selectedStockForSMC.sector_name}</span> | Industry: <span className="text-slate-200">{selectedStockForSMC.industry}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">SMC Stop Loss</span>
                    <span className="text-sm font-mono font-bold text-rose-400">₹{selectedStockForSMC.stop_loss.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Target Upside</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">₹{selectedStockForSMC.target_price.toFixed(2)} (+{selectedStockForSMC.fair_value_upside}%)</span>
                  </div>
                </div>
              </div>

              {/* SMC 4-Pillar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    1. Order Block (OB) Zone
                  </span>
                  <div className="text-sm font-black text-slate-100 font-mono">
                    ₹{selectedStockForSMC.smc.order_block_zone.low} - ₹{selectedStockForSMC.smc.order_block_zone.high}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedStockForSMC.smc.order_block_zone.description}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    2. Liquidity Sweep (SSL/BSL)
                  </span>
                  <div className="text-sm font-black text-amber-300 font-mono">
                    Swept at ₹{selectedStockForSMC.smc.liquidity_sweep.level}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedStockForSMC.smc.liquidity_sweep.description}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    3. Fair Value Gap (FVG)
                  </span>
                  <div className="text-sm font-black text-emerald-300 font-mono">
                    {selectedStockForSMC.smc.fair_value_gap_fvg.has_fvg
                      ? `₹${selectedStockForSMC.smc.fair_value_gap_fvg.fvg_low} - ₹${selectedStockForSMC.smc.fair_value_gap_fvg.fvg_high}`
                      : 'Balanced (No Imbalance)'}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedStockForSMC.smc.fair_value_gap_fvg.has_fvg
                      ? 'Bullish price inefficiency gap acts as high-probability magnet entry.'
                      : 'Efficient liquidity pricing.'}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                    4. Smart Money Bias
                  </span>
                  <div className="text-sm font-black text-purple-300">
                    {selectedStockForSMC.smc.institutional_bias.replace('_', ' ')}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Risk/Reward ratio <strong className="text-slate-200">{selectedStockForSMC.smc.risk_reward_ratio}</strong> with {selectedStockForSMC.dividend_yield}% cash dividend cushion.
                  </p>
                </div>
              </div>

              {/* Thesis & Catalysts */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">💡 Multi-Bagger Fundamental Thesis:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedStockForSMC.investment_thesis}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <strong className="text-emerald-400 block mb-1">🚀 High-Return Catalysts:</strong>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {selectedStockForSMC.catalysts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-rose-400 block mb-1">⚠️ Key Monitored Risks:</strong>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {selectedStockForSMC.key_risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SECTOR ALLOCATOR (CHOOSE ANY SECTOR TO GET TOP MOMENTUM PICKS) */}
      {viewMode === 'SECTORS' && (
        <div className="space-y-6">
          {/* Sector Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SECTOR_CATEGORIES.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectorId(sec.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedSectorId === sec.id
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {getSectorIcon(sec.icon_name)}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{sec.avg_1m_return_pct}% 1M
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-100 mb-1">{sec.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{sec.trend_label}</p>
              </button>
            ))}
          </div>

          {/* Selected Sector Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>{selectedSector.name} Sector Momentum Report</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Rank #{selectedSector.momentum_rank} in Dalal Street
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">{selectedSector.description}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Institutional Flow</span>
                <span className="text-xs font-black text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 inline-block">
                  {selectedSector.institutional_fii_dii_flow.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Recommended Stocks in Selected Sector */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Top Momentum Stocks Recommended to Buy in {selectedSector.name}:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorStocks.length > 0 ? (
                  sectorStocks.map((stk) => (
                    <div
                      key={stk.ticker}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-black text-slate-100">{stk.ticker}</h5>
                          <p className="text-[11px] text-slate-400">{stk.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-100 block">₹{stk.price.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block">+{stk.fair_value_upside}% Target</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>SMC Demand Zone:</span>
                          <span className="font-mono text-cyan-300 font-bold">₹{stk.smc.order_block_zone.low} - ₹{stk.smc.order_block_zone.high}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Dividend Yield:</span>
                          <span className="font-bold text-amber-400">{stk.dividend_yield}%</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Stop Loss:</span>
                          <span className="font-mono text-rose-400">₹{stk.stop_loss.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (onSelectStockForReturn) onSelectStockForReturn(stk.ticker);
                          }}
                          className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Compare Return
                        </button>
                        <button
                          onClick={() => {
                            if (onSelectStockForReport) onSelectStockForReport(stk.ticker);
                          }}
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[11px] transition-colors border border-slate-700"
                        >
                          SMC Breakdown
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-6 text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                    Scanning live institutional SMC order blocks for {selectedSector.name}... Top picks: {selectedSector.top_picks.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AUTO-EXIT & PROFIT BOOKING RADAR */}
      {viewMode === 'AUTO_EXITS' && (
        <div className="space-y-6">
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center space-x-2 text-rose-400 font-black text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>🚨 Capital Protection & Profit Booking Rules</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jab koi stock apna full multi-bagger cycle complete kar leta hai aur chart par <strong className="text-rose-400">Bearish CHoCH (Change of Character)</strong> ya <strong className="text-rose-400">Supply Zone Rejection</strong> dikhti hai, to ye algorithm turant Exit ya 50% Profit Book karne ka alert deta hai taaki aapka profit safe rahe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AUTO_EXIT_ALERTS.map((alert) => (
              <div
                key={alert.ticker}
                className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                      <span>{alert.name} ({alert.ticker})</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        +{alert.realized_gain_pct}% GAIN
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Buy Price: ₹{alert.entry_price.toFixed(2)} → Current: <strong className="text-slate-200">₹{alert.current_price.toFixed(2)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {alert.exit_status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/20 space-y-2">
                  <div className="text-xs font-bold text-rose-400">
                    ⚠️ SMC Technical Breakdown Reason:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.smc_exit_reason}</p>

                  <div className="pt-2 border-t border-slate-900 text-xs">
                    <strong className="text-slate-400 block mb-1 font-semibold">Triggers Fired:</strong>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                      {alert.technical_triggers.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30 text-xs">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Next Capital Rotation Step:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{alert.reinvestment_advice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
