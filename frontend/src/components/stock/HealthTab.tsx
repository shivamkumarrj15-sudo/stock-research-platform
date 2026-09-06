import React, { useEffect, useState } from 'react';
import { PiotroskiScore, BeneishMScore, AltmanZScore } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';

interface HealthTabProps {
  ticker: string;
}

export const HealthTab: React.FC<HealthTabProps> = ({ ticker }) => {
  const [health, setHealth] = useState<{ piotroski: PiotroskiScore; beneish: BeneishMScore; altman: AltmanZScore } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getHealth(ticker)
      .then((res) => setHealth(res))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (!health) return <div className="text-xs text-slate-400">Financial health data unavailable.</div>;

  const { piotroski, beneish, altman } = health;

  return (
    <div className="space-y-6">
      {/* Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Piotroski Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Piotroski F-Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{piotroski.score} / 9</div>
          <span className="text-xs font-semibold text-emerald-400 block mt-1">{piotroski.risk_level} Financial Position</span>
          <p className="text-xs text-slate-400 mt-2">{piotroski.interpretation}</p>
        </div>

        {/* Beneish M-Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beneish M-Score</span>
            <AlertOctagon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-slate-100">{beneish.score}</div>
          <span className={`text-xs font-semibold block mt-1 ${beneish.risk_level === 'LOW' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {beneish.risk_level} Manipulation Risk
          </span>
          <p className="text-[11px] text-slate-500 mt-2 italic">{beneish.disclaimer}</p>
        </div>

        {/* Altman Z-Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Altman Z-Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{altman.score}</div>
          <span className="text-xs font-semibold text-emerald-400 block mt-1">{altman.risk_level}</span>
          <p className="text-[11px] text-slate-500 mt-2 italic">{altman.disclaimer}</p>
        </div>
      </div>

      {/* Piotroski Breakdown Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Piotroski 9-Point Checklist Explanation</h3>
        <div className="space-y-3">
          {piotroski.items.map((item) => (
            <div key={item.criterion_id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-start space-x-3">
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">{item.criterion_id}. {item.name}</span>
                  <span className="text-[10px] text-slate-500">{item.group}</span>
                </div>
                <p className="text-slate-400 mt-0.5">{item.interpretation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
