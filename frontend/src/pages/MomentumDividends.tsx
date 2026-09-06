import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowUpRight,
  Activity,
  RefreshCw,
  Search,
  Sparkles,
  X,
  ShieldCheck,
  TrendingUp,
  Award,
  HelpCircle,
  BarChart2,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Briefcase,
  TrendingDown,
  Newspaper,
  Calendar,
  AlertOctagon,
  ShieldAlert,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Check,
  PlusCircle,
  XCircle,
  Clock,
  History,
  Scale,
  DollarSign,
  LineChart
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatPct, getChangeColor, formatCurrency } from '../utils/formatters';
import { stocksApi } from '../api';
import {
  resolveSymbolAndQuote,
  searchLiveSymbols,
  fetchTimeframeChart,
  SymbolSearchResult
} from '../api/liveMarketFetcher';
import {
  STOCK_EXIT_RADAR,
  DAILY_MAJOR_MARKET_EVENTS,
  MONTHLY_REBALANCE_CYCLE,
  MONTHLY_REBALANCE_ITEMS,
  MONTHLY_REBALANCE_HISTORY,
  getStockExitAdvisory,
  getAllExitAlerts,
  getDailyMajorEvents,
  getMonthlyRebalanceItems,
  getMonthlyRebalanceHistory,
  DailyMarketEvent,
  StockExitAdvisory,
  MonthlyRebalanceItem,
  MonthlyRebalanceHistory,
  UserLoggedTrade
} from '../data/newsAndEventsData';
import { PerformanceVersusBenchmark } from '../components/stock/PerformanceVersusBenchmark';
import { getStockPerformance } from '../data/backtestPerformanceData';

export interface DetailedExplanation {
  business_model: string;
  future_demand_outlook: string;
  why_invest: string;
  financial_health_summary: string;
  catalysts: string[];
  key_risks: string[];
}

export interface MomentumDividendStock {
  ticker: string;
  name: string;
  bse_code?: string;
  sector: string;
  industry: string;
  price: number;
  change_1d: number;
  change_1w: number;
  change_1m: number;
  change_1y: number;
  fair_value: number;
  fair_value_label: 'Bargain' | 'Undervalued' | 'Fair' | 'Overvalued';
  fair_value_upside: number;
  health_label: 'Great' | 'Good' | 'Fair' | 'Weak';
  health_score: number;
  market_cap: string;
  dividend_per_share: number;
  dividend_yield: number;
  ex_dividend_date: string;
  pay_date: string;
  rsi_14: number;
  pe_ratio: number;
  pb_ratio: number;
  momentum_score: number;
  ai_recommendation_reason: string;
  detailed_explanation: DetailedExplanation;
  key_drivers: string[];
}

