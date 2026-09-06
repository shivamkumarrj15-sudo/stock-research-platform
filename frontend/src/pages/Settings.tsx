import React from 'react';
import { useAuthStore } from '../store';
import { Settings as SettingsIcon, Key, Shield, User } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-500" />
          <span>Platform Settings & API Configurations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage user credentials, data provider mode, and system parameters.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>User Profile</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold">Full Name</label>
            <input type="text" readOnly value={user?.full_name || 'Demo Trader'} className="w-full bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-slate-200" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold">Email Address</label>
            <input type="text" readOnly value={user?.email || 'demo@stockiq.com'} className="w-full bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-slate-200" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Data Provider & API Keys</span>
        </h3>
        <p className="text-xs text-slate-400">Environment keys read from backend `.env` configuration file.</p>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span>Provider Mode</span>
            <span className="font-bold text-amber-400">DATA_PROVIDER_MODE = MOCK (Demo)</span>
          </div>
          <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span>Market Data API (Alpha Vantage / YFinance)</span>
            <span className="text-slate-400">Default (yfinance fallback)</span>
          </div>
          <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span>AI Research Assistant API</span>
            <span className="text-slate-400">Mock Data / Local Reasoning Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
