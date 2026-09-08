// Long-Term Wealth Compounder & Multibagger Investment Dataset
// Designed specifically for Long-Term Investors (1-5 Years Horizon)
// Focus on Economic Moats, ROIC > 20%, FCF Growth, Zero/Low Debt, and High Compounding

export interface LongTermStockItem {
  ticker: string;
  name: string;
  bse_code?: string;
  sector: string;
  industry: string;
  current_price: number;
  accumulation_zone: {
    min_price: number;
    max_price: number;
    margin_of_safety_pct: number;
  };
  target_1yr: number;
  target_3yr: number;
  expected_cagr_3yr: number; // e.g. 30.5%
  dividend_yield: number;
  roic_pct: number;
  roe_pct: number;
  sales_cagr_5yr: number;
  profit_cagr_5yr: number;
  debt_to_equity: number;
  pe_ratio: number;
  pb_ratio: number;
  market_cap_cr: number;
  piotroski_f_score: number; // 0-9
  altman_z_score: number;
  moat_type: 'Monopoly / Duopoly' | 'High Switching Cost' | 'Low-Cost Scale & Network' | 'Brand & Pricing Power' | 'Government Defense Moat';
  moat_rating: 'Wide Moat' | 'Narrow Moat' | 'High Moat';
  investment_horizon: '1 - 3 Years' | '2 - 4 Years' | '3 - 5 Years' | '5+ Years (Coffee Can)';
  risk_level: 'Very Low' | 'Low' | 'Moderate';
  suitability_badge: 'Multi-Bagger Compounder' | 'High-Dividend Cash Machine' | 'Secular Mega-Trend' | 'Monopoly Compounder';
  portfolio_weight_recommended_pct: number;
  thesis_summary_hi: string;
  thesis_summary_en: string;
  why_invest_long_term: string[];
  key_tailwinds: string[];
  invalidation_risks: string[];
  dividend_reinvestment_impact: string;
}

export interface InvestmentModelPortfolio {
  id: string;
  title: string;
  subtitle: string;
  hindi_title: string;
  tagline: string;
  recommended_horizon: string;
  expected_cagr_3yr: number;
  expected_3yr_multiplier: number; // e.g. 2.3x (130% return)
  avg_dividend_yield: number;
  risk_profile: 'Low Risk' | 'Moderate Risk' | 'Conservative';
  ideal_for: string;
  holdings: Array<{
    ticker: string;
    name: string;
    weight_pct: number;
    expected_cagr: number;
    role: string;
  }>;
  investment_philosophy: string;
}

