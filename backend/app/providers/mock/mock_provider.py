"""
app/providers/mock/mock_provider.py — Complete mock data provider.

All methods return realistic but clearly labeled demo data.
Every response dict includes:
  is_demo_data: true
  source: "MOCK_PROVIDER"
  data_freshness: "DEMO"
  retrieved_at: <ISO datetime string>

Price series are generated using a seeded random walk so results are
reproducible per ticker.
"""

from __future__ import annotations

import hashlib
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np

from app.providers.base import (
    AnalystDataProvider,
    DividendProvider,
    EarningsProvider,
    EconomicDataProvider,
    FundamentalDataProvider,
    MarketDataProvider,
    NewsProvider,
)


# ─────────────────────────────────────────────────────────────────────────────
# Static stock universe
# ─────────────────────────────────────────────────────────────────────────────
MOCK_STOCKS: Dict[str, Dict[str, Any]] = {
    # ── Indian equities (NSE) ────────────────────────────────────────────────
    "TCS": {
        "name": "Tata Consultancy Services Ltd",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Services & Consulting",
        "country": "India",
        "currency": "INR",
        "isin": "INE467B01029",
        "website": "https://www.tcs.com",
        "employees": 614795,
        "founded_year": 1968,
        "description": "Tata Consultancy Services is an IT services, consulting and business solutions organization.",
        "base_price": 3850.0,
        "market_cap_cr": 1_400_000,
        "revenue_cr": 240_893,
        "net_income_cr": 46_099,
        "roic": 51.2,
        "roe": 47.8,
        "gross_margin": 34.6,
        "net_margin": 19.1,
        "pe_ratio": 30.4,
        "pb_ratio": 14.6,
        "debt_to_equity": 0.04,
        "piotroski": 7,
        "dividend_yield": 1.2,
        "peers": ["INFY", "WIPRO", "HCLTECH"],
    },
    "RELIANCE": {
        "name": "Reliance Industries Ltd",
        "exchange": "NSE",
        "sector": "Energy",
        "industry": "Oil, Gas & Consumable Fuels",
        "country": "India",
        "currency": "INR",
        "isin": "INE002A01018",
        "website": "https://www.ril.com",
        "employees": 236334,
        "founded_year": 1966,
        "description": "Reliance Industries is a conglomerate with interests in petrochemicals, refining, oil, retail, and telecom.",
        "base_price": 2960.0,
        "market_cap_cr": 2_000_000,
        "revenue_cr": 897_688,
        "net_income_cr": 69_621,
        "roic": 11.4,
        "roe": 9.3,
        "gross_margin": 15.2,
        "net_margin": 7.8,
        "pe_ratio": 28.7,
        "pb_ratio": 2.4,
        "debt_to_equity": 0.35,
        "piotroski": 6,
        "dividend_yield": 0.3,
        "peers": ["IOC", "BPCL", "ONGC"],
    },
    "INFY": {
        "name": "Infosys Ltd",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Services & Consulting",
        "country": "India",
        "currency": "INR",
        "isin": "INE009A01021",
        "website": "https://www.infosys.com",
        "employees": 343234,
        "founded_year": 1981,
        "description": "Infosys is a global leader in next-generation digital services and consulting.",
        "base_price": 1780.0,
        "market_cap_cr": 740_000,
        "revenue_cr": 153_670,
        "net_income_cr": 26_248,
        "roic": 38.4,
        "roe": 31.5,
        "gross_margin": 33.1,
        "net_margin": 17.1,
        "pe_ratio": 28.2,
        "pb_ratio": 8.9,
        "debt_to_equity": 0.06,
        "piotroski": 7,
        "dividend_yield": 2.1,
        "peers": ["TCS", "WIPRO", "HCLTECH"],
    },
    "HDFCBANK": {
        "name": "HDFC Bank Ltd",
        "exchange": "NSE",
        "sector": "Financials",
        "industry": "Banks",
        "country": "India",
        "currency": "INR",
        "isin": "INE040A01034",
        "website": "https://www.hdfcbank.com",
        "employees": 213527,
        "founded_year": 1994,
        "description": "HDFC Bank is India's largest private sector bank by assets.",
        "base_price": 1680.0,
        "market_cap_cr": 1_270_000,
        "revenue_cr": 204_665,
        "net_income_cr": 60_812,
        "roic": 15.2,
        "roe": 17.4,
        "gross_margin": 48.2,
        "net_margin": 29.7,
        "pe_ratio": 20.9,
        "pb_ratio": 3.5,
        "debt_to_equity": 7.8,  # banks have high D/E by nature
        "piotroski": 7,
        "dividend_yield": 1.1,
        "peers": ["ICICIBANK", "KOTAKBANK", "AXISBANK"],
    },
    "WIPRO": {
        "name": "Wipro Ltd",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Services & Consulting",
        "country": "India",
        "currency": "INR",
        "isin": "INE075A01022",
        "website": "https://www.wipro.com",
        "employees": 234054,
        "founded_year": 1945,
        "description": "Wipro is a leading global IT, consulting and BPO company.",
        "base_price": 490.0,
        "market_cap_cr": 265_000,
        "revenue_cr": 89_762,
        "net_income_cr": 11_365,
        "roic": 22.1,
        "roe": 17.8,
        "gross_margin": 28.4,
        "net_margin": 12.7,
        "pe_ratio": 23.3,
        "pb_ratio": 4.2,
        "debt_to_equity": 0.12,
        "piotroski": 6,
        "dividend_yield": 0.2,
        "peers": ["TCS", "INFY", "HCLTECH"],
    },
    "ICICIBANK": {
        "name": "ICICI Bank Ltd",
        "exchange": "NSE",
        "sector": "Financials",
        "industry": "Banks",
        "country": "India",
        "currency": "INR",
        "isin": "INE090A01021",
        "website": "https://www.icicibank.com",
        "employees": 130509,
        "founded_year": 1994,
        "description": "ICICI Bank is India's second largest private sector bank.",
        "base_price": 1250.0,
        "market_cap_cr": 885_000,
        "revenue_cr": 124_000,
        "net_income_cr": 44_120,
        "roic": 14.8,
        "roe": 18.2,
        "gross_margin": 46.0,
        "net_margin": 35.6,
        "pe_ratio": 20.1,
        "pb_ratio": 3.3,
        "debt_to_equity": 7.2,
        "piotroski": 7,
        "dividend_yield": 0.8,
        "peers": ["HDFCBANK", "KOTAKBANK", "AXISBANK"],
    },
    "BAJFINANCE": {
        "name": "Bajaj Finance Ltd",
        "exchange": "NSE",
        "sector": "Financials",
        "industry": "Consumer Finance",
        "country": "India",
        "currency": "INR",
        "isin": "INE296A01024",
        "website": "https://www.bajajfinserv.in",
        "employees": 57000,
        "founded_year": 1987,
        "description": "Bajaj Finance is one of India's leading NBFCs with consumer, SME and commercial lending.",
        "base_price": 7200.0,
        "market_cap_cr": 445_000,
        "revenue_cr": 55_049,
        "net_income_cr": 14_451,
        "roic": 20.4,
        "roe": 22.6,
        "gross_margin": 61.0,
        "net_margin": 26.3,
        "pe_ratio": 30.8,
        "pb_ratio": 7.0,
        "debt_to_equity": 3.9,
        "piotroski": 7,
        "dividend_yield": 0.4,
        "peers": ["BAJAJFINSV", "CHOLAFIN", "MUTHOOTFIN"],
    },
    "LT": {
        "name": "Larsen & Toubro Ltd",
        "exchange": "NSE",
        "sector": "Industrials",
        "industry": "Engineering & Construction",
        "country": "India",
        "currency": "INR",
        "isin": "INE018A01030",
        "website": "https://www.larsentoubro.com",
        "employees": 53838,
        "founded_year": 1938,
        "description": "Larsen & Toubro is a major technology, engineering, construction and financial services conglomerate.",
        "base_price": 3720.0,
        "market_cap_cr": 520_000,
        "revenue_cr": 221_113,
        "net_income_cr": 13_752,
        "roic": 14.6,
        "roe": 14.3,
        "gross_margin": 12.8,
        "net_margin": 6.2,
        "pe_ratio": 37.8,
        "pb_ratio": 5.2,
        "debt_to_equity": 1.72,
        "piotroski": 6,
        "dividend_yield": 0.7,
        "peers": ["SIEMENS", "ABB", "BHEL"],
    },
    "SUNPHARMA": {
        "name": "Sun Pharmaceutical Industries Ltd",
        "exchange": "NSE",
        "sector": "Healthcare",
        "industry": "Pharmaceuticals",
        "country": "India",
        "currency": "INR",
        "isin": "INE044A01036",
        "website": "https://www.sunpharma.com",
        "employees": 43000,
        "founded_year": 1983,
        "description": "Sun Pharma is India's largest specialty pharma company and fifth largest globally.",
        "base_price": 1620.0,
        "market_cap_cr": 390_000,
        "revenue_cr": 47_936,
        "net_income_cr": 8_630,
        "roic": 18.9,
        "roe": 16.7,
        "gross_margin": 72.4,
        "net_margin": 18.0,
        "pe_ratio": 45.2,
        "pb_ratio": 7.5,
        "debt_to_equity": 0.13,
        "piotroski": 7,
        "dividend_yield": 0.6,
        "peers": ["DRREDDY", "CIPLA", "LUPIN"],
    },
    "TITAN": {
        "name": "Titan Company Ltd",
        "exchange": "NSE",
        "sector": "Consumer Discretionary",
        "industry": "Jewelry & Watches",
        "country": "India",
        "currency": "INR",
        "isin": "INE280A01028",
        "website": "https://www.titancompany.in",
        "employees": 9000,
        "founded_year": 1984,
        "description": "Titan is India's largest lifestyle company in watches, jewelry and eyewear.",
        "base_price": 3540.0,
        "market_cap_cr": 315_000,
        "revenue_cr": 51_090,
        "net_income_cr": 3_542,
        "roic": 42.8,
        "roe": 32.1,
        "gross_margin": 25.3,
        "net_margin": 6.9,
        "pe_ratio": 88.9,
        "pb_ratio": 28.4,
        "debt_to_equity": 0.08,
        "piotroski": 8,
        "dividend_yield": 0.3,
        "peers": ["KALYAN", "PCJEWELLER", "SENCO"],
    },
    "MARUTI": {
        "name": "Maruti Suzuki India Ltd",
        "exchange": "NSE",
        "sector": "Consumer Discretionary",
        "industry": "Automobiles",
        "country": "India",
        "currency": "INR",
        "isin": "INE585B01010",
        "website": "https://www.marutisuzuki.com",
        "employees": 23367,
        "founded_year": 1981,
        "description": "Maruti Suzuki is India's largest automobile manufacturer with 42% market share.",
        "base_price": 12800.0,
        "market_cap_cr": 385_000,
        "revenue_cr": 136_969,
        "net_income_cr": 13_519,
        "roic": 21.3,
        "roe": 18.4,
        "gross_margin": 27.8,
        "net_margin": 9.9,
        "pe_ratio": 28.5,
        "pb_ratio": 5.2,
        "debt_to_equity": 0.01,
        "piotroski": 7,
        "dividend_yield": 1.2,
        "peers": ["TATAMOTORS", "M&M", "HYUNDAI"],
    },
    "ASIANPAINT": {
        "name": "Asian Paints Ltd",
        "exchange": "NSE",
        "sector": "Materials",
        "industry": "Paints & Coatings",
        "country": "India",
        "currency": "INR",
        "isin": "INE021A01026",
        "website": "https://www.asianpaints.com",
        "employees": 8000,
        "founded_year": 1942,
        "description": "Asian Paints is India's largest paint company and Asia's third largest.",
        "base_price": 2860.0,
        "market_cap_cr": 274_000,
        "revenue_cr": 35_493,
        "net_income_cr": 4_293,
        "roic": 38.9,
        "roe": 34.2,
        "gross_margin": 42.5,
        "net_margin": 12.1,
        "pe_ratio": 63.8,
        "pb_ratio": 21.8,
        "debt_to_equity": 0.06,
        "piotroski": 7,
        "dividend_yield": 0.7,
        "peers": ["BERGER", "KANSAINER", "INDIGO"],
    },
    "NESTLEIND": {
        "name": "Nestle India Ltd",
        "exchange": "NSE",
        "sector": "Consumer Staples",
        "industry": "Food Products",
        "country": "India",
        "currency": "INR",
        "isin": "INE239A01016",
        "website": "https://www.nestle.in",
        "employees": 8700,
        "founded_year": 1961,
        "description": "Nestlé India manufactures and markets food products including Maggi, KitKat and Nescafe.",
        "base_price": 2440.0,
        "market_cap_cr": 235_000,
        "revenue_cr": 22_103,
        "net_income_cr": 3_654,
        "roic": 99.8,
        "roe": 108.4,
        "gross_margin": 56.1,
        "net_margin": 16.5,
        "pe_ratio": 64.3,
        "pb_ratio": 71.4,
        "debt_to_equity": 0.0,
        "piotroski": 8,
        "dividend_yield": 1.4,
        "peers": ["BRITANNIA", "ITC", "DABUR"],
    },
    "PIDILITIND": {
        "name": "Pidilite Industries Ltd",
        "exchange": "NSE",
        "sector": "Materials",
        "industry": "Specialty Chemicals",
        "country": "India",
        "currency": "INR",
        "isin": "INE318A01026",
        "website": "https://www.pidilite.com",
        "employees": 6800,
        "founded_year": 1959,
        "description": "Pidilite is India's leading manufacturer of adhesives, sealants and construction chemicals.",
        "base_price": 3060.0,
        "market_cap_cr": 156_000,
        "revenue_cr": 12_427,
        "net_income_cr": 1_940,
        "roic": 34.7,
        "roe": 24.6,
        "gross_margin": 50.2,
        "net_margin": 15.6,
        "pe_ratio": 80.4,
        "pb_ratio": 19.7,
        "debt_to_equity": 0.02,
        "piotroski": 8,
        "dividend_yield": 0.5,
        "peers": ["AKZOINDIA", "GSFC", "DEEPAKNTR"],
    },
    "SIEMENS": {
        "name": "Siemens Ltd",
        "exchange": "NSE",
        "sector": "Industrials",
        "industry": "Electrical Equipment",
        "country": "India",
        "currency": "INR",
        "isin": "INE003A01024",
        "website": "https://www.siemens.co.in",
        "employees": 11200,
        "founded_year": 1867,
        "description": "Siemens India provides innovative solutions for electrification, automation and digitalization.",
        "base_price": 7640.0,
        "market_cap_cr": 137_000,
        "revenue_cr": 23_059,
        "net_income_cr": 2_234,
        "roic": 28.4,
        "roe": 20.8,
        "gross_margin": 34.1,
        "net_margin": 9.7,
        "pe_ratio": 61.4,
        "pb_ratio": 12.7,
        "debt_to_equity": 0.0,
        "piotroski": 7,
        "dividend_yield": 0.3,
        "peers": ["ABB", "LT", "BHEL"],
    },
    "HEROMOTOCO": {
        "name": "Hero MotoCorp Ltd",
        "exchange": "NSE",
        "sector": "Consumer Discretionary",
        "industry": "Motorcycles & Scooters",
        "country": "India",
        "currency": "INR",
        "isin": "INE158A01026",
        "website": "https://www.heromotocorp.com",
        "employees": 9900,
        "founded_year": 1984,
        "description": "Hero MotoCorp is the world's largest two-wheeler manufacturer by volume.",
        "base_price": 5470.0,
        "market_cap_cr": 109_000,
        "revenue_cr": 39_727,
        "net_income_cr": 3_739,
        "roic": 32.1,
        "roe": 26.8,
        "gross_margin": 28.4,
        "net_margin": 9.4,
        "pe_ratio": 29.2,
        "pb_ratio": 7.8,
        "debt_to_equity": 0.01,
        "piotroski": 7,
        "dividend_yield": 2.6,
        "peers": ["BAJAJ-AUTO", "TVSMOTORS", "EICHERMOT"],
    },
    # ── US equities (NASDAQ / NYSE) ─────────────────────────────────────────
    "AAPL": {
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "sector": "Information Technology",
        "industry": "Technology Hardware",
        "country": "United States",
        "currency": "USD",
        "isin": "US0378331005",
        "website": "https://www.apple.com",
        "employees": 164000,
        "founded_year": 1976,
        "description": "Apple designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories.",
        "base_price": 189.5,
        "market_cap_cr": None,
        "market_cap_usd": 2_950_000_000_000,
        "revenue_usd": 385_706_000_000,
        "net_income_usd": 97_000_000_000,
        "roic": 58.4,
        "roe": 151.8,
        "gross_margin": 44.1,
        "net_margin": 25.2,
        "pe_ratio": 30.4,
        "pb_ratio": 48.2,
        "debt_to_equity": 1.87,
        "piotroski": 7,
        "dividend_yield": 0.5,
        "peers": ["MSFT", "GOOGL", "META"],
    },
    "MSFT": {
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "sector": "Information Technology",
        "industry": "Software",
        "country": "United States",
        "currency": "USD",
        "isin": "US5949181045",
        "website": "https://www.microsoft.com",
        "employees": 228000,
        "founded_year": 1975,
        "description": "Microsoft develops software, services, devices and solutions enabling people and businesses.",
        "base_price": 415.0,
        "market_cap_usd": 3_080_000_000_000,
        "revenue_usd": 211_915_000_000,
        "net_income_usd": 88_136_000_000,
        "roic": 28.4,
        "roe": 38.3,
        "gross_margin": 69.8,
        "net_margin": 41.6,
        "pe_ratio": 35.0,
        "pb_ratio": 13.4,
        "debt_to_equity": 0.42,
        "piotroski": 8,
        "dividend_yield": 0.7,
        "peers": ["AAPL", "GOOGL", "AMZN"],
    },
    "GOOGL": {
        "name": "Alphabet Inc.",
        "exchange": "NASDAQ",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "country": "United States",
        "currency": "USD",
        "isin": "US02079K3059",
        "website": "https://www.abc.xyz",
        "employees": 182000,
        "founded_year": 1998,
        "description": "Alphabet is the parent company of Google, providing search, advertising, cloud and hardware.",
        "base_price": 175.0,
        "market_cap_usd": 2_180_000_000_000,
        "revenue_usd": 307_394_000_000,
        "net_income_usd": 73_795_000_000,
        "roic": 26.4,
        "roe": 28.4,
        "gross_margin": 56.7,
        "net_margin": 24.0,
        "pe_ratio": 29.6,
        "pb_ratio": 8.3,
        "debt_to_equity": 0.06,
        "piotroski": 8,
        "dividend_yield": 0.5,
        "peers": ["META", "MSFT", "AMZN"],
    },
    "AMZN": {
        "name": "Amazon.com Inc.",
        "exchange": "NASDAQ",
        "sector": "Consumer Discretionary",
        "industry": "Internet & Direct Marketing Retail",
        "country": "United States",
        "currency": "USD",
        "isin": "US0231351067",
        "website": "https://www.amazon.com",
        "employees": 1540000,
        "founded_year": 1994,
        "description": "Amazon is the world's largest online retailer and cloud computing provider via AWS.",
        "base_price": 195.0,
        "market_cap_usd": 2_050_000_000_000,
        "revenue_usd": 590_740_000_000,
        "net_income_usd": 30_425_000_000,
        "roic": 14.8,
        "roe": 18.2,
        "gross_margin": 46.2,
        "net_margin": 5.2,
        "pe_ratio": 67.4,
        "pb_ratio": 12.1,
        "debt_to_equity": 0.84,
        "piotroski": 7,
        "dividend_yield": 0.0,
        "peers": ["GOOGL", "MSFT", "WMT"],
    },
    "NVDA": {
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "country": "United States",
        "currency": "USD",
        "isin": "US67066G1040",
        "website": "https://www.nvidia.com",
        "employees": 36000,
        "founded_year": 1993,
        "description": "NVIDIA is the world's leading GPU designer, driving AI, gaming and data center innovation.",
        "base_price": 875.0,
        "market_cap_usd": 2_150_000_000_000,
        "revenue_usd": 60_922_000_000,
        "net_income_usd": 29_760_000_000,
        "roic": 63.8,
        "roe": 91.4,
        "gross_margin": 72.7,
        "net_margin": 48.8,
        "pe_ratio": 72.3,
        "pb_ratio": 67.4,
        "debt_to_equity": 0.43,
        "piotroski": 8,
        "dividend_yield": 0.03,
        "peers": ["AMD", "INTC", "QCOM"],
    },
    "META": {
        "name": "Meta Platforms Inc.",
        "exchange": "NASDAQ",
        "sector": "Communication Services",
        "industry": "Interactive Media & Services",
        "country": "United States",
        "currency": "USD",
        "isin": "US30303M1027",
        "website": "https://www.meta.com",
        "employees": 86482,
        "founded_year": 2004,
        "description": "Meta builds technologies connecting people and the world through Facebook, Instagram and WhatsApp.",
        "base_price": 525.0,
        "market_cap_usd": 1_340_000_000_000,
        "revenue_usd": 134_902_000_000,
        "net_income_usd": 39_098_000_000,
        "roic": 37.2,
        "roe": 34.8,
        "gross_margin": 80.7,
        "net_margin": 29.0,
        "pe_ratio": 34.3,
        "pb_ratio": 11.9,
        "debt_to_equity": 0.11,
        "piotroski": 8,
        "dividend_yield": 0.4,
        "peers": ["GOOGL", "SNAP", "PINS"],
    },
    "TSLA": {
        "name": "Tesla Inc.",
        "exchange": "NASDAQ",
        "sector": "Consumer Discretionary",
        "industry": "Automobile Manufacturers",
        "country": "United States",
        "currency": "USD",
        "isin": "US88160R1014",
        "website": "https://www.tesla.com",
        "employees": 140473,
        "founded_year": 2003,
        "description": "Tesla designs and manufactures electric vehicles, energy storage and solar products.",
        "base_price": 248.0,
        "market_cap_usd": 789_000_000_000,
        "revenue_usd": 97_690_000_000,
        "net_income_usd": 7_153_000_000,
        "roic": 14.3,
        "roe": 14.5,
        "gross_margin": 18.2,
        "net_margin": 7.3,
        "pe_ratio": 110.3,
        "pb_ratio": 16.0,
        "debt_to_equity": 0.19,
        "piotroski": 6,
        "dividend_yield": 0.0,
        "peers": ["F", "GM", "RIVN"],
    },
    "JPM": {
        "name": "JPMorgan Chase & Co.",
        "exchange": "NYSE",
        "sector": "Financials",
        "industry": "Diversified Banks",
        "country": "United States",
        "currency": "USD",
        "isin": "US46625H1005",
        "website": "https://www.jpmorganchase.com",
        "employees": 310000,
        "founded_year": 1799,
        "description": "JPMorgan Chase is a leading global financial services firm with $3.9 trillion in assets.",
        "base_price": 205.0,
        "market_cap_usd": 590_000_000_000,
        "revenue_usd": 162_402_000_000,
        "net_income_usd": 49_552_000_000,
        "roic": 14.7,
        "roe": 17.4,
        "gross_margin": 52.0,
        "net_margin": 30.5,
        "pe_ratio": 11.9,
        "pb_ratio": 2.1,
        "debt_to_equity": 1.38,
        "piotroski": 7,
        "dividend_yield": 2.4,
        "peers": ["BAC", "WFC", "C"],
    },
    "JNJ": {
        "name": "Johnson & Johnson",
        "exchange": "NYSE",
        "sector": "Healthcare",
        "industry": "Pharmaceuticals",
        "country": "United States",
        "currency": "USD",
        "isin": "US4781601046",
        "website": "https://www.jnj.com",
        "employees": 152700,
        "founded_year": 1886,
        "description": "Johnson & Johnson is a worldwide leader in healthcare with pharmaceutical and MedTech segments.",
        "base_price": 158.0,
        "market_cap_usd": 381_000_000_000,
        "revenue_usd": 88_821_000_000,
        "net_income_usd": 13_446_000_000,
        "roic": 11.3,
        "roe": 21.2,
        "gross_margin": 68.8,
        "net_margin": 15.1,
        "pe_ratio": 28.3,
        "pb_ratio": 5.9,
        "debt_to_equity": 0.54,
        "piotroski": 7,
        "dividend_yield": 3.2,
        "peers": ["PFE", "MRK", "ABT"],
    },
    "PG": {
        "name": "Procter & Gamble Co.",
        "exchange": "NYSE",
        "sector": "Consumer Staples",
        "industry": "Household Products",
        "country": "United States",
        "currency": "USD",
        "isin": "US7427181091",
        "website": "https://www.pg.com",
        "employees": 107000,
        "founded_year": 1837,
        "description": "Procter & Gamble is a global consumer goods company with brands in 10 product categories.",
        "base_price": 165.0,
        "market_cap_usd": 389_000_000_000,
        "revenue_usd": 84_039_000_000,
        "net_income_usd": 14_714_000_000,
        "roic": 14.8,
        "roe": 30.6,
        "gross_margin": 50.4,
        "net_margin": 17.5,
        "pe_ratio": 26.4,
        "pb_ratio": 8.0,
        "debt_to_equity": 0.65,
        "piotroski": 7,
        "dividend_yield": 2.4,
        "peers": ["UL", "KMB", "CL"],
    },
    "V": {
        "name": "Visa Inc.",
        "exchange": "NYSE",
        "sector": "Financials",
        "industry": "Payment Processing",
        "country": "United States",
        "currency": "USD",
        "isin": "US92826C8394",
        "website": "https://www.visa.com",
        "employees": 26500,
        "founded_year": 1958,
        "description": "Visa operates the world's largest payment network enabling digital commerce globally.",
        "base_price": 275.0,
        "market_cap_usd": 565_000_000_000,
        "revenue_usd": 35_926_000_000,
        "net_income_usd": 17_273_000_000,
        "roic": 17.4,
        "roe": 44.4,
        "gross_margin": 80.1,
        "net_margin": 48.1,
        "pe_ratio": 32.7,
        "pb_ratio": 14.5,
        "debt_to_equity": 0.58,
        "piotroski": 8,
        "dividend_yield": 0.8,
        "peers": ["MA", "PYPL", "AXP"],
    },
    "MA": {
        "name": "Mastercard Incorporated",
        "exchange": "NYSE",
        "sector": "Financials",
        "industry": "Payment Processing",
        "country": "United States",
        "currency": "USD",
        "isin": "US57636Q1040",
        "website": "https://www.mastercard.com",
        "employees": 34000,
        "founded_year": 1966,
        "description": "Mastercard is a technology company in the global payments industry.",
        "base_price": 465.0,
        "market_cap_usd": 437_000_000_000,
        "revenue_usd": 25_098_000_000,
        "net_income_usd": 11_195_000_000,
        "roic": 41.4,
        "roe": 179.8,
        "gross_margin": 77.3,
        "net_margin": 44.6,
        "pe_ratio": 39.0,
        "pb_ratio": 70.2,
        "debt_to_equity": 2.06,
        "piotroski": 7,
        "dividend_yield": 0.6,
        "peers": ["V", "PYPL", "AXP"],
    },
    "HD": {
        "name": "The Home Depot Inc.",
        "exchange": "NYSE",
        "sector": "Consumer Discretionary",
        "industry": "Home Improvement Retail",
        "country": "United States",
        "currency": "USD",
        "isin": "US4370761029",
        "website": "https://www.homedepot.com",
        "employees": 465000,
        "founded_year": 1978,
        "description": "Home Depot is the world's largest home improvement retailer with over 2,300 stores.",
        "base_price": 355.0,
        "market_cap_usd": 354_000_000_000,
        "revenue_usd": 153_670_000_000,
        "net_income_usd": 15_143_000_000,
        "roic": 38.4,
        "roe": 0.0,  # negative equity
        "gross_margin": 33.6,
        "net_margin": 9.9,
        "pe_ratio": 23.4,
        "pb_ratio": 0.0,
        "debt_to_equity": 0.0,
        "piotroski": 6,
        "dividend_yield": 2.5,
        "peers": ["LOW", "TGT", "WMT"],
    },
    "UNH": {
        "name": "UnitedHealth Group Inc.",
        "exchange": "NYSE",
        "sector": "Healthcare",
        "industry": "Managed Health Care",
        "country": "United States",
        "currency": "USD",
        "isin": "US91324P1021",
        "website": "https://www.unitedhealthgroup.com",
        "employees": 440000,
        "founded_year": 1977,
        "description": "UnitedHealth Group is a diversified health care and well-being company.",
        "base_price": 498.0,
        "market_cap_usd": 461_000_000_000,
        "revenue_usd": 371_622_000_000,
        "net_income_usd": 21_897_000_000,
        "roic": 18.9,
        "roe": 28.7,
        "gross_margin": 23.4,
        "net_margin": 5.9,
        "pe_ratio": 21.1,
        "pb_ratio": 6.0,
        "debt_to_equity": 0.78,
        "piotroski": 7,
        "dividend_yield": 1.6,
        "peers": ["CVS", "CI", "HUM"],
    },
}


