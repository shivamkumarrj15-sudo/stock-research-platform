import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Bot, Settings, Search } from 'lucide-react';
import { useUIStore } from '../../store';

export const MobileBottomNav: React.FC = () => {
  const { setMobileMenuOpen } = useUIStore();

  const navItems = [
    { to: '/', label: 'Hub', icon: LayoutDashboard },
    { to: '/propicks-ai', label: 'ProPicks', icon: Zap },
    { to: '/ai-research', label: 'WarrenAI', icon: Bot, isHighlighted: true },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-3 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? item.isHighlighted
                    ? 'text-amber-400 font-extrabold scale-105'
                    : 'text-purple-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.isHighlighted && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
