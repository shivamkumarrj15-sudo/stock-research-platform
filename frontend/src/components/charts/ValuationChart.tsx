import React from 'react';
import { ValuationScenarios } from '../../types';
import { formatCurrency, formatPct } from '../../utils/formatters';

interface ValuationChartProps {
  scenarios: ValuationScenarios;
  currency?: string;
}

export const ValuationChart: React.FC<ValuationChartProps> = ({ scenarios, currency = 'INR' }) => {
  const { current_price, bear, base, bull, upside_pct } = scenarios;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fair Value Scenario Range</h3>
          <p className="text-xs text-slate-500 mt-1">Multi-scenario DCF & Relative Valuation Model</p>
        </div>
        <div className="mt-3 sm:mt-0 text-right">
          <span className="text-xs text-slate-400">Estimated Upside: </span>
          <span className={`text-lg font-extrabold ${upside_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPct(upside_pct)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Current Price</span>
          <div className="text-xl font-bold text-slate-100 mt-1">{formatCurrency(current_price, currency)}</div>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <span className="text-xs text-rose-400 font-semibold">Bear Case</span>
          <div className="text-xl font-bold text-rose-400 mt-1">{formatCurrency(bear.fair_value, currency)}</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-semibold">Base Case (Target)</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(base.fair_value, currency)}</div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
          <span className="text-xs text-blue-400 font-semibold">Bull Case</span>
          <div className="text-xl font-bold text-blue-400 mt-1">{formatCurrency(bull.fair_value, currency)}</div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Assumptions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">Bear Scenario:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {bear.key_assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Base Scenario:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {base.key_assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            <span className="font-bold text-blue-400 block mb-1">Bull Scenario:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {bull.key_assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
