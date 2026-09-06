import React from 'react';
import { Activity } from 'lucide-react';

export const DemoDataBanner: React.FC = () => {
  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3 text-xs text-emerald-200/90">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div>
          <span className="font-bold text-emerald-400">ANGEL ONE SMARTAPI LIVE:</span> Connected to Real-time NSE/BSE Market Data Feed & Real-time Ratios (P/E, P/B, ROE, ROIC).
        </div>
      </div>
      <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-mono text-emerald-300">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>LIVE MARKET</span>
      </div>
    </div>
  );
};
