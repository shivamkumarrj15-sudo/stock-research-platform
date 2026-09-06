import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { StockProfile } from './pages/StockProfile';
import { Screener } from './pages/Screener';
import { AIResearch } from './pages/AIResearch';
import { Watchlist } from './pages/Watchlist';
import { Portfolio } from './pages/Portfolio';
import { CalendarPage } from './pages/Calendar';
import { NewsPage } from './pages/News';
import { MarketsPage } from './pages/Markets';
import { StrategiesPage } from './pages/Strategies';
import { BacktestingPage } from './pages/Backtesting';
import { SettingsPage } from './pages/Settings';
import { AdminPage } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MomentumDividends } from './pages/MomentumDividends';
import { NSEBSETerminal } from './pages/NSEBSETerminal';
import { useAuthStore } from './store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return <AppLayout>{children}</AppLayout>;
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/nse-bse-terminal" element={<ProtectedRoute><NSEBSETerminal /></ProtectedRoute>} />
        <Route path="/propicks-ai" element={<ProtectedRoute><MomentumDividends /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
        <Route path="/stocks/:ticker" element={<ProtectedRoute><StockProfile /></ProtectedRoute>} />
        <Route path="/screener" element={<ProtectedRoute><Screener /></ProtectedRoute>} />
        <Route path="/ai-research" element={<ProtectedRoute><AIResearch /></ProtectedRoute>} />
        <Route path="/watchlists" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/strategies" element={<ProtectedRoute><StrategiesPage /></ProtectedRoute>} />
        <Route path="/backtesting" element={<ProtectedRoute><BacktestingPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
