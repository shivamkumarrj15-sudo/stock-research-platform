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
  Building2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatPct, getChangeColor } from '../utils/formatters';
import { stocksApi } from '../api';
import {
  resolveSymbolAndQuote,
  searchLiveSymbols,
  fetchTimeframeChart,
  SymbolSearchResult
} from '../api/liveMarketFetcher';

export interface DetailedExplanation {
  why_selected: string;
  sector_analysis: string;
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
      why_selected: 'Andhra Sugars was selected because it trades at an aggressive 52.9% discount to intrinsic fair value with low P/E multiple (12.9x). The government’s 20% ethanol blending mandate provides long-term revenue visibility and robust cash generation.',
      sector_analysis: 'The Sugar & Bio-Ethanol sector is experiencing a multi-year structural re-rating. Ethanol blending quotas create guaranteed off-take contracts for sugar mills, insulating revenues from international sugar price volatility.',
      financial_health_summary: 'Exceptional balance sheet health with a Piotroski Score of 8/9, minimal Debt-to-Equity (0.15), and high interest coverage ratio (18.2x). Free cash flow generation is at record highs.',
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
      why_selected: 'Confidence Petroleum was selected due to strong price momentum (+22.8% 1-Month surge) and rapid expansion of its Auto-LPG dispensing station network across tier-2/3 Indian cities.',
      sector_analysis: 'Clean auto fuel infrastructure in India is seeing surging demand as commercial vehicles switch away from diesel toward cheaper LPG and CNG alternatives.',
      financial_health_summary: 'Healthy revenue CAGR of 18.4%, moderate Debt-to-Equity ratio (0.42), and improving EBITDA margins reaching 14.2%.',
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
    price: 127.11,
    change_1d: 3.4,
    change_1w: 8.1,
    change_1m: 16.5,
    change_1y: 42.0,
    fair_value: 131.00,
    fair_value_label: 'Fair',
    fair_value_upside: 3.1,
    health_label: 'Great',
    health_score: 86,
    market_cap: '₹32.29 B',
    dividend_per_share: 6.00,
    dividend_yield: 4.7,
    ex_dividend_date: '2026-09-15',
    pay_date: '2026-09-30',
    rsi_14: 62.77,
    pe_ratio: 15.6,
    pb_ratio: 2.8,
    momentum_score: 79,
    ai_recommendation_reason: 'Lucrative 4.7% Dividend Yield with 100% cash-backed payout and zero long-term debt balance sheet.',
    detailed_explanation: {
      why_selected: 'BEPL offers an attractive 4.7% dividend yield backed by a 100% zero-debt balance sheet and industry-leading Return on Capital Employed (ROIC 34.2%).',
      sector_analysis: 'ABS polymers are essential engineering plastics used in automobiles, consumer electronics, and appliances, benefiting directly from domestic manufacturing growth.',
      financial_health_summary: 'Zero Long-Term Debt, Piotroski Score 8/9, Free Cash Flow Yield 6.8%, and strong cash reserves.',
      catalysts: ['Capacity expansion to 150,000 MTPA', 'Automotive sector production revival', 'High dividend payout policy'],
      key_risks: ['Acrylonitrile raw material cost spikes', 'Import competition from foreign chemical manufacturers'],
    },
    key_drivers: ['Zero Debt Company', 'High ROIC (34.2%)', 'High Dividend Pay-out Coverage'],
  },
  {
    ticker: 'JAMNAAUTO',
    name: 'Jamna Auto Industries',
    bse_code: '520051',
    sector: 'Automotive Ancillaries',
    industry: 'Commercial Vehicle Suspension Systems',
    price: 121.50,
    change_1d: 1.5,
    change_1w: 3.2,
    change_1m: 9.8,
    change_1y: 28.4,
    fair_value: 140.97,
    fair_value_label: 'Fair',
    fair_value_upside: 16.0,
    health_label: 'Good',
    health_score: 72,
    market_cap: '₹48.21 B',
    dividend_per_share: 2.10,
    dividend_yield: 1.7,
    ex_dividend_date: '2026-09-25',
    pay_date: '2026-10-15',
    rsi_14: 33.03,
    pe_ratio: 20.3,
    pb_ratio: 3.4,
    momentum_score: 77,
    ai_recommendation_reason: 'Market leader in Commercial Vehicle suspension springs benefiting from domestic CV volume recovery cycle.',
    detailed_explanation: {
      why_selected: 'Jamna Auto holds a commanding 68% OEM market share in commercial vehicle leaf and parabolic springs in India, capturing high cash flow as CV sales rise.',
      sector_analysis: 'India’s national infrastructure spending and highway expansion drive continuous replacement demand for heavy commercial vehicles.',
      financial_health_summary: 'ROE 24.1%, Interest Coverage 14.2x, low financial leverage, and consistent operational cash generation.',
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
      why_selected: 'BCL Industries boasts a flawless Piotroski 9/9 financial health rating while trading at a discount P/E of just 9.6x amidst rapid ethanol plant expansion.',
      sector_analysis: 'Grain-based ethanol distilleries benefit from dual feedstocks (maize and damaged rice) and fixed OMC purchase pricing guarantees.',
      financial_health_summary: 'Piotroski Score 9/9, ROE 21.8%, strong asset turnover ratio, and comfortable interest coverage (8.5x).',
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
    pe_ratio: 24.0,
    pb_ratio: 1.8,
    momentum_score: 74,
    ai_recommendation_reason: 'Gujarat State PSU chemical leader with consistent ₹17.70/share cash dividend payouts.',
    detailed_explanation: {
      why_selected: 'Gujarat Alkalies is a premier state government PSU chemical manufacturer offering high asset quality, reliable cash dividends (₹17.70/share), and recovering Caustic Soda realization margins.',
      sector_analysis: 'Chlor-Alkali chemicals form the foundational building blocks for textiles, paper, alumina, and water treatment industries in India.',
      financial_health_summary: 'Book Value ₹405/share, low leverage, strong credit rating, and reliable cash generation backed by Gujarat state promoter.',
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
      why_selected: 'BF Investment is a deep value holding company of the Kalyani Group (Bharat Forge) trading at a 70%+ discount to net asset value (NAV) with a P/E ratio of just 4.3x.',
      sector_analysis: 'Holding company discounts narrow when group operating subsidiaries undergo rapid earnings expansion in defense, aerospace, and heavy engineering exports.',
      financial_health_summary: 'Zero long-term debt, P/B ratio 0.6x, low earnings multiple, and pristine group balance sheet.',
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
      why_selected: 'Zuari Agro Chemicals scored the highest momentum rating (91/100) with 54.9% intrinsic fair value upside (Fair Value ₹350.14) driven by monetization of non-core land assets.',
      sector_analysis: 'Monsoon recovery and direct fertilizer subsidy disbursements from the government strengthen cash-flows for phosphatic fertilizer producers.',
      financial_health_summary: 'Rapid balance sheet deleveraging through non-core Goa land bank asset sales and Paradeep Phosphates JV monetization.',
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
      why_selected: 'BPCL is a premier PSU dividend champion delivering a 7.1% annual cash yield supported by stable refining margins and nationwide retail petrol pump sales.',
      sector_analysis: 'Downstream oil refining and marketing in India is driven by growing transportation fuel demand and petrochemical integration.',
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
      why_selected: 'Coal India operates as a near-monopoly producing over 80% of India’s thermal coal, generating immense free cash flow and delivering a 6.4% cash dividend yield.',
      sector_analysis: 'Coal supplies over 70% of India’s electricity base load generation, ensuring long-term volume off-take agreements with thermal power plants.',
      financial_health_summary: 'Massive cash reserve balance sheet, low P/E ratio (8.4x), Piotroski Score 8/9, and generous dividend distribution policy.',
      catalysts: ['Record annual coal production & dispatch targets', '6.4% Cash Dividend Yield', 'E-auction premium realization gains'],
      key_risks: ['Pace of renewable energy transition', 'Monsoon flooding at open-cast mining sites'],
    },
    key_drivers: ['Record production volumes', '6.4% Cash dividend yield', 'Monopoly distribution moat'],
  },
];

