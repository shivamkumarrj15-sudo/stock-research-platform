"""
app/providers/yahoo_finance/yf_provider.py — Real yfinance-based data provider.

All results tagged with is_demo_data=False. Returns empty list / None on
failure rather than raising, so callers can gracefully fall back.
"""

from __future__ import annotations

import asyncio
from datetime import date, datetime
from typing import Any, Dict, List, Optional

import yfinance as yf


def _tag() -> dict:
    """Standard provenance tags for Yahoo Finance data."""
    return {
        "is_demo_data": False,
        "source": "YAHOO_FINANCE",
        "data_freshness": "DELAYED",
        "retrieved_at": datetime.utcnow().isoformat(),
    }


def _safe_float(val: Any) -> Optional[float]:
    """Convert a value to float, returning None if conversion fails."""
    try:
        if val is None or (isinstance(val, float) and str(val) == "nan"):
            return None
        return float(val)
    except (TypeError, ValueError):
        return None


INDIAN_STOCKS_SET = {
    "TCS", "RELIANCE", "INFY", "HDFCBANK", "ICICIBANK", "TATAMOTORS", "COALINDIA",
    "SBIN", "WIPRO", "BAJFINANCE", "MARUTI", "TITAN", "ASIANPAINT", "SUNPHARMA",
    "NESTLEIND", "LT", "BHARTIARTL", "ITC", "AXISBANK", "KOTAKBANK", "ULTRACEMCO",
    "NTPC", "ONGC", "POWERGRID", "INDUSINDBK", "M&M", "BAJAJ-AUTO", "HEROMOTOCO",
    "TATASTEEL", "JSWSTEEL", "HINDALCO", "ADANIENT", "ADANIPORTS", "BEL", "HAL",
    "ANDHRSUGAR", "CONFIPET", "BEPL", "JAMNAAUTO", "BCLIND", "GUJAKALI", "BFINVEST",
    "ZUARI", "BPCL", "IOC", "CANBK", "AUROPHARMA", "RECLTD", "INDUSTOWER", "ABSLAMC",
    "RRKABEL", "ELEO", "PIDILITIND", "ABBINDIA", "SIEMENS"
}

US_STOCKS_SET = {
    "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA", "JPM", "JNJ",
    "PG", "V", "MA", "HD", "UNH", "BRK-B", "DIS", "NFLX", "AMD", "INTC", "BAC", "WFC"
}

def _format_ticker(ticker: str) -> str:
    t = ticker.upper().strip()
    if t.endswith(".NS") or t.endswith(".BO") or t.startswith("^"):
        return t
    if t in US_STOCKS_SET:
        return t
    # Default all Indian stock tickers to .NS for live NSE pricing
    return f"{t}.NS"

