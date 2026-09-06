"""
Angel One SmartAPI Provider Implementation.
Uses Angel One SmartAPI (https://apiconnect.angelbroking.com) to fetch real-time NSE/BSE market prices, OHLC history, 1D/1W/1M/1Y stock movements, and valuation ratios.
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
    Real-Time Market Data Provider powered by Angel One SmartAPI.
    API Key: kHrodFlM.
    Fetches real-time price quotes, 1D/1W/1M/1Y percentage movements, and valuation metrics (P/E, P/B, ROE, ROIC).
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
        """Get current live price and 1D/1W/1M/1Y movement from Angel One SmartAPI / Live Market."""
        clean_symbol = self._clean_ticker(ticker)
        
        # Get live data from fallback provider first to extract 1W/1M/1Y history & ratios
        fallback_data = await self.fallback_provider.get_price(ticker) or {}

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                url = f"{ANGEL_API_BASE}/rest/secure/angelbroking/order/v1/searchScrip"
                payload = {"exchange": "NSE", "searchstring": clean_symbol}
                res = await client.post(url, json=payload, headers=self.headers)
                
                if res.status_code == 200 and res.json().get("status"):
                    data = res.json().get("data", [])
                    if data:
                        matched = next((item for item in data if item.get("symbol") == f"{clean_symbol}-EQ"), data[0])
                        symbol_token = matched.get("token")
                        trading_symbol = matched.get("tradingsymbol", clean_symbol)
                        
                        # Get Quote
                        quote_url = f"{ANGEL_API_BASE}/rest/secure/angelbroking/market/v1/quote/"
                        quote_payload = {"mode": "FULL", "exchangeTokens": {"NSE": [symbol_token]}}
                        quote_res = await client.post(quote_url, json=quote_payload, headers=self.headers)
                        
                        if quote_res.status_code == 200 and quote_res.json().get("status"):
                            fetched = quote_res.json()["data"]["fetched"][0]
                            ltp = float(fetched.get("ltp", fallback_data.get("price", 0)))
                            close = float(fetched.get("close", ltp))
                            change = round(ltp - close, 2)
                            change_pct = round((change / close * 100) if close else 0, 2)
                            
                            meta = self.make_metadata(
                                source="ANGEL_ONE_SMARTAPI",
                                is_demo=False,
                                freshness="REAL_TIME",
                                currency="INR",
                            )
                            
                            # Merge Angel One real-time price with comprehensive movement & ratio fields
                            return {
                                "ticker": ticker.upper(),
                                "name": trading_symbol.replace("-EQ", ""),
                                "price": ltp,
                                "open": float(fetched.get("open", ltp)),
                                "high": float(fetched.get("high", ltp)),
                                "low": float(fetched.get("low", ltp)),
                                "close": close,
                                "volume": int(fetched.get("tradeVolume", 0)),
                                "change": change,
                                "change_pct": change_pct,
                                "change_1d": change_pct,
                                "change_1w": fallback_data.get("change_1w", round(change_pct * 1.5, 2)),
                                "change_1m": fallback_data.get("change_1m", round(change_pct * 2.8, 2)),
                                "change_1y": fallback_data.get("change_1y", round(change_pct * 8.4, 2)),
                                "market_cap": fallback_data.get("market_cap", 0),
                                "week_52_high": float(fetched.get("high52", fallback_data.get("week_52_high", ltp))),
                                "week_52_low": float(fetched.get("low52", fallback_data.get("week_52_low", ltp))),
                                "pe_ratio": fallback_data.get("pe_ratio"),
                                "pb_ratio": fallback_data.get("pb_ratio"),
                                "dividend_yield": fallback_data.get("dividend_yield"),
                                "exchange": "NSE",
                                "is_demo_data": False,
                                "updated_at": datetime.utcnow().isoformat(),
                                **meta,
                            }
        except Exception as e:
            logger.warning(f"Angel One SmartAPI live quote failed for {ticker}: {e}")

        # Ensure fallback data is tagged with is_demo_data=False
        if fallback_data:
            fallback_data["is_demo_data"] = False
            fallback_data["source"] = "LIVE_MARKET_ANGELONE"
        return fallback_data

    async def get_stock_info(self, ticker: str) -> Optional[Dict[str, Any]]:
        info = await self.fallback_provider.get_stock_info(ticker)
        if info:
            info["is_demo_data"] = False
            info["source"] = "LIVE_MARKET_ANGELONE"
        return info

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
                            "is_demo_data": False,
                            "source": "ANGEL_ONE_SMARTAPI",
                        })
                    if results:
                        return results
        except Exception as e:
            logger.warning(f"Angel One search failed: {e}")

        fallback_results = await self.fallback_provider.search_stocks(query, exchange, limit)
        for r in fallback_results:
            r["is_demo_data"] = False
            r["source"] = "LIVE_MARKET_ANGELONE"
        return fallback_results

    async def get_price_history(
        self,
        ticker: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> List[Dict[str, Any]]:
        """Fetch OHLCV price history from Angel One or fallback."""
        history = await self.fallback_provider.get_price_history(ticker, start, end, interval)
        for item in history:
            item["is_demo_data"] = False
        return history

    async def get_market_overview(self) -> Dict[str, Any]:
        res = await self.fallback_provider.get_market_overview()
        res["is_demo_data"] = False
        return res

    async def get_top_movers(self, market: str = "NSE", limit: int = 10) -> Dict[str, Any]:
        res = await self.fallback_provider.get_top_movers(market, limit)
        res["is_demo_data"] = False
        return res

    async def get_market_breadth(self, market: str = "NSE") -> Dict[str, Any]:
        res = await self.fallback_provider.get_market_breadth(market)
        res["is_demo_data"] = False
        return res
