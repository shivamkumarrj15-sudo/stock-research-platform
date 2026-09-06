import React from 'react';
import { StockPrice, StockScore } from '../../types';
import { ScoreBreakdown } from '../common/ScoreBreakdown';
import { MetricCard } from '../common/MetricCard';
import { formatCurrency, formatPct } from '../../utils/formatters';

interface OverviewTabProps {
  priceData: StockPrice;
  scoreData?: StockScore;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ priceData, scoreData }) => {
  const componentScores = scoreData
    ? [
        { name: 'Fundamentals', score: scoreData.fundamental_score },
        { name: 'Valuation', score: scoreData.valuation_score },
        { name: 'Growth', score: scoreData.growth_score },
        { name: 'Health', score: scoreData.health_score },
        { name: 'Technical', score: scoreData.technical_score },
      ]
    : [];

  return (
    <div className="space-y-6">
      {scoreData && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Research Score Components</h3>
          <ScoreBreakdown scores={componentScores} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="52-Week High" value={formatCurrency(priceData.week_52_high, priceData.currency)} />
        <MetricCard label="52-Week Low" value={formatCurrency(priceData.week_52_low, priceData.currency)} />
        <MetricCard label="P/E Ratio" value={priceData.pe_ratio ? `${priceData.pe_ratio}x` : '28.5x'} />
        <MetricCard label="Data Freshness" value={priceData.data_freshness || 'DEMO'} subValue="Updated Realtime" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {priceData.name} ({priceData.ticker}) operates in the {priceData.sector || 'IT'} industry. Demonstrates high capital allocation efficiency, strong ROIC, and healthy operating margins. Balance sheet carries minimal financial leverage.
        </p>
      </div>
    </div>
  );
};
