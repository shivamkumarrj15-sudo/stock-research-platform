"""
News API Router
===============
Endpoints for company and market news aggregation with AI sentiment scores.
"""

from fastapi import APIRouter
from typing import Optional
from app.providers.mock.mock_provider import MockNewsProvider

router = APIRouter()
news_provider = MockNewsProvider()

@router.get("/market")
async def get_market_news(category: str = "general", limit: int = 20):
    return await news_provider.get_market_news(category, limit)

@router.get("/stock/{ticker}")
async def get_stock_news(ticker: str, limit: int = 20):
    return await news_provider.get_stock_news(ticker, limit)
