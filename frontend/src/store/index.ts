import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Watchlist, Portfolio, Alert } from '../types';

// ──── Auth Store ────
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: { id: 'usr_demo', email: 'demo@stockiq.com', full_name: 'Demo Trader', subscription_tier: 'pro_plus', is_admin: true, created_at: '2026-08-30' },
      accessToken: 'demo_token',
      refreshToken: 'demo_refresh',
      isLoading: false,
      isAuthenticated: true,
      login: async (email: string, password: string) => {
        set({
          user: { id: 'usr_demo', email, full_name: email.split('@')[0], subscription_tier: 'pro_plus', is_admin: true, created_at: '2026-08-30' },
          accessToken: 'demo_token',
          refreshToken: 'demo_refresh',
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'auth-store' }
  )
);

// ──── Theme Store ────
interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
      },
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-store' }
  )
);

// ──── Watchlist Store ────
interface WatchlistState {
  watchlists: Watchlist[];
  selectedWatchlistId: string | null;
  setWatchlists: (watchlists: Watchlist[]) => void;
}

export const useWatchlistStore = create<WatchlistState>()((set) => ({
  watchlists: [],
  selectedWatchlistId: null,
  setWatchlists: (watchlists) => set({ watchlists }),
}));

// ──── Portfolio Store ────
interface PortfolioState {
  portfolios: Portfolio[];
  setPortfolios: (portfolios: Portfolio[]) => void;
}

export const usePortfolioStore = create<PortfolioState>()((set) => ({
  portfolios: [],
  setPortfolios: (portfolios) => set({ portfolios }),
}));

// ──── Alerts Store ────
interface AlertsState {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
}

export const useAlertsStore = create<AlertsState>()((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
}));

// ──── UI Store ────
interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed, sidebarOpen: get().sidebarCollapsed }),
}));
