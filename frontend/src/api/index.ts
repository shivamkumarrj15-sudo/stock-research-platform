import api from './client';
import { fetchLiveMarketQuote, resolveSymbolAndQuote, searchLiveSymbols } from './liveMarketFetcher';
import type {
  AuthTokens, User, StockPrice, StockScore, ValuationScenarios,
  PiotroskiScore, BeneishMScore, AltmanZScore, FinancialRatios,
  EarningsRecord, DividendRecord, NewsArticle, EconomicEvent,
  Watchlist, Portfolio, ScreenerResult, AIAnalysis, MarketOverview,
  TechnicalAnalysis, BacktestResult, ScreenerFilter
} from '../types';

// Helper to extract .data from AxiosResponse
const getData = <T>(promise: Promise<{ data: T }>): Promise<T> => promise.then((res) => res.data);

// ──── Auth ────
export const authApi = {
  register: (data: { email: string; password: string; full_name: string }) =>
    getData(api.post<User>('/auth/register', data)),
  login: (email: string, password: string) =>
    getData(api.post<AuthTokens>('/auth/login', { email, password })),
  me: () => getData(api.get<User>('/auth/me')),
};

// ──── Stocks ────
export const stocksApi = {
  search: async (query: string, exchange?: string) => {
    try {
      const res = await api.get<StockPrice[]>('/stocks/search', { params: { q: query, exchange } });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch (e) {
      // Fallback
    }
    const liveSuggestions = await searchLiveSymbols(query);
    return liveSuggestions.map((s) => ({
      ticker: s.symbol.replace('.NS', '').replace('.BO', ''),
      name: s.name,
      exchange: s.exchange,
      price: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      change: 0,
      change_pct: 0,
      market_cap: 0,
      week_52_high: 0,
      week_52_low: 0,
      data_freshness: 'REAL_TIME',
      updated_at: new Date().toISOString(),
      is_demo_data: false,
    })) as StockPrice[];
  },
  getProfile: async (ticker: string) => {
    try {
      const res = await api.get<StockPrice>(`/stocks/${ticker}`);
      if (res.data && res.data.price) return res.data;
    } catch (e) {
      // Fallback
    }
    const live = await resolveSymbolAndQuote(ticker);
    if (live) {
      return {
        ticker: live.ticker,
        name: live.name || `${live.ticker} Equity`,
        exchange: live.exchange,
        price: live.price,
        open: live.open,
        high: live.high,
        low: live.low,
        close: live.price,
        volume: 100000,
        change: Math.round((live.price * (live.change_pct / 100)) * 100) / 100,
        change_pct: live.change_pct,
        market_cap: 0,
        week_52_high: live.week_52_high,
        week_52_low: live.week_52_low,
        data_freshness: 'REAL_TIME',
        updated_at: new Date().toISOString(),
        is_demo_data: false,
      } as StockPrice;
    }
    throw new Error(`Profile unavailable for ${ticker}`);
  },
  getPrice: async (ticker: string) => {
    try {
      const res = await api.get<StockPrice>(`/stocks/${ticker}/price`);
      if (res.data && res.data.price) return res.data;
    } catch (e) {
      // Fallback to real market provider
    }
    const live = await resolveSymbolAndQuote(ticker);
    if (live) {
      return {
        ticker: live.ticker,
        name: live.name || `${live.ticker} Equity`,
        price: live.price,
        open: live.open,
        high: live.high,
        low: live.low,
        close: live.price,
        volume: 100000,
        change: Math.round((live.price * (live.change_pct / 100)) * 100) / 100,
        change_pct: live.change_pct,
        market_cap: 0,
        week_52_high: live.week_52_high,
        week_52_low: live.week_52_low,
        data_freshness: 'REAL_TIME',
        updated_at: new Date().toISOString(),
        is_demo_data: false,
      } as StockPrice;
    }
    throw new Error(`Price unavailable for ${ticker}`);
  },
  getFinancials: (ticker: string, period = 'annual') =>
    getData(api.get<any>(`/stocks/${ticker}/financials`, { params: { period } })),
  getRatios: (ticker: string) =>
    getData(api.get<FinancialRatios>(`/stocks/${ticker}/ratios`)),
  getValuation: (ticker: string) =>
    getData(api.get<ValuationScenarios>(`/stocks/${ticker}/valuation`)),
  getHealth: (ticker: string) =>
    getData(api.get<{ piotroski: PiotroskiScore; beneish: BeneishMScore; altman: AltmanZScore }>(`/stocks/${ticker}/health`)),
  getScore: (ticker: string) =>
    getData(api.get<StockScore>(`/stocks/${ticker}/score`)),
  getTechnical: (ticker: string) =>
    getData(api.get<TechnicalAnalysis>(`/stocks/${ticker}/technical`)),
  getEarnings: (ticker: string) =>
    getData(api.get<EarningsRecord[]>(`/stocks/${ticker}/earnings`)),
  getDividends: (ticker: string) =>
    getData(api.get<DividendRecord[]>(`/stocks/${ticker}/dividends`)),
  getNews: (ticker: string) =>
    getData(api.get<NewsArticle[]>(`/stocks/${ticker}/news`)),
  getPeers: (ticker: string) =>
    getData(api.get<StockPrice[]>(`/stocks/${ticker}/peers`)),
  getPriceHistory: async (ticker: string) => {
    try {
      const res = await api.get<any[]>(`/stocks/${ticker}/price-history`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch (e) {
      // Fallback
    }
    const live = await fetchLiveMarketQuote(ticker);
    if (live && live.history.length > 0) {
      return live.history;
    }
    return [];
  },
};

// ──── Market ────
export const marketApi = {
  getOverview: () => getData(api.get<MarketOverview>('/market/overview')),
  getTopMovers: (market = 'NSE') =>
    getData(api.get<{ gainers: StockPrice[]; losers: StockPrice[] }>('/market/top-movers', { params: { market } })),
};

// ──── Screener ────
export const screenerApi = {
  run: (payload: { filters?: ScreenerFilter[]; sort_by?: string; sort_direction?: string; limit?: number }) =>
    getData(api.post<{ count: number; results: ScreenerResult[] }>('/screener/run', payload)),
  getStrategies: () => getData(api.get<any[]>('/screener/strategies')),
  getFields: () => getData(api.get<Record<string, any>>('/screener/fields')),
  getRanking: (type: string, exchange?: string) =>
    getData(api.get<ScreenerResult[]>('/screener/run', { params: { sort_by: type, exchange } })),
};

// ──── Watchlist ────
export const watchlistApi = {
  getAll: () => getData(api.get<Watchlist[]>('/watchlists')),
  get: (id: string) => getData(api.get<Watchlist>(`/watchlists/${id}`)),
  create: (name: string, description = '') =>
    getData(api.post<Watchlist>('/watchlists', { name, description })),
  addStock: (watchlistId: string, ticker: string) =>
    getData(api.post<Watchlist>(`/watchlists/${watchlistId}/stocks`, { ticker })),
  removeStock: (watchlistId: string, ticker: string) =>
    getData(api.delete<Watchlist>(`/watchlists/${watchlistId}/stocks/${ticker}`)),
};

// ──── Portfolio ────
export const portfolioApi = {
  getAll: () => getData(api.get<Portfolio[]>('/portfolios')),
  get: (id: string) => getData(api.get<Portfolio>(`/portfolios/${id}`)),
  create: (name: string, description = '', currency = 'INR') =>
    getData(api.post<Portfolio>('/portfolios', { name, description, currency })),
  addPosition: (portfolioId: string, data: { ticker: string; quantity: number; buy_price: number; buy_date: string }) =>
    getData(api.post<Portfolio>(`/portfolios/${portfolioId}/positions`, data)),
  getAnalysis: (portfolioId: string) =>
    getData(api.get<any>(`/portfolios/${portfolioId}/analysis`)),
};

// ──── Calendar ────
export const calendarApi = {
  getEarnings: (from?: string, to?: string) =>
    getData(api.get<EarningsRecord[]>('/calendar/earnings', { params: { from, to } })),
  getDividends: (from?: string, to?: string) =>
    getData(api.get<DividendRecord[]>('/calendar/dividends', { params: { from, to } })),
  getEconomic: (country?: string, impact?: string) =>
    getData(api.get<EconomicEvent[]>('/calendar/economic', { params: { country, impact } })),
};

// ──── News ────
export const newsApi = {
  getMarket: (category = 'general', limit = 20) =>
    getData(api.get<NewsArticle[]>('/news/market', { params: { category, limit } })),
  getStock: (ticker: string, limit = 20) =>
    getData(api.get<NewsArticle[]>(`/news/stock/${ticker}`, { params: { limit } })),
};

// ──── AI ────
export const aiApi = {
  analyze: (ticker: string) =>
    getData(api.post<AIAnalysis>('/ai/analyze', { ticker })),
  compare: (tickers: string[]) =>
    getData(api.post<any>('/ai/compare', { tickers })),
  report: (ticker: string) =>
    getData(api.post<any>('/ai/report', { ticker })),
  chat: (message: string, history: any[], context_ticker?: string) =>
    getData(api.post<{ reply: string; confidence: string; data_timestamp: string; sources: string[] }>('/ai/chat', {
      message, history, context_ticker,
    })),
};

// ──── Backtesting ────
export const backtestApi = {
  run: (payload: { universe: string; strategy_name: string; initial_capital: number; filters?: ScreenerFilter[] }) =>
    getData(api.post<BacktestResult>('/backtesting/run', payload)),
};

// ──── Admin ────
export const adminApi = {
  getStatus: () => getData(api.get<any>('/admin/status')),
  getUsers: () => getData(api.get<any[]>('/admin/users')),
};
