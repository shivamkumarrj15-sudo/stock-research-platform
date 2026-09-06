import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-800/80 rounded-xl w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl" />
      </div>
      <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl" />
    </div>
  );
};
