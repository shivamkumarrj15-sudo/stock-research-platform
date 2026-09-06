import React, { useEffect, useState } from 'react';
import { marketApi } from '../api';
import { MarketOverview } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { formatCurrency, getChangeColor } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketsPage: React.FC = () => {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    marketApi.getOverview().then(setOverview).catch(() => {});
  }, []);

  const moverCols: Column<any>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.name}</span> },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price, 'INR') },
    { key: 'change_pct', header: 'Change %', align: 'right', render: (row) => <span className={getChangeColor(row.change_pct)}>{row.change_pct}%</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <span>Global Markets Overview</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time indices snapshot, top gainers, and top decliners.</p>
      </div>

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Market Gainers</h3>
            <DataTable columns={moverCols} data={overview.top_gainers} onRowClick={(r) => navigate(`/stocks/${r.ticker}`)} />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Top Market Losers</h3>
            <DataTable columns={moverCols} data={overview.top_losers} onRowClick={(r) => navigate(`/stocks/${r.ticker}`)} />
          </div>
        </div>
      )}
    </div>
  );
};
