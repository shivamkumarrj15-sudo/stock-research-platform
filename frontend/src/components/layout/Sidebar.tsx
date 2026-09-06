import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Filter,
  Bot,
  Bookmark,
  Briefcase,
  Calendar,
  Newspaper,
  Compass,
  History,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Zap,
  Sparkles,
  PieChart
} from 'lucide-react';
import { useUIStore, useAuthStore } from '../../store';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/nse-bse-terminal', label: 'NSE/BSE Terminal', icon: LineChart, badge: 'LIVE' },
    { to: '/propicks-ai', label: 'ProPicks AI (Momentum)', icon: Zap, badge: 'PRO' },
    { to: '/screener', label: 'Screener', icon: Filter },
    { to: '/ai-research', label: 'AI Assistant (WarrenAI)', icon: Bot },
    { to: '/watchlists', label: 'Watchlists', icon: Bookmark },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/markets', label: 'Markets & Charts', icon: TrendingUp },
    { to: '/calendar', label: 'Dividend Calendar', icon: Calendar },
    { to: '/news', label: 'News & Sentiment', icon: Newspaper },
    { to: '/strategies', label: 'Ideas & Strategies', icon: Compass },
    { to: '/backtesting', label: 'Backtesting', icon: History },
  ];

  if (user?.is_admin) {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <NavLink to="/" className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight leading-none">
                Investing<span className="text-amber-500">Pro</span> AI
              </span>
              <span className="text-[10px] text-purple-400 font-bold tracking-wider uppercase mt-1">
                Bharat Momentum Gems
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all relative ${
                  isActive
                    ? 'bg-purple-600/90 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-amber-500 text-slate-950 uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800">
        <NavLink
          to="/settings"
          className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};
