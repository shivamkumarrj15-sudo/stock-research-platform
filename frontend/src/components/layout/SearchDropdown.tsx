import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { stocksApi } from '../../api';
import { StockPrice } from '../../types';
import { useDebounce } from '../../hooks';
import { formatCurrency, getChangeColor } from '../../utils/formatters';

export const SearchDropdown: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) {
      setLoading(true);
      stocksApi.search(debouncedQuery)
        .then((res) => {
          setResults(res);
          setIsOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ticker: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/stocks/${ticker}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          placeholder="Search stocks by ticker, name, or ISIN (e.g. TCS, RELIANCE, AAPL)..."
          className="w-full bg-slate-950/80 text-slate-200 text-sm pl-10 pr-10 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          <div className="p-2 space-y-1">
            {results.map((item) => (
              <div
                key={item.ticker}
                onClick={() => handleSelect(item.ticker)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-sm">{item.ticker}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.exchange}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate max-w-xs">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">
                    {formatCurrency(item.price || item.market_cap, item.currency || 'INR')}
                  </div>
                  {item.change_pct !== undefined && (
                    <div className={`text-xs ${getChangeColor(item.change_pct)}`}>
                      {item.change_pct > 0 ? '+' : ''}{item.change_pct}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
