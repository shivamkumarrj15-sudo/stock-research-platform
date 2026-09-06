import React from 'react';
import { getScoreColor, getScoreBgColor } from '../../utils/formatters';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label = 'AI Score', size = 'md' }) => {
  const colorClass = getScoreColor(score);
  const bgClass = getScoreBgColor(score);

  const dimensionMap = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center rounded-full border-4 shadow-xl ${bgClass} ${dimensionMap[size]}`}>
        <span className={`font-black tracking-tighter ${colorClass}`}>
          {Math.round(score)}
        </span>
      </div>
      {label && <span className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">{label}</span>}
    </div>
  );
};