export const LONG_TERM_COMPOUNDERS: LongTermStockItem[] = [
  {
    ticker: 'TRENT',
    name: 'Trent Ltd (Tata Retail)',
    bse_code: '500251',
    sector: 'Consumer & Retail',
    industry: 'Fast Fashion & Supermarket Retail',
    current_price: 7150.00,
    accumulation_zone: {
      min_price: 6800.00,
      max_price: 7200.00,
      margin_of_safety_pct: 22.0
    },
    target_1yr: 9600.00,
    target_3yr: 16500.00,
    expected_cagr_3yr: 32.5,
    dividend_yield: 0.6,
    roic_pct: 26.5,
    roe_pct: 28.2,
    sales_cagr_5yr: 36.8,
    profit_cagr_5yr: 62.4,
    debt_to_equity: 0.12,
    pe_ratio: 88.5,
    pb_ratio: 24.1,
    market_cap_cr: 254000,
    piotroski_f_score: 8,
    altman_z_score: 9.8,
    moat_type: 'Low-Cost Scale & Network',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Low',
    suitability_badge: 'Multi-Bagger Compounder',
    portfolio_weight_recommended_pct: 12.0,
    thesis_summary_hi: 'Zudio aur Westside ka unmatched supply chain scale aur store expansion model India ke consumer retail market ko dominate kar raha hai. 5 saal me 62% profit CAGR ke saath ye Tata group ka sabse tez compounder ban chuka hai.',
    thesis_summary_en: 'Dominant fast-fashion retail powerhouse driven by Zudio unit economics and explosive Pan-India expansion, backed by unmatched Tata group corporate governance.',
    why_invest_long_term: [
      'Zudio stores achieve store-level profitability within 90 days of opening due to high inventory turnover (10+ cycles/yr).',
      'Operating cash flows exceed ₹2,200 Cr annually with zero reliance on debt.',
      'Massive expansion runway from current ~600 stores to 1,500+ stores across Tier 2/3 Indian cities.'
    ],
    key_tailwinds: [
      'Rapid shift from unorganized apparel (70% of market) to value fast-fashion organized retail.',
      'Expansion into Star Bazaar (supermarkets) and beauty segment (Zudio Beauty).'
    ],
    invalidation_risks: [
      'Extreme competitive price wars in fast fashion from Reliance Yousta / Max Fashion.',
      'Short-term valuation multiple compression if same-store sales growth (SSSG) dips below 12%.'
    ],
    dividend_reinvestment_impact: 'Capital growth heavy compounder; every ₹1 Lakh invested 5 years ago is worth over ₹8 Lakhs today.'
  },
  {
    ticker: 'BEL',
    name: 'Bharat Electronics Ltd',
    bse_code: '500049',
    sector: 'Defense & Aerospace',
    industry: 'Defense Electronics, Radar & EW Systems',
    current_price: 300.00,
    accumulation_zone: {
      min_price: 288.00,
      max_price: 304.00,
      margin_of_safety_pct: 25.0
    },
    target_1yr: 395.00,
    target_3yr: 680.00,
    expected_cagr_3yr: 31.5,
    dividend_yield: 2.10,
    roic_pct: 32.8,
    roe_pct: 27.4,
    sales_cagr_5yr: 16.5,
    profit_cagr_5yr: 24.2,
    debt_to_equity: 0.00,
    pe_ratio: 44.2,
    pb_ratio: 11.2,
    market_cap_cr: 219000,
    piotroski_f_score: 9,
    altman_z_score: 11.4,
    moat_type: 'Government Defense Moat',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Very Low',
    suitability_badge: 'Monopoly Compounder',
    portfolio_weight_recommended_pct: 12.0,
    thesis_summary_hi: 'India ki defense electronics aur radar systems me 55%+ market share. Zero debt, 32%+ ROIC aur ₹76,000 Cr+ ki massive order book ke saath sovereign balance sheet ka protection.',
    thesis_summary_en: 'Virtual monopoly in Indian defense electronics, radars, sonars, and electronic warfare with zero debt, 32.8% ROIC, and multi-year order book visibility.',
    why_invest_long_term: [
      'Debt-Free Balance Sheet with massive ₹8,500+ Cr cash and cash equivalents generating high treasury returns.',
      'Highest order book to bill ratio (3.5x annual revenue) ensuring 20%+ annual revenue visibility for next 4 years.',
      'Strong expansion into non-defense tech: EV battery storage, electronic voting, and railway signaling Kavach system.'
    ],
    key_tailwinds: [
      'Make in India Defense indigenization mandate prohibiting import of 500+ defense subsystems.',
      'Global defense export pipeline to friendly nations (Mauritius, Vietnam, Armenia, Philippines).'
    ],
    invalidation_risks: [
      'Government delay in defense contract disbursement or annual budget allocation shifts.',
      'Raw material semiconductor component supply chain bottlenecks.'
    ],
    dividend_reinvestment_impact: 'High steady 2.1% dividend combined with capital appreciation gives safe 30%+ compounding with zero insolvency risk.'
  },
  {
    ticker: 'POLYCAB',
    name: 'Polycab India Ltd',
    bse_code: '542652',
    sector: 'Capital Goods & Infra',
    industry: 'Cables, Wires & Fast Moving Electricals (FMEG)',
    current_price: 6020.00,
    accumulation_zone: {
      min_price: 5800.00,
      max_price: 6050.00,
      margin_of_safety_pct: 24.0
    },
    target_1yr: 7800.00,
    target_3yr: 13500.00,
    expected_cagr_3yr: 30.8,
    dividend_yield: 1.80,
    roic_pct: 28.6,
    roe_pct: 25.1,
    sales_cagr_5yr: 21.4,
    profit_cagr_5yr: 27.9,
    debt_to_equity: 0.04,
    pe_ratio: 46.8,
    pb_ratio: 10.4,
    market_cap_cr: 90500,
    piotroski_f_score: 8,
    altman_z_score: 8.9,
    moat_type: 'Low-Cost Scale & Network',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Low',
    suitability_badge: 'Multi-Bagger Compounder',
    portfolio_weight_recommended_pct: 10.0,
    thesis_summary_hi: 'India ke cable & wire market ka undisputed market leader (24%+ organized market share). Net cash balance sheet, pan-India 4,300+ dealer network aur data center/renewable power grid se massive structural demand.',
    thesis_summary_en: 'Unquestioned market leader in cables & wires commanding 24% organized market share with net-cash balance sheet and deep distribution moat.',
    why_invest_long_term: [
      'Extremely high return on capital (28.6% ROIC) with virtually zero net debt.',
      'India Infrastructure Supercycle: Power transmission upgrade, renewable grid connectivity, high-speed rail, and AI data centers require 3x more specialized cabling.',
      'Backward integration: Manufactures own copper rods and PVC insulation, giving 300-400 bps margin edge over competitors.'
    ],
    key_tailwinds: [
      'National Electricity Plan targeting ₹4.75 Lakh Cr investment in power transmission grid by 2027.',
      'Global supply chain diversification (exports growing at 45% CAGR to US and Europe).'
    ],
    invalidation_risks: [
      'Sharp volatility in global Copper & Aluminum raw material commodity prices.',
      'Real estate construction slowdown in residential housing segment.'
    ],
    dividend_reinvestment_impact: 'Consistent dividend payer with 20%+ payout ratio; exceptional compounder for 3-5 year holding.'
  },
  {
    ticker: 'DIXON',
    name: 'Dixon Technologies Ltd',
    bse_code: '540699',
    sector: 'Electronics EMS & Tech',
    industry: 'Electronic Manufacturing Services (EMS) & PLI Leader',
    current_price: 13600.00,
    accumulation_zone: {
      min_price: 13100.00,
      max_price: 13700.00,
      margin_of_safety_pct: 26.0
    },
    target_1yr: 18500.00,
    target_3yr: 32000.00,
    expected_cagr_3yr: 33.0,
    dividend_yield: 1.20,
    roic_pct: 29.4,
    roe_pct: 26.8,
    sales_cagr_5yr: 34.2,
    profit_cagr_5yr: 38.5,
    debt_to_equity: 0.22,
    pe_ratio: 76.5,
    pb_ratio: 28.0,
    market_cap_cr: 81500,
    piotroski_f_score: 8,
    altman_z_score: 7.6,
    moat_type: 'Low-Cost Scale & Network',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Moderate',
    suitability_badge: 'Secular Mega-Trend',
    portfolio_weight_recommended_pct: 10.0,
    thesis_summary_hi: 'India ka Foxconn! Smartphone, LED TV, Home Appliances aur IT hardware PLI schemes ka sabse bada beneficiary. Global tech giants (Xiaomi, Motorola, Samsung, Lenovo) Dixon se contract manufacturing karwa rahe hain.',
    thesis_summary_en: 'The Foxconn of India. Market-leading electronic contract manufacturer benefiting from multi-billion dollar PLI schemes and global tech brand outsourcing.',
    why_invest_long_term: [
      'Explosive revenue growth trajectory (+40% YoY) driven by smartphone assembly and component localization.',
      'Backward integration into display modules, precision mechanics, and camera modules increasing value addition from 3% to 12%.',
      'Govt PLI subsidies provide guaranteed cash inflows and margin expansion over next 5 years.'
    ],
    key_tailwinds: [
      'India electronics manufacturing target of $300 Billion by 2026-27.',
      'Import restrictions on laptops and tablets forcing global OEMs to manufacture locally with Dixon.'
    ],
    invalidation_risks: [
      'Customer concentration risk (top 3 clients account for 45% of volume).',
      'Thin operating margins susceptible to labor cost inflation or supply chain disruptions.'
    ],
    dividend_reinvestment_impact: 'High capital reinvestment engine that compounds wealth through sheer scale and volume expansion.'
  },
  {
    ticker: 'CDSL',
    name: 'Central Depository Services Ltd',
    bse_code: '540704',
    sector: 'Financial Infrastructure',
    industry: 'Capital Markets Depository Monopoly',
    current_price: 1480.00,
    accumulation_zone: {
      min_price: 1420.00,
      max_price: 1495.00,
      margin_of_safety_pct: 28.0
    },
    target_1yr: 1950.00,
    target_3yr: 3400.00,
    expected_cagr_3yr: 31.9,
    dividend_yield: 1.60,
    roic_pct: 36.2,
    roe_pct: 31.5,
    sales_cagr_5yr: 42.0,
    profit_cagr_5yr: 34.5,
    debt_to_equity: 0.00,
    pe_ratio: 54.0,
    pb_ratio: 16.5,
    market_cap_cr: 31000,
    piotroski_f_score: 9,
    altman_z_score: 14.5,
    moat_type: 'Monopoly / Duopoly',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Very Low',
    suitability_badge: 'Monopoly Compounder',
    portfolio_weight_recommended_pct: 10.0,
    thesis_summary_hi: 'India ki capital markets ka toll-booth! 77%+ active Demat accounts CDSL ke paas hain. Har transaction, corporate action aur account maintenance par automatic cashflow generate hota hai. Zero debt, 65%+ EBITDA margin.',
    thesis_summary_en: 'Digital toll-booth on India financialization boom. Commands 77%+ share of incremental Demat accounts with 65%+ EBITDA margins and zero capex requirements.',
    why_invest_long_term: [
      'Asset-light capital market monopoly with 65%+ EBITDA margins and zero debt.',
      'Structural runway: Only ~7% of Indian population invests in equity markets compared to 55%+ in USA, guaranteeing 10+ years of high growth.',
      'Recurring annuity revenues from annual issuer charges, transaction fees, and KYC repository.'
    ],
    key_tailwinds: [
      'Rapid rise of retail SIPs (₹23,000+ Cr monthly) and digital discount brokers (Zerodha, Groww, Angel One).',
      'Insurance and unlisted company dematerialization mandate boosting corporate repository revenue.'
    ],
    invalidation_risks: [
      'Prolonged cyclical bear market in Indian stock indices reducing retail trading transaction volumes.',
      'SEBI regulatory fee structure changes on transaction slab pricing.'
    ],
    dividend_reinvestment_impact: 'High dividend payout (>50% of profits) combined with zero debt creates a classic Peter Lynch compounder.'
  },
  {
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    bse_code: '500400',
    sector: 'Clean Energy & Power Infra',
    industry: 'Solar EPC, Renewable Energy & EV Infra',
    current_price: 385.00,
    accumulation_zone: {
      min_price: 370.00,
      max_price: 390.00,
      margin_of_safety_pct: 25.0
    },
    target_1yr: 510.00,
    target_3yr: 850.00,
    expected_cagr_3yr: 30.2,
    dividend_yield: 2.00,
    roic_pct: 16.5,
    roe_pct: 14.8,
    sales_cagr_5yr: 18.2,
    profit_cagr_5yr: 31.0,
    debt_to_equity: 1.10,
    pe_ratio: 31.2,
    pb_ratio: 3.8,
    market_cap_cr: 123000,
    piotroski_f_score: 7,
    altman_z_score: 3.2,
    moat_type: 'Brand & Pricing Power',
    moat_rating: 'High Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Low',
    suitability_badge: 'Secular Mega-Trend',
    portfolio_weight_recommended_pct: 10.0,
    thesis_summary_hi: 'Green Energy, Rooftop Solar (PM Surya Ghar Muft Bijli Yojana), EV Charging stations aur Transmission infrastructure me Tata group ka flagship pillar. 20GW+ clean energy pipeline aur strong cashflows.',
    thesis_summary_en: 'Tata Group crown jewel leading India energy transition across renewable generation (20GW target), rooftop solar, EV charging infrastructure, and smart metering.',
    why_invest_long_term: [
      'Direct beneficiary of PM Surya Ghar Muft Bijli Yojana (1 Crore rooftop solar installations target).',
      'Largest EV Charging station network across 500+ Indian cities and highway corridors.',
      'Commissioned 4.3 GW solar cell & module manufacturing plant in Tamil Nadu, eliminating import dependence.'
    ],
    key_tailwinds: [
      'India national target of 500 GW non-fossil power capacity by 2030.',
      'Commercial & Industrial (C&I) clients shifting rapidly to 100% green captive power purchase.'
    ],
    invalidation_risks: [
      'State discom payment delays or Power Purchase Agreement (PPA) renegotiation friction.',
      'Capital-intensive expansion requiring continuous debt management.'
    ],
    dividend_reinvestment_impact: 'Stable dividend with high compounding as renewable portfolio shifts from capex phase to free-cash generation phase.'
  },
  {
    ticker: 'RECLTD',
    name: 'REC Ltd (Rural Electrification Corp)',
    bse_code: '532955',
    sector: 'PSU Power Finance & Dividends',
    industry: 'Infrastructure & Green Energy Financing',
    current_price: 317.85,
    accumulation_zone: {
      min_price: 305.00,
      max_price: 320.00,
      margin_of_safety_pct: 35.0
    },
    target_1yr: 435.00,
    target_3yr: 650.00,
    expected_cagr_3yr: 26.9,
    dividend_yield: 6.20,
    roic_pct: 22.8,
    roe_pct: 23.4,
    sales_cagr_5yr: 19.5,
    profit_cagr_5yr: 23.4,
    debt_to_equity: 5.2,
    pe_ratio: 5.8,
    pb_ratio: 1.25,
    market_cap_cr: 83700,
    piotroski_f_score: 8,
    altman_z_score: 3.8,
    moat_type: 'Government Defense Moat',
    moat_rating: 'Wide Moat',
    investment_horizon: '1 - 3 Years',
    risk_level: 'Low',
    suitability_badge: 'High-Dividend Cash Machine',
    portfolio_weight_recommended_pct: 12.0,
    thesis_summary_hi: 'Sovereign-backed Maharatna NBFC jo India ke sabhi green energy, transmission aur infra projects ko loan deti hai. 6.2% massive dividend yield aur 23%+ ROE ke sath ultra-undervalued PE 5.8x par available hai.',
    thesis_summary_en: 'Maharatna PSU monopoly financier of India power, renewable, and infrastructure sector offering staggering 6.2% dividend yield with industry-best 0.8% net NPA.',
    why_invest_long_term: [
      'Highest Dividend Yield (6.2%) in the large-cap universe, paying regular quarterly interim dividends.',
      'Rock-solid asset quality with Net NPAs down to historic lows of 0.82% and 100% provision coverage.',
      'Loan book expanding at 18-20% CAGR towards ₹6 Lakh Crore by 2026, driven by renewable energy financing.'
    ],
    key_tailwinds: [
      'Nodal agency for Revamped Distribution Sector Scheme (RDSS) with ₹3 Lakh Cr outlay.',
      'Lowest cost of foreign and domestic borrowings backed by sovereign credit rating.'
    ],
    invalidation_risks: [
      'Interest rate cycle spikes compressing net interest margins (NIMs).',
      'Credit stress in private sector renewable project developers.'
    ],
    dividend_reinvestment_impact: '6.2% annual dividend yield reinvested creates an unstoppable compounding snowball effect over 3-5 years.'
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    bse_code: '533278',
    sector: 'PSU Natural Resources & Energy',
    industry: 'Energy Commodities & Mining Monopoly',
    current_price: 380.00,
    accumulation_zone: {
      min_price: 365.00,
      max_price: 385.00,
      margin_of_safety_pct: 32.0
    },
    target_1yr: 490.00,
    target_3yr: 680.00,
    expected_cagr_3yr: 21.4,
    dividend_yield: 6.60,
    roic_pct: 48.5,
    roe_pct: 46.2,
    sales_cagr_5yr: 14.8,
    profit_cagr_5yr: 22.1,
    debt_to_equity: 0.06,
    pe_ratio: 7.4,
    pb_ratio: 2.9,
    market_cap_cr: 234000,
    piotroski_f_score: 9,
    altman_z_score: 5.6,
    moat_type: 'Monopoly / Duopoly',
    moat_rating: 'Wide Moat',
    investment_horizon: '1 - 3 Years',
    risk_level: 'Low',
    suitability_badge: 'High-Dividend Cash Machine',
    portfolio_weight_recommended_pct: 8.0,
    thesis_summary_hi: 'India ki 80%+ coal production ka absolute monopoly producer. 48%+ ROIC, ₹40,000+ Cr ki massive cash reserves aur 6.6% super high dividend yield. Baseload thermal power demand agle 10-15 saal tak mandatory hai.',
    thesis_summary_en: 'Absolute monopoly accounting for 80%+ of India coal production with 48.5% ROIC, negligible debt, and 6.6% dividend yield supported by rising baseload thermal demand.',
    why_invest_long_term: [
      'Super-high dividend yield of 6.6% with historical track record of 75%+ profit distribution to shareholders.',
      'Peak power demand hitting new records (250GW+) every summer, making Coal India fuel supply indispensable.',
      'Massive cash buffer generating ₹3,000+ Cr in pure interest income each year.'
    ],
    key_tailwinds: [
      'Commercial coal e-auction premiums remaining elevated above 40-50% over notified prices.',
      'Expansion of dedicated railway evacuation corridors speeding up mine-to-power plant dispatches.'
    ],
    invalidation_risks: [
      'Long-term decarbonization policy shifts 15-20 years in the future (minimal impact in 3-5 year horizon).',
      'Wage revision hikes occasionally impacting one quarter operating margins.'
    ],
    dividend_reinvestment_impact: 'Ideal for passive income seekers and pension/wealth builders; generates massive cash flow into bank account.'
  },
  {
    ticker: 'HAL',
    name: 'Hindustan Aeronautics Ltd',
    bse_code: '541154',
    sector: 'Defense & Aerospace',
    industry: 'Military Aircraft, Helicopters & Jet Engines',
    current_price: 4120.00,
    accumulation_zone: {
      min_price: 3950.00,
      max_price: 4150.00,
      margin_of_safety_pct: 26.0
    },
    target_1yr: 5400.00,
    target_3yr: 9200.00,
    expected_cagr_3yr: 30.7,
    dividend_yield: 1.70,
    roic_pct: 34.5,
    roe_pct: 29.2,
    sales_cagr_5yr: 12.8,
    profit_cagr_5yr: 26.7,
    debt_to_equity: 0.00,
    pe_ratio: 36.8,
    pb_ratio: 9.8,
    market_cap_cr: 275000,
    piotroski_f_score: 9,
    altman_z_score: 8.8,
    moat_type: 'Government Defense Moat',
    moat_rating: 'Wide Moat',
    investment_horizon: '3 - 5 Years',
    risk_level: 'Very Low',
    suitability_badge: 'Monopoly Compounder',
    portfolio_weight_recommended_pct: 10.0,
    thesis_summary_hi: 'India ka akela fighter aircraft aur military helicopter manufacturer (Tejas, Prachand, Su-30MKI). Zero debt, ₹1.2 Lakh Crore ki lifetime high order book aur GE Aerospace ke saath F414 jet engine transfer of technology.',
    thesis_summary_en: 'Sole indigenous military aircraft and helicopter manufacturer in India with zero debt, ₹1.2 Lakh Cr order pipeline, and GE jet engine co-production deal.',
    why_invest_long_term: [
      'Monopoly Status: No private or public company in India can manufacture fighter jets or attack helicopters.',
      'Zero Debt with ₹24,000+ Cr cash reserves earning huge interest yield.',
      'Tejas Mk1A (83 aircraft) and upcoming Tejas Mk2 orders provide unbroken revenue surge till 2032.'
    ],
    key_tailwinds: [
      'IAF fighter squadron strength deficit requiring emergency induction of 200+ indigenous jets.',
      'Export inquiries for Light Combat Helicopter (Prachand) from Africa and Southeast Asia.'
    ],
    invalidation_risks: [
      'Delivery delays from foreign engine suppliers (GE Aerospace delivery timelines).',
      'Long testing and flight certification lead times.'
    ],
    dividend_reinvestment_impact: 'High-conviction wealth compounder that will benefit directly from India $100B defense modernization budget.'
  },
  {
    ticker: 'KALYANKJIL',
    name: 'Kalyan Jewellers India Ltd',
    bse_code: '543278',
    sector: 'Consumer & Retail',
    industry: 'Gold, Diamond & Lifestyle Retail Chains',
    current_price: 595.00,
    accumulation_zone: {
      min_price: 560.00,
      max_price: 600.00,
      margin_of_safety_pct: 24.0
    },
    target_1yr: 820.00,
    target_3yr: 1350.00,
    expected_cagr_3yr: 31.4,
    dividend_yield: 1.00,
    roic_pct: 22.4,
    roe_pct: 20.8,
    sales_cagr_5yr: 28.5,
    profit_cagr_5yr: 45.2,
    debt_to_equity: 0.35,
    pe_ratio: 48.0,
    pb_ratio: 11.8,
    market_cap_cr: 61200,
    piotroski_f_score: 8,
    altman_z_score: 5.4,
    moat_type: 'Brand & Pricing Power',
    moat_rating: 'High Moat',
    investment_horizon: '2 - 4 Years',
    risk_level: 'Low',
    suitability_badge: 'Multi-Bagger Compounder',
    portfolio_weight_recommended_pct: 6.0,
    thesis_summary_hi: 'FOCO (Franchise-Owned Company-Operated) asset-light expansion model ke through Bharat aur Middle East me fastest growing jewellery chain. Custom duty cut aur wedding season demand se profit 45%+ CAGR se grow ho raha hai.',
    thesis_summary_en: 'Asset-light FOCO franchise expansion delivering 30%+ revenue CAGR, capturing market share from unorganized jewellery sector in India & GCC.',
    why_invest_long_term: [
      'Shift to Franchise FOCO model dramatically reduced capex and boosted return on capital employed (ROCE) towards 25%.',
      'Candere digital lifestyle brand capturing Gen-Z light-weight diamond jewellery market.',
      'Govt reduction in gold import customs duty from 15% to 6% stimulated massive customer footfall and curbed illegal gray market.'
    ],
    key_tailwinds: [
      'Organized jewellery market share growing from 38% to 55% over the next 4 years.',
      'Wedding boom and gold hedging demand in Tier 2/3 towns where Kalyan has strong trust.'
    ],
    invalidation_risks: [
      'High fluctuations in international spot gold prices causing short-term inventory hedging costs.',
      'Rising competition from Titan Tanishq and Senco Gold.'
    ],
    dividend_reinvestment_impact: 'Fastest growing consumer compounder with expanding margins and rapid retail footprint.'
  }
];

