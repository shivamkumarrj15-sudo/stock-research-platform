"""
NewsAPI & GNews Live News Provider
===================================
Fetches live company and market news using NewsAPI and GNews API keys.
"""

import httpx
from datetime import datetime
from typing import List, Dict, Any
from app.providers.base import NewsProvider

class NewsAPIProvider(NewsProvider):
    def __init__(self, news_api_key: str = "", gnews_api_key: str = ""):
        from app.core.config import settings
        self.news_api_key = news_api_key or settings.NEWS_API_KEY
        self.gnews_api_key = gnews_api_key or getattr(settings, "GNEWS_API_KEY", "8c51608b915faa039a57ad086cf94b0d")

    async def get_stock_news(self, ticker: str, limit: int = 20) -> List[Dict[str, Any]]:
        # Try GNews first, fallback to NewsAPI
        if self.gnews_api_key:
            url = f"https://gnews.io/api/v4/search?q={ticker}&token={self.gnews_api_key}&lang=en&max={limit}"
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(url)
                    if res.status_code == 200:
                        data = res.json()
                        articles = data.get("articles", [])
                        results = []
                        for idx, a in enumerate(articles):
                            results.append({
                                "id": f"gnews_{ticker}_{idx}",
                                "headline": a.get("title"),
                                "summary": a.get("description"),
                                "url": a.get("url"),
                                "source_name": a.get("source", {}).get("name", "GNews"),
                                "published_at": a.get("publishedAt"),
                                "sentiment_score": 45,
                                "sentiment_label": "positive",
                                "category": "market",
                                "topics": [ticker, "stocks"],
                                **self.make_metadata("GNEWS_API", is_demo=False)
                            })
                        if results:
                            return results
            except Exception:
                pass

        if self.news_api_key:
            url = f"https://newsapi.org/v2/everything?q={ticker}&apiKey={self.news_api_key}&pageSize={limit}&language=en"
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(url)
                    if res.status_code == 200:
                        data = res.json()
                        articles = data.get("articles", [])
                        results = []
                        for idx, a in enumerate(articles):
                            results.append({
                                "id": f"newsapi_{ticker}_{idx}",
                                "headline": a.get("title"),
                                "summary": a.get("description"),
                                "url": a.get("url"),
                                "source_name": a.get("source", {}).get("name", "NewsAPI"),
                                "published_at": a.get("publishedAt"),
                                "sentiment_score": 50,
                                "sentiment_label": "neutral",
                                "category": "company",
                                "topics": [ticker],
                                **self.make_metadata("NEWS_API", is_demo=False)
                            })
                        return results
            except Exception:
                pass

        return []

    async def get_market_news(self, category: str = "general", limit: int = 20) -> List[Dict[str, Any]]:
        return await self.get_stock_news("stock market India US", limit)