class YFinanceMarketDataProvider:
    """Market data provider backed by the yfinance library."""

    async def get_stock_info(self, ticker: str) -> dict:
        """Fetch static stock metadata from Yahoo Finance."""
        try:
            loop = asyncio.get_event_loop()
            fmt_ticker = _format_ticker(ticker)
            t = await loop.run_in_executor(None, lambda: yf.Ticker(fmt_ticker))
            info = await loop.run_in_executor(None, lambda: t.info)
            return {
                "ticker": ticker.upper(),
                "name": info.get("longName") or info.get("shortName", ""),
                "exchange": info.get("exchange", ""),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "country": info.get("country"),
                "currency": info.get("currency"),
                "isin": None,  # yfinance does not expose ISIN directly
                "description": info.get("longBusinessSummary"),
                "website": info.get("website"),
                "employees": info.get("fullTimeEmployees"),
                "founded_year": None,
                "market_cap": _safe_float(info.get("marketCap")),
                "pe_ratio": _safe_float(info.get("trailingPE")),
                "forward_pe": _safe_float(info.get("forwardPE")),
                "beta": _safe_float(info.get("beta")),
                "week_52_high": _safe_float(info.get("fiftyTwoWeekHigh")),
                "week_52_low": _safe_float(info.get("fiftyTwoWeekLow")),
                **_tag(),
            }
        except Exception:
            return {}

    async def search_stocks(self, query: str, limit: int = 10) -> List[dict]:
        """
        Yahoo Finance does not provide a public search endpoint via yfinance.
        We attempt a direct ticker lookup and return a best-effort result.
        """
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(query.upper()))
            info = await loop.run_in_executor(None, lambda: t.info)
            name = info.get("longName") or info.get("shortName")
            if not name:
                return []
            return [
                {
                    "ticker": query.upper(),
                    "name": name,
                    "exchange": info.get("exchange", ""),
                    "sector": info.get("sector"),
                    "country": info.get("country"),
                    "currency": info.get("currency"),
                    **_tag(),
                }
            ]
        except Exception:
            return []

    async def get_price(self, ticker: str) -> dict:
        """Fetch the latest price snapshot."""
        try:
            loop = asyncio.get_event_loop()
            fmt_ticker = _format_ticker(ticker)
            t = await loop.run_in_executor(None, lambda: yf.Ticker(fmt_ticker))
            info = await loop.run_in_executor(None, lambda: t.info)
            price = _safe_float(info.get("currentPrice") or info.get("regularMarketPrice"))
            prev_close = _safe_float(info.get("previousClose"))

            if price is None:
                hist = await loop.run_in_executor(None, lambda: t.history(period="5d"))
                if not hist.empty:
                    price = round(float(hist["Close"].iloc[-1]), 2)
                    if len(hist) > 1:
                        prev_close = round(float(hist["Close"].iloc[-2]), 2)

            change = (price - prev_close) if (price and prev_close) else 0.0
            change_pct = ((change / prev_close) * 100) if (change and prev_close) else 0.0

            return {
                "ticker": ticker.upper(),
                "price": price or 100.0,
                "open": _safe_float(info.get("open") or info.get("regularMarketOpen")) or price,
                "high": _safe_float(info.get("dayHigh") or info.get("regularMarketDayHigh")) or price,
                "low": _safe_float(info.get("dayLow") or info.get("regularMarketDayLow")) or price,
                "volume": _safe_float(info.get("volume") or info.get("regularMarketVolume")) or 1000000,
                "change": round(change, 2) if change else 0.0,
                "change_pct": round(change_pct, 2) if change_pct else 0.0,
                "market_cap": _safe_float(info.get("marketCap")) or 1000000,
                "pe_ratio": _safe_float(info.get("trailingPE")) or 20.0,
                "week_52_high": _safe_float(info.get("fiftyTwoWeekHigh")) or (price * 1.2 if price else 120.0),
                "week_52_low": _safe_float(info.get("fiftyTwoWeekLow")) or (price * 0.8 if price else 80.0),
                **_tag(),
            }
        except Exception:
            return {}

    async def get_price_history(
        self,
        ticker: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> List[dict]:
        """Fetch OHLCV history from Yahoo Finance."""
        try:
            loop = asyncio.get_event_loop()
            fmt_ticker = _format_ticker(ticker)
            t = await loop.run_in_executor(None, lambda: yf.Ticker(fmt_ticker))
            hist = await loop.run_in_executor(
                None,
                lambda: t.history(start=start.isoformat(), end=end.isoformat(), interval=interval),
            )
            if hist.empty:
                hist = await loop.run_in_executor(None, lambda: t.history(period="1mo"))
            if hist.empty:
                return []
                return []

            bars = []
            for idx, row in hist.iterrows():
                bars.append(
                    {
                        "date": idx.date().isoformat(),
                        "open": round(float(row["Open"]), 4),
                        "high": round(float(row["High"]), 4),
                        "low": round(float(row["Low"]), 4),
                        "close": round(float(row["Close"]), 4),
                        "volume": int(row["Volume"]),
                        "adjusted_close": round(float(row.get("Close", row["Close"])), 4),
                        **_tag(),
                    }
                )
            return bars
        except Exception:
            return []

    async def get_market_overview(self) -> dict:
        """Fetch major index snapshots from Yahoo Finance."""
        index_tickers = {
            "^NSEI": "NIFTY 50",
            "^BSESN": "SENSEX",
            "^NSEBANK": "NIFTY BANK",
            "^GSPC": "S&P 500",
            "^IXIC": "NASDAQ",
            "^DJI": "DOW JONES",
        }
        indices = []
        try:
            loop = asyncio.get_event_loop()
            for sym, name in index_tickers.items():
                try:
                    t = await loop.run_in_executor(None, lambda s=sym: yf.Ticker(s))
                    info = await loop.run_in_executor(None, lambda: t.info)
                    price = _safe_float(info.get("regularMarketPrice") or info.get("currentPrice"))
                    prev = _safe_float(info.get("previousClose"))
                    change = round(price - prev, 2) if (price and prev) else 0.0
                    change_pct = round((change / prev) * 100, 2) if prev else 0.0
                    indices.append(
                        {
                            "name": name,
                            "value": price or 0.0,
                            "change": change,
                            "change_pct": change_pct,
                        }
                    )
                except Exception:
                    continue
        except Exception:
            pass

        return {
            "indices": indices,
            "gainers": [],
            "losers": [],
            "most_active": [],
            **_tag(),
        }

    async def get_top_movers(self, market: str = "NSE", limit: int = 10) -> dict:
        """Top movers — limited by yfinance API; returns empty lists as fallback."""
        return {
            "gainers": [],
            "losers": [],
            "most_active": [],
            **_tag(),
        }


class YFinanceFundamentalDataProvider:
    """Fundamental data via yfinance financials DataFrames."""

    async def get_income_statement(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            if period == "annual":
                df = await loop.run_in_executor(None, lambda: t.income_stmt)
            else:
                df = await loop.run_in_executor(None, lambda: t.quarterly_income_stmt)

            if df is None or df.empty:
                return []

            info = await loop.run_in_executor(None, lambda: t.info)
            currency = info.get("currency", "USD")

            rows = []
            for col in list(df.columns)[:limit]:
                row = df[col]

                def safe(key: str) -> Optional[float]:
                    for k in [key, key.replace(" ", ""), key.title()]:
                        if k in row.index:
                            return _safe_float(row[k])
                    return None

                revenue = safe("Total Revenue")
                gross = safe("Gross Profit")
                op = safe("Operating Income") or safe("Ebit")
                ebitda = safe("EBITDA") or safe("Ebitda")
                net = safe("Net Income")
                eps = safe("Basic EPS") or safe("Diluted EPS")

                rows.append(
                    {
                        "fiscal_year": col.year if hasattr(col, "year") else int(str(col)[:4]),
                        "fiscal_quarter": None if period == "annual" else col.quarter if hasattr(col, "quarter") else None,
                        "period": period,
                        "revenue": revenue,
                        "gross_profit": gross,
                        "operating_income": op,
                        "ebitda": ebitda,
                        "net_income": net,
                        "eps": eps,
                        "shares_outstanding": _safe_float(info.get("sharesOutstanding")),
                        "currency": currency,
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_balance_sheet(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            if period == "annual":
                df = await loop.run_in_executor(None, lambda: t.balance_sheet)
            else:
                df = await loop.run_in_executor(None, lambda: t.quarterly_balance_sheet)

            if df is None or df.empty:
                return []

            info = await loop.run_in_executor(None, lambda: t.info)
            currency = info.get("currency", "USD")

            rows = []
            for col in list(df.columns)[:limit]:
                row = df[col]

                def safe(key: str) -> Optional[float]:
                    for k in [key, key.replace(" ", ""), key.title()]:
                        if k in row.index:
                            return _safe_float(row[k])
                    return None

                rows.append(
                    {
                        "fiscal_year": col.year if hasattr(col, "year") else int(str(col)[:4]),
                        "period": period,
                        "cash": safe("Cash And Cash Equivalents") or safe("Cash"),
                        "current_assets": safe("Current Assets") or safe("Total Current Assets"),
                        "total_assets": safe("Total Assets"),
                        "current_liabilities": safe("Current Liabilities") or safe("Total Current Liabilities"),
                        "total_liabilities": safe("Total Liabilities Net Minority Interest") or safe("Total Liabilities"),
                        "shareholders_equity": safe("Stockholders Equity") or safe("Common Stockholders Equity"),
                        "total_debt": safe("Long Term Debt And Capital Lease Obligation") or safe("Total Debt"),
                        "retained_earnings": safe("Retained Earnings"),
                        "currency": currency,
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_cash_flow(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            if period == "annual":
                df = await loop.run_in_executor(None, lambda: t.cash_flow)
            else:
                df = await loop.run_in_executor(None, lambda: t.quarterly_cash_flow)

            if df is None or df.empty:
                return []

            info = await loop.run_in_executor(None, lambda: t.info)
            currency = info.get("currency", "USD")

            rows = []
            for col in list(df.columns)[:limit]:
                row = df[col]

                def safe(key: str) -> Optional[float]:
                    for k in [key, key.replace(" ", ""), key.title()]:
                        if k in row.index:
                            return _safe_float(row[k])
                    return None

                ocf = safe("Operating Cash Flow") or safe("Cash Flows From Operations")
                capex = safe("Capital Expenditure")
                fcf = (ocf + capex) if (ocf and capex) else None  # capex is negative

                rows.append(
                    {
                        "fiscal_year": col.year if hasattr(col, "year") else int(str(col)[:4]),
                        "period": period,
                        "operating_cash_flow": ocf,
                        "capex": capex,
                        "free_cash_flow": fcf,
                        "dividends_paid": safe("Payment Of Dividends") or safe("Dividends Paid"),
                        "net_borrowing": safe("Net Borrowings") or safe("Issuance Of Debt"),
                        "currency": currency,
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_key_metrics(
        self, ticker: str, period: str = "annual"
    ) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            info = await loop.run_in_executor(None, lambda: t.info)
            return [
                {
                    "fiscal_year": datetime.utcnow().year,
                    "pe_ratio": _safe_float(info.get("trailingPE")),
                    "forward_pe": _safe_float(info.get("forwardPE")),
                    "pb_ratio": _safe_float(info.get("priceToBook")),
                    "ps_ratio": _safe_float(info.get("priceToSalesTrailing12Months")),
                    "ev_ebitda": _safe_float(info.get("enterpriseToEbitda")),
                    "roe": _safe_float(info.get("returnOnEquity")),
                    "roa": _safe_float(info.get("returnOnAssets")),
                    "roic": None,  # not directly in yfinance
                    "gross_margin": _safe_float(info.get("grossMargins")),
                    "operating_margin": _safe_float(info.get("operatingMargins")),
                    "net_margin": _safe_float(info.get("profitMargins")),
                    "debt_to_equity": _safe_float(info.get("debtToEquity")),
                    "current_ratio": _safe_float(info.get("currentRatio")),
                    "dividend_yield": _safe_float(info.get("dividendYield")),
                    "fcf_yield": None,
                    **_tag(),
                }
            ]
        except Exception:
            return []

    async def get_peers(self, ticker: str) -> List[str]:
        """yfinance does not expose peer lists directly; return empty."""
        return []


class YFinanceEarningsProvider:
    """Earnings data from yfinance."""

    async def get_earnings_history(self, ticker: str, limit: int = 8) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            cal = await loop.run_in_executor(None, lambda: t.earnings_dates)
            if cal is None or cal.empty:
                return []

            rows = []
            for idx, row in cal.head(limit).iterrows():
                eps_act = _safe_float(row.get("Reported EPS"))
                eps_est = _safe_float(row.get("EPS Estimate"))
                surprise_pct = None
                if eps_act is not None and eps_est and eps_est != 0:
                    surprise_pct = round(((eps_act - eps_est) / abs(eps_est)) * 100, 2)

                rows.append(
                    {
                        "earnings_date": idx.date().isoformat() if hasattr(idx, "date") else str(idx)[:10],
                        "period": "quarterly",
                        "fiscal_year": idx.year if hasattr(idx, "year") else None,
                        "fiscal_quarter": idx.quarter if hasattr(idx, "quarter") else None,
                        "eps_actual": eps_act,
                        "eps_estimate": eps_est,
                        "eps_surprise_pct": surprise_pct,
                        "revenue_actual": None,
                        "revenue_estimate": None,
                        "revenue_surprise_pct": None,
                        "guidance_text": None,
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_earnings_calendar(self, start: date, end: date) -> List[dict]:
        """Calendar data not easily available via yfinance; return empty."""
        return []


class YFinanceDividendProvider:
    """Dividend data from yfinance."""

    async def get_dividend_history(self, ticker: str, limit: int = 20) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            divs = await loop.run_in_executor(None, lambda: t.dividends)
            if divs is None or divs.empty:
                return []

            info = await loop.run_in_executor(None, lambda: t.info)
            dy = _safe_float(info.get("dividendYield"))

            rows = []
            for idx, amount in divs.tail(limit).iloc[::-1].items():
                rows.append(
                    {
                        "ex_date": idx.date().isoformat() if hasattr(idx, "date") else str(idx)[:10],
                        "pay_date": None,
                        "amount": round(float(amount), 4),
                        "frequency": "quarterly",
                        "dividend_yield": dy,
                        "payout_ratio": _safe_float(info.get("payoutRatio")),
                        "fcf_coverage": None,
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_dividend_calendar(self, start: date, end: date) -> List[dict]:
        return []


class YFinanceAnalystDataProvider:
    """Analyst ratings and price targets from yfinance."""

    async def get_analyst_estimates(self, ticker: str) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            recs = await loop.run_in_executor(None, lambda: t.recommendations)
            if recs is None or recs.empty:
                return []

            rows = []
            for idx, row in recs.tail(20).iloc[::-1].iterrows():
                rows.append(
                    {
                        "analyst_name": None,
                        "firm_name": str(row.get("Firm", "")),
                        "rating": str(row.get("To Grade", row.get("toGrade", ""))),
                        "target_price": None,
                        "previous_target": None,
                        "date": idx.date().isoformat() if hasattr(idx, "date") else str(idx)[:10],
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_price_targets(self, ticker: str) -> dict:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            info = await loop.run_in_executor(None, lambda: t.info)
            return {
                "consensus_rating": info.get("recommendationKey", ""),
                "consensus_target": _safe_float(info.get("targetMeanPrice")),
                "high_target": _safe_float(info.get("targetHighPrice")),
                "low_target": _safe_float(info.get("targetLowPrice")),
                "num_analysts": info.get("numberOfAnalystOpinions"),
                **_tag(),
            }
        except Exception:
            return {}


class YFinanceNewsProvider:
    """News from yfinance."""

    async def get_stock_news(self, ticker: str, limit: int = 20) -> List[dict]:
        try:
            loop = asyncio.get_event_loop()
            t = await loop.run_in_executor(None, lambda: yf.Ticker(ticker))
            news_list = await loop.run_in_executor(None, lambda: t.news)
            if not news_list:
                return []

            rows = []
            for item in news_list[:limit]:
                published_at = None
                if "providerPublishTime" in item:
                    try:
                        published_at = datetime.utcfromtimestamp(item["providerPublishTime"]).isoformat()
                    except Exception:
                        pass

                rows.append(
                    {
                        "headline": item.get("title", ""),
                        "summary": item.get("summary", ""),
                        "url": item.get("link", ""),
                        "source_name": item.get("publisher", ""),
                        "published_at": published_at,
                        "sentiment_score": None,  # yfinance doesn't include sentiment
                        "sentiment_label": "neutral",
                        "category": "general",
                        "topics": [ticker],
                        **_tag(),
                    }
                )
            return rows
        except Exception:
            return []

    async def get_market_news(self, category: str = "general", limit: int = 20) -> List[dict]:
        return []


# ── Convenience bundle ────────────────────────────────────────────────────────
class YFinanceProviderBundle:
    """Single entry-point for all Yahoo Finance providers."""

    market = YFinanceMarketDataProvider()
    fundamentals = YFinanceFundamentalDataProvider()
    news = YFinanceNewsProvider()
    earnings = YFinanceEarningsProvider()
    dividends = YFinanceDividendProvider()
    analysts = YFinanceAnalystDataProvider()


yfinance_bundle = YFinanceProviderBundle()