export const INVESTMENT_MODEL_PORTFOLIOS: InvestmentModelPortfolio[] = [
  {
    id: 'coffee_can_monopolies',
    title: '👑 Forever Compounders (Coffee Can Monopolies)',
    subtitle: 'Zero-Debt, Wide Moat, Market Dominators for Stress-Free Compounding',
    hindi_title: '👑 सदाबहार मोनोपोली कम्पाउंडर्स (जीरो कर्ज & मजबूत Moat)',
    tagline: 'Buy & Hold for 3-5 Years. Zero sleepless nights.',
    recommended_horizon: '3 - 5 Years',
    expected_cagr_3yr: 31.8,
    expected_3yr_multiplier: 2.30,
    avg_dividend_yield: 1.65,
    risk_profile: 'Low Risk',
    ideal_for: 'Conservative to Moderate wealth builders looking for multibagger returns with near-zero insolvency risk.',
    investment_philosophy: 'Invests only in companies with undisputed economic moats (monopolies or duopolies), zero to negligible debt, high ROIC > 25%, and exceptional management pedigree (Tata, PSU Defense, CDSL).',
    holdings: [
      { ticker: 'TRENT', name: 'Trent Ltd (Tata)', weight_pct: 22.0, expected_cagr: 32.5, role: 'High Growth Consumer Compounder' },
      { ticker: 'BEL', name: 'Bharat Electronics', weight_pct: 22.0, expected_cagr: 31.5, role: 'Zero-Debt Defense Monopoly' },
      { ticker: 'CDSL', name: 'Central Depository', weight_pct: 20.0, expected_cagr: 31.9, role: 'High Margin Market Toll-Booth' },
      { ticker: 'HAL', name: 'Hindustan Aeronautics', weight_pct: 20.0, expected_cagr: 30.7, role: 'Fighter Jet Defense Monopoly' },
      { ticker: 'POLYCAB', name: 'Polycab India', weight_pct: 16.0, expected_cagr: 30.8, role: 'Infrastructure Cabling Kingpin' }
    ]
  },
  {
    id: 'secular_mega_trends',
    title: '🚀 India 2030 Mega-Trends (10x Secular Theme)',
    subtitle: 'Green Energy, Electronics PLI, Defense Modernization & Consumer Boom',
    hindi_title: '🚀 भारत 2030 मेगा-ट्रेंड्स (ग्रीन एनर्जी & इलेक्ट्रॉनिक्स PLI)',
    tagline: 'High Octane Wealth Expansion riding India $5 Trillion economy.',
    recommended_horizon: '3 - 5 Years',
    expected_cagr_3yr: 32.2,
    expected_3yr_multiplier: 2.35,
    avg_dividend_yield: 1.85,
    risk_profile: 'Moderate Risk',
    ideal_for: 'Growth investors targeting maximum capital multiplication over the next 3 to 5 years.',
    investment_philosophy: 'Focuses on the biggest multi-year tailwinds backed by Government Capex & PLI incentives: Clean Energy, Electronics Manufacturing (EMS), Defense Indigenization, and Retail Jewellery.',
    holdings: [
      { ticker: 'DIXON', name: 'Dixon Tech', weight_pct: 22.0, expected_cagr: 33.0, role: 'India Electronics & PLI Kingpin' },
      { ticker: 'TATAPOWER', name: 'Tata Power', weight_pct: 22.0, expected_cagr: 30.2, role: 'Solar, EV & Energy Transition' },
      { ticker: 'POLYCAB', name: 'Polycab India', weight_pct: 20.0, expected_cagr: 30.8, role: 'Power Grid Transmission' },
      { ticker: 'BEL', name: 'Bharat Electronics', weight_pct: 20.0, expected_cagr: 31.5, role: 'Defense Tech & Radars' },
      { ticker: 'KALYANKJIL', name: 'Kalyan Jewellers', weight_pct: 16.0, expected_cagr: 31.4, role: 'Organized Retail & Lifestyle' }
    ]
  },
  {
    id: 'high_dividend_cash_machine',
    title: '💰 High-Dividend Cash Machine & Compounding Yield',
    subtitle: '4% - 7% Safe Cash Dividends + 25%+ Annual Capital Appreciation',
    hindi_title: '💰 हाई-डिविडेंड कैश मशीन (रेगुलर इनकम + हाई रिटर्न)',
    tagline: 'Get high quarterly dividend payouts while your portfolio doubles.',
    recommended_horizon: '2 - 4 Years',
    expected_cagr_3yr: 27.5,
    expected_3yr_multiplier: 2.08,
    avg_dividend_yield: 5.20,
    risk_profile: 'Conservative',
    ideal_for: 'Investors seeking regular passive income / pension plus strong inflation-beating capital growth.',
    investment_philosophy: 'Combines cash-rich, high-ROIC Maharatna PSUs and dividend aristocrats that pay 5%+ dividend yields with high margin of safety.',
    holdings: [
      { ticker: 'RECLTD', name: 'REC Ltd', weight_pct: 30.0, expected_cagr: 26.9, role: '6.2% High Dividend + Power Loan Moat' },
      { ticker: 'COALINDIA', name: 'Coal India', weight_pct: 25.0, expected_cagr: 21.4, role: '6.6% High Dividend + Energy Monopoly' },
      { ticker: 'BEL', name: 'Bharat Electronics', weight_pct: 20.0, expected_cagr: 31.5, role: '2.1% Div + Zero Debt Growth' },
      { ticker: 'TATAPOWER', name: 'Tata Power', weight_pct: 15.0, expected_cagr: 30.2, role: '2.0% Div + Clean Energy Expansion' },
      { ticker: 'POLYCAB', name: 'Polycab India', weight_pct: 10.0, expected_cagr: 30.8, role: '1.8% Div + Infrastructure Growth' }
    ]
  }
];

