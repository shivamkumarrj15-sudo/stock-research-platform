"""
Screener API Router
===================
Endpoints to execute custom screens, run pre-built strategies, and fetch available screener fields.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional

from app.services.screener.filter_engine import FilterEngine
from app.services.screener.ranking_engine import PRE_BUILT_STRATEGIES
from app.providers.mock.mock_provider import MOCK_STOCKS

router = APIRouter()
filter_engine = FilterEngine()

@router.post("/run")
async def run_screener(payload: Dict[str, Any]):
    filters = payload.get("filters", [])
    sort_by = payload.get("sort_by", "overall_score")
    sort_direction = payload.get("sort_direction", "desc")
    limit = payload.get("limit", 50)
    exchange = payload.get("exchange")
    sector = payload.get("sector")

    matched_stocks = []
    for ticker, stock in MOCK_STOCKS.items():
        if exchange and stock["exchange"].upper() != exchange.upper():
            continue
        if sector and stock["sector"].lower() != sector.lower():
            continue

        if filter_engine.evaluate_stock(stock, filters):
            matched_stocks.append({
                "ticker": ticker,
                "name": stock["name"],
                "exchange": stock["exchange"],
                "price": stock["price"],
                "change_pct": 1.25,
                "market_cap": stock["market_cap"],
                "sector": stock["sector"],
                "overall_score": stock["overall_score"],
                "pe_ratio": stock["pe"],
                "roic": stock["roic"],
                "revenue_growth": stock["revenue_growth"],
                "fair_value_upside": 14.5,
                "is_demo_data": True
            })

    reverse = True if sort_direction == "desc" else False
    matched_stocks.sort(key=lambda s: s.get(sort_by) or 0, reverse=reverse)

    return {
        "count": len(matched_stocks),
        "results": matched_stocks[:limit],
        "is_demo_data": True
    }

@router.get("/strategies")
async def get_strategies():
    return list(PRE_BUILT_STRATEGIES.values())

@router.post("/strategies/{slug}/run")
async def run_strategy(slug: str):
    strat = PRE_BUILT_STRATEGIES.get(slug)
    if not strat:
        raise HTTPException(status_code=404, detail="Strategy template not found")

    return await run_screener({
        "filters": strat["filters"],
        "sort_by": strat["rank_by"],
        "sort_direction": strat["rank_direction"]
    })

@router.get("/fields")
async def get_fields():
    return FilterEngine.AVAILABLE_FIELDS
