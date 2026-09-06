// Auth
export interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: 'free' | 'pro' | 'pro_plus';
  is_admin: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: User;
}

// Stock
export interface Stock {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  is_demo_data: boolean;
}

export interface StockPrice {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  sector: string;
  country: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  change_pct: number;
  market_cap: number;
  week_52_high: number;
  week_52_low: number;
  pe_ratio?: number;
  data_freshness: 'REAL_TIME' | 'DELAYED' | 'DEMO';
  updated_at: string;
  is_demo_data: boolean;
}

export interface PriceCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockScore {
  overall_score: number;
  fundamental_score: number;
  valuation_score: number;
  growth_score: number;
  health_score: number;
  technical_score: number;
  momentum_score: number;
  dividend_score: number;
  risk_score: number;
  quality_score: number;
  classification: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  is_demo_data: boolean;
}

export interface FinancialRatios {
  roe: number | null;
  roa: number | null;
  roic: number | null;
  gross_margin: number | null;
  operating_margin: number | null;
  ebitda_margin: number | null;
  net_margin: number | null;
  current_ratio: number | null;
  quick_ratio: number | null;
  debt_to_equity: number | null;
  interest_coverage: number | null;
  asset_turnover: number | null;
  pe_ratio: number | null;
  forward_pe: number | null;
  pb_ratio: number | null;
  ps_ratio: number | null;
  ev_ebitda: number | null;
  ev_revenue: number | null;
  peg_ratio: number | null;
  fcf_yield: number | null;
  dividend_yield: number | null;
  is_demo_data: boolean;
}

export interface FairValue {
  method: string;
  current_price: number;
  fair_value_low: number;
  fair_value_base: number;
  fair_value_high: number;
  upside_pct: number;
  assumptions: Record<string, any>;
  calculated_at: string;
  is_demo_data: boolean;
}

export interface ValuationScenarios {
  current_price: number;
  fair_value_base: number;
  fair_value_low: number;
  fair_value_high: number;
  upside_pct: number;
  bear: { fair_value: number; key_assumptions: string[] };
  base: { fair_value: number; key_assumptions: string[] };
  bull: { fair_value: number; key_assumptions: string[] };
}

export interface PiotroskiItem {
  criterion_id: number;
  name: string;
  description: string;
  formula: string;
  value: number | null;
  passed: boolean;
  group: string;
  interpretation: string;
}

export interface PiotroskiScore {
  score: number;
  items: PiotroskiItem[];
  risk_level: string;
  interpretation: string;
}

export interface BeneishMScore {
  score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  variables: Record<string, { value: number; desc: string }>;
  interpretation: string;
  disclaimer: string;
}

export interface AltmanZScore {
  score: number;
  zone: 'safe' | 'grey' | 'distress';
  risk_level: string;
  variables: Record<string, number>;
  interpretation: string;
  disclaimer: string;
}

export interface FinancialStatement {
  period: string;
  fiscal_year: number;
  revenue: number;
  gross_profit: number;
  operating_income: number;
  net_income: number;
  ebitda: number;
}

export interface EarningsRecord {
  earnings_date: string;
  period: string;
  fiscal_year: number;
  fiscal_quarter: number;
  eps_actual: number | null;
  eps_estimate: number | null;
  eps_surprise_pct: number | null;
  revenue_actual: number | null;
  revenue_estimate: number | null;
  revenue_surprise_pct: number | null;
  result: string;
  is_demo_data: boolean;
}

export interface DividendRecord {
  ex_date: string;
  pay_date: string;
  amount: number;
  frequency: string;
  dividend_yield: number;
  payout_ratio: number | null;
  fcf_coverage: number | null;
  is_demo_data: boolean;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source_name: string;
  published_at: string;
  sentiment_score: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  category: string;
  topics: string[];
  is_demo_data: boolean;
}

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  category: string;
  event_date: string;
  previous_value: number | null;
  forecast_value: number | null;
  actual_value: number | null;
  unit: string;
  impact_level: 'low' | 'medium' | 'high';
  source: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  items: Array<{
    stock: { ticker: string; name: string; exchange: string; sector: string };
    price: number;
    change_pct: number;
    added_at: string;
  }>;
  created_at: string;
}

export interface PortfolioPosition {
  id: string;
  stock: { ticker: string; name: string; sector: string };
  quantity: number;
  buy_price: number;
  buy_date: string;
  current_price: number;
  current_value: number;
  pnl: number;
  pnl_pct: number;
  weight_pct: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  currency: string;
  positions: PortfolioPosition[];
  total_invested: number;
  total_current_value: number;
  total_pnl: number;
  total_pnl_pct: number;
  created_at: string;
}

export interface Alert {
  id: string;
  stock: { ticker: string; name: string } | null;
  alert_type: string;
  condition: string;
  threshold_value: number;
  is_triggered: boolean;
  triggered_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ScreenerFilter {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==';
  value: number | string;
}

export interface ScreenerResult {
  ticker: string;
  name: string;
  exchange: string;
  price: number;
  change_pct: number;
  market_cap: number;
  sector: string;
  overall_score: number;
  pe_ratio: number | null;
  roic: number | null;
  revenue_growth: number | null;
  fair_value_upside: number | null;
  is_demo_data: boolean;
}

export interface AIAnalysis {
  ticker: string;
  verdict: string;
  business_quality: string;
  fundamentals: string;
  growth: string;
  financial_health: string;
  valuation: string;
  technical_picture: string;
  earnings: string;
  news_catalysts: string;
  risks: string[];
  bull_case: string;
  base_case: string;
  bear_case: string;
  invalidation_points: string[];
  overall_score: number;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  data_timestamp: string;
  sources: string[];
  disclaimer: string;
  is_demo_data: boolean;
}

export interface MarketOverview {
  indices: Array<{ name: string; ticker: string; value: number; change: number; change_pct: number; currency: string }>;
  top_gainers: ScreenerResult[];
  top_losers: ScreenerResult[];
  market_status: string;
  is_demo_data: boolean;
}

export interface TechnicalAnalysis {
  trend: { short_term: string; medium_term: string; long_term: string; strength: string };
  rsi: number;
  rsi_signal: string;
  macd: { value: number; signal: number; histogram: number };
  macd_signal: string;
  support_levels: number[];
  resistance_levels: number[];
  technical_score: number;
  components: {
    trend_score: number;
    momentum_score: number;
    volume_score: number;
    volatility_score: number;
    structure_score: number;
  };
  interpretation: string;
  is_demo_data: boolean;
}

export interface BacktestResult {
  strategy_name: string;
  universe: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  total_return_pct: number;
  cagr_pct: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
  win_rate_pct: number;
  num_trades: number;
  portfolio_values: Array<{ date: string; value: number }>;
  disclaimer: string;
  is_demo_data: boolean;
}