export const INVESTMENT_GOLDEN_RULES = [
  {
    rule: 'Rule 1: Never Lose Capital (Margin of Safety)',
    hindi: 'नियम 1: पूंजी कभी न खोएं (सुरक्षा का दायरा)',
    desc: 'Always buy fundamentally great businesses when they are trading inside their safe accumulation zone, giving at least 20-30% margin of safety.'
  },
  {
    rule: 'Rule 2: Invest in Monopolies & Pricing Power (Economic Moat)',
    hindi: 'नियम 2: मोनोपोली और मजबूत ब्रांड्स में निवेश करें',
    desc: 'Choose companies that can increase prices without losing customers (e.g. CDSL, Trent, BEL, Polycab).'
  },
  {
    rule: 'Rule 3: Avoid Debt Traps (Zero to Low Debt)',
    hindi: 'नियम 3: भारी कर्ज वाली कंपनियों से दूर रहें',
    desc: 'Companies with Debt/Equity < 0.3 can easily survive market crashes and economic recessions without dilution.'
  },
  {
    rule: 'Rule 4: Power of Compounding & Time Horizon (1-5 Years)',
    hindi: 'नियम 4: कम्पाउंडिंग की ताकत और धैर्य रखें',
    desc: 'Do not panic on short-term 5-10% daily market swings. Multi-baggers take 2 to 4 years of business earnings growth to deliver 2x to 5x returns.'
  },
  {
    rule: 'Rule 5: Reinvest Dividends into Winning Compounders',
    hindi: 'नियम 5: मिलने वाले डिविडेंड को दोबारा इन्वेस्ट करें',
    desc: 'Reinvesting high dividend payouts (like REC 6.2%, Coal India 6.6%) into accumulation creates an exponential compounding snowball.'
  }
];