def _tag(extra: Optional[dict] = None) -> dict:
    """Return standard demo data provenance tags."""
    tags = {
        "is_demo_data": True,
        "source": "MOCK_PROVIDER",
        "data_freshness": "DEMO",
        "retrieved_at": datetime.utcnow().isoformat(),
    }
    if extra:
        tags.update(extra)
    return tags


def _seed(ticker: str) -> int:
    """Deterministic integer seed from ticker string."""
    return int(hashlib.md5(ticker.encode()).hexdigest(), 16) % (2**31)


def _generate_price_series(
    ticker: str,
    start: date,
    end: date,
    interval: str = "1d",
) -> List[dict]:
    """
    Generate a realistic OHLCV price series using a seeded geometric random walk.

    Uses the stock's base_price as the starting level.
    Returns a list of OHLCV bar dicts in ascending date order.
    """
    info = MOCK_STOCKS.get(ticker.upper())
    base = info["base_price"] if info else 1000.0

    rng = np.random.default_rng(_seed(ticker))

    current = start
    delta = timedelta(days=1)
    bars: List[dict] = []

    price = base
    while current <= end:
        if current.weekday() < 5:  # Mon-Fri only
            daily_return = rng.normal(0.0003, 0.015)  # ~7.5% annualised drift
            price *= 1 + daily_return

            open_p = price * rng.uniform(0.995, 1.005)
            high_p = price * rng.uniform(1.002, 1.025)
            low_p = price * rng.uniform(0.975, 0.998)
            volume = rng.integers(500_000, 10_000_000)

            bars.append(
                {
                    "date": current.isoformat(),
                    "open": round(open_p, 2),
                    "high": round(max(open_p, high_p), 2),
                    "low": round(min(open_p, low_p), 2),
                    "close": round(price, 2),
                    "volume": int(volume),
                    "adjusted_close": round(price, 2),
                    **_tag(),
                }
            )
        current += delta

    return bars


