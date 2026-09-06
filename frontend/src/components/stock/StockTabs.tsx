import React from 'react';

interface StockTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const StockTabs: React.FC<StockTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pro-research', label: '📄 Pro Research Report' },
    { id: 'benchmark-return', label: '📊 Return vs Benchmark' },
    { id: 'financials', label: 'Financials' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'health', label: 'Financial Health' },
    { id: 'technicals', label: 'Technicals' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'dividends', label: 'Dividends' },
    { id: 'news', label: 'News' },
    { id: 'peers', label: 'Peers' },
    { id: 'ai-analysis', label: 'AI Report' },
  ];

  return (
    <div className="border-b border-slate-800 mb-6 overflow-x-auto">
      <nav className="flex space-x-2 min-w-max pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-blue-500/5 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-xl'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