export function calculateSipWealth(
  monthlyInvestment: number,
  expectedAnnualCagrPct: number,
  years: number,
  annualDividendYieldPct: number = 0
) {
  const effectiveAnnualReturn = (expectedAnnualCagrPct + annualDividendYieldPct) / 100;
  const monthlyRate = Math.pow(1 + effectiveAnnualReturn, 1 / 12) - 1;
  const totalMonths = years * 12;

  let totalInvested = monthlyInvestment * totalMonths;
  let futureValue = 0;

  for (let m = 1; m <= totalMonths; m++) {
    futureValue += monthlyInvestment * Math.pow(1 + monthlyRate, totalMonths - m + 1);
  }

  const wealthGained = Math.max(0, futureValue - totalInvested);
  const totalDividendsEstimated = (futureValue * (annualDividendYieldPct / 100)) * (years / 2);

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(wealthGained),
    totalDividendsEstimated: Math.round(totalDividendsEstimated),
    multiplier: totalInvested > 0 ? (futureValue / totalInvested).toFixed(2) : '1.0'
  };
}

export function calculateLumpsumWealth(
  lumpsumAmount: number,
  expectedAnnualCagrPct: number,
  years: number,
  annualDividendYieldPct: number = 0
) {
  const totalReturnRate = (expectedAnnualCagrPct + annualDividendYieldPct) / 100;
  const futureValue = lumpsumAmount * Math.pow(1 + totalReturnRate, years);
  const wealthGained = Math.max(0, futureValue - lumpsumAmount);
  const annualDividendAtMaturity = futureValue * (annualDividendYieldPct / 100);

  return {
    investedAmount: Math.round(lumpsumAmount),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(wealthGained),
    annualDividendAtMaturity: Math.round(annualDividendAtMaturity),
    multiplier: (futureValue / lumpsumAmount).toFixed(2)
  };
}
