import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenerResult, ScreenerFilter } from '../types';
import { screenerApi } from '../api';
import { DataTable, Column } from '../components/common/DataTable';
import { formatCurrency, getChangeColor, getScoreColor } from '../utils/formatters';
import { Filter, Play, Plus, Trash2, Award } from 'lucide-react';

export const Screener: React.FC = () => {
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ScreenerFilter[]>([
    { field: 'roic', operator: '>', value: 12 },
    { field: 'pe_ratio', operator: '<', value: 30 },
  ]);
  const navigate = useNavigate();

  const handleRun = () => {
    setLoading(true);
    screenerApi.run({ filters, limit: 50 })
      .then((res) => setResults(res.results))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleRun();
  }, []);

  const addFilterRow = () => {
    setFilters([...filters, { field: 'revenue_growth', operator: '>', value: 10 }]);
  };

  const removeFilterRow = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: string, value: any) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], [field]: value };
    setFilters(updated);
  };

  const columns: Column<ScreenerResult>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.name}</span> },
    { key: 'exchange', header: 'Exchange', render: (row) => <span className="text-xs text-slate-400">{row.exchange}</span> },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price, 'INR') },
    { key: 'change_pct', header: 'Change %', align: 'right', render: (row) => <span className={getChangeColor(row.change_pct)}>{row.change_pct}%</span> },
    { key: 'overall_score', header: 'Score', align: 'center', render: (row) => <span className={`font-black ${getScoreColor(row.overall_score)}`}>{row.overall_score}</span> },
    { key: 'roic', header: 'ROIC %', align: 'right', render: (row) => row.roic ? `${row.roic}%` : '—' },
    { key: 'pe_ratio', header: 'P/E', align: 'right', render: (row) => row.pe_ratio ? `${row.pe_ratio}x` : '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Filter className="w-6 h-6 text-blue-500" />
            <span>Advanced Quantitative Stock Screener</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Filter across 50+ fundamental, valuation, financial health, and technical indicators.</p>
        </div>
      </div>

      {/* Filter Builder Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Screening Criteria</h3>
        <div className="space-y-3">
          {filters.map((f, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <select
                value={f.field}
                onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs p-2 rounded-lg border border-slate-700"
              >
                <option value="roic">ROIC %</option>
                <option value="roe">ROE %</option>
                <option value="pe_ratio">P/E Ratio</option>
                <option value="revenue_growth">Revenue Growth YoY %</option>
                <option value="debt_to_equity">Debt to Equity</option>
                <option value="fcf_yield">FCF Yield %</option>
                <option value="piotroski_score">Piotroski Score</option>
                <option value="overall_score">Overall Score</option>
              </select>

              <select
                value={f.operator}
                onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs p-2 rounded-lg border border-slate-700 font-mono"
              >
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>

              <input
                type="number"
                value={f.value}
                onChange={(e) => updateFilter(idx, 'value', Number(e.target.value))}
                className="bg-slate-900 text-slate-200 text-xs p-2 rounded-lg border border-slate-700 w-28"
              />

              <button onClick={() => removeFilterRow(idx)} className="p-2 text-slate-500 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={addFilterRow}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Condition</span>
          </button>

          <button
            onClick={handleRun}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Screener</span>
          </button>
        </div>
      </div>

      {/* Screener Results */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matching Candidates ({results.length})</h3>
        </div>
        <DataTable
          columns={columns}
          data={results}
          onRowClick={(row) => navigate(`/stocks/${row.ticker}`)}
        />
      </div>
    </div>
  );
};
