import React, { useEffect, useState } from 'react';
import { TechnicalAnalysis } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ScoreGauge } from '../common/ScoreGauge';

interface TechnicalsTabProps {
  ticker: string;
}

export const TechnicalsTab: React.FC<TechnicalsTabProps> = ({ ticker }) => {
  const [tech, setTech] = useState<TechnicalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getTechnical(ticker)
      .then((res) => setTech(res))
      .catch(() => setTech(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (!tech) return <div className="text-xs text-slate-400">Technical data unavailable.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <ScoreGauge score={tech.technical_score} label="Technical Score" size="lg" />
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">Short-Term Trend</span>
              <span className="font-bold text-emerald-400">{tech.trend.short_term}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">RSI (14)</span>
              <span className="font-bold text-slate-100">{tech.rsi} ({tech.rsi_signal})</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">MACD Signal</span>
              <span className="font-bold text-blue-400">{tech.macd_signal}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            {tech.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
};
