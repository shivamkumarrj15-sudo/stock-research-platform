import React, { useEffect, useState } from 'react';
import { Watchlist as WatchlistType } from '../types';
import { watchlistApi } from '../api';
import { DataTable, Column } from '../components/common/DataTable';
import { formatCurrency, getChangeColor } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Trash2 } from 'lucide-react';

export const Watchlist: React.FC = () => {
  const [lists, setLists] = useState<WatchlistType[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    watchlistApi.getAll().then((res) => {
      setLists(res);
      if (res.length > 0) setActiveListId(res[0].id);
    });
  }, []);

  const activeList = lists.find((l) => l.id === activeListId);

  const columns: Column<any>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.stock.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.stock.name}</span> },
    { key: 'exchange', header: 'Exchange', render: (row) => <span className="text-xs text-slate-400">{row.stock.exchange}</span> },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price, 'INR') },
    { key: 'change_pct', header: 'Change %', align: 'right', render: (row) => <span className={getChangeColor(row.change_pct)}>{row.change_pct}%</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <button
          onClick={(e) => {
            if (activeListId) {
              watchlistApi.removeStock(activeListId, row.stock.ticker).then(() => watchlistApi.getAll().then(setLists));
            }
          }}
          className="text-slate-500 hover:text-rose-400 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-500" />
            <span>My Research Watchlists</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Organize candidates across long-term, swing, and dividend strategies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Watchlists Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Watchlists</h3>
          {lists.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveListId(l.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeListId === l.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Watchlist Table */}
        <div className="md:col-span-3">
          {activeList ? (
            <DataTable
              columns={columns}
              data={activeList.items}
              onRowClick={(row) => navigate(`/stocks/${row.stock.ticker}`)}
            />
          ) : (
            <div className="text-xs text-slate-400">Select or create a watchlist to view candidates.</div>
          )}
        </div>
      </div>
    </div>
  );
};