# ─────────────────────────────────────────────────────────────────────────────
# Mock Market Data Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockMarketDataProvider(MarketDataProvider):
    """Mock implementation of MarketDataProvider using MOCK_STOCKS universe."""

    async def get_stock_info(self, ticker: str) -> dict:
        t = ticker.upper()
        info = MOCK_STOCKS.get(t)
        if not info:
            return {}
        return {
            "ticker": t,
            "name": info["name"],
            "exchange": info["exchange"],
            "sector": info["sector"],
            "industry": info["industry"],
            "country": info["country"],
            "currency": info["currency"],
            "isin": info.get("isin"),
            "description": info.get("description"),
            "website": info.get("website"),
            "employees": info.get("employees"),
            "founded_year": info.get("founded_year"),
            **_tag(),
        }

    async def search_stocks(self, query: str, limit: int = 10) -> List[dict]:
        q = query.lower()
        results = []
        for ticker, info in MOCK_STOCKS.items():
            if q in ticker.lower() or q in info["name"].lower():
                results.append(
                    {
                        "ticker": ticker,
                        "name": info["name"],
                        "exchange": info["exchange"],
                        "sector": info["sector"],
                        "country": info["country"],
                        "currency": info["currency"],
                        **_tag(),
                    }
                )
        return results[:limit]

    async def get_price(self, ticker: str) -> dict:
        t = ticker.upper()
        info = MOCK_STOCKS.get(t, {})
        base = info.get("base_price", 1000.0)

        rng = np.random.default_rng(_seed(t) + int(datetime.utcnow().timestamp() // 3600))
        chg = rng.normal(0, 0.015)
        price = round(base * (1 + chg), 2)

        return {
            "ticker": t,
            "price": price,
            "open": round(base * rng.uniform(0.99, 1.01), 2),
            "high": round(price * rng.uniform(1.002, 1.018), 2),
            "low": round(price * rng.uniform(0.982, 0.998), 2),
            "volume": int(rng.integers(1_000_000, 15_000_000)),
            "change": round(price - base, 2),
            "change_pct": round(chg * 100, 2),
            "market_cap": info.get("market_cap_cr") or info.get("market_cap_usd"),
            "pe_ratio": info.get("pe_ratio"),
            "week_52_high": round(base * 1.38, 2),
            "week_52_low": round(base * 0.72, 2),
            **_tag(),
        }

    async def get_price_history(
        self,
        ticker: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> List[dict]:
        return _generate_price_series(ticker, start, end, interval)

    async def get_market_overview(self) -> dict:
        indices = [
            {"name": "NIFTY 50", "value": 24680.3, "change": 145.2, "change_pct": 0.59},
            {"name": "SENSEX", "value": 81240.5, "change": 458.3, "change_pct": 0.57},
            {"name": "NIFTY BANK", "value": 52340.6, "change": -120.4, "change_pct": -0.23},
            {"name": "S&P 500", "value": 5420.6, "change": 22.4, "change_pct": 0.41},
            {"name": "NASDAQ", "value": 17480.3, "change": 89.1, "change_pct": 0.51},
            {"name": "DOW JONES", "value": 39250.8, "change": 132.4, "change_pct": 0.34},
        ]
        gainers = [
            {"ticker": "TITAN", "name": "Titan Company", "price": 3540.0, "change": 124.5, "change_pct": 3.64, "volume": 2100000},
            {"ticker": "BAJFINANCE", "name": "Bajaj Finance", "price": 7200.0, "change": 215.0, "change_pct": 3.08, "volume": 890000},
            {"ticker": "NVDA", "name": "NVIDIA Corp", "price": 875.0, "change": 22.5, "change_pct": 2.64, "volume": 45000000},
        ]
        losers = [
            {"ticker": "WIPRO", "name": "Wipro Ltd", "price": 490.0, "change": -14.5, "change_pct": -2.87, "volume": 3200000},
            {"ticker": "TSLA", "name": "Tesla Inc", "price": 248.0, "change": -8.2, "change_pct": -3.20, "volume": 82000000},
            {"ticker": "HEROMOTOCO", "name": "Hero MotoCorp", "price": 5470.0, "change": -98.0, "change_pct": -1.76, "volume": 450000},
        ]
        most_active = [
            {"ticker": "RELIANCE", "name": "Reliance Industries", "price": 2960.0, "change": 24.5, "change_pct": 0.83, "volume": 12000000},
            {"ticker": "AAPL", "name": "Apple Inc", "price": 189.5, "change": 1.8, "change_pct": 0.96, "volume": 78000000},
            {"ticker": "TCS", "name": "TCS", "price": 3850.0, "change": 45.0, "change_pct": 1.18, "volume": 2200000},
        ]
        return {
            "indices": indices,
            "gainers": gainers,
            "losers": losers,
            "most_active": most_active,
            **_tag(),
        }

    async def get_top_movers(self, market: str = "NSE", limit: int = 10) -> dict:
        overview = await self.get_market_overview()
        return {
            "gainers": overview["gainers"][:limit],
            "losers": overview["losers"][:limit],
            "most_active": overview["most_active"][:limit],
            **_tag(),
        }

    async def get_market_breadth(self, market: str = "NSE") -> dict:
        return {
            "market": market,
            "advancing": 1250,
            "declining": 680,
            "unchanged": 50,
            "new_52w_highs": 48,
            "new_52w_lows": 15,
            **_tag(),
        }


# ─────────────────────────────────────────────────────────────────────────────
# Mock Fundamental Data Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockFundamentalDataProvider(FundamentalDataProvider):
    """Returns realistic financial statement data for all mock stocks."""

    def _income_row(
        self, ticker: str, year: int, quarter: Optional[int] = None
    ) -> dict:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        rng = np.random.default_rng(_seed(ticker) + year * 100 + (quarter or 0))

        # Use INR crores for NSE, USD millions for US
        base_rev = info.get("revenue_cr") or (
            (info.get("revenue_usd", 1e9) / 1e7)  # convert to crores approx
        )
        growth = rng.uniform(0.06, 0.22)
        yrs_back = datetime.utcnow().year - year
        rev = base_rev / ((1 + growth) ** yrs_back)
        gm = info.get("gross_margin", 30) / 100
        nm = info.get("net_margin", 10) / 100
        om = max(nm + 0.03, 0.08)
        ebitda_m = om + 0.05

        gross = rev * gm
        ebitda = rev * ebitda_m
        op_inc = rev * om
        net = rev * nm
        shares = rng.uniform(800, 5000)  # millions
        eps = (net * 1e7) / (shares * 1e6)  # approx

        period = "annual" if not quarter else "quarterly"
        return {
            "fiscal_year": year,
            "fiscal_quarter": quarter,
            "period": period,
            "revenue": round(rev, 2),
            "gross_profit": round(gross, 2),
            "operating_income": round(op_inc, 2),
            "ebitda": round(ebitda, 2),
            "net_income": round(net, 2),
            "eps": round(eps, 2),
            "shares_outstanding": round(shares, 2),
            "interest_expense": round(rev * rng.uniform(0.005, 0.02), 2),
            "income_tax": round(net * rng.uniform(0.22, 0.30), 2),
            "depreciation": round(rev * rng.uniform(0.02, 0.06), 2),
            "sga_expense": round(rev * rng.uniform(0.05, 0.15), 2),
            "currency": info.get("currency", "INR"),
            **_tag(),
        }

    def _balance_row(self, ticker: str, year: int) -> dict:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        rng = np.random.default_rng(_seed(ticker) + year * 200)

        rev = (info.get("revenue_cr") or info.get("revenue_usd", 1e9) / 1e7)
        yrs_back = datetime.utcnow().year - year
        growth = rng.uniform(0.06, 0.18)
        rev = rev / ((1 + growth) ** yrs_back)

        total_assets = rev * rng.uniform(0.6, 1.8)
        current_assets = total_assets * rng.uniform(0.35, 0.55)
        cash = current_assets * rng.uniform(0.15, 0.40)
        receivables = current_assets * rng.uniform(0.20, 0.40)
        inventory = current_assets * rng.uniform(0.05, 0.20)
        current_liabilities = current_assets * rng.uniform(0.40, 0.70)
        total_debt = rev * info.get("debt_to_equity", 0.2) * 0.5
        total_liabilities = current_liabilities + total_debt
        equity = total_assets - total_liabilities
        retained = equity * rng.uniform(0.40, 0.80)

        return {
            "fiscal_year": year,
            "period": "annual",
            "cash": round(cash, 2),
            "short_term_investments": round(cash * rng.uniform(0, 0.5), 2),
            "receivables": round(receivables, 2),
            "inventory": round(inventory, 2),
            "current_assets": round(current_assets, 2),
            "total_assets": round(total_assets, 2),
            "current_liabilities": round(current_liabilities, 2),
            "total_liabilities": round(total_liabilities, 2),
            "shareholders_equity": round(max(equity, 1), 2),
            "total_debt": round(total_debt, 2),
            "retained_earnings": round(retained, 2),
            "goodwill": round(total_assets * rng.uniform(0, 0.10), 2),
            "intangible_assets": round(total_assets * rng.uniform(0, 0.08), 2),
            "currency": info.get("currency", "INR"),
            **_tag(),
        }

    def _cashflow_row(self, ticker: str, year: int) -> dict:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        rng = np.random.default_rng(_seed(ticker) + year * 300)

        rev = (info.get("revenue_cr") or info.get("revenue_usd", 1e9) / 1e7)
        yrs_back = datetime.utcnow().year - year
        growth = rng.uniform(0.06, 0.18)
        rev = rev / ((1 + growth) ** yrs_back)

        nm = info.get("net_margin", 10) / 100
        net = rev * nm
        ocf = net * rng.uniform(1.1, 1.5)  # OCF typically higher than net income
        capex = rev * rng.uniform(0.02, 0.08)
        fcf = ocf - capex
        div_paid = rev * (info.get("dividend_yield", 0.5) / 100)
        net_borrowing = (rev - rev / (1 + rng.uniform(-0.05, 0.10)))

        return {
            "fiscal_year": year,
            "period": "annual",
            "operating_cash_flow": round(ocf, 2),
            "capex": round(-capex, 2),  # negative by convention
            "free_cash_flow": round(fcf, 2),
            "dividends_paid": round(-div_paid, 2),
            "net_borrowing": round(net_borrowing, 2),
            "depreciation_amortization": round(rev * rng.uniform(0.02, 0.06), 2),
            "stock_based_compensation": round(net * rng.uniform(0.02, 0.12), 2),
            "currency": info.get("currency", "INR"),
            **_tag(),
        }

    async def get_income_statement(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        current_year = datetime.utcnow().year
        if period == "annual":
            return [self._income_row(ticker, current_year - i) for i in range(limit)]
        else:
            rows = []
            for i in range(limit):
                yr = current_year - (i // 4)
                qtr = 4 - (i % 4)
                rows.append(self._income_row(ticker, yr, qtr))
            return rows

    async def get_balance_sheet(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        current_year = datetime.utcnow().year
        return [self._balance_row(ticker, current_year - i) for i in range(limit)]

    async def get_cash_flow(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        current_year = datetime.utcnow().year
        return [self._cashflow_row(ticker, current_year - i) for i in range(limit)]

    async def get_cash_flow_statement(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        return await self.get_cash_flow(ticker, period, limit)

    async def get_company_profile(self, ticker: str) -> Optional[dict]:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        if not info:
            return None
        return {
            "ticker": ticker.upper(),
            "name": info.get("name"),
            "description": info.get("description"),
            "employees": info.get("employees"),
            "founded_year": info.get("founded_year"),
            "website": info.get("website"),
            **_tag()
        }

    async def get_key_metrics(
        self, ticker: str, period: str = "annual"
    ) -> List[dict]:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        current_year = datetime.utcnow().year
        rows = []
        for i in range(5):
            rng = np.random.default_rng(_seed(ticker) + current_year - i)
            rows.append(
                {
                    "fiscal_year": current_year - i,
                    "pe_ratio": round(info.get("pe_ratio", 20) * rng.uniform(0.8, 1.2), 1),
                    "pb_ratio": round(info.get("pb_ratio", 3) * rng.uniform(0.85, 1.15), 2),
                    "ps_ratio": round(rng.uniform(1.5, 8.0), 2),
                    "ev_ebitda": round(rng.uniform(12, 35), 1),
                    "roe": round(info.get("roe", 15) * rng.uniform(0.85, 1.15), 1),
                    "roa": round(info.get("roic", 10) * 0.6 * rng.uniform(0.85, 1.15), 1),
                    "roic": round(info.get("roic", 12) * rng.uniform(0.85, 1.15), 1),
                    "gross_margin": round(info.get("gross_margin", 30) * rng.uniform(0.93, 1.07), 1),
                    "net_margin": round(info.get("net_margin", 10) * rng.uniform(0.90, 1.10), 1),
                    "debt_to_equity": round(info.get("debt_to_equity", 0.3) * rng.uniform(0.85, 1.15), 2),
                    "current_ratio": round(rng.uniform(1.2, 3.5), 2),
                    "dividend_yield": round(info.get("dividend_yield", 0.5) * rng.uniform(0.9, 1.1), 2),
                    "fcf_yield": round(rng.uniform(2.0, 7.0), 2),
                    **_tag(),
                }
            )
        return rows

    async def get_peers(self, ticker: str) -> List[str]:
        info = MOCK_STOCKS.get(ticker.upper(), {})
        return info.get("peers", [])


# ─────────────────────────────────────────────────────────────────────────────
# Mock News Provider
# ─────────────────────────────────────────────────────────────────────────────
_NEWS_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
    "TCS": [
        {"headline": "TCS reports record quarterly revenue of ₹60,000 Cr, beats estimates", "sentiment_score": 72, "sentiment_label": "positive", "category": "earnings"},
        {"headline": "TCS wins $500M digital transformation deal from European bank", "sentiment_score": 65, "sentiment_label": "positive", "category": "business"},
        {"headline": "TCS announces share buyback of ₹17,000 Cr at premium to market price", "sentiment_score": 80, "sentiment_label": "positive", "category": "corporate_action"},
        {"headline": "TCS headcount falls by 3,000 in Q2 amid demand slowdown in BFSI", "sentiment_score": -35, "sentiment_label": "negative", "category": "business"},
        {"headline": "Analysts upgrade TCS to Buy with target price of ₹4,200", "sentiment_score": 60, "sentiment_label": "positive", "category": "analyst"},
    ],
    "RELIANCE": [
        {"headline": "Reliance Jio crosses 500 million subscribers milestone", "sentiment_score": 70, "sentiment_label": "positive", "category": "business"},
        {"headline": "Reliance Retail to invest ₹75,000 Cr in next 3 years", "sentiment_score": 65, "sentiment_label": "positive", "category": "strategy"},
        {"headline": "Reliance New Energy commissions first solar panel plant in Gujarat", "sentiment_score": 55, "sentiment_label": "positive", "category": "business"},
        {"headline": "RIL Q3 profit misses estimates due to weak O2C margins", "sentiment_score": -25, "sentiment_label": "negative", "category": "earnings"},
        {"headline": "Mukesh Ambani flags high debt levels in new energy ventures", "sentiment_score": -20, "sentiment_label": "negative", "category": "risk"},
    ],
    "AAPL": [
        {"headline": "Apple reports record iPhone 15 sales in India, revenue up 35% YoY", "sentiment_score": 78, "sentiment_label": "positive", "category": "earnings"},
        {"headline": "Apple Vision Pro headset launches to mixed reviews", "sentiment_score": 15, "sentiment_label": "neutral", "category": "product"},
        {"headline": "Apple services revenue surpasses hardware for the first time", "sentiment_score": 72, "sentiment_label": "positive", "category": "earnings"},
        {"headline": "EU slaps Apple with €1.8B fine for App Store anti-competitive practices", "sentiment_score": -55, "sentiment_label": "negative", "category": "regulatory"},
        {"headline": "Apple announces $110B buyback and dividend increase of 4%", "sentiment_score": 82, "sentiment_label": "positive", "category": "corporate_action"},
    ],
    "NVDA": [
        {"headline": "Nvidia Q4 earnings triple expectations as AI chip demand surges", "sentiment_score": 92, "sentiment_label": "positive", "category": "earnings"},
        {"headline": "Nvidia announces Blackwell GPU architecture, 30x faster than Hopper", "sentiment_score": 88, "sentiment_label": "positive", "category": "product"},
        {"headline": "US restricts Nvidia chip exports to China and Middle East", "sentiment_score": -48, "sentiment_label": "negative", "category": "regulatory"},
        {"headline": "Microsoft, Google, Amazon ordering billions in Nvidia H100 GPUs", "sentiment_score": 75, "sentiment_label": "positive", "category": "business"},
        {"headline": "Nvidia stock drops 10% on reports of AMD competitive threat", "sentiment_score": -40, "sentiment_label": "negative", "category": "competition"},
    ],
}

_GENERIC_NEWS = [
    {"headline": "Company reports strong quarterly results, beats earnings estimates", "sentiment_score": 65, "sentiment_label": "positive", "category": "earnings"},
    {"headline": "Stock upgraded to Buy by leading brokerage with 20% upside target", "sentiment_score": 58, "sentiment_label": "positive", "category": "analyst"},
    {"headline": "Company announces strategic partnership to expand in new markets", "sentiment_score": 50, "sentiment_label": "positive", "category": "business"},
    {"headline": "Macro headwinds could pressure margins in near term, analysts warn", "sentiment_score": -30, "sentiment_label": "negative", "category": "macro"},
    {"headline": "Company board approves share buyback programme worth ₹2,000 Cr", "sentiment_score": 60, "sentiment_label": "positive", "category": "corporate_action"},
    {"headline": "Revenue growth moderating as competitive pressure intensifies", "sentiment_score": -22, "sentiment_label": "negative", "category": "business"},
    {"headline": "Management raises full-year earnings guidance above consensus", "sentiment_score": 70, "sentiment_label": "positive", "category": "guidance"},
    {"headline": "Rising input costs squeeze profit margins in latest quarter", "sentiment_score": -35, "sentiment_label": "negative", "category": "earnings"},
    {"headline": "Institutional investors increase stake ahead of results season", "sentiment_score": 40, "sentiment_label": "positive", "category": "institutional"},
    {"headline": "Company debt levels under scrutiny as interest rates remain elevated", "sentiment_score": -28, "sentiment_label": "negative", "category": "risk"},
]


class MockNewsProvider(NewsProvider):
    """Returns realistic news articles tagged as demo data."""

    async def get_stock_news(self, ticker: str, limit: int = 20) -> List[dict]:
        t = ticker.upper()
        specific = _NEWS_TEMPLATES.get(t, [])
        combined = specific + _GENERIC_NEWS
        results = []
        now = datetime.utcnow()

        for i, item in enumerate(combined[:limit]):
            results.append(
                {
                    "headline": item["headline"].replace("Company", MOCK_STOCKS.get(t, {}).get("name", ticker)),
                    "summary": item["headline"],
                    "url": f"https://demo.stockresearch.ai/news/{t.lower()}/{i}",
                    "source_name": ["Economic Times", "MoneyControl", "CNBC", "Bloomberg", "Reuters"][i % 5],
                    "published_at": (now - timedelta(hours=i * 4)).isoformat(),
                    "sentiment_score": item["sentiment_score"],
                    "sentiment_label": item["sentiment_label"],
                    "category": item["category"],
                    "topics": [t, item["category"], "markets"],
                    **_tag(),
                }
            )
        return results

    async def get_market_news(self, category: str = "general", limit: int = 20) -> List[dict]:
        now = datetime.utcnow()
        market_headlines = [
            ("RBI holds repo rate steady at 6.5%, signals data-dependent stance", 10, "neutral", "monetary_policy"),
            ("Nifty 50 hits all-time high of 25,000 on strong FII inflows", 68, "positive", "markets"),
            ("US Fed signals two rate cuts in 2024, global markets rally", 60, "positive", "monetary_policy"),
            ("India GDP grows 7.2% in Q3, beats consensus of 6.8%", 72, "positive", "macro"),
            ("Crude oil falls 4% on demand concerns from China slowdown", -30, "negative", "commodity"),
            ("IT sector faces headwinds as US banking clients cut tech spend", -38, "negative", "sector"),
            ("FII net inflows cross ₹50,000 Cr in March on EM optimism", 55, "positive", "flows"),
            ("Rupee strengthens to 82.5 against USD on positive macro data", 25, "positive", "currency"),
            ("Global inflation easing faster than expected, rate-cut hopes rise", 48, "positive", "macro"),
            ("China exports fall sharply, raising global recession concerns", -42, "negative", "global"),
        ]
        results = []
        for i, (headline, score, label, cat) in enumerate(market_headlines[:limit]):
            results.append(
                {
                    "headline": headline,
                    "summary": headline,
                    "url": f"https://demo.stockresearch.ai/market-news/{i}",
                    "source_name": ["Bloomberg", "Reuters", "Economic Times", "CNBC", "Mint"][i % 5],
                    "published_at": (now - timedelta(hours=i * 2)).isoformat(),
                    "sentiment_score": score,
                    "sentiment_label": label,
                    "category": cat,
                    "topics": ["market", cat],
                    **_tag(),
                }
            )
        return results


# ─────────────────────────────────────────────────────────────────────────────
# Mock Economic Data Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockEconomicDataProvider(EconomicDataProvider):

    async def get_economic_calendar(
        self,
        start: date,
        end: date,
        country: Optional[str] = None,
    ) -> List[dict]:
        now = datetime.utcnow()
        events = [
            {
                "name": "India CPI Inflation",
                "country": "India",
                "category": "Inflation",
                "event_date": (now + timedelta(days=3)).isoformat(),
                "previous_value": 5.08,
                "forecast_value": 4.95,
                "actual_value": None,
                "unit": "%",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "India GDP Growth Rate",
                "country": "India",
                "category": "GDP",
                "event_date": (now + timedelta(days=10)).isoformat(),
                "previous_value": 7.2,
                "forecast_value": 7.0,
                "actual_value": None,
                "unit": "%",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "US Federal Reserve Rate Decision",
                "country": "United States",
                "category": "Monetary Policy",
                "event_date": (now + timedelta(days=15)).isoformat(),
                "previous_value": 5.25,
                "forecast_value": 5.25,
                "actual_value": None,
                "unit": "%",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "US Non-Farm Payrolls",
                "country": "United States",
                "category": "Employment",
                "event_date": (now + timedelta(days=7)).isoformat(),
                "previous_value": 275_000,
                "forecast_value": 190_000,
                "actual_value": None,
                "unit": "thousands",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "India Manufacturing PMI",
                "country": "India",
                "category": "Business Activity",
                "event_date": (now + timedelta(days=1)).isoformat(),
                "previous_value": 56.5,
                "forecast_value": 57.0,
                "actual_value": 57.5,
                "unit": "index",
                "impact_level": "medium",
                **_tag(),
            },
            {
                "name": "US CPI Inflation",
                "country": "United States",
                "category": "Inflation",
                "event_date": (now + timedelta(days=12)).isoformat(),
                "previous_value": 3.2,
                "forecast_value": 3.1,
                "actual_value": None,
                "unit": "%",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "RBI Monetary Policy Meeting",
                "country": "India",
                "category": "Monetary Policy",
                "event_date": (now + timedelta(days=20)).isoformat(),
                "previous_value": 6.5,
                "forecast_value": 6.5,
                "actual_value": None,
                "unit": "%",
                "impact_level": "high",
                **_tag(),
            },
            {
                "name": "India Trade Balance",
                "country": "India",
                "category": "Trade",
                "event_date": (now + timedelta(days=5)).isoformat(),
                "previous_value": -19.8,
                "forecast_value": -18.5,
                "actual_value": None,
                "unit": "USD Billion",
                "impact_level": "medium",
                **_tag(),
            },
        ]
        if country:
            events = [e for e in events if e["country"].lower() == country.lower()]
        return events

    async def get_indicator(self, indicator: str, limit: int = 12) -> List[dict]:
        now = datetime.utcnow()
        values = {
            "gdp_growth": [7.2, 6.8, 7.6, 6.1, 8.2, 7.0, 6.3, 5.8, 6.6, 7.1, 7.4, 8.0],
            "inflation": [5.1, 5.4, 4.8, 5.0, 4.7, 5.3, 6.1, 5.9, 6.4, 7.0, 6.8, 5.2],
            "repo_rate": [6.5, 6.5, 6.5, 6.5, 6.5, 6.25, 6.25, 6.25, 6.0, 5.9, 5.75, 5.4],
            "fed_rate": [5.25, 5.25, 5.0, 5.0, 4.75, 4.5, 4.0, 3.75, 3.25, 2.5, 2.0, 1.75],
        }
        data = values.get(indicator.lower(), [5.0] * 12)
        results = []
        for i, val in enumerate(data[:limit]):
            results.append(
                {
                    "date": (now - timedelta(days=30 * i)).date().isoformat(),
                    "value": val,
                    "unit": "%",
                    "country": "India" if "repo" in indicator.lower() else "Global",
                    **_tag(),
                }
            )
        return results


# ─────────────────────────────────────────────────────────────────────────────
# Mock Earnings Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockEarningsProvider(EarningsProvider):

    async def get_earnings_history(self, ticker: str, limit: int = 8) -> List[dict]:
        t = ticker.upper()
        info = MOCK_STOCKS.get(t, {})
        results = []
        now = datetime.utcnow()

        for i in range(limit):
            rng = np.random.default_rng(_seed(t) + i * 1000)
            quarter = 4 - (i % 4)
            year = now.year - (i // 4)
            eps_est = round(rng.uniform(20, 100), 2)
            surprise = rng.uniform(-0.10, 0.12)
            eps_act = round(eps_est * (1 + surprise), 2)
            rev_est = round(rng.uniform(50_000, 200_000), 2)
            rev_surprise = rng.uniform(-0.05, 0.08)
            rev_act = round(rev_est * (1 + rev_surprise), 2)

            results.append(
                {
                    "earnings_date": (now - timedelta(days=90 * i)).date().isoformat(),
                    "period": "quarterly",
                    "fiscal_year": year,
                    "fiscal_quarter": quarter,
                    "eps_actual": eps_act,
                    "eps_estimate": eps_est,
                    "eps_surprise_pct": round(surprise * 100, 2),
                    "revenue_actual": rev_act,
                    "revenue_estimate": rev_est,
                    "revenue_surprise_pct": round(rev_surprise * 100, 2),
                    "guidance_text": "Management reiterated full-year guidance" if rng.random() > 0.4 else "Company raised guidance for next quarter",
                    "analyst_revisions": {"upgrades": int(rng.integers(2, 8)), "downgrades": int(rng.integers(0, 3))},
                    **_tag(),
                }
            )
        return results

    async def get_earnings_calendar(self, start: date, end: date) -> List[dict]:
        now = datetime.utcnow()
        upcoming = []
        for i, (ticker, info) in enumerate(list(MOCK_STOCKS.items())[:15]):
            days_offset = (i * 3) % 30
            earnings_dt = now + timedelta(days=days_offset)
            if start <= earnings_dt.date() <= end:
                rng = np.random.default_rng(_seed(ticker) + int(earnings_dt.timestamp()))
                upcoming.append(
                    {
                        "ticker": ticker,
                        "name": info["name"],
                        "earnings_date": earnings_dt.date().isoformat(),
                        "eps_estimate": round(rng.uniform(15, 80), 2),
                        **_tag(),
                    }
                )
        return upcoming


# ─────────────────────────────────────────────────────────────────────────────
# Mock Dividend Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockDividendProvider(DividendProvider):

    async def get_dividend_history(self, ticker: str, limit: int = 20) -> List[dict]:
        t = ticker.upper()
        info = MOCK_STOCKS.get(t, {})
        dy = info.get("dividend_yield", 0)
        if dy == 0:
            return []

        base_price = info.get("base_price", 1000)
        annual_div = base_price * dy / 100
        results = []
        now = datetime.utcnow()

        for i in range(min(limit, 8)):
            rng = np.random.default_rng(_seed(t) + i * 500)
            ex = now - timedelta(days=365 * i + 15)
            pay = ex + timedelta(days=30)
            amount = round(annual_div * rng.uniform(0.90, 1.10), 2)
            results.append(
                {
                    "ex_date": ex.date().isoformat(),
                    "pay_date": pay.date().isoformat(),
                    "amount": amount,
                    "frequency": "annual",
                    "dividend_yield": round(dy * rng.uniform(0.9, 1.1), 2),
                    "payout_ratio": round(rng.uniform(20, 50), 1),
                    "fcf_coverage": round(rng.uniform(1.5, 4.0), 2),
                    **_tag(),
                }
            )
        return results

    async def get_dividend_calendar(self, start: date, end: date) -> List[dict]:
        now = datetime.utcnow()
        results = []
        for ticker, info in MOCK_STOCKS.items():
            if info.get("dividend_yield", 0) > 0:
                ex = now + timedelta(days=len(ticker) % 30)
                if start <= ex.date() <= end:
                    results.append(
                        {
                            "ticker": ticker,
                            "name": info["name"],
                            "ex_date": ex.date().isoformat(),
                            "pay_date": (ex + timedelta(days=30)).date().isoformat(),
                            "amount": round(info["base_price"] * info["dividend_yield"] / 100, 2),
                            **_tag(),
                        }
                    )
        return results


# ─────────────────────────────────────────────────────────────────────────────
# Mock Analyst Data Provider
# ─────────────────────────────────────────────────────────────────────────────
class MockAnalystDataProvider(AnalystDataProvider):

    _FIRMS = ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Kotak Securities",
              "Motilal Oswal", "HDFC Securities", "UBS", "Citigroup"]
    _RATINGS = ["Strong Buy", "Buy", "Neutral", "Sell"]

    async def get_analyst_estimates(self, ticker: str) -> List[dict]:
        t = ticker.upper()
        info = MOCK_STOCKS.get(t, {})
        base_price = info.get("base_price", 1000)
        results = []
        now = datetime.utcnow()

        for i, firm in enumerate(self._FIRMS):
            rng = np.random.default_rng(_seed(t) + i * 77)
            target = round(base_price * rng.uniform(0.85, 1.35), 0)
            rating_idx = int(rng.integers(0, 4))
            results.append(
                {
                    "analyst_name": f"Analyst {chr(65 + i)}",
                    "firm_name": firm,
                    "rating": self._RATINGS[rating_idx],
                    "target_price": target,
                    "previous_target": round(target * rng.uniform(0.90, 1.08), 0),
                    "date": (now - timedelta(days=int(rng.integers(1, 60)))).date().isoformat(),
                    **_tag(),
                }
            )
        return results

    async def get_price_targets(self, ticker: str) -> dict:
        estimates = await self.get_analyst_estimates(ticker)
        targets = [e["target_price"] for e in estimates]
        ratings = [e["rating"] for e in estimates]
        buy_count = sum(1 for r in ratings if "Buy" in r)
        neutral_count = sum(1 for r in ratings if r == "Neutral")
        sell_count = sum(1 for r in ratings if r == "Sell")

        if buy_count > neutral_count and buy_count > sell_count:
            consensus = "Buy"
        elif sell_count > neutral_count and sell_count > buy_count:
            consensus = "Sell"
        else:
            consensus = "Neutral"

        return {
            "consensus_rating": consensus,
            "consensus_target": round(sum(targets) / len(targets), 2),
            "high_target": max(targets),
            "low_target": min(targets),
            "num_analysts": len(estimates),
            **_tag(),
        }

    async def get_consensus_estimates(self, ticker: str) -> Optional[dict]:
        targets = await self.get_price_targets(ticker)
        return {
            "ticker": ticker.upper(),
            "consensus_eps": 45.0,
            "consensus_revenue": 100000,
            "num_analysts": targets["num_analysts"],
            **_tag()
        }


# ─────────────────────────────────────────────────────────────────────────────
# Convenience: unified mock provider bundle
# ─────────────────────────────────────────────────────────────────────────────
class MockProviderBundle:
    """Single entry-point exposing all mock providers."""

    market = MockMarketDataProvider()
    fundamentals = MockFundamentalDataProvider()
    news = MockNewsProvider()
    economic = MockEconomicDataProvider()
    earnings = MockEarningsProvider()
    dividends = MockDividendProvider()
    analysts = MockAnalystDataProvider()


mock_bundle = MockProviderBundle()
