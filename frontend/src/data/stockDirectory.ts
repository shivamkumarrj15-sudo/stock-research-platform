export interface StockInfo {
  ticker: string;
  name: string;
  symbol: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  change_pct: number;
  week_52_high: number;
  week_52_low: number;
  pe_ratio: number;
  pb_ratio: number;
  dividend_yield: number;
  market_cap: string;
  business_model: string;
  future_demand_outlook: string;
  why_invest: string;
  financial_health_summary: string;
  catalysts: string[];
  key_risks: string[];
}

export const STOCK_DIRECTORY: StockInfo[] = [
  {
    ticker: 'WIPRO',
    name: 'Wipro Limited',
    symbol: 'WIPRO.NS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    price: 166.30,
    change_pct: -0.42,
    week_52_high: 200.40,
    week_52_low: 154.20,
    pe_ratio: 12.5,
    pb_ratio: 1.98,
    dividend_yield: 6.59,
    market_cap: '₹1,65,294 Cr',
    business_model: 'Wipro is a global IT services and consulting enterprise with operations across 65+ countries.',
    future_demand_outlook: 'HIGH AI MODERNIZATION DEMAND. Wipro ai360 ecosystem and large cloud transformation outsourcing deals.',
    why_invest: 'Bargain P/E valuation (12.5x), attractive 6.59% dividend yield, and over ₹12,000 Cr annual free cash flow.',
    financial_health_summary: 'Piotroski Score 7/9, Debt-to-Equity 0.24, ROE 15.5%, ROCE 17.8%, and strong cash conversion.',
    catalysts: ['Wipro ai360 enterprise scaling', 'Large deal pipeline ramp-up', 'High cash dividend payout'],
    key_risks: ['Discretionary IT consulting budget slowdown', 'Margin pressure in BFSI vertical']
  },
  {
    ticker: 'RECLTD',
    name: 'REC Limited',
    symbol: 'RECLTD.NS',
    exchange: 'NSE',
    sector: 'Financials & Power Infra',
    industry: 'Infrastructure & Power NBFC (Maharatna)',
    price: 313.80,
    change_pct: -0.22,
    week_52_high: 390.50,
    week_52_low: 304.05,
    pe_ratio: 5.10,
    pb_ratio: 0.98,
    dividend_yield: 5.95,
    market_cap: '₹81,893 Cr',
    business_model: 'REC Limited is a Maharatna CPSE providing long-term debt financing across India power generation, transmission, and green energy.',
    future_demand_outlook: 'HIGH STRUCTURAL DEMAND. National power CAPEX exceeding ₹15 Lakh Cr guarantees multi-year loan growth.',
    why_invest: 'Trading below Book Value (0.98x PB), super low P/E (5.10x), high dividend yield (~6.0%), and sovereign backing.',
    financial_health_summary: 'Return on Equity 20.1%, Net NPA < 0.4%, and record loan disbursements.',
    catalysts: ['Renewable energy financing target ₹3 Lakh Cr', 'Navratna to Maharatna operational freedom', 'Consistent quarterly dividends'],
    key_risks: ['State DISCOM payment delay cycles', 'Interest rate margin compression']
  },
  {
    ticker: 'BEL',
    name: 'Bharat Electronics Ltd',
    symbol: 'BEL.NS',
    exchange: 'NSE',
    sector: 'Defense & Aerospace',
    industry: 'Defense Electronics & Radars (Navratna)',
    price: 405.00,
    change_pct: -0.25,
    week_52_high: 440.00,
    week_52_low: 260.00,
    pe_ratio: 46.8,
    pb_ratio: 17.3,
    dividend_yield: 1.10,
    market_cap: '₹2,96,000 Cr',
    business_model: 'BEL is India’s premier defense electronics giant manufacturing radars, sonars, missile electronics, and electronic warfare suites.',
    future_demand_outlook: 'MASSIVE MULTI-YEAR DEFENSE CAPEX. Indigenization mandate (Atmanirbhar Bharat) guarantees steady domestic defense procurement.',
    why_invest: 'Completely ZERO DEBT (D/E 0.00), exceptional ROCE (36.4%), ROE (27.4%), and record order book exceeding ₹76,000 Cr.',
    financial_health_summary: 'Piotroski Score 9/9, Zero Debt, Altman Z-Score 11.4, and over ₹10,000 Cr cash reserves.',
    catalysts: ['QRSAM & Akash Prime missile electronics delivery', 'Naval radar exports to friendly nations', 'Defense budget capital allocation boost'],
    key_risks: ['Single customer concentration (Indian Armed Forces)', 'Lead time for defense system flight certifications']
  },
  {
    ticker: 'TRENT',
    name: 'Trent Limited (Tata Retail)',
    symbol: 'TRENT.NS',
    exchange: 'NSE',
    sector: 'Consumer & Retail',
    industry: 'Fast Fashion & Supermarket Retail (Zudio)',
    price: 2818.70,
    change_pct: -0.05,
    week_52_high: 3100.00,
    week_52_low: 1850.00,
    pe_ratio: 82.2,
    pb_ratio: 24.5,
    dividend_yield: 0.60,
    market_cap: '₹1,00,200 Cr',
    business_model: 'Trent (Tata Group) operates retail formats including Westside, Zudio, Star Bazaar, and Misbu.',
    future_demand_outlook: 'EXPLOSIVE RETAIL CONSUMPTION. Zudio format is opening 150+ stores annually with store-level breakeven within 90 days.',
    why_invest: 'Profit CAGR 62.4% over 5 years, ROCE 28.3%, ROE 27.7%, and virtually zero debt (D/E 0.12).',
    financial_health_summary: 'Piotroski Score 8/9, negligible leverage, and highest inventory turnover in Indian retail.',
    catalysts: ['Zudio footprint expansion into tier-3/4 towns', 'Star Bazaar grocery format turnaround', 'International GCC expansion'],
    key_risks: ['High valuation multiple', 'Intensifying fast-fashion competition from Reliance Yousta']
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Limited',
    symbol: 'COALINDIA.NS',
    exchange: 'NSE',
    sector: 'Energy & Commodities',
    industry: 'Mining & Coal Monopoly (Maharatna)',
    price: 432.00,
    change_pct: 0.23,
    week_52_high: 491.25,
    week_52_low: 369.60,
    pe_ratio: 8.10,
    pb_ratio: 2.98,
    dividend_yield: 6.60,
    market_cap: '₹2,66,000 Cr',
    business_model: 'Coal India produces 80%+ of India domestic coal required for thermal power stations and heavy industries.',
    future_demand_outlook: 'HIGH BASELOAD POWER DEMAND. Coal generates 70%+ of India electricity baseload.',
    why_invest: 'Huge 6.60% Dividend Yield, negligible debt (D/E 0.06), low P/E (8.10x), and ROCE 35.0%.',
    financial_health_summary: 'Piotroski Score 9/9, massive annual FCF of ₹24,000 Cr, and fortress balance sheet.',
    catalysts: ['1 Billion Ton annual dispatch target', '6.6% Dividend Yield', 'E-auction premium realization gains'],
    key_risks: ['Long-term green energy transition policy', 'Monsoon flooding at open-cast mines']
  },
  {
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    symbol: 'TATAPOWER.NS',
    exchange: 'NSE',
    sector: 'Utilities & Clean Energy',
    industry: 'Integrated Power, Solar & EV Infra',
    price: 367.00,
    change_pct: -0.81,
    week_52_high: 448.00,
    week_52_low: 245.00,
    pe_ratio: 30.6,
    pb_ratio: 3.50,
    dividend_yield: 2.00,
    market_cap: '₹1,17,200 Cr',
    business_model: 'Tata Power is India largest integrated power player across conventional & renewable generation, transmission, and EV charging.',
    future_demand_outlook: 'MASSIVE CLEAN ENERGY TRANSITION. 20GW+ renewable generation capacity pipeline by 2030.',
    why_invest: 'Profit growth of 31.0% CAGR over 5 years, #1 rooftop solar player benefiting from PM Surya Ghar Yojana.',
    financial_health_summary: 'EBITDA expansion, strong operating cash flow of ₹5,400 Cr, and declining net debt.',
    catalysts: ['PM Surya Ghar solar rooftop rollout', 'EV charging station network across 500+ cities', 'Green hydrogen utility tie-ups'],
    key_risks: ['Discom receivable collection timelines', 'High capital expenditure intensity']
  },
  {
    ticker: 'DIXON',
    name: 'Dixon Technologies Ltd',
    symbol: 'DIXON.NS',
    exchange: 'NSE',
    sector: 'Technology Hardware & EMS',
    industry: 'Electronic Manufacturing Services (PLI Leader)',
    price: 13500.00,
    change_pct: -2.49,
    week_52_high: 15400.00,
    week_52_low: 6800.00,
    pe_ratio: 42.4,
    pb_ratio: 43.5,
    dividend_yield: 1.20,
    market_cap: '₹80,800 Cr',
    business_model: 'Dixon is India largest home-grown contract electronics manufacturer producing smartphones, LED TVs, and IT hardware.',
    future_demand_outlook: 'EXPONENTIAL MAKE-IN-INDIA EMS GROWTH. Global smartphone OEMs moving supply chains to India.',
    why_invest: 'Sales CAGR 34.2% and Profit CAGR 38.5% over 5 years, ROCE 29.2%, and negligible debt (D/E 0.22).',
    financial_health_summary: 'Piotroski Score 8/9, high asset turnover, and strong cash conversion.',
    catalysts: ['Smartphone PLI quota incentive disbursements', 'Ismartu & Transsion acquisition synergies', 'Laptop and IT hardware manufacturing contracts'],
    key_risks: ['Low single-digit operating margins (3.5-4.5%)', 'Customer concentration in top smartphone brands']
  },
  {
    ticker: 'POLYCAB',
    name: 'Polycab India Ltd',
    symbol: 'POLYCAB.NS',
    exchange: 'NSE',
    sector: 'Capital Goods & Industrials',
    industry: 'Cables, Wires & Fast Moving Electricals (FMEG)',
    price: 8358.00,
    change_pct: 0.05,
    week_52_high: 8800.00,
    week_52_low: 4500.00,
    pe_ratio: 44.1,
    pb_ratio: 15.5,
    dividend_yield: 1.80,
    market_cap: '₹1,25,600 Cr',
    business_model: 'Polycab is the market leader in wires and cables with 24%+ organized market share and expanding FMEG presence.',
    future_demand_outlook: 'HIGH REAL ESTATE & INFRASTRUCTURE DEMAND. Building construction, smart cities, and power grid modernization.',
    why_invest: 'Virtually DEBT FREE (D/E 0.04), ROCE 33.2%, ROE 23.0%, and profit CAGR 27.9% over 5 years.',
    financial_health_summary: 'Piotroski Score 8/9, pristine balance sheet with zero net debt, and FCF ₹2,100 Cr.',
    catalysts: ['National transmission grid expansion', 'FMEG distribution expansion', 'Exports to US/Europe growing at 30%+'],
    key_risks: ['Copper and aluminum raw material price volatility', 'Real estate construction cycle slowdown']
  },
  {
    ticker: 'HAL',
    name: 'Hindustan Aeronautics Ltd',
    symbol: 'HAL.NS',
    exchange: 'NSE',
    sector: 'Defense & Aerospace',
    industry: 'Fighter Jets, Helicopters & Engines (Maharatna)',
    price: 4950.00,
    change_pct: -1.01,
    week_52_high: 5600.00,
    week_52_low: 2900.00,
    pe_ratio: 34.5,
    pb_ratio: 12.0,
    dividend_yield: 1.70,
    market_cap: '₹3,31,000 Cr',
    business_model: 'HAL is the sole domestic designer and manufacturer of fighter aircraft, military helicopters, and aero-engines for the Indian Armed Forces.',
    future_demand_outlook: 'GUARANTEED MULTI-DECADE DEFENSE DEMAND. Modernization of Indian Air Force fighter squadrons.',
    why_invest: 'Completely DEBT FREE (D/E 0.00), ₹24,000+ Cr cash reserves, ROCE 32.0%, ROE 24.0%, and ₹1.2 Lakh Cr order pipeline.',
    financial_health_summary: 'Piotroski Score 9/9, Zero Debt, and immense operating cash flows.',
    catalysts: ['Tejas Mk1A delivery ramp-up to 24 jets/yr', 'Prachand Light Combat Helicopter mega order', 'GE-414 jet engine co-production pact with USA'],
    key_risks: ['Reliance on foreign engine deliveries', 'Long manufacturing cycles']
  },
  {
    ticker: 'CDSL',
    name: 'Central Depository Services Ltd',
    symbol: 'CDSL.NS',
    exchange: 'NSE',
    sector: 'Financial Infrastructure',
    industry: 'Capital Markets Depository (Duopoly Monopoly)',
    price: 1355.00,
    change_pct: -0.99,
    week_52_high: 1650.00,
    week_52_low: 850.00,
    pe_ratio: 54.0,
    pb_ratio: 16.5,
    dividend_yield: 1.60,
    market_cap: '₹28,300 Cr',
    business_model: 'CDSL holds shares, mutual funds, and debentures in electronic demat format for Indian retail and institutional investors.',
    future_demand_outlook: 'HIGH FINANCIALIZATION DEMAND. Demat accounts in India growing from 16 Crore to projected 30 Crore+.',
    why_invest: 'ZERO DEBT (D/E 0.00), 65%+ EBITDA margins, 77% incremental Demat market share, ROCE 36.2%, and ROE 31.5%.',
    financial_health_summary: 'Piotroski Score 9/9, zero debt, high cash conversion, and recurring annuity revenues.',
    catalysts: ['Record Demat account monthly additions', 'Insurance Demat account mandate (Bima Bharosa)', 'High cash dividend payouts'],
    key_risks: ['SEBI transaction fee rate revisions', 'Retail equity market trading volume cycles']
  },
  {
    ticker: 'KALYANKJIL',
    name: 'Kalyan Jewellers India Ltd',
    symbol: 'KALYANKJIL.NS',
    exchange: 'NSE',
    sector: 'Consumer & Retail',
    industry: 'Gold, Diamond & Lifestyle Jewellery Retail',
    price: 615.20,
    change_pct: 1.25,
    week_52_high: 720.00,
    week_52_low: 280.00,
    pe_ratio: 48.0,
    pb_ratio: 11.8,
    dividend_yield: 1.00,
    market_cap: '₹63,300 Cr',
    business_model: 'Kalyan Jewellers operates 200+ retail showrooms across India and the Middle East selling gold, bridal, and diamond jewellery.',
    future_demand_outlook: 'SHIFT TO ORGANIZED JEWELLERY. Custom duty reduction on gold accelerates shift from local unorganized shops.',
    why_invest: 'Profit CAGR 45.2% over 5 years, FOCO franchise asset-light model driving ROCE to 22.4%, and ROE 20.8%.',
    financial_health_summary: 'Piotroski Score 8/9, expanding operating margins, and asset-light showroom additions.',
    catalysts: ['FOCO franchise showroom network doubling', 'Candere diamond lifestyle format expansion', 'Gold import duty cut volume boost'],
    key_risks: ['Gold commodity price volatility', 'Competition with Titan Tanishq']
  },
  {
    ticker: 'ANDHRSUGAR',
    name: 'The Andhra Sugars Ltd',
    symbol: 'ANDHRSUGAR.NS',
    exchange: 'NSE',
    sector: 'Chemicals & Agro-Processing',
    industry: 'Bio-Ethanol, Caustic Soda & Rocket Propellants',
    price: 96.50,
    change_pct: -1.28,
    week_52_high: 107.23,
    week_52_low: 66.50,
    pe_ratio: 12.9,
    pb_ratio: 1.13,
    dividend_yield: 2.10,
    market_cap: '₹1,280 Cr',
    business_model: 'Andhra Sugars manufactures sugar, bio-ethanol, caustic soda, industrial chemicals, and rocket fuel for ISRO.',
    future_demand_outlook: 'SURGING ETHANOL & CHEMICAL DEMAND. 20% ethanol blending mandate and expanding ISRO rocket launches.',
    why_invest: 'Deep value multiple (1.13x Book Value), P/E 12.9x, low debt (D/E 0.08), and Piotroski Score 7/9.',
    financial_health_summary: 'Low leverage, high interest coverage (18.2x), and strong asset backing.',
    catalysts: ['Ethanol blend quota boost', 'ISRO launch vehicle propellant supply contracts', 'Caustic soda price realization recovery'],
    key_risks: ['Sugarcane crop yield sensitivity to monsoon', 'Government sugar price regulation']
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals Ltd',
    symbol: 'ZUARI.NS',
    exchange: 'NSE',
    sector: 'Fertilizers & Agriculture',
    industry: 'Specialty Nutrients & Crop Protection',
    price: 223.04,
    change_pct: -1.15,
    week_52_high: 345.60,
    week_52_low: 175.10,
    pe_ratio: 9.4,
    pb_ratio: 1.14,
    dividend_yield: 1.80,
    market_cap: '₹1,850 Cr',
    business_model: 'Zuari Agro Chemicals produces complex NPK/DAP fertilizers and agricultural crop nutrients.',
    future_demand_outlook: 'HIGH AGRICULTURAL INPUT DEMAND. Monsoon stability and direct government fertilizer subsidy disbursements.',
    why_invest: 'Trading near Book Value (1.14x PB), single-digit P/E (9.4x), and debt reduction via land asset sales.',
    financial_health_summary: 'Balance sheet deleveraging, low P/E multiple, and Paradeep Phosphates turnaround.',
    catalysts: ['Non-core land bank asset monetization', 'Fertilizer subsidy release', 'P/E multiple expansion'],
    key_risks: ['Raw material ammonia/phosphoric acid cost spikes', 'Monsoon spatial distribution']
  },
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    symbol: 'TCS.NS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting Leader',
    price: 2204.10,
    change_pct: -0.18,
    week_52_high: 3350.00,
    week_52_low: 1976.80,
    pe_ratio: 26.5,
    pb_ratio: 11.2,
    dividend_yield: 2.40,
    market_cap: '₹8,33,400 Cr',
    business_model: 'TCS is India largest IT services exporter providing enterprise digital transformation and AI consulting.',
    future_demand_outlook: 'ENTERPRISE AI MODERNIZATION. Multi-billion dollar digital transformation contracts.',
    why_invest: 'ZERO DEBT, ROE > 48%, Piotroski 9/9, and massive cash reserves of ₹45,000+ Cr.',
    financial_health_summary: 'Flawless balance sheet, operating margins ~26%, and FCF conversion > 100%.',
    catalysts: ['Generative AI order book exceeding $1 Billion', 'Mega-deal ramp-up', 'Share buyback & dividend payouts'],
    key_risks: ['Western enterprise IT budget caution', 'FX currency volatility']
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    symbol: 'RELIANCE.NS',
    exchange: 'NSE',
    sector: 'Energy / Telecom / Retail',
    industry: 'Diversified Conglomerate',
    price: 1274.00,
    change_pct: -0.39,
    week_52_high: 1611.80,
    week_52_low: 1249.80,
    pe_ratio: 24.2,
    pb_ratio: 2.10,
    dividend_yield: 0.80,
    market_cap: '₹17,88,000 Cr',
    business_model: 'Reliance spans Oil-to-Chemicals refining, Jio Telecom (470M+ subscribers), Retail (18,000+ stores), and Green Energy.',
    future_demand_outlook: 'TRIPLE GROWTH ENGINES. Jio 5G tariff hikes, retail consumption, and new green energy giga-factories.',
    why_invest: 'Market leader in telecom & retail, strong cash generation from refining, and potential Jio/Retail IPO listings.',
    financial_health_summary: 'EBITDA exceeding ₹1,75,000 Cr, conservative debt leverage, and credit rating AAA.',
    catalysts: ['Potential Jio & Retail IPO value unlocking', 'Jio ARPU increases', 'Solar Giga-factory commissioning'],
    key_risks: ['Global refining margin volatility', 'Heavy capital expenditure intensity']
  },
  {
    ticker: 'INFY',
    name: 'Infosys Limited',
    symbol: 'INFY.NS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Digital Solutions',
    price: 1036.50,
    change_pct: 0.14,
    week_52_high: 1728.00,
    week_52_low: 982.40,
    pe_ratio: 23.8,
    pb_ratio: 6.80,
    dividend_yield: 2.80,
    market_cap: '₹4,68,900 Cr',
    business_model: 'Infosys executes enterprise cloud transformations (Cobalt) and enterprise AI solutions (Topaz).',
    future_demand_outlook: 'HIGH CLOUD & AI REPLATFORMING DEMAND.',
    why_invest: 'ZERO DEBT, ROE > 30%, Piotroski 8/9, and 2.8% dividend yield.',
    financial_health_summary: 'Zero Debt, Free Cash Flow Yield 4.8%, and strong balance sheet.',
    catalysts: ['Large deal TCV conversion', 'Topaz AI adoption', 'Dividend and buyback capital returns'],
    key_risks: ['Discretionary IT spending slowdown', 'Talent wage inflation']
  },
  {
    ticker: 'SBIN',
    name: 'State Bank of India',
    symbol: 'SBIN.NS',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    industry: 'Public Sector Banking Leader',
    price: 1008.00,
    change_pct: 0.21,
    week_52_high: 1234.70,
    week_52_low: 805.60,
    pe_ratio: 9.8,
    pb_ratio: 1.40,
    dividend_yield: 1.80,
    market_cap: '₹9,06,800 Cr',
    business_model: 'SBI is India largest commercial bank with 480M+ customers and 22,000+ branches.',
    future_demand_outlook: 'STRONG CREDIT DEMAND. Corporate credit CAPEX cycle and retail home mortgage expansion.',
    why_invest: 'Multi-decade low Net NPA (< 0.6%), ROE > 18%, and attractive single-digit P/E (9.8x).',
    financial_health_summary: 'NIM 3.3%, Provision Coverage Ratio > 75%, and high capital adequacy.',
    catalysts: ['Corporate credit re-acceleration', 'YONO 2.0 digital banking rollout', 'Subsidiary IPO unlocking (SBI MF)'],
    key_risks: ['Deposit cost pressures in tight liquidity', 'Macroeconomic credit cycle shocks']
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    symbol: 'HDFCBANK.NS',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    industry: 'Private Sector Banking Giant',
    price: 693.80,
    change_pct: 0.98,
    week_52_high: 1020.50,
    week_52_low: 698.50,
    pe_ratio: 17.5,
    pb_ratio: 2.40,
    dividend_yield: 1.40,
    market_cap: '₹12,40,000 Cr',
    business_model: 'HDFC Bank is India largest private sector lender with 8,500+ branches.',
    future_demand_outlook: 'STEADY CREDIT & MORTGAGE GROWTH.',
    why_invest: 'Industry-leading low GNPA track record, deep retail network, and multi-year valuation discount.',
    financial_health_summary: 'Net NPA < 0.35%, robust capital adequacy, and high return on assets.',
    catalysts: ['Credit-to-deposit ratio normalization', 'Cross-selling mortgage insurance', 'FII institutional buying'],
    key_risks: ['Deposit mobilization cost pressure', 'Integration timeline adjustments']
  },
  {
    ticker: 'BPCL',
    name: 'Bharat Petroleum Corp',
    symbol: 'BPCL.NS',
    exchange: 'NSE',
    sector: 'PSU Oil & Gas',
    industry: 'Refining & Marketing Champion',
    price: 303.85,
    change_pct: -2.89,
    week_52_high: 391.65,
    week_52_low: 266.60,
    pe_ratio: 11.2,
    pb_ratio: 1.90,
    dividend_yield: 7.10,
    market_cap: '₹1,38,010 Cr',
    business_model: 'BPCL operates major refineries in Mumbai, Kochi, Bina and a network of 21,000+ fuel stations.',
    future_demand_outlook: 'STEADY BASELINE VEHICLE FUEL DEMAND.',
    why_invest: 'High 7.10% Dividend Yield, P/E 11.2x, and strong free cash flow generation.',
    financial_health_summary: 'Low leverage, high credit rating, and consistent PSU dividend payouts.',
    catalysts: ['7.1% Cash Dividend Yield', 'EV charging station network rollout', 'Stable marketing margins'],
    key_risks: ['Crude oil price spikes (> $95/bbl)', 'Government retail fuel price ceiling']
  }
];

