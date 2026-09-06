import React, { useEffect, useState } from 'react';
import { calendarApi } from '../api';
import { DataTable, Column } from '../components/common/DataTable';
import { Calendar as CalendarIcon, DollarSign, Globe, Award } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [tab, setTab] = useState<'earnings' | 'dividends' | 'economic'>('earnings');
  const [earnings, setEarnings] = useState<any[]>([]);
  const [dividends, setDividends] = useState<any[]>([]);
  const [economic, setEconomic] = useState<any[]>([]);

  useEffect(() => {
    if (tab === 'earnings') calendarApi.getEarnings().then(setEarnings).catch(() => {});
    if (tab === 'dividends') calendarApi.getDividends().then(setDividends).catch(() => {});
    if (tab === 'economic') calendarApi.getEconomic().then(setEconomic).catch(() => {});
  }, [tab]);

  const earningsCols: Column<any>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className="text-slate-200">{row.name}</span> },
    { key: 'earnings_date', header: 'Earnings Date', render: (row) => row.earnings_date },
    { key: 'eps_estimate', header: 'EPS Est.', align: 'right', render: (row) => row.eps_estimate ?? '—' },
    { key: 'time_of_day', header: 'Timing', align: 'center', render: (row) => <span className="capitalize text-slate-400">{row.time_of_day}</span> },
  ];

  const dividendCols: Column<any>[] = [
    { key: 'ticker', header: 'Ticker', render: (row) => <span className="font-bold text-blue-400">{row.ticker}</span> },
    { key: 'ex_date', header: 'Ex-Date', render: (row) => row.ex_date },
    { key: 'pay_date', header: 'Pay Date', render: (row) => row.pay_date },
    { key: 'amount', header: 'Amount', align: 'right', render: (row) => `₹${row.amount}` },
    { key: 'yield', header: 'Yield %', align: 'right', render: (row) => `${row.yield}%` },
  ];

  const econCols: Column<any>[] = [
    { key: 'name', header: 'Event', render: (row) => <span className="font-bold text-slate-100">{row.name}</span> },
    { key: 'country', header: 'Country', render: (row) => <span className="text-slate-300">{row.country}</span> },
    { key: 'event_date', header: 'Date', render: (row) => new Date(row.event_date).toLocaleDateString() },
    { key: 'impact_level', header: 'Impact', align: 'center', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        row.impact_level === 'high' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
      }`}>
        {row.impact_level}
      </span>
    )},
    { key: 'previous_value', header: 'Previous', align: 'right', render: (row) => `${row.previous_value}${row.unit}` },
    { key: 'forecast_value', header: 'Forecast', align: 'right', render: (row) => `${row.forecast_value}${row.unit}` },
    { key: 'actual_value', header: 'Actual', align: 'right', render: (row) => row.actual_value ? `${row.actual_value}${row.unit}` : '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-500" />
          <span>Financial & Macro Calendar</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track earnings releases, ex-dividend dates, CPI, GDP, and central bank rate decisions.</p>
      </div>

      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'earnings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Earnings Calendar
        </button>
        <button
          onClick={() => setTab('dividends')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'dividends' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Dividend Calendar
        </button>
        <button
          onClick={() => setTab('economic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'economic' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Macro Economic Events
        </button>
      </div>

      {tab === 'earnings' && <DataTable columns={earningsCols} data={earnings} />}
      {tab === 'dividends' && <DataTable columns={dividendCols} data={dividends} />}
      {tab === 'economic' && <DataTable columns={econCols} data={economic} />}
    </div>
  );
};
