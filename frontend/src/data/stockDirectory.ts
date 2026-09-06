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
    ticker: 'RECLTD',
    name: 'REC Limited',
    symbol: 'RECLTD.NS',
    exchange: 'NSE',
    sector: 'Power Finance / Infrastructure',
    industry: 'Infrastructure Non-Banking Financial Company (NBFC)',
    price: 318.70,
    change_pct: -1.4,
    week_52_high: 390.50,
    week_52_low: 304.05,
    pe_ratio: 5.2,
    pb_ratio: 1.1,
    dividend_yield: 6.5,
    market_cap: '₹83,920 Cr',
    business_model: 'REC Limited (formerly Rural Electrification Corporation) is a Maharatna Central Public Sector Enterprise (CPSE) under the Ministry of Power. It provides long-term debt financing and loans across power generation, transmission, distribution, and renewable green energy projects in India.',
    future_demand_outlook: 'HIGH STRUCTURAL DEMAND. India’s national power demand is expanding at 7% CAGR. Government initiatives (PM-KUSUM, RDSS, National Green Hydrogen Mission) guarantee massive multi-year power CAPEX lending expansion.',
    why_invest: 'Attractive P/E valuation (5.2x), high dividend yield (~6.5%), sovereign backing, and accelerating green energy loan portfolio with near-zero NPAs in renewable projects.',
    financial_health_summary: 'Net Interest Margin (NIM) 3.6%, Return on Equity (ROE) 22.4%, Capital Adequacy Ratio (CRAR) 28.2%, and strong asset quality with zero new NPA additions.',
    catalysts: ['Power sector CAPEX boom exceeding ₹15 Lakh Cr', 'Green energy transition financing loan target of ₹3 Lakh Cr', 'Consistent quarterly cash dividend distribution'],
    key_risks: ['State DISCOM financial stress & delayed payment cycles', 'Interest rate margin compression in tight liquidity']
  },
  {
    ticker: 'PFC',
    name: 'Power Finance Corporation',
    symbol: 'PFC.NS',
    exchange: 'NSE',
    sector: 'Power Finance / Infrastructure',
    industry: 'Power Sector Specialized NBFC',
    price: 432.50,
    change_pct: 1.2,
    week_52_high: 580.00,
    week_52_low: 375.00,
    pe_ratio: 5.8,
    pb_ratio: 1.2,
    dividend_yield: 5.8,
    market_cap: '₹1,42,700 Cr',
    business_model: 'PFC is the parent Maharatna company of REC Ltd, serving as the financial backbone of India’s power and energy infrastructure sector.',
    future_demand_outlook: 'VERY HIGH DEMAND. Electrification of transportation, data center power consumption, and industrial renewable energy transitions require colossal capital expenditure.',
    why_invest: 'Low single-digit P/E (5.8x), high dividend yield (5.8%), excellent asset quality, and premier sovereign credit rating.',
    financial_health_summary: 'ROE 21.8%, Net NPA < 0.9%, robust capital adequacy, and steady quarterly dividend payouts.',
    catalysts: ['National transmission grid expansion', 'Renewable energy loan book crossing 25%', 'Navratna to Maharatna operational freedom'],
    key_risks: ['Concentration risk in state government power utilities', 'Fluctuations in international borrowing costs']
  },
  {
    ticker: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    symbol: 'TATAMOTORS.NS',
    exchange: 'NSE',
    sector: 'Automotive',
    industry: 'Commercial & Passenger Vehicles / Electric Vehicles',
    price: 311.50,
    change_pct: 0.8,
    week_52_high: 739.70,
    week_52_low: 294.30,
    pe_ratio: 14.8,
    pb_ratio: 2.8,
    dividend_yield: 1.2,
    market_cap: '₹1,14,500 Cr',
    business_model: 'Tata Motors is a global automotive powerhouse manufacturing commercial trucks/buses, passenger cars (Nexon, Punch, Harrier), luxury vehicles (Jaguar Land Rover), and leading India’s Electric Vehicle market with 70%+ market share.',
    future_demand_outlook: 'RAPID LONG-TERM EV & HCV GROWTH. Electric vehicle adoption in India is expanding at 30%+ CAGR where Tata holds dominant leadership. Fleet modernization and infrastructure spending drive steady heavy truck sales.',
    why_invest: 'JLR balance sheet net-debt free, market monopoly in Indian electric cars, margin expansion in commercial vehicles, and strong export growth.',
    financial_health_summary: 'Rapid balance sheet deleveraging, EBIT margins at JLR reaching 8.5%, Free Cash Flow generation > ₹15,000 Cr, and ROE 26.5%.',
    catalysts: ['New EV launches (Curvv EV, Sierra EV)', 'JLR order book stability in UK/Europe', 'Demerger into Commercial and Passenger Vehicle listed entities'],
    key_risks: ['Global luxury car demand slowdown in China/US', 'Intensifying competition from foreign EV entrants']
  },
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    symbol: 'TCS.NS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Digital Consulting',
    price: 2304.00,
    change_pct: -0.6,
    week_52_high: 3350.00,
    week_52_low: 1976.80,
    pe_ratio: 26.5,
    pb_ratio: 11.2,
    dividend_yield: 2.4,
    market_cap: '₹8,33,400 Cr',
    business_model: 'TCS is India’s largest IT services exporter, providing cloud migration, cybersecurity, enterprise AI software, cognitive business operations, and digital transformation consulting to Fortune 500 clients worldwide.',
    future_demand_outlook: 'SUSTAINED STRUCTURAL ENTERPRISE DEMAND. Generative AI integration, legacy mainframe modernization, and cost-optimization mega-deals provide steady 6-9% multi-year revenue growth.',
    why_invest: 'Flawless zero-debt balance sheet, industry-leading operating margin (~26%), Return on Equity > 48%, and consistent high-payout cash dividend and share buyback history.',
    financial_health_summary: 'Piotroski Score 9/9, Zero Debt, Free Cash Flow conversion > 100% of Net Income, and massive cash reserves of ₹45,000+ Cr.',
    catalysts: ['Enterprise Generative AI order book exceeding $1 Billion', 'Mega-deal ramp-up across BFSI and Retail', 'High return of capital via dividends'],
    key_risks: ['US & European enterprise IT budget tightening', 'Cross-currency FX volatility (USD/EUR vs INR)']
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    symbol: 'RELIANCE.NS',
    exchange: 'NSE',
    sector: 'Energy / Telecom / Retail',
    industry: 'Diversified Conglomerate',
    price: 1322.00,
    change_pct: 1.8,
    week_52_high: 1611.80,
    week_52_low: 1249.80,
    pe_ratio: 24.2,
    pb_ratio: 2.1,
    dividend_yield: 0.8,
    market_cap: '₹17,88,000 Cr',
    business_model: 'Reliance is India’s largest company spanning Oil-to-Chemicals (O2C refining & petrochemicals), Telecom (Jio with 470M+ subscribers), Retail (Reliance Retail with 18,000+ stores), and New Green Energy (Solar Giga-factories & Green Hydrogen).',
    future_demand_outlook: 'MASSIVE MULTI-ENGINE GROWTH. Jio 5G monetization, retail consumer consumption boom, and ₹75,000 Cr green energy complex commercialization drive comprehensive earnings expansion.',
    why_invest: 'Dominant market leadership in telecom and retail, strong cash generation from refining, potential value unlocking via Jio and Retail IPO listings.',
    financial_health_summary: 'Robust EBITDA generation exceeding ₹1,75,000 Cr, conservative debt leverage, and high credit rating AAA.',
    catalysts: ['Potential Jio and Reliance Retail IPO listings', 'Jio 5G tariff hikes boosting ARPU', 'Solar Giga-factory commissioning in Jamnagar'],
    key_risks: ['Global refining margin volatility (GRM swings)', 'Heavy ongoing CAPEX intensity in new energy']
  },
  {
    ticker: 'INFY',
    name: 'Infosys Limited',
    symbol: 'INFY.NS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Digital Solutions',
    price: 1130.00,
    change_pct: 0.2,
    week_52_high: 1922.65,
    week_52_low: 1127.00,
    pe_ratio: 23.8,
    pb_ratio: 6.8,
    dividend_yield: 2.8,
    market_cap: '₹4,68,900 Cr',
    business_model: 'Infosys is a global leader in next-generation digital services and consulting, executing large-scale cloud transformations (Infosys Cobalt) and enterprise AI solutions (Infosys Topaz).',
    future_demand_outlook: 'EXPANDING DIGITAL TRANSFORMATION DEMAND. Long-term cost optimization and generative AI modernization contracts across financial services, healthcare, and manufacturing ensure resilient pipeline.',
    why_invest: 'High Dividend Yield (2.8%), Zero Debt, Return on Equity > 30%, and strong large-deal Total Contract Value (TCV) momentum.',
    financial_health_summary: 'Zero Debt, Free Cash Flow Yield 4.8%, Piotroski Score 8/9, and steady dividend distribution policy.',
    catalysts: ['Large deal TCV conversion into billing', 'Topaz AI adoption in BFSI clients', 'Dividend and buyback capital returns'],
    key_risks: ['Discretionary IT spending slowdown in North America', 'Attrition in high-skill AI engineering talent']
  },
  {
    ticker: 'SBIN',
    name: 'State Bank of India',
    symbol: 'SBIN.NS',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    industry: 'Public Sector Banking Leader',
    price: 1016.10,
    change_pct: -0.4,
    week_52_high: 1234.70,
    week_52_low: 805.60,
    pe_ratio: 9.8,
    pb_ratio: 1.4,
    dividend_yield: 1.8,
    market_cap: '₹9,06,800 Cr',
    business_model: 'State Bank of India (SBI) is India’s largest commercial bank with 480M+ customers, 22,000+ branches, and a dominant market share in domestic credit, retail home loans, and deposits.',
    future_demand_outlook: 'HIGH ECONOMIC CREDIT DEMAND. Corporate credit CAPEX cycle recovery, retail mortgage growth, and SME lending are expanding at 14-16% annual pace.',
    why_invest: 'Pristine asset quality with Net NPA at multi-decade low (< 0.6%), Return on Equity (ROE) sustained above 18%, and attractive valuation multiple relative to private banks.',
    financial_health_summary: 'Net Interest Margin (NIM) 3.3%, Provision Coverage Ratio (PCR) > 75%, and strong Capital Adequacy Ratio.',
    catalysts: ['Corporate loan book re-acceleration', 'YONO 2.0 digital banking rollout', 'Value unlocking via subsidiary listings (SBI Mutual Fund)'],
    key_risks: ['Deposit cost pressure in tight liquidity', 'Macroeconomic credit cycle shocks']
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    symbol: 'HDFCBANK.NS',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    industry: 'Private Sector Banking Giant',
    price: 712.10,
    change_pct: 0.6,
    week_52_high: 880.00,
    week_52_low: 680.00,
    pe_ratio: 17.5,
    pb_ratio: 2.4,
    dividend_yield: 1.4,
    market_cap: '₹12,40,000 Cr',
    business_model: 'HDFC Bank is India’s largest private sector lender with leadership across retail mortgages, auto loans, credit cards, commercial banking, and digital financial services.',
    future_demand_outlook: 'CONTINUOUS RETAIL & CORPORATE EXPANSION. Post-merger synergy realization allows HDFC Bank to cross-sell banking products to millions of existing mortgage customers.',
    why_invest: 'Best-in-class risk management, industry-leading low GNPA track record, deep branch distribution network (8,500+ branches), and valuation at multi-year historical discount.',
    financial_health_summary: 'CASA ratio stabilizing, NIM ~3.5%, Net NPA < 0.35%, and fortress balance sheet with high capital adequacy.',
    catalysts: ['Credit-to-deposit (CD) ratio normalization', 'Cross-selling mortgage insurance & banking services', 'FII institutional re-weighting inflows'],
    key_risks: ['Margin pressure during deposit mobilization phase', 'Integration timeline adjustments']
  },
  {
    ticker: 'BPCL',
    name: 'Bharat Petroleum Corp',
    symbol: 'BPCL.NS',
    exchange: 'NSE',
    sector: 'PSU Oil & Gas',
    industry: 'Refining & Fuel Marketing',
    price: 315.70,
    change_pct: 2.0,
    week_52_high: 365.00,
    week_52_low: 280.00,
    pe_ratio: 11.2,
    pb_ratio: 1.9,
    dividend_yield: 7.1,
    market_cap: '₹1,38,010 Cr',
    business_model: 'BPCL is a Maharatna PSU operating major oil refineries in Mumbai, Kochi, and Bina, alongside a nationwide retail network of 21,000+ petrol stations and LPG distributorships.',
    future_demand_outlook: 'STEADY BASELINE TRANSPORT DEMAND. Growing Indian economic activity and highway vehicle movement drive robust petrol, diesel, and aviation turbine fuel consumption.',
    why_invest: 'High-yield PSU dividend champion delivering 7.1% annual cash yield, supported by stable marketing margins and reasonable P/E valuation (11.2x).',
    financial_health_summary: 'P/E 11.2x, strong free cash flow generation, high return on capital, and consistent PSU cash distribution policy.',
    catalysts: ['7.1% Cash Dividend Yield', 'Green Hydrogen & EV charging station rollout', 'Stable marketing margins'],
    key_risks: ['Crude oil price spikes (> $95/bbl)', 'Government retail fuel price ceiling intervention']
  },
  {
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    symbol: 'COALINDIA.NS',
    exchange: 'NSE',
    sector: 'Mining & Natural Resources',
    industry: 'Monopoly Thermal Coal Mining',
    price: 415.35,
    change_pct: 0.7,
    week_52_high: 540.00,
    week_52_low: 370.00,
    pe_ratio: 8.4,
    pb_ratio: 2.5,
    dividend_yield: 6.4,
    market_cap: '₹2,48,970 Cr',
    business_model: 'Coal India is the world’s largest coal miner, producing 80%+ of India’s domestic coal. It supplies thermal power stations, steel plants, and cement manufacturers under long-term Fuel Supply Agreements (FSA).',
    future_demand_outlook: 'HIGH BASELOAD POWER DEMAND. Coal provides 70%+ of India’s power grid baseload. Rising industrial electricity consumption ensures high annual coal dispatch targets.',
    why_invest: 'Near-monopoly market position, low P/E multiple (8.4x), immense cash reserves, and 6.4% annual cash dividend yield.',
    financial_health_summary: 'Piotroski Score 8/9, low P/E 8.4x, massive cash reserves, and generous cash dividend distribution policy.',
    catalysts: ['Record annual coal production & dispatch targets', '6.4% Cash Dividend Yield', 'E-auction premium realization gains'],
    key_risks: ['Pace of renewable energy transition', 'Monsoon flooding at open-cast mining sites']
  },
  {
    ticker: 'ANDHRSUGAR',
    name: 'Andhra Sugars Ltd',
    symbol: 'ANDHRSUGAR.NS',
    exchange: 'NSE',
    sector: 'Sugar & Bio-Ethanol',
    industry: 'Bio-Ethanol & Industrial Chemicals',
    price: 99.50,
    change_pct: 1.6,
    week_52_high: 135.00,
    week_52_low: 85.00,
    pe_ratio: 12.9,
    pb_ratio: 1.4,
    dividend_yield: 0.8,
    market_cap: '₹1,325 Cr',
    business_model: 'Andhra Sugars operates an integrated sugar-to-ethanol and chlor-alkali chemical manufacturing complex in Andhra Pradesh.',
    future_demand_outlook: 'SURGING ETHANOL DEMAND. Government 20% ethanol blending mandate provides 100% off-take security at fixed OMC purchase prices.',
    why_invest: '52.9% Intrinsic Fair Value discount (₹152.13), low debt-to-equity (0.15), and Piotroski Score 8/9.',
    financial_health_summary: 'Piotroski Score 8/9, minimal Debt-to-Equity (0.15), and high interest coverage ratio (18.2x).',
    catalysts: ['Ethanol blending quota allocation boost', 'Recovery in Caustic Soda realization prices', 'Zero promoter share pledge'],
    key_risks: ['Sugarcane crop yield sensitivity to monsoon', 'Government price regulation on sugar sales']
  },
  {
    ticker: 'CONFIPET',
    name: 'Confidence Petroleum India',
    symbol: 'CONFIPET.NS',
    exchange: 'NSE',
    sector: 'Energy & LPG Logistics',
    industry: 'Auto-LPG & Gas Infrastructure',
    price: 82.30,
    change_pct: 7.4,
    week_52_high: 110.00,
    week_52_low: 65.00,
    pe_ratio: 17.9,
    pb_ratio: 2.1,
    dividend_yield: 0.1,
    market_cap: '₹2,582 Cr',
    business_model: 'Confidence Petroleum is India’s largest private sector Auto-LPG dispensing station operator (under GoGas brand) and LPG cylinder manufacturer.',
    future_demand_outlook: 'HIGH VOLUME DEMAND. Commercial vehicles in tier-2/3 cities are aggressively switching to clean, cost-effective Auto-LPG fuel.',
    why_invest: 'High price momentum (+22.8% 1-Month) combined with 28.8% intrinsic fair value upside (Target ₹105.99).',
    financial_health_summary: 'Revenue CAGR 18.4%, Debt-to-Equity 0.42, and improving EBITDA margins reaching 14.2%.',
    catalysts: ['Network expansion to 250+ LPG dispensing units', 'High turnover in LPG cylinder manufacturing division', 'FII institutional holding accumulation'],
    key_risks: ['Global Saudi CP LPG price fluctuations', 'EV adoption in commercial taxi fleets']
  },
  {
    ticker: 'BEPL',
    name: 'Bhansali Eng Polymers',
    symbol: 'BEPL.NS',
    exchange: 'NSE',
    sector: 'Specialty Polymers',
    industry: 'ABS Resins & Engineering Plastics',
    price: 127.11,
    change_pct: 3.4,
    week_52_high: 160.00,
    week_52_low: 95.00,
    pe_ratio: 15.6,
    pb_ratio: 2.8,
    dividend_yield: 4.7,
    market_cap: '₹3,229 Cr',
    business_model: 'BEPL manufactures ABS (Acrylonitrile Butadiene Styrene) and SAN resins supplied to automotive OEMs and consumer appliances.',
    future_demand_outlook: 'STEADY DOMESTIC DEMAND. Expanding automotive and consumer electronic production in India drives 10%+ annual growth in ABS plastic demand.',
    why_invest: 'Zero-debt balance sheet, lucrative 4.7% Dividend Yield, and 34.2% Return on Capital Employed (ROIC).',
    financial_health_summary: 'Zero Long-Term Debt, Piotroski Score 8/9, Free Cash Flow Yield 6.8%, and strong cash reserves.',
    catalysts: ['Capacity expansion to 150,000 MTPA', 'Automotive sector production revival', 'High dividend payout policy'],
    key_risks: ['Acrylonitrile raw material cost spikes', 'Import competition from foreign chemical manufacturers']
  },
  {
    ticker: 'JAMNAAUTO',
    name: 'Jamna Auto Industries',
    symbol: 'JAMNAAUTO.NS',
    exchange: 'NSE',
    sector: 'Automotive Ancillaries',
    industry: 'Commercial Vehicle Suspension Systems',
    price: 121.50,
    change_pct: 1.5,
    week_52_high: 145.00,
    week_52_low: 95.00,
    pe_ratio: 20.3,
    pb_ratio: 3.4,
    dividend_yield: 1.7,
    market_cap: '₹4,821 Cr',
    business_model: 'Jamna Auto holds a commanding 68% OEM market share in commercial vehicle leaf and parabolic springs in India.',
    future_demand_outlook: 'HIGH REPLACEMENT DEMAND. Expanding national highway freight movement and fleet replacements ensure high sales of suspension components.',
    why_invest: '68% OEM market share in commercial vehicles, ROE 24.1%, interest coverage 14.2x, and growing aftermarket revenue.',
    financial_health_summary: 'ROE 24.1%, Interest Coverage 14.2x, low financial leverage, and consistent operational cash generation.',
    catalysts: ['National infrastructure expenditure rollout', 'Aftermarket expansion for replacement springs', 'Air suspension adoption'],
    key_risks: ['Commercial vehicle fleet sales cyclicality', 'Steel input price inflation']
  },
  {
    ticker: 'BCLIND',
    name: 'BCL Ind & Infrastructure',
    symbol: 'BCLIND.NS',
    exchange: 'NSE',
    sector: 'Distilleries & Agro-Processing',
    industry: 'Grain-based Ethanol & Edible Oils',
    price: 36.90,
    change_pct: 1.1,
    week_52_high: 58.00,
    week_52_low: 32.00,
    pe_ratio: 9.6,
    pb_ratio: 1.2,
    dividend_yield: 0.9,
    market_cap: '₹1,111 Cr',
    business_model: 'BCL Industries operates grain-based ethanol distilleries supplying bio-fuel under fixed government contracts to state oil marketing companies.',
    future_demand_outlook: '100% OFF-TAKE SECURITY. E20 ethanol mandate guarantees long-term volume demand for grain distilleries.',
    why_invest: 'Flawless Piotroski Score 9/9, bargain single-digit P/E multiple (9.6x), and doubling ethanol production capacity.',
    financial_health_summary: 'Piotroski Score 9/9, ROE 21.8%, strong asset turnover ratio, and comfortable interest coverage (8.5x).',
    catalysts: ['Commissioning of 200 KLPD Kharagpur distillery', 'Edible oil margin recovery', 'De-leveraging timeline'],
    key_risks: ['Maize and broken rice grain price spikes', 'Import duty changes on crude palm oil']
  },
  {
    ticker: 'GUJALKALI',
    name: 'Gujarat Alkalies & Chemicals',
    symbol: 'GUJALKALI.NS',
    exchange: 'NSE',
    sector: 'Basic Industrial Chemicals',
    industry: 'Chlor-Alkali & Caustic Soda',
    price: 720.50,
    change_pct: 0.5,
    week_52_high: 860.00,
    week_52_low: 640.00,
    pe_ratio: 24.0,
    pb_ratio: 1.8,
    dividend_yield: 2.5,
    market_cap: '₹5,337 Cr',
    business_model: 'Gujarat Alkalies is a state government PSU producing caustic soda, chlorine, and specialty chemicals for industrial manufacturing.',
    future_demand_outlook: 'STEADY DEMAND. Foundational chemical demand from textiles, alumina, paper, and pharmaceutical manufacturing.',
    why_invest: 'State PSU backing, reliable dividend payouts (₹17.70/share), strong asset quality, and recovering realization margins.',
    financial_health_summary: 'Low leverage, high credit rating, strong asset backing, and consistent operating cash flow supported by Gujarat state government ownership.',
    catalysts: ['Hydrazine Hydrate plant commercialization', 'Caustic soda price realization recovery', 'Consistent annual cash dividends'],
    key_risks: ['Power cost fluctuations (chlor-alkali power intensive)', 'Global chemical dumping']
  },
  {
    ticker: 'BFINVEST',
    name: 'BF Investment Ltd',
    symbol: 'BFINVEST.NS',
    exchange: 'NSE',
    sector: 'Financial Holding Company',
    industry: 'Kalyani Group Asset Holding',
    price: 470.00,
    change_pct: 0.0,
    week_52_high: 620.00,
    week_52_low: 410.00,
    pe_ratio: 4.3,
    pb_ratio: 0.6,
    dividend_yield: 2.1,
    market_cap: '₹1,691 Cr',
    business_model: 'BF Investment is a deep value holding company holding substantial equity stakes in Kalyani Group companies (Bharat Forge, Automotive Axles).',
    future_demand_outlook: 'DEFENSE & AEROSPACE BOOM. Underlying operating companies are expanding rapidly into global defense and engineering exports.',
    why_invest: '70%+ discount to underlying Net Asset Value (NAV), P/E of just 4.3x, and zero long-term debt.',
    financial_health_summary: 'Zero debt, pristine group balance sheet, low P/E 4.3x, and high book value backing.',
    catalysts: ['Value unlocking via group corporate restructuring', 'Bharat Forge defense export order book growth', 'Promoter stake consolidation'],
    key_risks: ['Holding company discount persistence', 'Low liquidity in equity shares']
  },
  {
    ticker: 'ZUARI',
    name: 'Zuari Agro Chemicals',
    symbol: 'ZUARI.NS',
    exchange: 'NSE',
    sector: 'Fertilizers & Agrochemicals',
    industry: 'Crop Nutrition & Phosphatics',
    price: 226.10,
    change_pct: 2.2,
    week_52_high: 290.00,
    week_52_low: 155.00,
    pe_ratio: 1.0,
    pb_ratio: 0.8,
    dividend_yield: 2.0,
    market_cap: '₹976 Cr',
    business_model: 'Zuari Agro Chemicals produces complex NPK/DAP fertilizers and distributes crop nutrition solutions across India.',
    future_demand_outlook: 'HIGH AGRICULTURAL DEMAND. Good monsoon and direct government fertilizer subsidy disbursements ensure strong volume consumption.',
    why_invest: 'Top momentum score (91/100) with 54.9% intrinsic valuation upside (Target ₹350.14) and rapid debt reduction via land asset sales.',
    financial_health_summary: 'Significant balance sheet deleveraging, low P/E multiple (1.0x asset discount), and strong turnaround in subsidiary Paradeep Phosphates.',
    catalysts: ['Monetization of non-core land bank assets', 'Government fertilizer subsidy release', 'P/E multiple 1.0x asset discount'],
    key_risks: ['Raw material (Phosphoric Acid) import cost volatility', 'Monsoon rainfall spatial distribution']
  },
  {
    ticker: 'ADANIENT',
    name: 'Adani Enterprises Ltd',
    symbol: 'ADANIENT.NS',
    exchange: 'NSE',
    sector: 'Infrastructure Incubator',
    industry: 'Airports, Roads, Green Hydrogen, Data Centers',
    price: 2840.00,
    change_pct: 1.5,
    week_52_high: 3450.00,
    week_52_low: 2150.00,
    pe_ratio: 42.0,
    pb_ratio: 6.5,
    dividend_yield: 0.1,
    market_cap: '₹3,24,000 Cr',
    business_model: 'Adani Enterprises is the flagship business incubator of the Adani Group, scaling multi-billion dollar infrastructure assets including 8 airports, toll roads, data centers, solar manufacturing, and green hydrogen.',
    future_demand_outlook: 'EXPONENTIAL INFRASTRUCTURE DEMAND. India’s air passenger traffic is growing at 15% CAGR, highway monetization is accelerating, and national data localization mandates drive massive data center leasing.',
    why_invest: 'Proven track record of incubating infrastructure businesses (Adani Ports, Adani Power, Adani Green were all incubated here), sovereign-scale assets, and strong operating cash flows from airports and mining.',
    financial_health_summary: 'EBITDA growing at 32% CAGR, strong debt refinancing profile with international banks, and increasing institutional promoter holding.',
    catalysts: ['Navi Mumbai International Airport commissioning', 'Green Hydrogen ecosystem commercialization', 'Demerger of airport business into separate listed entity'],
    key_risks: ['High debt leverage across group projects', 'Sensitivity to international short-seller reports & governance scrutiny']
  },
  {
    ticker: 'ITC',
    name: 'ITC Limited',
    symbol: 'ITC.NS',
    exchange: 'NSE',
    sector: 'FMCG / Cigarettes / Hotels',
    industry: 'Diversified Consumer Goods',
    price: 462.50,
    change_pct: 0.4,
    week_52_high: 520.00,
    week_52_low: 399.00,
    pe_ratio: 27.5,
    pb_ratio: 7.2,
    dividend_yield: 3.2,
    market_cap: '₹5,78,000 Cr',
    business_model: 'ITC is a diversified consumer conglomerate generating immense free cash flow from its near-monopoly cigarette business, while scaling non-cigarette FMCG (Aashirvaad, Sunfeast, Bingo), Agri-business, Paperboards, and Hotels.',
    future_demand_outlook: 'RESILIENT CONSUMER STAPLES GROWTH. Premiumization in packaged foods, branded staples, and booming domestic travel/tourism support double-digit FMCG and hotel profitability.',
    why_invest: 'Fortress zero-debt balance sheet, industry-leading Free Cash Flow generation (> ₹16,000 Cr annually), reliable 3.2% dividend yield, and value unlocking from Hotel business demerger.',
    financial_health_summary: 'Zero Debt, Return on Capital Employed (ROCE) > 38%, Piotroski Score 9/9, and exceptional cash conversion ratio (> 95%).',
    catalysts: ['Listing of ITC Hotels entity', 'Non-cigarette FMCG margin expansion above 10%', 'Tax stability on tobacco products'],
    key_risks: ['Government taxation hikes on cigarettes', 'Agricultural commodity inflation (wheat, edible oils)']
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
  ).slice(0, 8);
}
