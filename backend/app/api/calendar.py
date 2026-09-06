"""
Calendar API Router
===================
Endpoints for Earnings, Dividend, and Economic calendar events.
"""

from fastapi import APIRouter
from datetime import date, timedelta
from typing import Optional

from app.providers.mock.mock_provider import MockEarningsProvider, MockDividendProvider, MockEconomicDataProvider

router = APIRouter()

earnings_provider = MockEarningsProvider()
dividend_provider = MockDividendProvider()
economic_provider = MockEconomicDataProvider()

@router.get("/earnings")
async def get_earnings_calendar(from_date: Optional[str] = None, to_date: Optional[str] = None):
    start = date.today() - timedelta(days=7)
    end = date.today() + timedelta(days=30)
    return await earnings_provider.get_earnings_calendar(start, end)

@router.get("/dividends")
async def get_dividend_calendar(from_date: Optional[str] = None, to_date: Optional[str] = None):
    start = date.today() - timedelta(days=7)
    end = date.today() + timedelta(days=30)
    return await dividend_provider.get_dividend_calendar(start, end)

@router.get("/economic")
async def get_economic_calendar(country: Optional[str] = None, impact: Optional[str] = None):
    start = date.today() - timedelta(days=7)
    end = date.today() + timedelta(days=30)
    return await economic_provider.get_economic_calendar(start, end, country=country, impact=impact)
