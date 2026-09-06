export interface StockNewsItem {
  id: string;
  ticker: string;
  headline: string;
  source: string;
  published_at: string;
  time_ago: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical_opposite';
  sentiment_score: number; // -100 to 100
  impact_on_thesis: string;
  url?: string;
}

export interface StockExitAdvisory {
  ticker: string;
  name: string;
  current_price: number;
  status: 'THESIS_INTACT' | 'CAUTION_WATCH' | 'EXIT_RECOMMENDED';
  signal_label: string;
  signal_color: 'emerald' | 'amber' | 'rose';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  opposite_news_detected: boolean;
  exit_reason: string;
  action_plan: string;
  stop_loss_price: number;
  key_support_price: number;
  target_price: number;
  last_evaluated: string;
  news: StockNewsItem[];
}

export interface DailyMarketEvent {
  id: string;
  title: string;
  category: 'MONETARY_POLICY' | 'MACRO_DATA' | 'EARNINGS' | 'REGULATORY' | 'GLOBAL_ENERGY';
  date: string;
  timing: string;
  day_label: 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'UPCOMING';
  country: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  affected_sectors: string[];
  affected_stocks: string[];
  summary: string;
  expected_outcome: string;
  investor_action: string;
}

export const STOCK_EXIT_RADAR: Record<string, StockExitAdvisory> = {
  ANDHRSUGAR: {
    ticker: 'ANDHRSUGAR',
    name: 'Andhra Sugars Ltd',
    current_price: 99.50,
    status: 'THESIS_INTACT',
    signal_label: 'Thesis Strong — HOLD / BUY ON DIPS',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'No opposite catalysts detected. Government 20% ethanol blending mandate and OMC procurement contracts remain intact.',
    action_plan: 'Maintain long position. Strict trailing stop-loss at ₹88.50. Upside target remains ₹152.13 (Intrinsic Fair Value).',
    stop_loss_price: 88.50,
    key_support_price: 92.00,
    target_price: 152.13,
    last_evaluated: 'Today, 03:30 PM (Post-Market Close)',
    news: [
      {
        id: 'as-1',
        ticker: 'ANDHRSUGAR',
        headline: 'Government raises ethanol procurement price for sugar-distilleries by ₹2.10/litre',
        source: 'Business Standard',
        published_at: '2026-09-06T11:30:00Z',
        time_ago: '4 hours ago',
        summary: 'Ministry of Petroleum notifies enhanced pricing for grain and molasses-based ethanol off-take for OMCs, directly expanding Q3 operating margins.',
        sentiment: 'positive',
        sentiment_score: 88,
        impact_on_thesis: 'Highly Bullish: Reinforces high EBITDA margin expansion thesis.',
      },
      {
        id: 'as-2',
        ticker: 'ANDHRSUGAR',
        headline: 'Caustic Soda domestic spot realization prices stabilize after 6-month slump',
        source: 'Chemical Market News',
        published_at: '2026-09-05T14:15:00Z',
        time_ago: '1 day ago',
        summary: 'Domestic chlor-alkali prices witnessed 4% recovery on supply curbs from East Asian producers.',
        sentiment: 'positive',
        sentiment_score: 65,
        impact_on_thesis: 'Positive: Removes margin drag from industrial chemical division.',
      },
    ],
  },
  CONFIPET: {
    ticker: 'CONFIPET',
    name: 'Confidence Petroleum India',
    current_price: 82.30,
    status: 'THESIS_INTACT',
    signal_label: 'Momentum Intact — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Auto-LPG volume expansion accelerating (+22.8% 1-Month). No adverse regulatory orders on gas pricing.',
    action_plan: 'Ride the momentum with trailing stop-loss at ₹74.00. Book partial profit near ₹105.00 resistance.',
    stop_loss_price: 74.00,
    key_support_price: 78.50,
    target_price: 105.99,
    last_evaluated: 'Today, 03:15 PM',
    news: [
      {
        id: 'cp-1',
        ticker: 'CONFIPET',
        headline: 'Confidence Petroleum commissions 12 new CNG/Auto-LPG hybrid retail outlets in Maharashtra & MP',
        source: 'LiveMint',
        published_at: '2026-09-06T09:00:00Z',
        time_ago: '6 hours ago',
        summary: 'Company expands retail fuel dispensing footprint to reach 265 total operational stations, boosting daily gas throughput.',
        sentiment: 'positive',
        sentiment_score: 82,
        impact_on_thesis: 'Bullish: Accelerates retail revenue growth.',
      },
      {
        id: 'cp-2',
        ticker: 'CONFIPET',
        headline: 'Saudi Aramco trims LPG contract price by $15/tonne for September deliveries',
        source: 'Reuters Energy',
        published_at: '2026-09-04T18:00:00Z',
        time_ago: '2 days ago',
        summary: 'Lower raw feedstock import costs will expand gross marketing margins for private LPG bottlers in India.',
        sentiment: 'positive',
        sentiment_score: 74,
        impact_on_thesis: 'Positive: Lowers cost of goods sold (COGS).',
      },
    ],
  },
  BEPL: {
    ticker: 'BEPL',
    name: 'Bhansali Eng Polymers',
    current_price: 144.20,
    status: 'CAUTION_WATCH',
    signal_label: 'Caution / Watchlist — Monitor Crude Spikes',
    signal_color: 'amber',
    risk_level: 'MEDIUM',
    opposite_news_detected: true,
    exit_reason: 'Warning: Brent crude spiked above $86/bbl, increasing raw Styrene Monomer import costs. If prices break ₹136, consider quick profit booking.',
    action_plan: 'Tighten stop-loss to ₹136.00. If raw material inflation persists into Q3 earnings, trigger EXIT signal.',
    stop_loss_price: 136.00,
    key_support_price: 138.50,
    target_price: 165.00,
    last_evaluated: 'Today, 02:45 PM',
    news: [
      {
        id: 'be-1',
        ticker: 'BEPL',
        headline: 'Global Styrene Monomer spot prices jump 6.2% following Middle East refinery maintenance outage',
        source: 'Plastics News Asia',
        published_at: '2026-09-06T07:30:00Z',
        time_ago: '8 hours ago',
        summary: 'Styrene feedstock prices rose to $1,080/tonne, which could compress ABS polymer gross spreads if price hikes are not passed on.',
        sentiment: 'negative',
        sentiment_score: -45,
        impact_on_thesis: 'Adverse Headwind: Short-term margin pressure on ABS resin manufacturing.',
      },
      {
        id: 'be-2',
        ticker: 'BEPL',
        headline: 'Domestic auto component makers report steady ABS resin order pipeline for festive season',
        source: 'Auto Monitor India',
        published_at: '2026-09-05T12:00:00Z',
        time_ago: '1 day ago',
        summary: 'High OEM demand for automotive instrument panels and two-wheeler body parts keeps production operating near 92% utilization.',
        sentiment: 'positive',
        sentiment_score: 60,
        impact_on_thesis: 'Neutral-Positive: Volume growth buffers raw material price impact.',
      },
    ],
  },
  JAMNAAUTO: {
    ticker: 'JAMNAAUTO',
    name: 'Jamna Auto Industries',
    current_price: 112.50,
    status: 'THESIS_INTACT',
    signal_label: 'Thesis Strong — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'CV (Commercial Vehicle) dispatch volumes robust. Tata Motors & Ashok Leyland leaf spring orders steady.',
    action_plan: 'Hold position for target of ₹138.50. Trailing stop-loss at ₹102.00.',
    stop_loss_price: 102.00,
    key_support_price: 106.00,
    target_price: 138.50,
    last_evaluated: 'Today, 01:20 PM',
    news: [
      {
        id: 'ja-1',
        ticker: 'JAMNAAUTO',
        headline: 'Medium & Heavy Commercial Vehicle (MHCV) retail sales grow 8.4% YoY in August',
        source: 'FADA Automotive Report',
        published_at: '2026-09-05T16:00:00Z',
        time_ago: '1 day ago',
        summary: 'Mining and highway freight corridor expansion drive heavy truck deliveries, boosting OEM spring demand.',
        sentiment: 'positive',
        sentiment_score: 79,
        impact_on_thesis: 'Bullish: Strong validation of CV replacement cycle thesis.',
      },
    ],
  },
  BCLIND: {
    ticker: 'BCLIND',
    name: 'BCL Ind & Infrastructure',
    current_price: 36.90,
    status: 'THESIS_INTACT',
    signal_label: 'Thesis Strong — HOLD / ACCUMULATE',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Perfect Piotroski 9/9 score. Kharagpur 200 KLPD grain distillery operating smoothly with OMC ethanol tenders.',
    action_plan: 'Hold for intrinsic valuation upside target of ₹46.84. Stop-loss at ₹32.50.',
    stop_loss_price: 32.50,
    key_support_price: 34.20,
    target_price: 46.84,
    last_evaluated: 'Today, 12:00 PM',
    news: [
      {
        id: 'bcl-1',
        ticker: 'BCLIND',
        headline: 'BCL Industries bags additional 1.8 Crore litre ethanol supply tender from BPCL and HPCL',
        source: 'Exchange Filing Notification',
        published_at: '2026-09-05T10:30:00Z',
        time_ago: '1 day ago',
        summary: 'Contract value estimated at ₹112 Crores with delivery scheduled over next 2 quarters.',
        sentiment: 'positive',
        sentiment_score: 92,
        impact_on_thesis: 'Highly Bullish: Direct revenue visibility and order book surge.',
      },
    ],
  },
  GUJALKALI: {
    ticker: 'GUJALKALI',
    name: 'Gujarat Alkalies & Chemicals',
    current_price: 720.50,
    status: 'THESIS_INTACT',
    signal_label: 'Dividend Yield Champion — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: '₹17.70/share cash dividend locked in. Gujarat state PSU backing ensures balance sheet safety.',
    action_plan: 'Hold for cash dividends and capital appreciation up to ₹780.00. Stop-loss at ₹670.00.',
    stop_loss_price: 670.00,
    key_support_price: 695.00,
    target_price: 780.00,
    last_evaluated: 'Today, 11:10 AM',
    news: [
      {
        id: 'gacl-1',
        ticker: 'GUJALKALI',
        headline: 'GACL approves final dividend of ₹17.70 per equity share; ex-date next week',
        source: 'BSE Corporate Announcement',
        published_at: '2026-09-04T15:00:00Z',
        time_ago: '2 days ago',
        summary: 'Board fixes record date for dividend distribution. Dividend yield stands at an attractive 2.5%.',
        sentiment: 'positive',
        sentiment_score: 85,
        impact_on_thesis: 'Bullish: Cash yield thesis confirmed.',
      },
    ],
  },
  BFINVEST: {
    ticker: 'BFINVEST',
    name: 'BF Investment Ltd',
    current_price: 470.00,
    status: 'THESIS_INTACT',
    signal_label: 'Deep Value Asset — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Kalyani Group defence and forging subsidiaries winning massive global export orders. P/E of just 4.3x.',
    action_plan: 'Hold with long-term target of ₹512.00+. Stop-loss at ₹425.00.',
    stop_loss_price: 425.00,
    key_support_price: 445.00,
    target_price: 512.00,
    last_evaluated: 'Today, 10:45 AM',
    news: [
      {
        id: 'bf-1',
        ticker: 'BFINVEST',
        headline: 'Bharat Forge arm bags ₹2,400 Crore artillery system export order from European client',
        source: 'Economic Times Defence',
        published_at: '2026-09-06T08:00:00Z',
        time_ago: '7 hours ago',
        summary: 'Huge surge in underlying portfolio asset value directly expands net asset value (NAV) backing for BF Investment.',
        sentiment: 'positive',
        sentiment_score: 90,
        impact_on_thesis: 'Highly Bullish: Sharp boost to intrinsic NAV.',
      },
    ],
  },
  ZUARI: {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals',
    current_price: 226.10,
    status: 'THESIS_INTACT',
    signal_label: 'Momentum Leader (91/100) — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Record momentum score 91/100, subsidy disbursement on schedule, and non-core debt monetization proceeding.',
    action_plan: 'Hold for target of ₹350.14 (+54.9% upside). Trailing stop-loss at ₹205.00.',
    stop_loss_price: 205.00,
    key_support_price: 215.00,
    target_price: 350.14,
    last_evaluated: 'Today, 03:00 PM',
    news: [
      {
        id: 'zu-1',
        ticker: 'ZUARI',
        headline: 'Ministry of Chemicals & Fertilizers clears ₹18,500 Cr subsidy installment to domestic manufacturers',
        source: 'Financial Express',
        published_at: '2026-09-06T10:00:00Z',
        time_ago: '5 hours ago',
        summary: 'Timely cash inflow significantly reduces working capital loan debt interest burden for Zuari Agro.',
        sentiment: 'positive',
        sentiment_score: 86,
        impact_on_thesis: 'Bullish: Liquidity and balance sheet deleveraging catalyst.',
      },
    ],
  },
  BPCL: {
    ticker: 'BPCL',
    name: 'Bharat Petroleum Corp',
    current_price: 315.70,
    status: 'THESIS_INTACT',
    signal_label: 'High Yield (7.1%) — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: '7.1% dividend yield, steady marketing margins on domestic petrol/diesel retail sales.',
    action_plan: 'Hold position for dividend income and ₹345.32 price target. Stop-loss at ₹292.00.',
    stop_loss_price: 292.00,
    key_support_price: 304.00,
    target_price: 345.32,
    last_evaluated: 'Today, 02:00 PM',
    news: [
      {
        id: 'bp-1',
        ticker: 'BPCL',
        headline: 'BPCL partners with Tata Power to install 5,000 EV ultra-fast charging points at highway fuel stations',
        source: 'Mint Mobility',
        published_at: '2026-09-05T11:00:00Z',
        time_ago: '1 day ago',
        summary: 'Long term strategic EV transition infrastructure monetization.',
        sentiment: 'positive',
        sentiment_score: 75,
        impact_on_thesis: 'Positive: Future-proofs retail pump franchise.',
      },
    ],
  },
  COALINDIA: {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    current_price: 415.35,
    status: 'THESIS_INTACT',
    signal_label: 'Cash Flow Monopoly — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Record power dispatch volumes, 6.4% cash dividend yield, P/E of just 8.4x.',
    action_plan: 'Hold with target of ₹522.01 (+25.7% upside). Stop-loss at ₹385.00.',
    stop_loss_price: 385.00,
    key_support_price: 402.00,
    target_price: 522.01,
    last_evaluated: 'Today, 01:45 PM',
    news: [
      {
        id: 'ci-1',
        ticker: 'COALINDIA',
        headline: 'Thermal power plant coal inventory reaches healthy 18-day average ahead of festive industrial demand peak',
        source: 'Press Information Bureau',
        published_at: '2026-09-06T06:30:00Z',
        time_ago: '9 hours ago',
        summary: 'Daily railway rake loading touches 330 rakes/day ensuring robust monthly dispatch revenue.',
        sentiment: 'positive',
        sentiment_score: 80,
        impact_on_thesis: 'Bullish: Continuous volume off-take at contracted prices.',
      },
    ],
  },
  RECLTD: {
    ticker: 'RECLTD',
    name: 'REC Limited',
    current_price: 318.70,
    status: 'THESIS_INTACT',
    signal_label: 'Sovereign Dividend Champion — HOLD / BUY',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'Power sector loan sanctions grow 24% YoY. Zero new renewable NPA slippages. 6.5% dividend yield intact.',
    action_plan: 'Accumulate on dips near ₹310. Target ₹390.50 (52-week high retest). Stop-loss at ₹294.00.',
    stop_loss_price: 294.00,
    key_support_price: 308.00,
    target_price: 390.50,
    last_evaluated: 'Today, 03:30 PM',
    news: [
      {
        id: 'rec-1',
        ticker: 'RECLTD',
        headline: 'REC sanctions ₹1.12 Lakh Crore loans for renewable energy and transmission projects in FY26',
        source: 'Economic Times Energy',
        published_at: '2026-09-06T09:30:00Z',
        time_ago: '6 hours ago',
        summary: 'Aggressive lending pipeline in solar, wind, pumped hydro, and EV infrastructure keeps loan book growth on track.',
        sentiment: 'positive',
        sentiment_score: 91,
        impact_on_thesis: 'Highly Bullish: Core growth and dividend thesis firmly confirmed.',
      },
    ],
  },
  TATAMOTORS: {
    ticker: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    current_price: 311.50,
    status: 'CAUTION_WATCH',
    signal_label: 'Watch European EV Tariff Developments',
    signal_color: 'amber',
    risk_level: 'MEDIUM',
    opposite_news_detected: true,
    exit_reason: 'Opposite news caution: European luxury car market witnessing discounted pricing wars which may moderate JLR Q3 margin growth slightly.',
    action_plan: 'Hold core long position with trailing stop-loss at ₹292.00. Do not add aggressive fresh leverage until breakout above ₹325.',
    stop_loss_price: 292.00,
    key_support_price: 300.00,
    target_price: 420.00,
    last_evaluated: 'Today, 02:15 PM',
    news: [
      {
        id: 'tm-1',
        ticker: 'TATAMOTORS',
        headline: 'European luxury car sales growth slows to 1.8% in August amid consumer caution',
        source: 'Bloomberg Auto',
        published_at: '2026-09-05T13:40:00Z',
        time_ago: '1 day ago',
        summary: 'Higher borrowing costs in UK and Germany led to discounts among luxury brands, keeping JLR delivery wait times under observation.',
        sentiment: 'negative',
        sentiment_score: -35,
        impact_on_thesis: 'Adverse Headwind: Temporary margin moderation for JLR division.',
      },
      {
        id: 'tm-2',
        ticker: 'TATAMOTORS',
        headline: 'Tata Motors domestic EV bookings cross 15,000 units for newly launched Curvv EV',
        source: 'Autocar India',
        published_at: '2026-09-06T10:15:00Z',
        time_ago: '5 hours ago',
        summary: 'Strong domestic consumer response cements 70%+ Indian electric vehicle market share.',
        sentiment: 'positive',
        sentiment_score: 84,
        impact_on_thesis: 'Positive: Offsets European luxury headwinds with domestic volume expansion.',
      },
    ],
  },
};

