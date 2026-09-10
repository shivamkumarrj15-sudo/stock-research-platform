// Smart Money Concepts (SMC), Sector Momentum Radar, and Fresh Multi-Bagger Stock Picks

export interface SMCTechnicalProfile {
  market_structure: 'BULLISH_BOS' | 'BEARISH_BOS' | 'CHOCH_REVERSAL' | 'RANGE_ACCUMULATION';
  structure_label: string;
  order_block_zone: {
    type: 'BULLISH_DEMAND' | 'BEARISH_SUPPLY';
    low: number;
    high: number;
    description: string;
  };
  liquidity_sweep: {
    status: 'SSL_SWEPT' | 'BSL_SWEPT' | 'PENDING_SWEEP';
    level: number;
    description: string;
  };
  fair_value_gap_fvg: {
    has_fvg: boolean;
    fvg_low: number;
    fvg_high: number;
    type: 'BULLISH_IMBALANCE' | 'BEARISH_IMBALANCE';
  };
  smart_money_accumulation_score: number; // 0-100
  risk_reward_ratio: string; // e.g. "1:4.2"
  institutional_bias: 'STRONG_BUY_ZONE' | 'BUY_ON_PULLBACK' | 'PROFIT_BOOK_ZONE' | 'DISTRIBUTION_EXIT';
}

export interface FreshSectorPick {
  ticker: string;
  name: string;
  bse_code: string;
  sector_id: string;
  sector_name: string;
  industry: string;
  price: number;
  change_1d: number;
  change_1m: number;
  fair_value: number;
  fair_value_upside: number;
  target_price: number;
  stop_loss: number;
  dividend_yield: number;
  dividend_per_share: number;
  health_score: number;
  momentum_score: number;
  action_signal: 'FRESH_BUY_TOMORROW' | 'MOMENTUM_ACCELERATING' | 'BOOK_PROFIT_EXIT' | 'HOLD_COMPOUND';
  signal_badge: string;
  smc: SMCTechnicalProfile;
  investment_thesis: string;
  catalysts: string[];
  key_risks: string[];
}

export interface SectorCategory {
  id: string;
  name: string;
  icon_name: string;
  momentum_rank: number;
  trend_status: 'SUPER_BULLISH' | 'ACCELERATING' | 'ROTATION_INFLOW' | 'CONSOLIDATING';
  trend_label: string;
  avg_1m_return_pct: number;
  institutional_fii_dii_flow: 'HEAVY_INFLOW' | 'STEADY_ACCUMULATION' | 'NEUTRAL';
  description: string;
  catalyst_summary: string;
  top_picks: string[]; // tickers
}

