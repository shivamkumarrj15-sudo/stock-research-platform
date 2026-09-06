import React from 'react';
import { SearchDropdown } from './SearchDropdown';
import { useAuthStore } from '../../store';
import { Bell, LogOut, Activity } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      <SearchDropdown />

      <div className="flex items-center space-x-4">
        {/* Live Angel One SmartAPI Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>ANGEL ONE SMARTAPI LIVE</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-slate-200 leading-tight">
              {user?.full_name || 'Shivam Kumar'}
            </span>
            <span className="text-[11px] text-emerald-400 font-bold uppercase">
              {user?.subscription_tier || 'Pro Plus'} Live Trader
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
