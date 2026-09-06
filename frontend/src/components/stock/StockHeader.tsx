import React from 'react';
import { StockPrice, StockScore } from '../../types';
import { formatCurrency, formatPct, getChangeColor } from '../../utils/formatters';
import { ScoreGauge } from '../common/ScoreGauge';
import { Building2, Globe, Bookmark, Plus } from 'lucide-react';

interface StockHeaderProps {
  priceData: StockPrice;
  scoreData?: StockScore;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ priceData, scoreData }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">{priceData.ticker}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {priceData.exchange || 'NSE'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-400 border border-blue-500/20">
              {priceData.currency || 'INR'}
            </span>
          </div>
          <h2 className="text-sm font-medium text-slate-400 mb-4">{priceData.name}</h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{priceData.sector || 'Information Technology'}</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{priceData.country || 'India'}</span>
            </span>
            <span className="text-slate-500">
              Market Cap: <strong className="text-slate-300">{formatCurrency(priceData.market_cap, priceData.currency || 'INR', true)}</strong>
            </span>
          </div>
        </div>

        {/* Current Price Display */}
        <div className="flex items-center space-x-8 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-8">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Current Price</span>
            <div className="text-3xl font-black text-slate-100 tracking-tight">
              {formatCurrency(priceData.price, priceData.currency || 'INR')}
            </div>
            <div className={`text-xs font-bold mt-1 flex items-center space-x-1 ${getChangeColor(priceData.change_pct)}`}>
              <span>{formatCurrency(priceData.change, priceData.currency || 'INR')}</span>
              <span>({formatPct(priceData.change_pct)})</span>
            </div>
          </div>

          {scoreData && (
            <ScoreGauge score={scoreData.overall_score} label="Research Score" size="md" />
          )}
        </div>
      </div>
    </div>
  );
};