// 1. Hot Sector Categories for Direct Sector Investment
export const SECTOR_CATEGORIES: SectorCategory[] = [
  {
    id: 'defense_aerospace',
    name: 'Defense & Aerospace',
    icon_name: 'ShieldCheck',
    momentum_rank: 1,
    trend_status: 'SUPER_BULLISH',
    trend_label: '🔥 Super Bullish (Highest Institutional Inflow)',
    avg_1m_return_pct: 18.6,
    institutional_fii_dii_flow: 'HEAVY_INFLOW',
    description: 'Defense indigenization (Make-in-India), ₹3.5 Lakh Cr defense budget allocation, and exponential export orders to 85+ countries make this the #1 alpha-generating sector.',
    catalyst_summary: 'Tri-service defense capital procurement orders, naval destroyer modernization, and indigenous missile systems.',
    top_picks: ['BEL', 'COCHINSHIP', 'SOLARINDS', 'KAYNES'],
  },
  {
    id: 'green_energy_power',
    name: 'Green Energy & Power Infra',
    icon_name: 'Zap',
    momentum_rank: 2,
    trend_status: 'ACCELERATING',
    trend_label: '⚡ Accelerating (500GW Clean Energy Goal)',
    avg_1m_return_pct: 15.2,
    institutional_fii_dii_flow: 'HEAVY_INFLOW',
    description: 'India power demand is growing at 8% CAGR driven by data centers, EV mobility, and manufacturing. Renewable energy financing yields 6%+ stable cash dividends.',
    catalyst_summary: '500 GW green energy mandate by 2030, National Green Hydrogen mission, and massive transmission grid expansion.',
    top_picks: ['IREDA', 'TATAPOWER', 'POWERGRID', 'RECLTD', 'PFC'],
  },
  {
    id: 'electronics_ems',
    name: 'Electronics Manufacturing (EMS)',
    icon_name: 'Cpu',
    momentum_rank: 3,
    trend_status: 'SUPER_BULLISH',
    trend_label: '🚀 Explosive Growth (PLI Export Boom)',
    avg_1m_return_pct: 22.4,
    institutional_fii_dii_flow: 'HEAVY_INFLOW',
    description: 'Global tech supply chains shifting from China to India. Electronics production linked incentive (PLI) schemes driving 40%+ annual revenue CAGR.',
    catalyst_summary: 'Smartphone export surge, defense electronics localization, automotive smart dashboards, and semiconductor OSAT packaging plants.',
    top_picks: ['DIXON', 'KAYNES', 'POLYCAB'],
  },
  {
    id: 'auto_ev_ancillary',
    name: 'Auto, EV & Mobility Exports',
    icon_name: 'Truck',
    momentum_rank: 4,
    trend_status: 'ROTATION_INFLOW',
    trend_label: '🟢 Rotation Inflow (EV Transition)',
    avg_1m_return_pct: 12.8,
    institutional_fii_dii_flow: 'STEADY_ACCUMULATION',
    description: 'Electric 2-wheelers, luxury passenger vehicle margin expansion, and high commercial vehicle suspension replacement demand.',
    catalyst_summary: 'FAME-3 EV subsidies, festive automobile volume ramp-up, and European auto component export contracts.',
    top_picks: ['TATAMOTORS', 'JAMNAAUTO', 'BEPL'],
  },
  {
    id: 'capital_goods_infra',
    name: 'Capital Goods & Infrastructure',
    icon_name: 'Building',
    momentum_rank: 5,
    trend_status: 'ACCELERATING',
    trend_label: '🏗️ Capex Boom (₹11 Lakh Cr National Budget)',
    avg_1m_return_pct: 14.1,
    institutional_fii_dii_flow: 'STEADY_ACCUMULATION',
    description: 'National infrastructure pipeline (highways, high-speed rail, deep-water ports, and industrial corridors) generating all-time high order books.',
    catalyst_summary: 'Record government infrastructure CAPEX budget, industrial automation, and heavy engineering exports.',
    top_picks: ['LT', 'POLYCAB', 'COALINDIA'],
  },
  {
    id: 'bio_ethanol_agro',
    name: 'Bio-Ethanol & Agro Chemicals',
    icon_name: 'Sprout',
    momentum_rank: 6,
    trend_status: 'ROTATION_INFLOW',
    trend_label: '🌱 High Margin Policy Tailwind',
    avg_1m_return_pct: 16.5,
    institutional_fii_dii_flow: 'STEADY_ACCUMULATION',
    description: 'Government 20% Ethanol Blending mandate guarantees 100% off-take at lucrative non-capping fixed rates for grain and sugar distilleries.',
    catalyst_summary: 'Ethanol procurement quota hike (+₹2.10/L) by state OMCs, and robust monsoon boosting agrochemical demand.',
    top_picks: ['BCLIND', 'CONFIPET', 'ANDHRSUGAR'],
  },
  {
    id: 'psu_value_dividends',
    name: 'PSU Value & High Cash Dividends',
    icon_name: 'Coins',
    momentum_rank: 7,
    trend_status: 'CONSOLIDATING',
    trend_label: '💰 High Yield Cash Cows (5% - 8% Yield)',
    avg_1m_return_pct: 9.4,
    institutional_fii_dii_flow: 'STEADY_ACCUMULATION',
    description: 'Monopolistic government enterprises trading at single-digit P/E ratios with sovereign balance sheet safety and regular quarterly cash payouts.',
    catalyst_summary: 'High dividend payout mandates, commodity price stability, and asset monetization.',
    top_picks: ['COALINDIA', 'BPCL', 'PFC', 'RECLTD'],
  },
];