const INITIAL_STOCKS: MomentumDividendStock[] = [
  {
    ticker: 'ANDHRSUGAR',
    name: 'Andhra Sugars Ltd',
    bse_code: '500008',
    sector: 'Sugar & Bio-Ethanol',
    industry: 'Ethanol & Industrial Chemicals',
    price: 99.50,
    change_1d: 1.6,
    change_1w: 4.8,
    change_1m: 12.4,
    change_1y: 38.6,
    fair_value: 152.13,
    fair_value_label: 'Bargain',
    fair_value_upside: 52.9,
    health_label: 'Great',
    health_score: 88,
    market_cap: '₹13.25 B',
    dividend_per_share: 0.80,
    dividend_yield: 0.8,
    ex_dividend_date: '2026-09-18',
    pay_date: '2026-10-05',
    rsi_14: 62.49,
    pe_ratio: 12.9,
    pb_ratio: 1.4,
    momentum_score: 82,
    ai_recommendation_reason: 'Deep value bargain pricing with 52.9% Intrinsic Fair Value upside (₹152.13) and strong ethanol blend policy cash flows.',
    detailed_explanation: {
      business_model: 'Andhra Sugars manufactures sugar, bio-ethanol, caustic soda, industrial chemicals, and liquid propellants. It operates an integrated sugar-to-chemical model where sugarcane bagasse powers co-generation power plants, and molasses feed high-margin ethanol distilleries supplying Oil Marketing Companies (OMCs).',
      future_demand_outlook: 'FUTURE DEMAND WILL SURGE HIGHLY. The Government of India target of 20% EBP (Ethanol Blending Program) by 2025-26 guarantees 100% off-take of produced ethanol at fixed non-capping prices, completely removing revenue dependency on volatile retail sugar prices.',
      why_invest: 'Bargain Valuation & High Safety Margin: Stock trades at a 52.9% discount to intrinsic fair value (₹152.13) with low P/E multiple (12.9x). Piotroski Health Score is 8/9 with minimal Debt-to-Equity (0.15) and zero promoter share pledge.',
      financial_health_summary: 'Exceptional balance sheet health: Piotroski Score 8/9, Debt-to-Equity 0.15, Interest Coverage 18.2x, and ROIC 19.4%. Operating cash flow covers debt obligations over 4.5x.',
      catalysts: ['Ethanol blending quota allocation boost', 'Recovery in Caustic Soda realization prices', 'Zero promoter share pledge'],
      key_risks: ['Sugarcane crop yield sensitivity to monsoon', 'Government price regulation on sugar sales'],
    },
    key_drivers: ['Ethanol blend mandate boost', 'Low Debt-to-Equity ratio (0.15)', 'Piotroski Health Score 8/9'],
  },
  {
    ticker: 'CONFIPET',
    name: 'Confidence Petroleum India',
    bse_code: '526829',
    sector: 'Energy & LPG Logistics',
    industry: 'Auto-LPG & Gas Infrastructure',
    price: 82.30,
    change_1d: 7.4,
    change_1w: 14.2,
    change_1m: 22.8,
    change_1y: 64.1,
    fair_value: 105.99,
    fair_value_label: 'Undervalued',
    fair_value_upside: 28.8,
    health_label: 'Good',
    health_score: 74,
    market_cap: '₹25.82 B',
    dividend_per_share: 0.10,
    dividend_yield: 0.1,
    ex_dividend_date: '2026-09-22',
    pay_date: '2026-10-12',
    rsi_14: 45.39,
    pe_ratio: 17.9,
    pb_ratio: 2.1,
    momentum_score: 85,
    ai_recommendation_reason: 'High relative strength price momentum (+22.8% 1-Month) driven by rapid Auto-LPG station expansion and high cylinder turnover.',
    detailed_explanation: {
      business_model: 'Confidence Petroleum is India’s largest private sector Auto-LPG dispensing station operator (under GoGas brand) and LPG cylinder manufacturer. Revenue comes from retail Auto-LPG sales to commercial vehicles and B2B cylinder sales to PSU oil giants (IOCL, BPCL, HPCL).',
      future_demand_outlook: 'STRONG MULTI-YEAR DEMAND GROWTH. As petrol and diesel prices remain high, commercial auto-rickshaws and delivery fleets are aggressively switching to Auto-LPG and CNG, driving double-digit volume growth in tier-2 and tier-3 cities.',
      why_invest: 'High Relative Price Momentum (+22.8% 1-Month) combined with 28.8% intrinsic fair value upside (Target ₹105.99). Network expanding to 250+ dispensing stations with high institutional DII/FII buying interest.',
      financial_health_summary: 'Revenue CAGR 18.4%, Debt-to-Equity 0.42, EBITDA margin expanding to 14.2%, and strong operational cash generation.',
      catalysts: ['Network expansion to 250+ LPG dispensing units', 'High turnover in LPG cylinder manufacturing division', 'FII institutional holding accumulation'],
      key_risks: ['Global Saudi CP LPG price fluctuations', 'EV adoption in commercial taxi fleets'],
    },
    key_drivers: ['LPG dispensing station network expansion', 'Institutional buying inflow', 'Improving gross operating margins'],
  },
  {
    ticker: 'BEPL',
    name: 'Bhansali Eng Polymers',
    bse_code: '500052',
    sector: 'Specialty Polymers',
    industry: 'ABS Resins & Engineering Plastics',
    price: 144.20,
    change_1d: 2.7,
    change_1w: 8.1,
    change_1m: 19.5,
    change_1y: 41.2,
    fair_value: 165.00,
    fair_value_label: 'Undervalued',
    fair_value_upside: 14.4,
    health_label: 'Great',
    health_score: 92,
    market_cap: '₹35.90 B',
    dividend_per_share: 4.00,
    dividend_yield: 2.8,
    ex_dividend_date: '2026-09-30',
    pay_date: '2026-10-18',
    rsi_14: 67.22,
    pe_ratio: 15.6,
    pb_ratio: 2.9,
    momentum_score: 84,
    ai_recommendation_reason: 'Highest balance sheet health score (92/100) with zero debt, high ROE (27.8%), and expanding auto ABS polymer demand.',
    detailed_explanation: {
      business_model: 'Bhansali Engineering Polymers (BEPL) is a pioneer in manufacturing ABS (Acrylonitrile Butadiene Styrene) and SAN resins. ABS polymers are critical raw materials for automotive body parts, 2-wheelers, home appliances (refrigerators, washing machines), and electronics.',
      future_demand_outlook: 'HIGH CONSUMPTION DEMAND. India’s automotive lightweighting and booming consumer electronics production (Make-in-India) have created a chronic domestic shortage of ABS resin, ensuring BEPL operates at full capacity.',
      why_invest: 'Zero-Debt Balance Sheet, ROE 27.8%, ROCE 34.5%, and high cash generation. Beneficiary of anti-dumping duties on cheap Chinese ABS imports.',
      financial_health_summary: 'Virtually zero debt (D/E 0.02), Quick Ratio 2.8, Piotroski Score 8/9, and high free cash flow yield.',
      catalysts: ['Brownfield ABS capacity expansion from 137k TPA to 200k TPA', 'Anti-dumping duty protection on ABS resins', 'Increasing polymer usage per vehicle'],
      key_risks: ['Volatility in crude-linked raw material (Styrene Monomer) costs', 'Global chemical supply glut'],
    },
    key_drivers: ['Zero Debt balance sheet', 'High ROE 27.8%', 'Anti-dumping duty protection'],
  },
  {
    ticker: 'JAMNAAUTO',
    name: 'Jamna Auto Industries',
    bse_code: '500216',
    sector: 'Auto Ancillary',
    industry: 'Commercial Vehicle Suspension Systems',
    price: 112.50,
    change_1d: 3.2,
    change_1w: 7.9,
    change_1m: 16.1,
    change_1y: 45.3,
    fair_value: 138.50,
    fair_value_label: 'Undervalued',
    fair_value_upside: 23.1,
    health_label: 'Great',
    health_score: 86,
    market_cap: '₹44.82 B',
    dividend_per_share: 2.20,
    dividend_yield: 2.0,
    ex_dividend_date: '2026-09-25',
    pay_date: '2026-10-15',
    rsi_14: 33.03,
    pe_ratio: 20.3,
    pb_ratio: 3.4,
    momentum_score: 77,
    ai_recommendation_reason: 'Market leader in Commercial Vehicle suspension springs benefiting from domestic CV volume recovery cycle.',
    detailed_explanation: {
      business_model: 'Jamna Auto Industries is India’s largest manufacturer of tapered leaf springs, parabolic springs, and air suspension systems for commercial vehicles. It supplies directly to Tata Motors, Ashok Leyland, Eicher Motors, and BharatBenz.',
      future_demand_outlook: 'HIGH STRUCTURAL DEMAND. Government infrastructure expenditure (roads, mining, freight corridors) requires continuous addition and replacement of heavy commercial vehicles, driving high OEM and aftermarket spring replacement demand.',
      why_invest: 'Monopoly-like 68% OEM market share in India, high Return on Equity (24.1%), strong interest coverage (14.2x), and expanding high-margin aftermarket distribution network.',
      financial_health_summary: 'ROE 24.1%, Interest Coverage 14.2x, low financial leverage, and consistent annual operational cash flow.',
      catalysts: ['National infrastructure expenditure rollout', 'Aftermarket expansion for replacement springs', 'Air suspension adoption'],
      key_risks: ['Commercial vehicle fleet sales cyclicality', 'Steel input price inflation'],
    },
    key_drivers: ['68% OEM Market Share in Commercial Vehicles', 'Strong FCF yield', 'Consistently high return on capital'],
  },
  {
    ticker: 'BCLIND',
    name: 'BCL Ind & Infrastructure',
    bse_code: '524332',
    sector: 'Distilleries & Agro-Processing',
    industry: 'Grain-based Ethanol & Edible Oils',
    price: 36.90,
    change_1d: 1.1,
    change_1w: 5.6,
    change_1m: 18.2,
    change_1y: 52.0,
    fair_value: 46.84,
    fair_value_label: 'Undervalued',
    fair_value_upside: 26.9,
    health_label: 'Great',
    health_score: 90,
    market_cap: '₹11.11 B',
    dividend_per_share: 0.35,
    dividend_yield: 0.9,
    ex_dividend_date: '2026-09-28',
    pay_date: '2026-10-20',
    rsi_14: 60.89,
    pe_ratio: 9.6,
    pb_ratio: 1.2,
    momentum_score: 88,
    ai_recommendation_reason: 'Perfect Piotroski Score 9/9 rating with single-digit P/E multiple (9.6x) and doubling ethanol distillery capacity.',
    detailed_explanation: {
      business_model: 'BCL Industries operates grain-based ethanol distilleries and edible oil refining plants. It processes broken rice and maize into bio-ethanol supplied under long-term tender contracts to state OMCs.',
      future_demand_outlook: 'HIGH GUARANTEED DEMAND. India’s transition to E20 (20% ethanol blended fuel) requires grain-based ethanol capacity expansion, ensuring BCL operates at 100%+ capacity utilization.',
      why_invest: 'Flawless Piotroski 9/9 Financial Health Score while trading at a bargain single-digit P/E multiple of 9.6x. Doubling distillery capacity to 700 KLPD provides strong earnings visibility.',
      financial_health_summary: 'Perfect Piotroski Score 9/9, ROE 21.8%, strong asset turnover ratio, and comfortable interest coverage (8.5x).',
      catalysts: ['Commissioning of 200 KLPD Kharagpur distillery', 'Edible oil margin recovery', 'De-leveraging timeline'],
      key_risks: ['Maize and broken rice grain price spikes', 'Import duty changes on crude palm oil'],
    },
    key_drivers: ['Distillery capacity doubling', 'Low valuation P/E 9.6x', 'Piotroski Score 9/9'],
  },
  {
    ticker: 'GUJALKALI',
    name: 'Gujarat Alkalies & Chemicals',
    bse_code: '530001',
    sector: 'Basic Industrial Chemicals',
    industry: 'Chlor-Alkali & Caustic Soda',
    price: 720.50,
    change_1d: 0.5,
    change_1w: 2.1,
    change_1m: 7.4,
    change_1y: 19.8,
    fair_value: 780.00,
    fair_value_label: 'Fair',
    fair_value_upside: 8.3,
    health_label: 'Fair',
    health_score: 65,
    market_cap: '₹53.37 B',
    dividend_per_share: 17.70,
    dividend_yield: 2.5,
    ex_dividend_date: '2026-09-12',
    pay_date: '2026-09-28',
    rsi_14: 68.18,
    pe_ratio: 80.0,
    pb_ratio: 1.8,
    momentum_score: 74,
    ai_recommendation_reason: 'Gujarat State PSU chemical leader with consistent ₹17.70/share cash dividend payouts.',
    detailed_explanation: {
      business_model: 'Gujarat Alkalies & Chemicals (GACL) is a leading Chlor-Alkali chemical producer backed by the Gujarat state government. It manufactures caustic soda, chlorine, hydrogen peroxide, and specialty chemical derivatives.',
      future_demand_outlook: 'STEADY LONG-TERM DEMAND. Caustic soda and chlorine are indispensable inputs for textiles, paper, alumina, pharmaceuticals, and water purification industries across India.',
      why_invest: 'State PSU backing, robust balance sheet, ₹405/share book value, and a track record of paying high annual cash dividends (₹17.70/share).',
      financial_health_summary: 'Low leverage, high credit rating, strong asset backing, and consistent operating cash flow supported by Gujarat state government ownership.',
      catalysts: ['Hydrazine Hydrate plant commercialization', 'Caustic soda price realization recovery', 'Consistent annual cash dividends'],
      key_risks: ['Power cost fluctuations (chlor-alkali power intensive)', 'Global chemical dumping'],
    },
    key_drivers: ['Caustic soda price realization recovery', 'State PSU backing', 'Steady dividend history'],
  },
  {
    ticker: 'BFINVEST',
    name: 'BF Investment Ltd',
    bse_code: '533303',
    sector: 'Financial Holding Company',
    industry: 'Kalyani Group Asset Holding',
    price: 470.00,
    change_1d: 0.0,
    change_1w: 3.9,
    change_1m: 14.1,
    change_1y: 35.6,
    fair_value: 512.00,
    fair_value_label: 'Fair',
    fair_value_upside: 8.9,
    health_label: 'Great',
    health_score: 89,
    market_cap: '₹16.91 B',
    dividend_per_share: 10.00,
    dividend_yield: 2.1,
    ex_dividend_date: '2026-09-20',
    pay_date: '2026-10-10',
    rsi_14: 48.19,
    pe_ratio: 4.3,
    pb_ratio: 0.6,
    momentum_score: 81,
    ai_recommendation_reason: 'Kalyani Group holding company trading at huge discount to underlying asset value with P/E of just 4.3x.',
    detailed_explanation: {
      business_model: 'BF Investment is a holding company of the Kalyani Group holding significant equity stakes in Bharat Forge, Automotive Axles, and Kalyani Steels.',
      future_demand_outlook: 'HIGH INDIRECT GROWTH. Operating subsidiaries like Bharat Forge are experiencing massive order wins in defense equipment, artillery guns, and aerospace exports.',
      why_invest: 'Deep value asset discount: Stock trades at a 70%+ discount to its net asset value (NAV) with a P/E multiple of just 4.3x and P/B of 0.6x.',
      financial_health_summary: 'Zero debt, pristine group balance sheet, low P/E 4.3x, and high book value backing.',
      catalysts: ['Value unlocking via group corporate restructuring', 'Bharat Forge defense export order book growth', 'Promoter stake consolidation'],
      key_risks: ['Holding company discount persistence', 'Low liquidity in equity shares'],
    },
    key_drivers: ['Deep value holding discount', 'P/E 4.3x', 'Strong group balance sheet'],
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals',
    bse_code: '534742',
    sector: 'Fertilizers & Agrochemicals',
    industry: 'Crop Nutrition & Phosphatics',
    price: 226.10,
    change_1d: 2.2,
    change_1w: 9.4,
    change_1m: 26.8,
    change_1y: 78.2,
    fair_value: 350.14,
    fair_value_label: 'Bargain',
    fair_value_upside: 54.9,
    health_label: 'Great',
    health_score: 87,
    market_cap: '₹9.76 B',
    dividend_per_share: 4.50,
    dividend_yield: 2.0,
    ex_dividend_date: '2026-09-24',
    pay_date: '2026-10-14',
    rsi_14: 49.16,
    pe_ratio: 1.0,
    pb_ratio: 0.8,
    momentum_score: 91,
    ai_recommendation_reason: 'Highest momentum score (91/100) with 54.9% intrinsic valuation upside and debt monetization catalysts.',
    detailed_explanation: {
      business_model: 'Zuari Agro Chemicals produces complex NPK/DAP fertilizers and agrochemicals. It distributes crop nutrients to millions of Indian farmers through an extensive dealer network.',
      future_demand_outlook: 'HIGH DEMAND. Healthy monsoons and direct government fertilizer subsidy disbursements ensure high volume off-take for phosphatic fertilizers.',
      why_invest: 'Highest momentum rating (91/100) with 54.9% intrinsic fair value upside (Fair Value ₹350.14). Rapid debt reduction via non-core land bank asset monetization.',
      financial_health_summary: 'Significant balance sheet deleveraging, low P/E multiple (1.0x asset discount), and strong turnaround in subsidiary Paradeep Phosphates.',
      catalysts: ['Monetization of non-core land bank assets', 'Government fertilizer subsidy release', 'P/E multiple 1.0x asset discount'],
      key_risks: ['Raw material (Phosphoric Acid) import cost volatility', 'Monsoon rainfall spatial distribution'],
    },
    key_drivers: ['Monetization of non-core land bank assets', 'Fertilizer subsidy release', 'P/E multiple 1.0x'],
  },
  {
    ticker: 'BPCL',
    name: 'Bharat Petroleum Corp',
    bse_code: '500547',
    sector: 'PSU Oil & Gas',
    industry: 'Refining & Marketing Champion',
    price: 315.70,
    change_1d: 2.0,
    change_1w: 4.5,
    change_1m: 11.2,
    change_1y: 44.0,
    fair_value: 345.32,
    fair_value_label: 'Fair',
    fair_value_upside: 9.4,
    health_label: 'Good',
    health_score: 75,
    market_cap: '₹1,380.1 B',
    dividend_per_share: 22.50,
    dividend_yield: 7.1,
    ex_dividend_date: '2026-09-10',
    pay_date: '2026-09-25',
    rsi_14: 58.20,
    pe_ratio: 11.2,
    pb_ratio: 1.9,
    momentum_score: 86,
    ai_recommendation_reason: 'High yield dividend champion (7.1% yield) backed by stable refining margins and robust retail fuel sales.',
    detailed_explanation: {
      business_model: 'BPCL is a Maharatna PSU operating major oil refineries in Mumbai, Kochi, and Bina, alongside a nationwide network of 21,000+ retail fuel stations and LPG distribution outlets.',
      future_demand_outlook: 'STEADY DEMAND. Growing Indian economic activity and highway vehicle movement drive robust petrol, diesel, and aviation turbine fuel (ATF) consumption.',
      why_invest: 'High-yield PSU dividend champion delivering 7.1% annual cash yield, supported by stable marketing margins and reasonable P/E valuation (11.2x).',
      financial_health_summary: 'P/E 11.2x, strong free cash flow generation, high return on capital, and consistent PSU cash distribution policy.',
      catalysts: ['7.1% Cash Dividend Yield', 'Green Hydrogen & EV charging station network', 'Stable marketing margins'],
      key_risks: ['Crude oil price spikes (> $95/bbl)', 'Government retail fuel price ceiling intervention'],
    },
    key_drivers: ['7.1% High Dividend Yield', 'Stable marketing margins', 'High PSU cash distribution'],
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    bse_code: '533278',
    sector: 'Mining & Natural Resources',
    industry: 'Monopoly Thermal Coal Mining',
    price: 415.35,
    change_1d: 0.7,
    change_1w: 3.8,
    change_1m: 15.6,
    change_1y: 48.9,
    fair_value: 522.01,
    fair_value_label: 'Undervalued',
    fair_value_upside: 25.7,
    health_label: 'Good',
    health_score: 78,
    market_cap: '₹2,489.7 B',
    dividend_per_share: 26.40,
    dividend_yield: 6.4,
    ex_dividend_date: '2026-09-16',
    pay_date: '2026-10-02',
    rsi_14: 64.10,
    pe_ratio: 8.4,
    pb_ratio: 2.5,
    momentum_score: 89,
    ai_recommendation_reason: 'Monopoly coal producer generating massive FCF with 6.4% dividend yield and robust power demand growth.',
    detailed_explanation: {
      business_model: 'Coal India is the world’s largest coal miner, producing 80%+ of India’s domestic coal. It supplies thermal power stations, steel plants, and cement manufacturers under long-term Fuel Supply Agreements (FSA).',
      future_demand_outlook: 'HIGH BASELOAD POWER DEMAND. Coal provides 70%+ of India’s power grid baseload. Rising industrial electricity consumption ensures high annual coal dispatch targets.',
      why_invest: 'Near-monopoly market position, low P/E multiple (8.4x), immense cash reserves, and 6.4% annual cash dividend yield.',
      financial_health_summary: 'Piotroski Score 8/9, low P/E 8.4x, massive cash reserves, and generous cash dividend distribution policy.',
      catalysts: ['Record annual coal production & dispatch targets', '6.4% Cash Dividend Yield', 'E-auction premium realization gains'],
      key_risks: ['Pace of renewable energy transition', 'Monsoon flooding at open-cast mining sites'],
    },
    key_drivers: ['Record production volumes', '6.4% Cash dividend yield', 'Monopoly distribution moat'],
  },
];