export function findStockInDirectory(query: string): StockInfo | null {
  if (!query) return null;
  const q = query.trim().toUpperCase().replace('.NS', '').replace('.BO', '');
  const cleanQ = query.trim().toLowerCase();

  // Direct ticker match
  const exact = STOCK_DIRECTORY.find(
    (s) => s.ticker === q || s.symbol === `${q}.NS` || s.symbol === `${q}.BO`
  );
  if (exact) return exact;

  // Search by name / keyword
  return (
    STOCK_DIRECTORY.find(
      (s) =>
        s.name.toLowerCase().includes(cleanQ) ||
        s.ticker.toLowerCase().includes(cleanQ) ||
        s.sector.toLowerCase().includes(cleanQ) ||
        s.industry.toLowerCase().includes(cleanQ)
    ) || null
  );
}

export function searchStockDirectory(query: string): StockInfo[] {
  if (!query || query.trim().length < 1) return [];
  const cleanQ = query.trim().toLowerCase();
  return STOCK_DIRECTORY.filter(
    (s) =>
      s.ticker.toLowerCase().includes(cleanQ) ||
      s.name.toLowerCase().includes(cleanQ) ||
      s.sector.toLowerCase().includes(cleanQ) ||
      s.industry.toLowerCase().includes(cleanQ)
  ).slice(0, 10);
}