// 2. Fresh Curated High-Return Multi-Baggers for Tomorrow's Buy (with SMC Liquidity Analysis)
export const FRESH_MOMENTUM_STOCKS: FreshSectorPick[] = [
  {
    ticker: 'BEL',
    name: 'Bharat Electronics Ltd',
    bse_code: '500049',
    sector_id: 'defense_aerospace',
    sector_name: 'Defense & Aerospace',
    industry: 'Naval & Air Defense Radars, Avionics & Electronic Warfare',
    price: 304.50,
    change_1d: 2.14,
    change_1m: 18.4,
    fair_value: 395.00,
    fair_value_upside: 29.7,
    target_price: 395.00,
    stop_loss: 282.00,
    dividend_yield: 4.2,
    dividend_per_share: 4.20,
    health_score: 95,
    momentum_score: 94,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '🎯 FRESH BUY (SMC Demand Zone)',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'Bullish Break of Structure (BOS) on Daily Chart',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 292.00,
        high: 302.50,
        description: 'Institutional Bullish Order Block formed after clearing previous swing highs with huge volume footprint.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 288.50,
        description: 'Sell-Side Liquidity (SSL) below equal lows was aggressively swept before the 5% impulsive rally.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 298.00,
        fvg_high: 303.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 94,
      risk_reward_ratio: '1:4.1',
      institutional_bias: 'STRONG_BUY_ZONE',
    },
    investment_thesis: 'BEL is India’s premier defense electronics giant with an unprecedented ₹76,000+ Cr order book. Zero debt, 28% ROE, and 4.2% consistent dividend yield make it the safest high-momentum compounder.',
    catalysts: ['Q3 order inflows exceeding ₹15,000 Cr', 'Akash missile system & radar export deliveries', 'Consistent high payout cash dividend policy'],
    key_risks: ['Defense procurement budget disbursement delays', 'Component import lead times'],
  },
  {
    ticker: 'COCHINSHIP',
    name: 'Cochin Shipyard Ltd',
    bse_code: '540678',
    sector_id: 'defense_aerospace',
    sector_name: 'Defense & Aerospace',
    industry: 'Defense Shipbuilding, Aircraft Carriers & Green Vessels',
    price: 1845.00,
    change_1d: 3.85,
    change_1m: 29.6,
    fair_value: 2450.00,
    fair_value_upside: 32.8,
    target_price: 2450.00,
    stop_loss: 1680.00,
    dividend_yield: 2.8,
    dividend_per_share: 15.00,
    health_score: 93,
    momentum_score: 96,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '🚀 SUPER MOMENTUM (Order Book 8x)',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'Aggressive Institutional Breakout & FVG Retest',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 1760.00,
        high: 1820.00,
        description: 'High-conviction Institutional Order Block created by DII mutual fund block deals.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 1740.00,
        description: 'Retail stop-loss clusters swept at 1740 before institutional expansion.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 1785.00,
        fvg_high: 1835.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 96,
      risk_reward_ratio: '1:3.7',
      institutional_bias: 'STRONG_BUY_ZONE',
    },
    investment_thesis: 'India’s largest shipbuilding dock with ₹22,000 Cr order book. Commissioning of new ₹2,800 Cr International Ship Repair Facility (ISRF) drives multi-year margin expansion.',
    catalysts: ['Next-Gen Corvette & Aircraft Carrier refit contracts', 'European zero-emission electric cargo vessel exports', 'Navratna status financial autonomy'],
    key_risks: ['Global steel plate raw material price inflation', 'Long execution gestation periods'],
  },
  {
    ticker: 'IREDA',
    name: 'Indian Renewable Energy Dev Agency',
    bse_code: '544026',
    sector_id: 'green_energy_power',
    sector_name: 'Green Energy & Power Infra',
    industry: 'Renewable Solar, Wind & Green Hydrogen Financing',
    price: 232.40,
    change_1d: 1.95,
    change_1m: 21.2,
    fair_value: 310.00,
    fair_value_upside: 33.4,
    target_price: 310.00,
    stop_loss: 212.00,
    dividend_yield: 2.1,
    dividend_per_share: 3.50,
    health_score: 91,
    momentum_score: 93,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '🎯 FRESH BUY (Clean Energy Pure-Play)',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'Higher-High Higher-Low Structural Trend',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 218.00,
        high: 228.00,
        description: 'Primary institutional demand block tested with declining volume on pullback.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 215.00,
        description: 'Liquidity sweep below key psychological 220 mark.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 224.00,
        fvg_high: 229.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 92,
      risk_reward_ratio: '1:3.8',
      institutional_bias: 'BUY_ON_PULLBACK',
    },
    investment_thesis: 'Government Navratna CPSE purely focused on financing India’s 500 GW clean energy transition. Loan book expanding at 35%+ CAGR with lowest borrowing costs in the sector.',
    catalysts: ['FPO / QIP capital raise for loan book expansion', 'Zero bad loans in rooftop solar portfolio', 'High sovereign rating AAA backing'],
    key_risks: ['State discom delayed payment cycles', 'Interest rate margin compression'],
  },
  {
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    bse_code: '500400',
    sector_id: 'green_energy_power',
    sector_name: 'Green Energy & Power Infra',
    industry: 'Integrated Power Generation, EV Charging & Solar Rooftops',
    price: 365.55,
    change_1d: 1.45,
    change_1m: 14.8,
    fair_value: 480.00,
    fair_value_upside: 31.3,
    target_price: 480.00,
    stop_loss: 340.00,
    dividend_yield: 3.8,
    dividend_per_share: 5.50,
    health_score: 90,
    momentum_score: 89,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '⚡ CLEAN POWER CHAMPION',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'SMC Golden Cross with Bullish Accumulation',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 350.00,
        high: 362.00,
        description: 'Institutional re-accumulation order block above 50-day moving average.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 348.00,
        description: 'Weak retail stop losses taken out before breakout continuation.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 358.00,
        fvg_high: 364.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 90,
      risk_reward_ratio: '1:4.5',
      institutional_bias: 'STRONG_BUY_ZONE',
    },
    investment_thesis: 'Monopoly in nationwide EV charging infrastructure (5,000+ public chargers) and leader in PM Surya Ghar solar rooftop installations with 35% market share.',
    catalysts: ['Solar cell & module 4.3 GW manufacturing plant ramp up in Tamil Nadu', 'PM Surya Ghar 1 Crore household solar rooftop scheme', 'Steady 3.8% dividend yield'],
    key_risks: ['Imported coal fuel price volatility at Mundra plant', 'Transmission line right-of-way hurdles'],
  },
  {
    ticker: 'DIXON',
    name: 'Dixon Technologies Ltd',
    bse_code: '540699',
    sector_id: 'electronics_ems',
    sector_name: 'Electronics Manufacturing (EMS)',
    industry: 'Smartphones, Consumer Electronics, LED & Telecom Hardware',
    price: 12450.00,
    change_1d: 2.85,
    change_1m: 24.1,
    fair_value: 15800.00,
    fair_value_upside: 26.9,
    target_price: 15800.00,
    stop_loss: 11400.00,
    dividend_yield: 1.4,
    dividend_per_share: 12.00,
    health_score: 94,
    momentum_score: 97,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '🚀 EMS MULTI-BAGGER LEADER',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'All-Time High Structure Breakout with Volume Explosion',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 11800.00,
        high: 12250.00,
        description: 'Highest volume institutional demand shelf during quarterly earnings breakout.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 11650.00,
        description: 'Pre-breakout shakeout swept all weak hands.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 12100.00,
        fvg_high: 12380.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 97,
      risk_reward_ratio: '1:3.2',
      institutional_bias: 'STRONG_BUY_ZONE',
    },
    investment_thesis: 'India’s Foxconn. Manufacturing smartphones for Xiaomi, Motorola, and global OEM giants. Revenue expanding at 45%+ CAGR with heavy domestic value addition.',
    catalysts: ['Acquisition of Ismartu / Transsion manufacturing scale', 'Display module & component backward integration', 'Global electronics export contracts'],
    key_risks: ['High customer concentration in top 3 smartphone brands', 'Component supply chain disruptions'],
  },
  {
    ticker: 'POLYCAB',
    name: 'Polycab India Ltd',
    bse_code: '542652',
    sector_id: 'capital_goods_infra',
    sector_name: 'Capital Goods & Infrastructure',
    industry: 'Wires, Power Transmission Cables & Fast Moving Electrical Goods (FMEG)',
    price: 6480.00,
    change_1d: 1.65,
    change_1m: 16.2,
    fair_value: 7850.00,
    fair_value_upside: 21.1,
    target_price: 7850.00,
    stop_loss: 5950.00,
    dividend_yield: 2.2,
    dividend_per_share: 30.00,
    health_score: 96,
    momentum_score: 91,
    action_signal: 'FRESH_BUY_TOMORROW',
    signal_badge: '🎯 INFRA BLUE-CHIP BUY',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'SMC Demand Zone Bounce & Trend Continuation',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 6150.00,
        high: 6380.00,
        description: 'Major institutional accumulation base established over 4 months.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 6080.00,
        description: 'Liquidity purge completed before 400-point expansion.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 6320.00,
        fvg_high: 6440.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 93,
      risk_reward_ratio: '1:3.5',
      institutional_bias: 'BUY_ON_PULLBACK',
    },
    investment_thesis: 'Market monopoly in Indian cables & wires with 25%+ organized market share. Zero debt balance sheet with ₹2,000+ Cr annual operating cash flows and high dividend payout.',
    catalysts: ['National transmission grid & high-speed rail electrification', 'Real estate and industrial CAPEX boom', 'Export expansion into US and Europe'],
    key_risks: ['Copper and aluminum raw material volatility', 'Intensifying competition in retail FMEG appliances'],
  },
  {
    ticker: 'RECLTD',
    name: 'REC Limited',
    bse_code: '532955',
    sector_id: 'psu_value_dividends',
    sector_name: 'PSU Value & High Cash Dividends',
    industry: 'Power & Infrastructure Financing Maharatna NBFC',
    price: 317.85,
    change_1d: 0.46,
    change_1m: 11.8,
    fair_value: 398.51,
    fair_value_upside: 25.4,
    target_price: 398.51,
    stop_loss: 295.00,
    dividend_yield: 6.5,
    dividend_per_share: 18.20,
    health_score: 92,
    momentum_score: 88,
    action_signal: 'HOLD_COMPOUND',
    signal_badge: '💰 6.5% HIGH DIVIDEND CASH COW',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'Multi-Month Demand Support Base',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 304.00,
        high: 314.00,
        description: '52-Week support base with heavy domestic institutional accumulation.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 304.05,
        description: '52-Week low liquidity swept cleanly, triggering strong buyer absorption.',
      },
      fair_value_gap_fvg: {
        has_fvg: false,
        fvg_low: 0,
        fvg_high: 0,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 89,
      risk_reward_ratio: '1:3.6',
      institutional_bias: 'STRONG_BUY_ZONE',
    },
    investment_thesis: 'High dividend yield of 6.5%, single digit P/E of 5.2x, sovereign credit backing, and green energy financing target of ₹3 Lakh Cr with near-zero NPAs.',
    catalysts: ['Quarterly cash dividend distribution (₹4.50/share)', 'Green hydrogen loan sanction ramp-up', 'Zero new NPA additions in renewable assets'],
    key_risks: ['State DISCOM financial stress', 'Interest rate margin compression'],
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    bse_code: '533278',
    sector_id: 'psu_value_dividends',
    sector_name: 'PSU Value & High Cash Dividends',
    industry: 'Monopoly Thermal Coal Mining & Power Security',
    price: 420.25,
    change_1d: 0.33,
    change_1m: 15.6,
    fair_value: 522.01,
    fair_value_upside: 24.2,
    target_price: 522.01,
    stop_loss: 388.00,
    dividend_yield: 6.6,
    dividend_per_share: 26.40,
    health_score: 89,
    momentum_score: 87,
    action_signal: 'HOLD_COMPOUND',
    signal_badge: '💰 6.6% CASH DIVIDEND MONOPOLY',
    smc: {
      market_structure: 'BULLISH_BOS',
      structure_label: 'Institutional Volume Re-accumulation Range',
      order_block_zone: {
        type: 'BULLISH_DEMAND',
        low: 395.00,
        high: 412.00,
        description: 'High volume node where pension funds and LIC aggressively buy.',
      },
      liquidity_sweep: {
        status: 'SSL_SWEPT',
        level: 392.00,
        description: 'Sell stops swept at 392 followed by 5 consecutive green daily sessions.',
      },
      fair_value_gap_fvg: {
        has_fvg: true,
        fvg_low: 410.00,
        fvg_high: 418.00,
        type: 'BULLISH_IMBALANCE',
      },
      smart_money_accumulation_score: 88,
      risk_reward_ratio: '1:3.2',
      institutional_bias: 'BUY_ON_PULLBACK',
    },
    investment_thesis: 'World’s largest coal miner supplying 80%+ of India’s thermal power grid. Net cash balance sheet with massive ₹40,000+ Cr cash reserves and 6.6% dividend yield.',
    catalysts: ['Higher e-auction coal premium realization', 'Thermal power capacity expansion to 80 GW', 'High interim cash dividend announcement'],
    key_risks: ['Long-term clean energy transition away from thermal coal', 'Mining royalty hikes by state governments'],
  }
];