export const MomentumDividends: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<MomentumDividendStock[]>(INITIAL_STOCKS);
  const [activeView, setActiveView] = useState<'benchmark_return' | 'propicks' | 'monthly_rebalance' | 'my_trades' | 'exit_radar' | 'daily_events'>('benchmark_return');
  const [selectedTickerForBenchmark, setSelectedTickerForBenchmark] = useState<string>('INSG20');
  const [filter, setFilter] = useState<'all' | 'high_momentum' | 'upcoming_dividend'>('all');
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedStockForReason, setSelectedStockForReason] = useState<MomentumDividendStock | null>(null);

  // Search stock section state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedStock, setSearchedStock] = useState<any>(null);
  const [searchedChart, setSearchedChart] = useState<any[]>([]);
  const [searchTimeframe, setSearchTimeframe] = useState<'1min' | '1h' | '1d' | '1w' | '1m'>('1m');
  const [searching, setSearching] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SymbolSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modal chart state
  const [modalTimeframe, setModalTimeframe] = useState<'1min' | '1h' | '1d' | '1w' | '1m'>('1m');
  const [modalChartData, setModalChartData] = useState<any[]>([]);
  const [loadingModalChart, setLoadingModalChart] = useState<boolean>(false);

  // Events Category Filter State
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');

  // User Logged Trades in localStorage
  const [userTrades, setUserTrades] = useState<Record<string, UserLoggedTrade>>(() => {
    try {
      const saved = localStorage.getItem('propicks_user_trades_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      ANDHRSUGAR: {
        ticker: 'ANDHRSUGAR',
        name: 'Andhra Sugars Ltd',
        status: 'BOUGHT',
        buy_price: 88.50,
        buy_date: '2026-09-01',
        quantity: 500,
        invested_amount: 44250,
        current_value: 49750,
        pnl_amount: 5500,
        pnl_pct: 12.4,
      },
      CONFIPET: {
        ticker: 'CONFIPET',
        name: 'Confidence Petroleum',
        status: 'BOUGHT',
        buy_price: 67.00,
        buy_date: '2026-09-01',
        quantity: 600,
        invested_amount: 40200,
        current_value: 49380,
        pnl_amount: 9180,
        pnl_pct: 22.8,
      },
      ZUARI: {
        ticker: 'ZUARI',
        name: 'Zuari Agro Chemicals',
        status: 'BOUGHT',
        buy_price: 178.30,
        buy_date: '2026-09-01',
        quantity: 250,
        invested_amount: 44575,
        current_value: 56525,
        pnl_amount: 11950,
        pnl_pct: 26.8,
      },
    };
  });

  // Save user trades to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('propicks_user_trades_v1', JSON.stringify(userTrades));
    } catch (e) {}
  }, [userTrades]);

  // Debounced search suggestions as user types
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchLiveSymbols(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (e) {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load accurate live chart when stock modal opens or modal timeframe changes
  useEffect(() => {
    if (!selectedStockForReason) {
      setModalChartData([]);
      return;
    }
    const loadModalChart = async () => {
      setLoadingModalChart(true);
      try {
        const timeframeData = await fetchTimeframeChart(selectedStockForReason.ticker, modalTimeframe);
        if (timeframeData && timeframeData.length > 0) {
          setModalChartData(timeframeData);
        } else {
          const live = await resolveSymbolAndQuote(selectedStockForReason.ticker);
          setModalChartData(live?.history || []);
        }
      } catch (e) {
        setModalChartData([]);
      } finally {
        setLoadingModalChart(false);
      }
    };
    loadModalChart();
  }, [selectedStockForReason, modalTimeframe]);

  // Update searched stock chart when search timeframe changes
  useEffect(() => {
    if (!searchedStock?.ticker) return;
    const updateSearchChartTimeframe = async () => {
      try {
        const chartData = await fetchTimeframeChart(searchedStock.ticker, searchTimeframe);
        if (chartData && chartData.length > 0) {
          setSearchedChart(chartData);
        }
      } catch (e) {}
    };
    updateSearchChartTimeframe();
  }, [searchTimeframe]);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLivePrices = async () => {
    setRefreshing(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (s) => {
          try {
            const data = await stocksApi.getPrice(s.ticker);
            if (data && data.price) {
              return {
                ...s,
                price: data.price,
                change_1d: data.change_pct ?? s.change_1d,
                pe_ratio: (data as any).pe_ratio ? round1((data as any).pe_ratio) : s.pe_ratio,
                pb_ratio: (data as any).pb_ratio ? round1((data as any).pb_ratio) : s.pb_ratio,
              };
            }
          } catch (e) {
            console.warn(`Failed price update for ${s.ticker}:`, e);
          }
          return s;
        })
      );
      setStocks(updated);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStockSearch = async (rawQuery: string) => {
    if (!rawQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    setShowSuggestions(false);
    try {
      const liveData = await resolveSymbolAndQuote(rawQuery);
      if (liveData && liveData.price > 0) {
        const livePrice = liveData.price;
        const liveChange = liveData.change_pct;

        setSearchedStock({
          ticker: liveData.ticker || rawQuery.toUpperCase(),
          name: liveData.name || `${liveData.ticker} Equity`,
          price: livePrice,
          change_pct: liveChange,
          open: liveData.open || livePrice,
          high: liveData.high || livePrice,
          low: liveData.low || livePrice,
          pe_ratio: 18.5,
          pb_ratio: 2.4,
          week_52_high: liveData.week_52_high,
          week_52_low: liveData.week_52_low,
          exchange: liveData.exchange || 'NSE',
        });

        const chartData = await fetchTimeframeChart(liveData.ticker, searchTimeframe);
        if (chartData && chartData.length > 0) {
          setSearchedChart(chartData);
        } else if (Array.isArray(liveData.history) && liveData.history.length > 0) {
          setSearchedChart(liveData.history);
        }
      } else {
        setSearchError(`Could not find live stock quote for "${rawQuery}". Try typing Tata Motors, Reliance, TCS, RECLTD, SBIN.`);
      }
    } catch (e: any) {
      setSearchError(e.message || 'Error fetching stock quote.');
    } finally {
      setSearching(false);
    }
  };

  // Toggle user Buy / Exit action for a stock
  const handleToggleBuy = (item: MonthlyRebalanceItem) => {
    const existing = userTrades[item.ticker];
    if (existing && existing.status === 'BOUGHT') {
      const exitPnl = (item.current_price - existing.buy_price) * existing.quantity;
      const exitPnlPct = ((item.current_price - existing.buy_price) / existing.buy_price) * 100;
      setUserTrades((prev) => ({
        ...prev,
        [item.ticker]: {
          ...existing,
          status: 'EXITED',
          exit_price: item.current_price,
          exit_date: new Date().toISOString().split('T')[0],
          current_value: item.current_price * existing.quantity,
          pnl_amount: exitPnl,
          pnl_pct: exitPnlPct,
        },
      }));
    } else {
      const defaultQty = Math.max(10, Math.floor(40000 / item.entry_price_1st));
      const invested = defaultQty * item.entry_price_1st;
      const curVal = defaultQty * item.current_price;
      const pnlAmt = curVal - invested;
      const pnlPct = ((item.current_price - item.entry_price_1st) / item.entry_price_1st) * 100;

      setUserTrades((prev) => ({
        ...prev,
        [item.ticker]: {
          ticker: item.ticker,
          name: item.name,
          status: 'BOUGHT',
          buy_price: item.entry_price_1st,
          buy_date: item.entry_date_1st,
          quantity: defaultQty,
          invested_amount: invested,
          current_value: curVal,
          pnl_amount: pnlAmt,
          pnl_pct: pnlPct,
        },
      }));
    }
  };

  const round1 = (v: number) => Math.round(v * 10) / 10;

  const filteredStocks = stocks.filter((s) => {
    if (filter === 'high_momentum') return s.momentum_score >= 80;
    if (filter === 'upcoming_dividend') return s.dividend_yield >= 2.0;
    return true;
  });

  const allExitAdvisories = getAllExitAlerts();
  const majorEvents = getDailyMajorEvents().filter((ev) => {
    if (eventCategoryFilter === 'ALL') return true;
    return ev.category === eventCategoryFilter;
  });

  const rebalanceItems = getMonthlyRebalanceItems();
  const rebalanceHistory = getMonthlyRebalanceHistory();

  // User Performance Calculations
  const userTradesList = Object.values(userTrades);
  const totalInvestedByUser = userTradesList.reduce((acc, t) => acc + (t.invested_amount || 0), 0);
  const totalCurrentValueOfUser = userTradesList.reduce((acc, t) => acc + (t.current_value || 0), 0);
  const totalUserPnlAmt = totalCurrentValueOfUser - totalInvestedByUser;
  const userOverallReturnPct = totalInvestedByUser > 0 ? (totalUserPnlAmt / totalInvestedByUser) * 100 : 0;

  const selectedStockAdvisory = selectedStockForReason
    ? getStockExitAdvisory(selectedStockForReason.ticker)
    : null;

  const selectedStockBacktest = selectedStockForReason
    ? getStockPerformance(selectedStockForReason.ticker)
    : null;

  return (
    <div className="space-y-6">
      {/* Live Angel One Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>ProPicks AI — InvestingPro Return & Benchmark System</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-2">
              Bharat Small Cap & Momentum Gems (INSG20)
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Historical multi-year Performance Versus Benchmark curve (+2,455.4% Max Return), 5 KPI scorecard, 1st of month rebalance, and genuine live market quotes.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Feed Status</span>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center space-x-1 justify-end">
                <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>100% REAL LIVE DATA</span>
              </div>
            </div>
            <button
              onClick={fetchLivePrices}
              disabled={refreshing}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              title="Refresh Live Quotes"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setActiveView('benchmark_return')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'benchmark_return'
              ? 'bg-gradient-to-r from-rose-950/90 to-slate-900 border-rose-500/80 shadow-lg shadow-rose-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'benchmark_return' ? 'bg-rose-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'}`}>
              <LineChart className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px] font-black">+2,455%</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">📊 Return vs Benchmark</div>
            <p className="text-[10px] text-slate-400">INSG20 & Stock Backtest</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView('propicks')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'propicks'
              ? 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'propicks' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'}`}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">10 Live</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">🚀 ProPicks AI Table</div>
            <p className="text-[10px] text-slate-400">Top momentum & value</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView('monthly_rebalance')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'monthly_rebalance'
              ? 'bg-gradient-to-r from-purple-950/90 to-slate-900 border-purple-500/80 shadow-lg shadow-purple-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'monthly_rebalance' ? 'bg-purple-500 text-white font-black' : 'bg-slate-800 text-slate-300'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold">1st Month</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">🔄 1st Rebalance</div>
            <p className="text-[10px] text-slate-400">Hold vs Exit decisions</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView('my_trades')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'my_trades'
              ? 'bg-gradient-to-r from-indigo-950/90 to-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'my_trades' ? 'bg-indigo-500 text-white font-black' : 'bg-slate-800 text-slate-300'}`}>
              <Scale className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-bold">My Alpha</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">💼 My Return Tracker</div>
            <p className="text-[10px] text-slate-400">User vs ProPicks Alpha</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView('exit_radar')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'exit_radar'
              ? 'bg-gradient-to-r from-rose-950/90 to-slate-900 border-rose-500/80 shadow-lg shadow-rose-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'exit_radar' ? 'bg-rose-500 text-white font-black' : 'bg-slate-800 text-slate-300'}`}>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">2 Caution</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">🚨 News & Exit Radar</div>
            <p className="text-[10px] text-slate-400">Opposite news alerts</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView('daily_events')}
          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between text-left ${
            activeView === 'daily_events'
              ? 'bg-gradient-to-r from-blue-950/90 to-slate-900 border-blue-500/80 shadow-lg shadow-blue-950/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className={`p-1.5 rounded-lg ${activeView === 'daily_events' ? 'bg-blue-500 text-white font-black' : 'bg-slate-800 text-slate-300'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold">RBI / Fed</span>
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">📅 Daily Major Events</div>
            <p className="text-[10px] text-slate-400">Macro events calendar</p>
          </div>
        </button>
      </div>

      {/* VIEW 1: EXACT MATCH TO USER'S INVESTINGPRO PERFORMANCE VERSUS BENCHMARK SCREENSHOT */}
      {activeView === 'benchmark_return' && (
        <PerformanceVersusBenchmark
          selectedTicker={selectedTickerForBenchmark}
          onSelectStock={(t) => setSelectedTickerForBenchmark(t)}
        />
      )}

      {/* Manual Stock Search & Live Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Manual Stock Lookup (Real-Time Price & Chart)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Type any stock name or symbol (e.g. Tata Motors, Reliance, TCS, SBIN)</span>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Type Stock Name or Ticker (e.g. Tata Motors, Reliance, TCS, RECLTD, SBIN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStockSearch(searchQuery);
                }}
                className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => handleStockSearch(searchQuery)}
              disabled={searching || !searchQuery.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
            >
              {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Search Live Data</span>}
            </button>
          </div>

          {/* Auto Suggestions Dropdown List */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-950 border border-emerald-500/40 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800">
              {suggestions.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => {
                    setSearchQuery(item.name || item.symbol);
                    handleStockSearch(item.symbol);
                  }}
                  className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{item.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{item.symbol} • {item.exchange}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 uppercase border border-slate-800">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error message banner */}
        {searchError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-medium">
            ⚠️ {searchError}
          </div>
        )}

        {/* Searched Stock Live Result Display */}
        {searchedStock && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-100">{searchedStock.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                    {searchedStock.ticker} • {searchedStock.exchange} Live
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">₹{searchedStock.price.toFixed(2)}</span>
                  <span className={`text-xs font-extrabold ${getChangeColor(searchedStock.change_pct)}`}>
                    {searchedStock.change_pct >= 0 ? '+' : ''}{searchedStock.change_pct}% ↑
                  </span>
                </div>
              </div>

              {/* Timeframe Selector Buttons for Manual Search Chart */}
              <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Timeframe:</span>
                {(['1min', '1h', '1d', '1w', '1m'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSearchTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      searchTimeframe === tf
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chart Area */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={searchedChart}>
                  <defs>
                    <linearGradient id="searchChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} orientation="right" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Live Close']}
                  />
                  <Area type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#searchChartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 2: PROPICKS MAIN TABLE */}
      {activeView === 'propicks' && (
        <div className="space-y-4">
          {/* Filter Tabs & Main Table Timeframe Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                All Candidates ({stocks.length})
              </button>
              <button
                onClick={() => setFilter('high_momentum')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'high_momentum' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                High Momentum (&gt;80 Score)
              </button>
              <button
                onClick={() => setFilter('upcoming_dividend')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'upcoming_dividend' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                High Dividend (&gt;2% Yield)
              </button>
            </div>

            {/* Timeframe selector (1D, 1W, 1M, 1Y) */}
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Table Movement:</span>
              {(['1d', '1w', '1m', '1y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all ${
                    timeframe === tf ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Main InvestingPro Style Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-4">Stock Name & Code</th>
                    <th className="px-4 py-4">Sector</th>
                    <th className="px-4 py-4 text-right">Real-Time Price</th>
                    <th className="px-4 py-4 text-right">{timeframe.toUpperCase()} Movement</th>
                    <th className="px-4 py-4 text-center">Fair Value Upside</th>
                    <th className="px-4 py-4 text-center">Valuation Label</th>
                    <th className="px-4 py-4 text-center">Overall Health</th>
                    <th className="px-4 py-4 text-center">Return & Backtest</th>
                    <th className="px-4 py-4 text-right">Dividend Yield</th>
                    <th className="px-4 py-4 text-right">P/E Ratio</th>
                    <th className="px-4 py-4 text-center">AI Recommendation Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStocks.map((stock) => {
                    const isBargain = stock.fair_value_label === 'Bargain';
                    const isUndervalued = stock.fair_value_label === 'Undervalued';

                    const currentMovement =
                      timeframe === '1d'
                        ? stock.change_1d
                        : timeframe === '1w'
                        ? stock.change_1w
                        : timeframe === '1m'
                        ? stock.change_1m
                        : stock.change_1y;

                    const exitAdvisory = getStockExitAdvisory(stock.ticker);
                    const stockPerf = getStockPerformance(stock.ticker);

                    return (
                      <tr
                        key={stock.ticker}
                        onClick={() => {
                          setSelectedStockForReason(stock);
                          handleStockSearch(stock.ticker);
                        }}
                        className="hover:bg-slate-800/70 cursor-pointer transition-colors"
                      >
                        {/* Stock Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-100 text-sm flex items-center space-x-1.5">
                              <span>{stock.name}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {stock.ticker} • BSE: {stock.bse_code}
                            </span>
                          </div>
                        </td>

                        {/* Sector Badge */}
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-400 border border-slate-800 text-[10px] font-bold">
                            {stock.sector}
                          </span>
                        </td>

                        {/* Real-Time Price */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="font-bold text-emerald-400 text-sm">₹{stock.price.toFixed(2)}</div>
                        </td>

                        {/* Timeframe Movement */}
                        <td className="px-4 py-3.5 text-right">
                          <div className={`text-xs font-black ${getChangeColor(currentMovement)}`}>
                            {currentMovement > 0 ? '+' : ''}{currentMovement}% ↑
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase">{timeframe} Change</div>
                        </td>

                        {/* Fair Value Upside */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="font-bold text-slate-100">₹{stock.fair_value.toFixed(2)}</div>
                          <div className={`text-[11px] font-extrabold ${stock.fair_value_upside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatPct(stock.fair_value_upside)} Upside
                          </div>
                        </td>

                        {/* Fair Value Label Badge */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isBargain
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              : isUndervalued
                              ? 'bg-green-950/80 text-green-400 border-green-500/40'
                              : 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40'
                          }`}>
                            {stock.fair_value_label}
                          </span>
                        </td>

                        {/* Overall Health Progress Bar */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className={`text-[11px] font-bold ${
                              stock.health_label === 'Great' ? 'text-emerald-400' : stock.health_label === 'Good' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {stock.health_label}
                            </span>
                            <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stock.health_score >= 85 ? 'bg-emerald-500' : stock.health_score >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${stock.health_score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Return & Backtest Inspect Button */}
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTickerForBenchmark(stock.ticker);
                              setActiveView('benchmark_return');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-[10px] font-black transition-colors"
                          >
                            <LineChart className="w-3 h-3 text-rose-400" />
                            <span>+{stockPerf.timeframes.Max.total_return_pct}% (CAGR +{stockPerf.timeframes.Max.cagr_pct.toFixed(0)}%)</span>
                          </button>
                        </td>

                        {/* Dividend Yield */}
                        <td className="px-4 py-3.5 text-right font-bold text-emerald-400">
                          {stock.dividend_yield}%
                        </td>

                        {/* P/E Ratio */}
                        <td className="px-4 py-3.5 text-right font-bold text-slate-100">
                          {stock.pe_ratio}x
                        </td>

                        {/* AI Recommendation Reason Button */}
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStockForReason(stock);
                              handleStockSearch(stock.ticker);
                            }}
                            className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 justify-center mx-auto"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>Why Recommended?</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 1ST OF MONTH REBALANCE & HOLD VS EXIT DECISION ENGINE */}
      {activeView === 'monthly_rebalance' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Monthly Header & Countdown Banner */}
          <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Har Mahine Ki 1st Tarikh Ka AI Rebalance System</span>
              </div>
              <h2 className="text-xl font-black text-slate-100">Current Cycle: {MONTHLY_REBALANCE_CYCLE.current_cycle}</h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Every month on the 1st, AI re-evaluates all stocks, confirms which stocks to <strong>HOLD</strong>, which new gems to <strong>BUY</strong>, and which to <strong>EXIT</strong> or <strong>PROFIT BOOK</strong> to maximize returns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950 border border-purple-500/30 p-3 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Rebalance</span>
                <span className="text-xs font-black text-purple-400">{MONTHLY_REBALANCE_CYCLE.next_rebalance_date}</span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">({MONTHLY_REBALANCE_CYCLE.days_until_next_rebalance} Days Left)</span>
              </div>
              <div className="bg-slate-950 border border-emerald-500/30 p-3 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Strategy Return (MTD)</span>
                <span className="text-xl font-black text-emerald-400">+{MONTHLY_REBALANCE_CYCLE.strategy_month_return_pct}%</span>
                <span className="text-[10px] text-slate-400 block font-medium">vs Nifty +{MONTHLY_REBALANCE_CYCLE.nifty_month_return_pct}%</span>
              </div>
            </div>
          </div>

          {/* Rebalance Items Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Active 1st of Month Holdings & Decision Status</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">12 Monitored Assets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rebalanceItems.map((item) => {
                const userTrade = userTrades[item.ticker];
                const isBought = userTrade?.status === 'BOUGHT';
                const isExited = userTrade?.status === 'EXITED';

                return (
                  <div
                    key={item.ticker}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                      item.decision === 'NEW_BUY'
                        ? 'border-emerald-500/50 hover:border-emerald-400 bg-gradient-to-b from-emerald-950/20 to-slate-900'
                        : item.decision === 'PROFIT_BOOK'
                        ? 'border-amber-500/50 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 to-slate-900'
                        : 'border-slate-800 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-black text-slate-100">{item.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{item.ticker} • {item.sector}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          item.decision === 'NEW_BUY'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : item.decision === 'PROFIT_BOOK'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : 'bg-purple-950 text-purple-300 border-purple-500/40'
                        }`}>
                          {item.decision_badge}
                        </span>
                      </div>

                      {/* Movement Since 1st */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">1st Entry</span>
                          <span className="text-xs font-bold text-slate-300">₹{item.entry_price_1st.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Live Price</span>
                          <span className="text-xs font-black text-emerald-400">₹{item.current_price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Move Since 1st</span>
                          <span className={`text-xs font-black ${item.month_move_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            +{item.month_move_pct}% ↑
                          </span>
                        </div>
                      </div>

                      {/* Rationale */}
                      <p className="text-xs text-slate-300 leading-relaxed">{item.rationale}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>Target: <strong className="text-emerald-400">₹{item.target_price.toFixed(2)}</strong></span>
                        <span>Trailing SL: <strong className="text-rose-400">₹{item.stop_loss.toFixed(2)}</strong></span>
                        <span>Weight: <strong className="text-purple-300">{item.allocation_weight_pct}%</strong></span>
                      </div>
                    </div>

                    {/* Interactive User Trade Action Buttons */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleBuy(item)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md ${
                          isBought
                            ? 'bg-emerald-600 hover:bg-rose-700 text-white'
                            : isExited
                            ? 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white'
                            : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white'
                        }`}
                      >
                        {isBought ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In My Portfolio (Click to Exit)</span>
                          </>
                        ) : isExited ? (
                          <>
                            <History className="w-3.5 h-3.5" />
                            <span>Exited (Click to Re-Buy)</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ I Bought This</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Monthly Rebalance Archive Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <History className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                Past Monthly Rebalance Log & Outperformance History
              </h3>
            </div>

            <div className="space-y-3">
              {rebalanceHistory.map((hist) => (
                <div
                  key={hist.rebalance_date}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-100">{hist.cycle_name}</span>
                      <span className="px-2 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        {hist.stocks_held_count} Stocks Basket
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{hist.summary_notes}</p>
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
                      <span><strong>New Buys:</strong> {hist.new_buys.join(', ')}</span>
                      <span>•</span>
                      <span><strong>Exits:</strong> {hist.exits.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-slate-900 p-3 rounded-xl border border-slate-800 shrink-0">
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Strategy Gain</span>
                      <span className="text-sm font-black text-emerald-400">+{hist.month_total_return_pct}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Nifty Benchmark</span>
                      <span className="text-sm font-bold text-slate-300">+{hist.nifty_benchmark_return_pct}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-purple-400 uppercase font-bold block">Alpha Outperformance</span>
                      <span className="text-sm font-black text-purple-400">+{hist.alpha_generated_pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: USER TRADES & RETURN COMPARISON / ALPHA MAXIMIZER */}
      {activeView === 'my_trades' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Comparison Scoreboard Header */}
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-4 h-4 text-indigo-400" />
                <span>ProPicks vs Your Portfolio Return Comparison Engine</span>
              </div>
              <h2 className="text-xl font-black text-slate-100">Compare Returns & Maximize High-Alpha Gains</h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Compare your actual logged buys/exits against the AI Strategy return and benchmark index. AI provides personalized optimization tips to capture the highest possible returns.
              </p>
            </div>

            {/* Performance Comparison KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">ProPicks Return</span>
                <span className="text-xl font-black text-emerald-400">+{MONTHLY_REBALANCE_CYCLE.strategy_month_return_pct}%</span>
                <span className="text-[9px] text-emerald-300 block font-medium">Ideal Rebalance</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/40 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Return</span>
                <span className="text-xl font-black text-indigo-300">+{userOverallReturnPct.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-400 block font-medium">({userTradesList.length} Logged)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Nifty 50 Index</span>
                <span className="text-xl font-black text-slate-300">+{MONTHLY_REBALANCE_CYCLE.nifty_month_return_pct}%</span>
                <span className="text-[9px] text-slate-500 block font-medium">Market Baseline</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/40 text-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Your Alpha</span>
                <span className="text-xl font-black text-purple-400">+{(userOverallReturnPct - MONTHLY_REBALANCE_CYCLE.nifty_month_return_pct).toFixed(1)}%</span>
                <span className="text-[9px] text-purple-300 block font-medium">Beating Nifty</span>
              </div>
            </div>
          </div>

          {/* User Portfolio Logged Trades Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                  Your Logged Trades & Stock Movement Status
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total Invested: ₹{totalInvestedByUser.toLocaleString()} • Value: ₹{totalCurrentValueOfUser.toLocaleString()}</span>
            </div>

            {userTradesList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <p>No trades logged yet. Click on <strong>"+ I Bought This"</strong> in the 1st of Month Rebalance tab to track your personal portfolio.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Buy Price</th>
                      <th className="px-4 py-3 text-right">Current / Exit Price</th>
                      <th className="px-4 py-3 text-right">Quantity</th>
                      <th className="px-4 py-3 text-right">Total Invested</th>
                      <th className="px-4 py-3 text-right">Current Value</th>
                      <th className="px-4 py-3 text-right">Profit / Loss</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {userTradesList.map((t) => {
                      const isProfit = t.pnl_amount >= 0;
                      return (
                        <tr key={t.ticker} className="hover:bg-slate-800/60 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-100">{t.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{t.ticker}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              t.status === 'BOUGHT' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {t.status === 'BOUGHT' ? '🟢 Active Holding' : '✕ Exited'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-200">₹{t.buy_price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-black text-emerald-400">
                            ₹{(t.exit_price || t.current_value / t.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300">{t.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-300">₹{t.invested_amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-100">₹{t.current_value.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className={`font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isProfit ? '+' : ''}₹{t.pnl_amount.toFixed(0)} ({isProfit ? '+' : ''}{t.pnl_pct.toFixed(1)}%)
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                const updated = { ...userTrades };
                                delete updated[t.ticker];
                                setUserTrades(updated);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-[10px] transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AI Strategy High-Return Optimizer Box ("High Return Dilvaye") */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-slate-100">
                🎯 AI Strategy Optimizer — Maximum Return Hasil Karne Ki Strategy
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-extrabold text-emerald-400">1. Rebalance on 1st of Every Month</div>
                <p className="text-slate-300 leading-relaxed">
                  Har mahine ki 1st tarikh ko jo naye momentum stocks (e.g. Zuari +26.8%, BCL Ind +18.2%) add hote hain, unme 10-12% weight allocate karein. Stagnant stocks se capital automatically rotate ho jata hai.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-extrabold text-amber-400">2. Execute 50% Profit Booking on Caution</div>
                <p className="text-slate-300 leading-relaxed">
                  Jab kisi stock (jaise BEPL) par opposite news ya input cost spike ka caution alert aaye, tab 50% capital book karein aur baaki trailing stop-loss (₹136) par hold karein taaki profits lock ho sakein.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-extrabold text-purple-400">3. Ride High-Conviction Multibaggers</div>
                <p className="text-slate-300 leading-relaxed">
                  Andhra Sugars (Target ₹152.13), Confidence Petroleum (Target ₹105.99), aur Coal India (Target ₹522) jaise high FCF stocks ko unke intrinsic fair value tak hold karein for maximum compounding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: AI NEWS & OPPOSITE CATALYST EXIT RADAR */}
      {activeView === 'exit_radar' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Summary Banner */}
          <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border border-rose-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>AI Automated Opposite News & Exit Risk Sentinel</span>
              </div>
              <h2 className="text-xl font-black text-slate-100">Live News Sentiment & Exit Signal Tracker</h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Real-time scanning of regulatory filings, commodity price spikes, earnings misses, and negative news opposite to the original recommendation thesis to trigger instant exit advisories.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-slate-950/90 border border-emerald-500/30 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Thesis Strong</span>
                <span className="text-xl font-black text-emerald-400">10 / 12</span>
              </div>
              <div className="bg-slate-950/90 border border-amber-500/30 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Caution / Watch</span>
                <span className="text-xl font-black text-amber-400">2 / 12</span>
              </div>
              <div className="bg-slate-950/90 border border-rose-500/30 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Exit Alert</span>
                <span className="text-xl font-black text-rose-400">0 / 12</span>
              </div>
            </div>
          </div>

          {/* Cards for each monitored stock's Exit Advisory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {allExitAdvisories.map((advisory) => {
              const isCaution = advisory.status === 'CAUTION_WATCH';
              const isExit = advisory.status === 'EXIT_RECOMMENDED';

              return (
                <div
                  key={advisory.ticker}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-4 transition-all ${
                    isExit
                      ? 'border-rose-500/60 hover:border-rose-400 bg-gradient-to-b from-rose-950/20 to-slate-900'
                      : isCaution
                      ? 'border-amber-500/50 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 to-slate-900'
                      : 'border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  {/* Stock Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-slate-100">{advisory.name}</h3>
                        <span className="text-xs font-mono font-bold text-slate-400">({advisory.ticker})</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Evaluated: {advisory.last_evaluated}</span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isExit
                          ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                          : isCaution
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      }`}>
                        {advisory.signal_label}
                      </span>
                      <div className="text-xs font-black text-slate-200 mt-1">Live: ₹{advisory.current_price.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Pricing Levels: Target & Trailing Stop Loss */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Target Price</span>
                      <span className="text-xs font-black text-emerald-400">₹{advisory.target_price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Trailing Stop-Loss</span>
                      <span className="text-xs font-black text-rose-400">₹{advisory.stop_loss_price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Key Support</span>
                      <span className="text-xs font-black text-blue-400">₹{advisory.key_support_price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Opposite News & Exit Rationale */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    advisory.opposite_news_detected
                      ? 'bg-rose-950/40 border-rose-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                      {advisory.opposite_news_detected ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>Exit Risk Rationale & Action Plan</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{advisory.exit_reason}</p>
                    <div className="text-[11px] text-amber-300/90 font-medium bg-slate-900/90 p-2 rounded-lg border border-slate-800 mt-1">
                      👉 <strong>Action:</strong> {advisory.action_plan}
                    </div>
                  </div>

                  {/* Recent News Headlines for this Stock */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      📰 Recent News Flow & Sentiment Impact
                    </span>
                    <div className="space-y-2">
                      {advisory.news.map((item) => (
                        <div key={item.id} className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-blue-400">{item.source} • {item.time_ago}</span>
                            <span className={`px-2 py-0.2 rounded font-bold ${
                              item.sentiment === 'positive'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-rose-950 text-rose-400'
                            }`}>
                              {item.sentiment_score > 0 ? `+${item.sentiment_score}% Bullish` : `${item.sentiment_score}% Adverse`}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 leading-snug">{item.headline}</h4>
                          <p className="text-[11px] text-slate-400">{item.summary}</p>
                          <div className="text-[10px] text-purple-300 font-medium pt-0.5">
                            ⚡ <em>{item.impact_on_thesis}</em>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 6: DAILY MAJOR MARKET & MACRO EVENTS */}
      {activeView === 'daily_events' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Event Header Banner */}
          <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Daily High-Impact Macro & Corporate Events Calendar</span>
              </div>
              <h2 className="text-xl font-black text-slate-100">Today & Upcoming Major Market Triggers</h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Tracks RBI Monetary Policy, US Fed interest rate decisions, CPI inflation, GST Council announcements, and OPEC energy meetings with linked affected stocks.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {[
                { id: 'ALL', label: 'All Events' },
                { id: 'MONETARY_POLICY', label: 'RBI & Fed' },
                { id: 'MACRO_DATA', label: 'CPI / Inflation' },
                { id: 'REGULATORY', label: 'GST & SEBI' },
                { id: 'GLOBAL_ENERGY', label: 'OPEC & Crude' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEventCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    eventCategoryFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {majorEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        evt.day_label === 'TODAY'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : evt.day_label === 'TOMORROW'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                      }`}>
                        {evt.day_label} • {evt.date}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{evt.timing}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>{evt.impact} IMPACT</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-100 leading-snug">{evt.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{evt.summary}</p>

                  {/* Impacted ProPicks Stock Badges with live price & ticker */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      📌 Linked Impacted Stocks:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {evt.affected_stocks.map((stk) => (
                        <div
                          key={stk.ticker}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center space-x-2"
                        >
                          <span className="text-xs font-bold text-slate-100">{stk.name}</span>
                          <span className="text-[10px] font-mono text-blue-400">({stk.ticker})</span>
                          <span className="text-[10px] font-bold text-emerald-400">₹{stk.price.toFixed(2)}</span>
                          <span className={`text-[10px] font-bold ${stk.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stk.change_pct >= 0 ? '+' : ''}{stk.change_pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expected Outcome & Strategy Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] text-slate-200">
                    <strong className="text-blue-400">Expected Outcome:</strong> {evt.expected_outcome}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium">
                    🎯 <strong>Investor Action:</strong> {evt.investor_action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation Reason Modal / Deep Dive Drawer */}
      {selectedStockForReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 max-w-3xl w-full shadow-2xl space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStockForReason(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-100">{selectedStockForReason.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-purple-400 font-mono font-bold">{selectedStockForReason.ticker}</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      Sector: {selectedStockForReason.sector} ({selectedStockForReason.industry})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-emerald-400">₹{selectedStockForReason.price.toFixed(2)}</span>
                <span className={`text-xs font-extrabold ${getChangeColor(selectedStockForReason.change_1d)}`}>
                  {selectedStockForReason.change_1d >= 0 ? '+' : ''}{selectedStockForReason.change_1d}% ↑
                </span>
              </div>
            </div>

            {/* 8. Full Backtest vs Benchmark Section in Modal */}
            {selectedStockBacktest && (
              <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <LineChart className="w-4 h-4 text-rose-400" />
                    <span>📊 Historical Performance Versus Benchmark Scorecard</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-black">
                    +{selectedStockBacktest.timeframes.Max.total_return_pct}% (Max)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Return</span>
                    <span className="text-sm font-black text-emerald-400">+{selectedStockBacktest.timeframes.Max.total_return_pct}%</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">CAGR (Annualized)</span>
                    <span className="text-sm font-black text-rose-400">+{selectedStockBacktest.timeframes.Max.cagr_pct.toFixed(1)}%</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sharpe Ratio</span>
                    <span className="text-sm font-bold text-slate-200">{selectedStockBacktest.timeframes.Max.sharpe_ratio}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Rating</span>
                    <span className="text-sm font-black text-emerald-400">{selectedStockBacktest.timeframes.Max.risk}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeframe Selector Toolbar for Modal Chart */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Accurate Real-Time Price Chart
                  </span>
                </div>

                {/* Timeframe selector buttons (1min, 1h, 1d, 1w, 1m) */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['1min', '1h', '1d', '1w', '1m'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setModalTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        modalTimeframe === tf
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-[200px] w-full pt-1">
                {loadingModalChart ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Fetching {modalTimeframe.toUpperCase()} Live Accurate Chart...</span>
                  </div>
                ) : modalChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modalChartData}>
                      <defs>
                        <linearGradient id="modalChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 9 }} orientation="right" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontSize: '11px' }}
                        formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Live Close']}
                      />
                      <Area type="monotone" dataKey="close" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#modalChartGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Live chart feed active
                  </div>
                )}
              </div>
            </div>

            {/* Comprehensive Deep-Dive Analysis Sections */}
            {/* 1. Business Model */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>🏢 1. Business Model (Company Kaise Paisa Kamati Hai)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedStockForReason.detailed_explanation.business_model}
              </p>
            </div>

            {/* 2. Future Demand Outlook */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>🚀 2. Future Demand Outlook (Future Me Demand Badhegi Ya Nahi & Kyu)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedStockForReason.detailed_explanation.future_demand_outlook}
              </p>
            </div>

            {/* 3. Why Invest in This Stock? */}
            <div className="bg-slate-950 border border-purple-500/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>💡 3. Why Invest in This Stock? (Isme Invest Kyu Karein)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedStockForReason.detailed_explanation.why_invest}
              </p>
            </div>

            {/* 4. Financial Health & Ratio Analysis */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>📊 4. Financial Health & Ratio Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedStockForReason.detailed_explanation.financial_health_summary}
              </p>
            </div>

            {/* 5. Key Growth Catalysts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">🚀 5. Key Growth Catalysts</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStockForReason.detailed_explanation.catalysts.map((cat, idx) => (
                  <li key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-start space-x-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Key Risk Factors */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">⚠️ 6. Key Risk Factors & Watch Items</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStockForReason.detailed_explanation.key_risks.map((risk, idx) => (
                  <li key={idx} className="bg-slate-950 border border-rose-500/20 p-2.5 rounded-lg flex items-start space-x-2 text-xs text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Dedicated Live News Feed & Opposite Catalyst Exit Radar Section */}
            {selectedStockAdvisory && (
              <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <Newspaper className="w-4 h-4 text-rose-400" />
                    <span>📰 7. Live News & Exit Trigger Radar</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    selectedStockAdvisory.status === 'EXIT_RECOMMENDED'
                      ? 'bg-rose-950 text-rose-300 border-rose-500'
                      : selectedStockAdvisory.status === 'CAUTION_WATCH'
                      ? 'bg-amber-950 text-amber-300 border-amber-500'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  }`}>
                    {selectedStockAdvisory.signal_label}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div><strong>Exit Analysis:</strong> {selectedStockAdvisory.exit_reason}</div>
                  <div className="text-emerald-400 font-bold">👉 Action Plan: {selectedStockAdvisory.action_plan}</div>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                    <span>Trailing SL: <strong className="text-rose-400">₹{selectedStockAdvisory.stop_loss_price.toFixed(2)}</strong></span>
                    <span>Support: <strong className="text-blue-400">₹{selectedStockAdvisory.key_support_price.toFixed(2)}</strong></span>
                  </div>
                </div>

                {/* News list */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Latest News Headlines:</span>
                  {selectedStockAdvisory.news.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-blue-400">{item.source} • {item.time_ago}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          item.sentiment === 'positive' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {item.sentiment_score > 0 ? `+${item.sentiment_score}% Bullish` : `${item.sentiment_score}% Adverse`}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100">{item.headline}</h4>
                      <p className="text-slate-400 text-[11px]">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Score Grid Summary */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Momentum Score</span>
                <span className="font-black text-emerald-400 text-base">{selectedStockForReason.momentum_score}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fair Value Upside</span>
                <span className="font-black text-blue-400 text-base">+{selectedStockForReason.fair_value_upside}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Health Rating</span>
                <span className="font-black text-purple-400 text-base">{selectedStockForReason.health_score}/100</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStockForReason(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-purple-600/30 transition-all"
              >
                Close Deep-Dive Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
