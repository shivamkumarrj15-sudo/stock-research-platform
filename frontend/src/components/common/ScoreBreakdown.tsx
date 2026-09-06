import React from 'react';
import { getScoreColor } from '../../utils/formatters';

interface ComponentScore {
  name: string;
  score: number;
}

interface ScoreBreakdownProps {
  scores: ComponentScore[];
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {scores.map((item) => (
        <div key={item.name} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col">
          <span className="text-xs text-slate-400 font-medium truncate">{item.name}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
              {Math.round(item.score)}
            </span>
            <span className="text-[10px] text-slate-500">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                item.score >= 80 ? 'bg-emerald-500' : item.score >= 65 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
