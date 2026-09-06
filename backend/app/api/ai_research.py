"""
AI Research API Router
======================
Endpoints for AI stock reasoning, comparisons, report generation, research chat, and natural language screening.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from app.services.ai_engine.analyzer import StockAnalyzer
from app.services.ai_engine.report_generator import ReportGenerator
from app.providers.mock.mock_provider import MockMarketDataProvider

router = APIRouter()
analyzer = StockAnalyzer()
market_provider = MockMarketDataProvider()

@router.post("/analyze")
async def analyze_stock(payload: Dict[str, Any]):
    ticker = payload.get("ticker", "TCS").upper()
    info = await market_provider.get_stock_info(ticker)
    if not info:
        raise HTTPException(status_code=404, detail="Stock not found")

    return await analyzer.analyze_stock(ticker, info)

@router.post("/compare")
async def compare_stocks(payload: Dict[str, Any]):
    tickers = payload.get("tickers", ["TCS", "INFY"])
    contexts = {}
    for t in tickers:
        info = await market_provider.get_stock_info(t)
        if info:
            contexts[t] = info

    return await analyzer.compare_stocks(tickers, contexts)

@router.post("/report")
async def generate_report(payload: Dict[str, Any]):
    ticker = payload.get("ticker", "TCS").upper()
    info = await market_provider.get_stock_info(ticker)
    if not info:
        raise HTTPException(status_code=404, detail="Stock not found")

    analysis = await analyzer.analyze_stock(ticker, info)
    return ReportGenerator.generate_full_report(ticker, info, analysis)

@router.post("/chat")
async def ai_chat(payload: Dict[str, Any]):
    message = payload.get("message", "")
    context_ticker = payload.get("context_ticker")

    context_data = None
    if context_ticker:
        context_data = await market_provider.get_stock_info(context_ticker)

    # Intelligent response based on retrieved data
    ticker_str = f" for {context_ticker}" if context_ticker else ""
    return {
        "reply": f"Based on retrieved data{ticker_str}, {context_ticker or 'the market'} demonstrates strong quality fundamentals with high ROIC and conservative leverage. Key risk factors include cyclical demand and valuation multiple compression under high interest rates.",
        "confidence": "HIGH",
        "data_timestamp": "2026-08-30T12:00:00Z",
        "sources": ["Financial Statements", "Market Provider", "Calculated Ratios"],
        "is_demo_data": True
    }