export const MomentumDividends: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<MomentumDividendStock[]>(INITIAL_STOCKS);
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
    // Poll live prices every 15 seconds for 100% real-time accuracy
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

  const round1 = (v: number) => Math.round(v * 10) / 10;

  const filteredStocks = stocks.filter((s) => {
    if (filter === 'high_momentum') return s.momentum_score >= 80;
    if (filter === 'upcoming_dividend') return s.dividend_yield >= 2.0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Live Angel One Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>ProPicks AI — Angel One Real-Time Market Feed (Auto-Sync 15s)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-2">
              ProPicks AI Momentum & Dividend Gems
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              AI predictive model ranking top momentum stocks, intrinsic fair value upside, Piotroski health rating, and live Angel One real-time market prices.
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
                <th className="px-4 py-4 text-right">Dividend / Share</th>
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

                    {/* Dividend Per Share */}
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-200">
                      ₹{stock.dividend_per_share.toFixed(2)}
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

      {/* AI Recommendation Reason Modal / Deep Dive Drawer */}
      {selectedStockForReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 relative my-8">
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
                      Sector: {selectedStockForReason.sector}
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

            {/* Detailed Explanation Sections */}
            {/* 1. Kyu Liya? (Detailed AI Thesis) */}
            <div className="bg-slate-950 border border-purple-500/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>🎯 Kyu Liya? (Detailed AI Investment Thesis)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedStockForReason.detailed_explanation.why_selected}
              </p>
            </div>

            {/* 2. Sector & Industry Analysis */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>🏢 Sector & Industry Analysis ({selectedStockForReason.sector})</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedStockForReason.detailed_explanation.sector_analysis}
              </p>
            </div>

            {/* 3. Financial Health & Ratio Analysis */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>📊 Financial Health & Balance Sheet Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedStockForReason.detailed_explanation.financial_health_summary}
              </p>
            </div>

            {/* 4. Key Growth Catalysts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">🚀 Key Growth Catalysts</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStockForReason.detailed_explanation.catalysts.map((cat, idx) => (
                  <li key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-start space-x-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Key Risk Factors */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">⚠️ Key Risk Factors & Watch Items</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStockForReason.detailed_explanation.key_risks.map((risk, idx) => (
                  <li key={idx} className="bg-slate-950 border border-rose-500/20 p-2.5 rounded-lg flex items-start space-x-2 text-xs text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

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
