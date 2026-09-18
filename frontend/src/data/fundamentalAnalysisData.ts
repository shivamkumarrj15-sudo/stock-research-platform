// Pure Fundamental Stock Analysis Dataset (Screener.in & Financial Ratios)
// Contains ROE, ROCE, Debt to Equity, P/E, P/B, Market Cap, Book Value, Compound Growth & Pros/Cons

export interface FundamentalStock {
  ticker: string;
  name: string;
  bse_code?: string;
  sector: string;
  industry: string;
  current_price: number;
  change_pct: number;
  market_cap_cr: number;
  pe_ratio: number;
  industry_pe: number;
  roe_pct: number;
  roce_pct: number;
  debt_to_equity: number;
  book_value: number;
  pb_ratio: number;
  dividend_yield: number;
  face_value: number;
  sales_cagr_5yr: number;
  profit_cagr_5yr: number;
  sales_cagr_3yr: number;
  profit_cagr_3yr: number;
  piotroski_f_score: number; // 0 - 9
  altman_z_score: number;
  free_cash_flow_cr: number;
  promoter_holding_pct: number;
  fii_holding_pct: number;
  dii_holding_pct: number;
  pros: string[];
  cons: string[];
  about: string;
}

export const FUNDAMENTAL_STOCKS_DATA: FundamentalStock[] = [
  {
    ticker: 'WIPRO',
    name: 'Wipro Limited',
    bse_code: '507685',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    current_price: 166.30,
    change_pct: -0.42,
    market_cap_cr: 165294,
    pe_ratio: 12.5,
    industry_pe: 28.4,
    roe_pct: 15.5,
    roce_pct: 17.8,
    debt_to_equity: 0.24,
    book_value: 83.9,
    pb_ratio: 1.98,
    dividend_yield: 6.59,
    face_value: 2.0,
    sales_cagr_5yr: 8.0,
    profit_cagr_5yr: 4.0,
    sales_cagr_3yr: 1.0,
    profit_cagr_3yr: 5.0,
    piotroski_f_score: 7,
    altman_z_score: 6.4,
    free_cash_flow_cr: 12400,
    promoter_holding_pct: 72.8,
    fii_holding_pct: 7.2,
    dii_holding_pct: 10.4,
    pros: [
      'Company is expected to give good quarter results',
      'High Dividend Yield of 6.59%',
      'Stock is providing an attractive dividend yield and trading at reasonable P/E of 12.5x',
      'Strong FCF generation of over ₹12,000 Cr annually'
    ],
    cons: [
      'The company has delivered a poor sales growth of 6% over past five years',
      'Tax rate seems low in recent periods'
    ],
    about: 'Wipro Limited is a leading global information technology, consulting, and business process services company with operations across 65+ countries.'
  },
  {
    ticker: 'RECLTD',
    name: 'REC Limited',
    bse_code: '532955',
    sector: 'Financials & Power Infra',
    industry: 'Infrastructure & Power NBFC (Maharatna)',
    current_price: 313.80,
    change_pct: -0.22,
    market_cap_cr: 81893,
    pe_ratio: 5.10,
    industry_pe: 14.8,
    roe_pct: 20.1,
    roce_pct: 9.71,
    debt_to_equity: 5.2,
    book_value: 321.0,
    pb_ratio: 0.98,
    dividend_yield: 5.95,
    face_value: 10.0,
    sales_cagr_5yr: 19.5,
    profit_cagr_5yr: 23.4,
    sales_cagr_3yr: 21.0,
    profit_cagr_3yr: 25.2,
    piotroski_f_score: 8,
    altman_z_score: 3.8,
    free_cash_flow_cr: 18500,
    promoter_holding_pct: 52.6,
    fii_holding_pct: 20.8,
    dii_holding_pct: 14.5,
    pros: [
      'Stock is trading at 0.98 times its book value (Bargain Discount)',
      'High Dividend Yield of 5.95%',
      'Company has delivered good profit growth of 23.4% CAGR over last 5 years',
      'Company has a good return on equity (ROE) track record: 20.1%'
    ],
    cons: [
      'High financial leverage typical of NBFC lenders',
      'Contingent liabilities of ₹14,200 Cr'
    ],
    about: 'REC Limited is a Maharatna Central Public Sector Enterprise providing long-term debt financing across India power generation, transmission, and renewable energy sectors.'
  },
  {
    ticker: 'BEL',
    name: 'Bharat Electronics Ltd',
    bse_code: '500049',
    sector: 'Defense & Aerospace',
    industry: 'Defense Electronics & Radars (Navratna)',
    current_price: 405.00,
    change_pct: -0.25,
    market_cap_cr: 296000,
    pe_ratio: 46.8,
    industry_pe: 52.0,
    roe_pct: 27.4,
    roce_pct: 36.4,
    debt_to_equity: 0.00,
    book_value: 23.4,
    pb_ratio: 17.3,
    dividend_yield: 1.10,
    face_value: 1.0,
    sales_cagr_5yr: 16.5,
    profit_cagr_5yr: 24.2,
    sales_cagr_3yr: 18.2,
    profit_cagr_3yr: 27.0,
    piotroski_f_score: 9,
    altman_z_score: 11.4,
    free_cash_flow_cr: 4200,
    promoter_holding_pct: 51.1,
    fii_holding_pct: 17.4,
    dii_holding_pct: 19.8,
    pros: [
      'Company is virtually DEBT FREE (Debt/Equity: 0.00)',
      'Outstanding return on capital: ROCE 36.4% and ROE 27.4%',
      'Company has a good profit growth track record of 24.2% CAGR over 5 years',
      'Massive order book of ₹76,000+ Cr giving multi-year revenue visibility'
    ],
    cons: [
      'Stock is trading at 17.3 times its book value due to defense premium',
      'Promoter holding is government controlled'
    ],
    about: 'Bharat Electronics Limited manufactures advanced electronic products for the Indian Armed Forces including radars, missile electronics, sonars, and electronic warfare.'
  },
  {
    ticker: 'TRENT',
    name: 'Trent Limited (Tata Retail)',
    bse_code: '500251',
    sector: 'Consumer & Retail',
    industry: 'Fast Fashion & Supermarket Retail (Zudio)',
    current_price: 2818.70,
    change_pct: -0.05,
    market_cap_cr: 100200,
    pe_ratio: 82.2,
    industry_pe: 68.0,
    roe_pct: 27.7,
    roce_pct: 28.3,
    debt_to_equity: 0.12,
    book_value: 115.0,
    pb_ratio: 24.5,
    dividend_yield: 0.60,
    face_value: 1.0,
    sales_cagr_5yr: 36.8,
    profit_cagr_5yr: 62.4,
    sales_cagr_3yr: 48.0,
    profit_cagr_3yr: 78.5,
    piotroski_f_score: 8,
    altman_z_score: 9.8,
    free_cash_flow_cr: 2200,
    promoter_holding_pct: 37.0,
    fii_holding_pct: 28.5,
    dii_holding_pct: 16.2,
    pros: [
      'Explosive Profit Growth of 62.4% CAGR over past 5 years (Fastest in Tata Group)',
      'Virtually negligible debt (Debt/Equity: 0.12)',
      'High Return on Capital: ROCE 28.3% and ROE 27.7%',
      'Unmatched retail economics: Zudio store level breakeven in 90 days'
    ],
    cons: [
      'Stock is trading at elevated P/E multiple (82.2x)',
      'Promoter holding has decreased marginally over past 3 years'
    ],
    about: 'Trent Limited is part of the Tata Group and operates retail formats including Westside, Zudio, Star Bazaar, and Misbu.'
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Limited',
    bse_code: '533278',
    sector: 'Energy & Commodities',
    industry: 'Mining & Coal Monopoly (Maharatna)',
    current_price: 432.00,
    change_pct: 0.23,
    market_cap_cr: 266000,
    pe_ratio: 8.10,
    industry_pe: 12.5,
    roe_pct: 28.2,
    roce_pct: 35.0,
    debt_to_equity: 0.06,
    book_value: 145.0,
    pb_ratio: 2.98,
    dividend_yield: 6.60,
    face_value: 10.0,
    sales_cagr_5yr: 14.8,
    profit_cagr_5yr: 22.1,
    sales_cagr_3yr: 19.5,
    profit_cagr_3yr: 28.0,
    piotroski_f_score: 9,
    altman_z_score: 5.6,
    free_cash_flow_cr: 24000,
    promoter_holding_pct: 63.1,
    fii_holding_pct: 8.4,
    dii_holding_pct: 21.2,
    pros: [
      'Huge Dividend Yield of 6.60% (Super High Cash Payout)',
      'Company is almost DEBT FREE (Debt/Equity: 0.06)',
      'Exceptional Return on Capital: ROCE 35.0% and ROE 28.2%',
      'Commands 80%+ of India total domestic coal production (Monopoly Moat)'
    ],
    cons: [
      'Long-term global energy transition policy risk',
      'Wage revisions impact short-term employee cost line items'
    ],
    about: 'Coal India Limited is the largest coal mining company in the world, producing 80%+ of India domestic coal required for thermal power stations and heavy industry.'
  },
  {
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    bse_code: '500400',
    sector: 'Utilities & Clean Energy',
    industry: 'Integrated Power, Solar & EV Infra',
    current_price: 367.00,
    change_pct: -0.81,
    market_cap_cr: 117200,
    pe_ratio: 30.6,
    industry_pe: 26.0,
    roe_pct: 10.2,
    roce_pct: 10.5,
    debt_to_equity: 1.10,
    book_value: 105.0,
    pb_ratio: 3.50,
    dividend_yield: 2.00,
    face_value: 1.0,
    sales_cagr_5yr: 18.2,
    profit_cagr_5yr: 31.0,
    sales_cagr_3yr: 22.0,
    profit_cagr_3yr: 38.5,
    piotroski_f_score: 7,
    altman_z_score: 3.2,
    free_cash_flow_cr: 5400,
    promoter_holding_pct: 46.9,
    fii_holding_pct: 10.2,
    dii_holding_pct: 16.5,
    pros: [
      'Profit growth of 31.0% CAGR over past 5 years',
      'Leading India Clean Energy transition with 20GW+ renewable target',
      '#1 Rooftop solar installer benefiting from PM Surya Ghar Yojana',
      'Largest EV Charging station network across 500+ Indian cities'
    ],
    cons: [
      'Debt to equity ratio is 1.10x due to high renewable infrastructure capex',
      'Discom receivable collection cycles'
    ],
    about: 'Tata Power is India’s largest integrated power company with a significant presence across conventional & renewable energy generation, transmission, and EV charging.'
  },
  {
    ticker: 'DIXON',
    name: 'Dixon Technologies Ltd',
    bse_code: '540699',
    sector: 'Technology Hardware & EMS',
    industry: 'Electronic Manufacturing Services (PLI Leader)',
    current_price: 13500.00,
    change_pct: -2.49,
    market_cap_cr: 80800,
    pe_ratio: 42.4,
    industry_pe: 55.0,
    roe_pct: 18.9,
    roce_pct: 29.2,
    debt_to_equity: 0.22,
    book_value: 310.0,
    pb_ratio: 43.5,
    dividend_yield: 1.20,
    face_value: 2.0,
    sales_cagr_5yr: 34.2,
    profit_cagr_5yr: 38.5,
    sales_cagr_3yr: 36.0,
    profit_cagr_3yr: 42.0,
    piotroski_f_score: 8,
    altman_z_score: 7.6,
    free_cash_flow_cr: 1100,
    promoter_holding_pct: 33.4,
    fii_holding_pct: 21.0,
    dii_holding_pct: 24.5,
    pros: [
      'Super-high Sales growth of 34.2% and Profit growth of 38.5% over 5 years',
      'Low debt on balance sheet (Debt/Equity: 0.22)',
      'High ROCE of 29.2%',
      'Largest beneficiary of India Smartphone, Laptop & Telecom PLI schemes'
    ],
    cons: [
      'Low operating margins (3.5% - 4.5%) typical of contract manufacturing',
      'Customer concentration in top global smartphone OEMs'
    ],
    about: 'Dixon Technologies is the largest home-grown Electronic Manufacturing Services (EMS) giant in India manufacturing smartphones, TVs, washing machines, and IT hardware.'
  },
  {
    ticker: 'POLYCAB',
    name: 'Polycab India Ltd',
    bse_code: '542652',
    sector: 'Capital Goods & Industrials',
    industry: 'Cables, Wires & Fast Moving Electricals (FMEG)',
    current_price: 8358.00,
    change_pct: 0.05,
    market_cap_cr: 125600,
    pe_ratio: 44.1,
    industry_pe: 48.0,
    roe_pct: 23.0,
    roce_pct: 33.2,
    debt_to_equity: 0.04,
    book_value: 540.0,
    pb_ratio: 15.5,
    dividend_yield: 1.80,
    face_value: 10.0,
    sales_cagr_5yr: 21.4,
    profit_cagr_5yr: 27.9,
    sales_cagr_3yr: 26.5,
    profit_cagr_3yr: 32.0,
    piotroski_f_score: 8,
    altman_z_score: 8.9,
    free_cash_flow_cr: 2100,
    promoter_holding_pct: 64.8,
    fii_holding_pct: 13.5,
    dii_holding_pct: 12.1,
    pros: [
      'Company is virtually DEBT FREE (Debt/Equity: 0.04)',
      'Outstanding return on capital: ROCE 33.2% and ROE 23.0%',
      'Market leader commanding 24%+ organized market share in cables and wires',
      'Backward integration giving 300-400 bps higher margins than peers'
    ],
    cons: [
      'Raw material price sensitivity to copper & aluminum volatility',
      'Trading at 15.5x Book Value'
    ],
    about: 'Polycab India is India’s largest manufacturer of wires and cables and a fast-growing player in FMEG (fans, switches, solar inverters, and lighting).'
  },
  {
    ticker: 'HAL',
    name: 'Hindustan Aeronautics Ltd',
    bse_code: '541154',
    sector: 'Defense & Aerospace',
    industry: 'Fighter Jets, Helicopters & Engines (Maharatna)',
    current_price: 4950.00,
    change_pct: -1.01,
    market_cap_cr: 331000,
    pe_ratio: 34.5,
    industry_pe: 45.0,
    roe_pct: 24.0,
    roce_pct: 32.0,
    debt_to_equity: 0.00,
    book_value: 410.0,
    pb_ratio: 12.0,
    dividend_yield: 1.70,
    face_value: 5.0,
    sales_cagr_5yr: 12.8,
    profit_cagr_5yr: 26.7,
    sales_cagr_3yr: 15.0,
    profit_cagr_3yr: 30.5,
    piotroski_f_score: 9,
    altman_z_score: 8.8,
    free_cash_flow_cr: 6500,
    promoter_holding_pct: 71.6,
    fii_holding_pct: 12.5,
    dii_holding_pct: 11.2,
    pros: [
      'Company is completely DEBT FREE (Debt/Equity: 0.00) with ₹24,000+ Cr cash reserves',
      'High Return on Capital: ROCE 32.0% and ROE 24.0%',
      'Absolute Monopoly: Sole military aircraft & attack helicopter manufacturer in India',
      'Massive order pipeline of ₹1.2 Lakh Crore for Tejas Mk1A, Prachand, and Su-30MKI upgrades'
    ],
    cons: [
      'Long lead times for defense platform flight certifications',
      'Reliance on foreign engine deliveries (GE Aerospace)'
    ],
    about: 'Hindustan Aeronautics Limited is a premier aerospace and defense company engaged in the design, development, manufacture, and overhaul of fighter aircraft, helicopters, and aero-engines.'
  },
  {
    ticker: 'CDSL',
    name: 'Central Depository Services Ltd',
    bse_code: '540704',
    sector: 'Financial Infrastructure',
    industry: 'Capital Markets Depository (Duopoly Monopoly)',
    current_price: 1355.00,
    change_pct: -0.99,
    market_cap_cr: 28300,
    pe_ratio: 54.0,
    industry_pe: 48.0,
    roe_pct: 31.5,
    roce_pct: 36.2,
    debt_to_equity: 0.00,
    book_value: 82.0,
    pb_ratio: 16.5,
    dividend_yield: 1.60,
    face_value: 10.0,
    sales_cagr_5yr: 42.0,
    profit_cagr_5yr: 34.5,
    sales_cagr_3yr: 38.0,
    profit_cagr_3yr: 31.0,
    piotroski_f_score: 9,
    altman_z_score: 14.5,
    free_cash_flow_cr: 390,
    promoter_holding_pct: 15.0,
    fii_holding_pct: 18.2,
    dii_holding_pct: 26.5,
    pros: [
      'Company is completely DEBT FREE (Debt/Equity: 0.00)',
      'Incredible EBITDA margin of 65%+ on recurring annuity stream',
      'Commands 77%+ incremental market share of active Demat accounts in India',
      'High Return on Capital: ROCE 36.2% and ROE 31.5%'
    ],
    cons: [
      'Revenue partially linked to equity market retail transaction volumes',
      'SEBI regulatory fee revisions'
    ],
    about: 'CDSL is India’s leading securities depository, holding shares, debentures, and mutual funds in electronic format for investors across India.'
  },
  {
    ticker: 'KALYANKJIL',
    name: 'Kalyan Jewellers India Ltd',
    bse_code: '543278',
    sector: 'Consumer & Retail',
    industry: 'Gold, Diamond & Lifestyle Jewellery Retail',
    current_price: 615.20,
    change_pct: 1.25,
    market_cap_cr: 63300,
    pe_ratio: 48.0,
    industry_pe: 65.0,
    roe_pct: 20.8,
    roce_pct: 22.4,
    debt_to_equity: 0.35,
    book_value: 52.0,
    pb_ratio: 11.8,
    dividend_yield: 1.00,
    face_value: 10.0,
    sales_cagr_5yr: 28.5,
    profit_cagr_5yr: 45.2,
    sales_cagr_3yr: 32.0,
    profit_cagr_3yr: 52.0,
    piotroski_f_score: 8,
    altman_z_score: 5.4,
    free_cash_flow_cr: 850,
    promoter_holding_pct: 60.5,
    fii_holding_pct: 16.5,
    dii_holding_pct: 10.2,
    pros: [
      'Explosive Profit Growth of 45.2% CAGR over 5 years',
      'Asset-light FOCO (Franchise-Owned Company-Operated) expansion improving ROCE',
      'Shift from unorganized to organized jewellery accelerated by gold custom duty cut',
      'Candere digital format capturing millennial & Gen-Z diamond jewellery'
    ],
    cons: [
      'Inventory hedging costs during gold price volatility',
      'Rising competitive rivalry with Titan Tanishq'
    ],
    about: 'Kalyan Jewellers is one of India’s largest and most trusted jewellery retail chains with over 200+ showrooms across India and the Middle East.'
  },
  {
    ticker: 'ANDHRSUGAR',
    name: 'The Andhra Sugars Ltd',
    bse_code: '500008',
    sector: 'Chemicals & Agro-Processing',
    industry: 'Bio-Ethanol, Caustic Soda & Rocket Propellants',
    current_price: 96.50,
    change_pct: -1.28,
    market_cap_cr: 1280,
    pe_ratio: 12.9,
    industry_pe: 22.0,
    roe_pct: 14.2,
    roce_pct: 16.5,
    debt_to_equity: 0.08,
    book_value: 85.0,
    pb_ratio: 1.13,
    dividend_yield: 2.10,
    face_value: 2.0,
    sales_cagr_5yr: 11.5,
    profit_cagr_5yr: 14.2,
    sales_cagr_3yr: 12.0,
    profit_cagr_3yr: 15.0,
    piotroski_f_score: 7,
    altman_z_score: 4.8,
    free_cash_flow_cr: 120,
    promoter_holding_pct: 47.5,
    fii_holding_pct: 1.2,
    dii_holding_pct: 3.5,
    pros: [
      'Stock is trading at only 1.13x Book Value (Deep Value Discount)',
      'Low debt (Debt/Equity: 0.08)',
      'Key supplier of Liquid Hydrogen & Rocket fuel propellants to ISRO space missions',
      'Beneficiary of 20% national Ethanol petrol blending mandate'
    ],
    cons: [
      'Sugar cane agricultural cyclicality',
      'Caustic soda global price cycles'
    ],
    about: 'The Andhra Sugars Limited manufactures sugar, bio-ethanol, industrial chemicals, chlor-alkali, and specialty rocket propellants for Indian Space Research Organisation (ISRO).'
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals Ltd',
    bse_code: '530067',
    sector: 'Fertilizers & Agriculture',
    industry: 'Specialty Nutrients & Crop Protection',
    current_price: 223.04,
    change_pct: -1.15,
    market_cap_cr: 1850,
    pe_ratio: 9.4,
    industry_pe: 18.0,
    roe_pct: 16.8,
    roce_pct: 15.2,
    debt_to_equity: 0.65,
    book_value: 195.0,
    pb_ratio: 1.14,
    dividend_yield: 1.80,
    face_value: 10.0,
    sales_cagr_5yr: 14.5,
    profit_cagr_5yr: 18.0,
    sales_cagr_3yr: 16.0,
    profit_cagr_3yr: 21.0,
    piotroski_f_score: 7,
    altman_z_score: 3.6,
    free_cash_flow_cr: 240,
    promoter_holding_pct: 65.2,
    fii_holding_pct: 2.1,
    dii_holding_pct: 5.4,
    pros: [
      'Stock trading near book value (1.14x Book Value)',
      'Low P/E multiple of 9.4x vs Industry 18.0x',
      'Strong retail fertilizer dealer network across South & Western India',
      'Government direct DBT subsidy clearance improvement'
    ],
    cons: [
      'Seasonal monsoon rainfall dependency',
      'Raw material ammonia and phosphoric acid import pricing'
    ],
    about: 'Zuari Agro Chemicals (Adventz Group) is a premier fertilizer manufacturer producing urea, complex fertilizers, and specialty crop nutrition products.'
  }
];
