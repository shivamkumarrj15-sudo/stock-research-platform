import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DemoDataBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 flex items-start space-x-3 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-amber-200/90 leading-relaxed">
        <span className="font-bold text-amber-400">DEMO MODE NOTICE:</span> Data displayed is retrieved from the Mock Data Provider interface. Connect your live financial data API keys (Alpha Vantage, FMP, NewsAPI, FRED) in environment settings to enable live production market feeds.
      </div>
    </div>
  );
};
