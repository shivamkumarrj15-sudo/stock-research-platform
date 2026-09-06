import React, { useEffect, useState } from 'react';
import { screenerApi } from '../api';
import { Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StrategiesPage: React.FC = () => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    screenerApi.getStrategies().then(setStrategies).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-500" />
          <span>Pre-Built Quantitative Strategy Templates</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configurable investment frameworks inspired by professional institutional research.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strat) => (
          <div key={strat.slug} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-md">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 mb-2">{strat.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{strat.description}</p>
              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Filter Rules:</span>
                {strat.filters.map((f: any, i: number) => (
                  <div key={i} className="text-xs text-slate-300 flex items-center justify-between bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="font-semibold text-blue-400">{f.field}</span>
                    <span>{f.operator} {f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/screener')}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <span>Run Strategy in Screener</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