// 3. Auto-Exit & Profit-Booking Alerts (When a stock has completed its move and correction is imminent)
export interface AutoExitAlert {
  ticker: string;
  name: string;
  current_price: number;
  entry_price: number;
  realized_gain_pct: number;
  exit_status: 'BOOK_FULL_PROFIT' | 'PARTIAL_EXIT_TRAIL_SL' | 'CORRECTION_WARNING_EXIT';
  exit_status_badge: string;
  exit_urgency: 'HIGH' | 'MEDIUM';
  smc_exit_reason: string;
  technical_triggers: string[];
  reinvestment_advice: string;
}

export const AUTO_EXIT_ALERTS: AutoExitAlert[] = [
  {
    ticker: 'HFCL',
    name: 'HFCL Ltd',
    current_price: 233.32,
    entry_price: 135.00,
    realized_gain_pct: 85.7,
    exit_status: 'BOOK_FULL_PROFIT',
    exit_status_badge: '🚨 FULL PROFIT BOOKING (Target Reached +85.7%)',
    exit_urgency: 'HIGH',
    smc_exit_reason: 'Bearish Change of Character (CHoCH) detected on 4H chart. Buy-Side Liquidity (BSL) swept at ₹255 followed by strong institutional supply dump.',
    technical_triggers: [
      'RSI-14 hit extreme overbought zone (84.2)',
      'Bearish Order Block rejection at ₹255.00 resistance',
      'Smart Money Distribution footprint detected with 3.2x normal volume',
      'Stock reached 150% of intrinsic fair value (Overvalued by 30%)'
    ],
    reinvestment_advice: 'Book 100% realized gains (+85.7%) and rotate freed capital into BEL (Bharat Electronics) or IREDA in the demand zone for next multi-bagger cycle.',
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals',
    current_price: 223.04,
    entry_price: 148.00,
    realized_gain_pct: 54.0,
    exit_status: 'PARTIAL_EXIT_TRAIL_SL',
    exit_status_badge: '⚠️ PARTIAL PROFIT BOOK (Lock 50% Gains)',
    exit_urgency: 'MEDIUM',
    smc_exit_reason: 'Fair Value Gap fully filled at ₹230. Momentum flattening near key supply zone. Trail Stop Loss to ₹212.00.',
    technical_triggers: [
      'Target ₹230 reached with +54% return',
      'RSI-14 divergence on 1D timeframe',
      'Phosphoric acid input cost escalation warning'
    ],
    reinvestment_advice: 'Book 50% capital profits now and move stop-loss to ₹212 to protect gains. Deploy profits into Dixon Technologies or Cochin Shipyard.',
  }
];
