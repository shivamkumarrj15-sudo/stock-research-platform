import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  subValueColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  subValueColor = 'text-slate-400',
  icon
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-xl font-bold text-slate-100 mt-1">{value}</span>
        {subValue && (
          <span className={`text-xs mt-1 font-medium ${subValueColor}`}>
            {subValue}
          </span>
        )}
      </div>
      {icon && <div className="p-2.5 rounded-xl bg-slate-800/80 text-blue-400">{icon}</div>}
    </div>
  );
};
