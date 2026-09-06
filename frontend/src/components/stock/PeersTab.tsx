import React, { useEffect, useState } from 'react';
import { StockPrice } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { DataTable, Column } from '../common/DataTable';
import { formatCurrency, getChangeColor, getScoreColor } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

interface PeersTabProps {
  ticker: string;
}

export const PeersTab: React.FC<PeersTabProps> = ({ ticker }) => {
  const [peers, setPeers] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    stocksApi.getPeers(ticker)
      .then((res) => setPeers(res))
      .catch(() => setPeers([]))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;

  const columns: Column<StockPrice>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.name}</span> },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price, row.currency) },
    { key: 'change_pct', header: '24h %', align: 'right', render: (row) => <span className={getChangeColor(row.change_pct)}>{row.change_pct}%</span> },
    { key: 'pe_ratio', header: 'P/E', align: 'right', render: (row) => row.pe_ratio ? `${row.pe_ratio}x` : '—' },
    { key: 'market_cap', header: 'Market Cap', align: 'right', render: (row) => formatCurrency(row.market_cap, row.currency, true) },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peer Group Side-By-Side Comparison</h3>
      <DataTable
        columns={columns}
        data={peers}
        onRowClick={(row) => navigate(`/stocks/${row.ticker}`)}
      />
    </div>
  );
};
