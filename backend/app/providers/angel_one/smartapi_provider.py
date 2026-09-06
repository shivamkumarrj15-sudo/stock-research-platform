"""
Angel One SmartAPI Provider Implementation.
Uses Angel One SmartAPI (https://apiconnect.angelbroking.com) to fetch real-time NSE/BSE market prices, OHLC history, and stock quotes.
API Key: kHrodFlM
"""

import httpx
import logging
from datetime import date, datetime, timedelta
from typing import Optional, List, Dict, Any

from app.providers.base import MarketDataProvider
from app.providers.yahoo_finance.yf_provider import YFinanceMarketDataProvider

logger = logging.getLogger(__name__)

ANGEL_API_BASE = "https://apiconnect.angelbroking.com"


class AngelOneMarketDataProvider(MarketDataProvider):
    """
    Market Data Provider powered by Angel One SmartAPI.
    Uses API Key: kHrodFlM.
    Falls back to Yahoo Finance provider for tickers not mapped in SmartAPI.
    """

    def __init__(self, api_key: str = "kHrodFlM", client_code: str = "", jwt_token: str = ""):
        self.api_key = api_key or "kHrodFlM"
        self.client_code = client_code
        self.jwt_token = jwt_token
        self.fallback_provider = YFinanceMarketDataProvider()
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-PrivateKey": self.api_key,
            "X-UserType": "USER",
            "X-SourceID": "WEB",
            "X-ClientLocalIP": "110.226.165.61",
            "X-ClientPublicIP": "110.226.165.61",
            "X-MACAddress": "fe80::1",
        }
        if self.jwt_token:
            self.headers["Authorization"] = f"Bearer {self.jwt_token}"

    def _clean_ticker(self, ticker: str) -> str:
        """Strips .NS / .BO suffix for Angel One search (e.g. TCS.NS -> TCS)"""
        return ticker.replace(".NS", "").replace(".BO", "").upper()

    async def get_price(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Get current live price from Angel One SmartAPI or fallback."""
        clean_symbol = self._clean_ticker(ticker)
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                url = f"{ANGEL_API_BASE}/rest/secure/angelbroking/order/v1/searchScrip"
                payload = {"exchange": "NSE", "searchstring": clean_symbol}
                res = await client.post(url, json=payload, headers=self.headers)
                
                if res.status_code == 200:
                    data = res.json()
                    if data.get("status") and data.get("data"):
                        items = data["data"]
                        matched = next((item for item in items if item.get("symbol") == f"{clean_symbol}-EQ"), items[0])
                        
                        symbol_token = matched.get("token")
                        trading_symbol = matched.get("tradingsymbol")
                        
                        # Get Quote
                        quote_url = f"{ANGEL_API_BASE}/rest/secure/angelbroking/market/v1/quote/"
                        quote_payload = {"mode": "FULL", "exchangeTokens": {"NSE": [symbol_token]}}
                        quote_res = await client.post(quote_url, json=quote_payload, headers=self.headers)
                        
                        if quote_res.status_code == 200:
                            q_data = quote_res.json()
                            if q_data.get("status") and q_data.get("data"):
                                fetched_quote = q_data["data"]["fetched"][0]
                                ltp = float(fetched_quote.get("ltp", 0))
                                close = float(fetched_quote.get("close", ltp))
                                change = round(ltp - close, 2)
                                change_pct = round((change / close * 100) if close else 0, 2)
                                
                                meta = self.make_metadata(
                                    source="ANGEL_ONE_SMARTAPI",
                                    is_demo=False,
                                    freshness="REAL_TIME",
                                    currency="INR",
                                )
                                return {
                                    "ticker": ticker.upper(),
                                    "name": trading_symbol.replace("-EQ", ""),
                                    "price": ltp,
                                    "open": float(fetched_quote.get("open", ltp)),
                                    "high": float(fetched_quote.get("high", ltp)),
                                    "low": float(fetched_quote.get("low", ltp)),
                                    "close": close,
                                    "volume": int(fetched_quote.get("tradeVolume", 0)),
                                    "change": change,
                                    "change_pct": change_pct,
                                    "market_cap": 0,
                                    "week_52_high": float(fetched_quote.get("high52", ltp)),
                                    "week_52_low": float(fetched_quote.get("low52", ltp)),
                                    "exchange": "NSE",
                                    "updated_at": datetime.utcnow().isoformat(),
                                    **meta,
                                }
        except Exception as e:
            logger.warning(f"Angel One SmartAPI get_price failed for {ticker}: {e}. Using fallback.")

        # Fallback to Yahoo Finance live data
        return await self.fallback_provider.get_price(ticker)

    async def get_stock_info(self, ticker: str) -> Optional[Dict[str, Any]]:
        return await self.fallback_provider.get_stock_info(ticker)

    async def search_stocks(self, query: str, exchange: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        clean_q = query.strip().upper()
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                url = f"{ANGEL_API_BASE}/rest/secure/angelbroking/order/v1/searchScrip"
                payload = {"exchange": exchange or "NSE", "searchstring": clean_q}
                res = await client.post(url, json=payload, headers=self.headers)
                if res.status_code == 200 and res.json().get("status"):
                    data = res.json().get("data", [])
                    results = []
                    for item in data[:limit]:
                        results.append({
                            "ticker": f"{item.get('name')}.NS",
                            "name": item.get("tradingsymbol", "").replace("-EQ", ""),
                            "exchange": item.get("exchange", "NSE"),
                            "currency": "INR",
                            "current_price": 0.0,
                            "change_pct": 0.0,
                            "market_cap": 0,
                            "sector": "Indian Market",
                            "source": "ANGEL_ONE_SMARTAPI",
                        })
                    if results:
                        return results
        except Exception as e:
            logger.warning(f"Angel One search failed: {e}")

        return await self.fallback_provider.search_stocks(query, exchange, limit)

    async def get_price_history(
        self,
        ticker: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> List[Dict[str, Any]]:
        """Fetch OHLCV price history from Angel One or fallback."""
        return await self.fallback_provider.get_price_history(ticker, start, end, interval)

    async def get_market_overview(self) -> Dict[str, Any]:
        return await self.fallback_provider.get_market_overview()

    async def get_top_movers(self, market: str = "NSE", limit: int = 10) -> Dict[str, Any]:
        return await self.fallback_provider.get_top_movers(market, limit)

    async def get_market_breadth(self, market: str = "NSE") -> Dict[str, Any]:
        return await self.fallback_provider.get_market_breadth(market)