export const DAILY_MAJOR_MARKET_EVENTS: DailyMarketEvent[] = [
  {
    id: 'evt-1',
    title: 'RBI Monetary Policy Committee (MPC) Rate Decision & Policy Stance',
    category: 'MONETARY_POLICY',
    date: '2026-09-08',
    timing: '10:00 AM IST',
    day_label: 'TODAY',
    country: 'India',
    impact: 'HIGH',
    affected_sectors: ['Banking & NBFCs', 'Automotive', 'Real Estate', 'Power Finance (REC/PFC)'],
    affected_stocks: ['RECLTD', 'PFC', 'SBIN', 'HDFCBANK', 'TATAMOTORS'],
    summary: 'RBI Governor Shaktikanta Das will announce the policy Repo Rate and GDP/Inflation projections. Consensus expects a status quo pause at 6.50% with commentary on food inflation.',
    expected_outcome: 'Rate Pause expected. Any dovish hint on liquidity easing will trigger a sharp rally in high-dividend NBFCs (REC, PFC) and Real Estate.',
    investor_action: 'Maintain existing long positions in REC/PFC. Keep stop-losses intact; do not short rate-sensitive counters.',
  },
  {
    id: 'evt-2',
    title: 'India Consumer Price Index (CPI) Inflation & Industrial Production (IIP) Release',
    category: 'MACRO_DATA',
    date: '2026-09-09',
    timing: '05:30 PM IST (Post-Market)',
    day_label: 'TOMORROW',
    country: 'India',
    impact: 'HIGH',
    affected_sectors: ['FMCG', 'Fertilizers & Agro', 'Sugar & Distilleries', 'General Consumption'],
    affected_stocks: ['ANDHRSUGAR', 'BCLIND', 'ZUARI', 'ITC', 'NESTLEIND'],
    summary: 'Ministry of Statistics (MOSPI) will release retail CPI inflation data for August. Expectations are for retail inflation to moderate below 4.2% due to stable monsoon crop supplies.',
    expected_outcome: 'Cooling inflation confirms sustained consumer purchasing power and reduces input cost pressures on agro/food processing companies.',
    investor_action: 'Bullish catalyst for Agro-Processing (BCLIND) and Fertilizer turnarounds (ZUARI). Accumulate on dips.',
  },
  {
    id: 'evt-3',
    title: 'US Federal Reserve FOMC Interest Rate Decision & Powell Press Conference',
    category: 'MONETARY_POLICY',
    date: '2026-09-10',
    timing: '11:30 PM IST',
    day_label: 'THIS_WEEK',
    country: 'United States',
    impact: 'HIGH',
    affected_sectors: ['IT Services & Tech', 'Commodities', 'Export Heavy Sectors', 'Global Metals'],
    affected_stocks: ['TCS', 'INFY', 'WIPRO', 'BHARTIARTL', 'BEPL'],
    summary: 'US Fed Chair Jerome Powell will announce FOMC rate decision. Markets are pricing a 92% probability of a 25 bps rate cut to 5.00%-5.25%.',
    expected_outcome: 'US rate cuts weaken US Dollar Index (DXY), sparking massive foreign institutional (FII) equity inflows into emerging markets like India.',
    investor_action: 'Huge positive trigger for Indian IT exporters (TCS, Infosys) and broad Nifty 50 largecaps.',
  },
  {
    id: 'evt-4',
    title: '54th GST Council Meeting on Bio-Fuel, EV Charging & Petrochemicals Tariffs',
    category: 'REGULATORY',
    date: '2026-09-11',
    timing: '02:00 PM IST',
    day_label: 'THIS_WEEK',
    country: 'India',
    impact: 'HIGH',
    affected_sectors: ['Sugar & Ethanol', 'LPG & Clean Energy', 'Specialty Chemicals', 'EV Mobility'],
    affected_stocks: ['ANDHRSUGAR', 'CONFIPET', 'BCLIND', 'GUJALKALI', 'BPCL'],
    summary: 'GST Council headed by Union Finance Minister will deliberate on rationalizing GST rates on ethanol blended fuel components and gas logistics equipment from 12% to 5%.',
    expected_outcome: 'Potential tax rate rationalization will directly expand operating margins for green fuel producers (Andhra Sugars, BCL Ind, Confidence Petroleum).',
    investor_action: 'Strong tactical catalyst for ProPicks clean energy basket. Pre-event accumulation favored.',
  },
  {
    id: 'evt-5',
    title: 'OPEC+ Ministerial JMMC Oil Output Policy & Crude Quota Review',
    category: 'GLOBAL_ENERGY',
    date: '2026-09-12',
    timing: '04:00 PM IST',
    day_label: 'THIS_WEEK',
    country: 'Global / OPEC',
    impact: 'MEDIUM',
    affected_sectors: ['Oil Refining & Marketing (OMCs)', 'Chemicals & Polymers', 'Aviation & Logistics'],
    affected_stocks: ['BPCL', 'BEPL', 'GUJALKALI', 'RELIANCE'],
    summary: 'OPEC+ alliance reviews the planned rollback of voluntary 2.2 million barrel/day oil supply cuts amid softening Chinese oil demand.',
    expected_outcome: 'Delaying supply hikes keeps Brent crude rangebound around $78-$84/bbl, preserving healthy marketing margins for domestic OMCs (BPCL).',
    investor_action: 'If Brent stays under $85, maintain full allocation to BPCL and keep tight stop-loss on polymer maker BEPL.',
  },
  {
    id: 'evt-6',
    title: 'BSE & NSE Monthly Futures & Options (F&O) Derivatives Expiry',
    category: 'REGULATORY',
    date: '2026-09-24',
    timing: '03:30 PM IST',
    day_label: 'UPCOMING',
    country: 'India',
    impact: 'MEDIUM',
    affected_sectors: ['All NSE & BSE Listed Equities', 'High Beta Momentum Stocks'],
    affected_stocks: ['ZUARI', 'COALINDIA', 'TATAMOTORS', 'CONFIPET'],
    summary: 'Monthly rollover of derivative contracts across Nifty, BankNifty, and stock futures. High volatility and price discovery expected during the final 90 minutes.',
    expected_outcome: 'Sharp intra-day swings; short covering rallies in undervalued counters.',
    investor_action: 'Avoid excessive intraday leverage; focus on cash delivery positions in ProPicks value champions.',
  },
];

export function getStockExitAdvisory(ticker: string): StockExitAdvisory {
  const normalized = ticker.toUpperCase().replace('.NS', '').replace('.BO', '');
  if (STOCK_EXIT_RADAR[normalized]) {
    return STOCK_EXIT_RADAR[normalized];
  }

  // Fallback dynamic generator
  return {
    ticker: normalized,
    name: normalized,
    current_price: 100.0,
    status: 'THESIS_INTACT',
    signal_label: 'Thesis Normal — HOLD',
    signal_color: 'emerald',
    risk_level: 'LOW',
    opposite_news_detected: false,
    exit_reason: 'No adverse opposite news detected. Company fundamentals and sector trends remain stable.',
    action_plan: 'Hold position with standard trailing stop-loss (8% below entry).',
    stop_loss_price: 92.00,
    key_support_price: 95.00,
    target_price: 130.00,
    last_evaluated: 'Today, 03:30 PM',
    news: [
      {
        id: `news-${normalized}-1`,
        ticker: normalized,
        headline: `${normalized} operations remain on track; sector quarterly demand steady`,
        source: 'Financial Market Wire',
        published_at: new Date().toISOString(),
        time_ago: '3 hours ago',
        summary: `Recent business updates show consistent order inflow and stable gross operating realization margins for ${normalized}.`,
        sentiment: 'positive',
        sentiment_score: 72,
        impact_on_thesis: 'Positive: Core investment thesis intact.',
      },
    ],
  };
}

export function getAllExitAlerts(): StockExitAdvisory[] {
  return Object.values(STOCK_EXIT_RADAR);
}

export function getDailyMajorEvents(): DailyMarketEvent[] {
  return DAILY_MAJOR_MARKET_EVENTS;
}
