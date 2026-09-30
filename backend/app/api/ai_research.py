"""
AI Research API Router
======================
Endpoints for AI stock reasoning, comparisons, report generation, research chat,
and institutional Buffett-Munger 20-stage research memos with automated PDF generation & email delivery.
"""

import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import Dict, Any, List, Optional

from app.services.ai_engine.analyzer import StockAnalyzer
from app.services.ai_engine.report_generator import ReportGenerator
from app.providers.mock.mock_provider import MockMarketDataProvider
from app.services.institutional_pipeline import InstitutionalPipeline

router = APIRouter()
analyzer = StockAnalyzer()
market_provider = MockMarketDataProvider()
institutional_pipeline = InstitutionalPipeline()


@router.post("/institutional-memo")
async def generate_institutional_memo(payload: Dict[str, Any]):
    """
    Executes exhaustive 20-stage Buffett-Munger institutional equity research.
    Generates 2-Volume PDFs (Business Model + Forensics & Buffett Verdict),
    and dispatches via Email & Telegram.
    """
    ticker = payload.get("ticker", "TCS").upper().strip()
    email = payload.get("email", "").strip()
    send_telegram = payload.get("send_telegram", True)
    chat_id = payload.get("telegram_chat_id", "").strip()
    
    try:
        result = await institutional_pipeline.run_full_research(
            ticker=ticker,
            recipient_email=email if email else None,
            send_telegram=send_telegram,
            telegram_chat_id=chat_id if chat_id else None
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Institutional research failed: {str(e)}")


@router.get("/download-master/{ticker}")
async def download_master_pdf(ticker: str):
    """Download Master 14-Pillar Complete Company Analysis PDF with EPS & 7-Model Valuation."""
    clean_ticker = ticker.upper().strip()
    pdf_path = f"{clean_ticker}_Master_Institutional_Equity_Research.pdf"
    fallback_path = f"{clean_ticker}_Master_Buffett_12Pillar_Analysis.pdf"
    
    target_path = pdf_path if os.path.exists(pdf_path) else (fallback_path if os.path.exists(fallback_path) else None)
    if not target_path:
        await institutional_pipeline.run_full_research(ticker=clean_ticker)
        target_path = pdf_path if os.path.exists(pdf_path) else fallback_path

    if target_path and os.path.exists(target_path):
        return FileResponse(
            target_path,
            media_type="application/pdf",
            filename=f"{clean_ticker}_Master_Institutional_Equity_Research.pdf"
        )
    raise HTTPException(status_code=404, detail=f"Master PDF for {clean_ticker} not found")


@router.get("/download-volume1/{ticker}")
async def download_volume1_pdf(ticker: str):
    """Download Volume 1: Business Model & 9-Pillar Moat PDF."""
    clean_ticker = ticker.upper().strip()
    pdf_path = f"{clean_ticker}_Vol1_Business_Model_and_Moat.pdf"
    if not os.path.exists(pdf_path):
        await institutional_pipeline.run_full_research(ticker=clean_ticker)

    if os.path.exists(pdf_path):
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{clean_ticker}_Vol1_Business_Model_and_Moat.pdf"
        )
    raise HTTPException(status_code=404, detail=f"Volume 1 PDF for {clean_ticker} not found")


@router.get("/download-volume2/{ticker}")
async def download_volume2_pdf(ticker: str):
    """Download Volume 2: Financial Forensics, 3-Scenario DCF & Buffett Verdict PDF."""
    clean_ticker = ticker.upper().strip()
    pdf_path = f"{clean_ticker}_Vol2_Financials_and_Buffett_Verdict.pdf"
    if not os.path.exists(pdf_path):
        await institutional_pipeline.run_full_research(ticker=clean_ticker)

    if os.path.exists(pdf_path):
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{clean_ticker}_Vol2_Financials_and_Buffett_Verdict.pdf"
        )
    raise HTTPException(status_code=404, detail=f"Volume 2 PDF for {clean_ticker} not found")


@router.get("/download-volume3/{ticker}")
async def download_volume3_pdf(ticker: str):
    """Download Volume 3: Competitor Warfare, Peer Benchmarking & Market Domination PDF."""
    clean_ticker = ticker.upper().strip()
    pdf_path = f"{clean_ticker}_Vol3_Competitor_Warfare_and_Beat_Analysis.pdf"
    if not os.path.exists(pdf_path):
        await institutional_pipeline.run_full_research(ticker=clean_ticker)

    if os.path.exists(pdf_path):
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{clean_ticker}_Vol3_Competitor_Warfare_and_Beat_Analysis.pdf"
        )
    raise HTTPException(status_code=404, detail=f"Volume 3 PDF for {clean_ticker} not found")


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

    ticker_str = f" for {context_ticker}" if context_ticker else ""
    return {
        "reply": f"Based on retrieved data{ticker_str}, {context_ticker or 'the market'} demonstrates strong quality fundamentals with high ROIC and conservative leverage. Key risk factors include cyclical demand and valuation multiple compression under high interest rates.",
        "confidence": "HIGH",
        "data_timestamp": "2026-08-30T12:00:00Z",
        "sources": ["Financial Statements", "Market Provider", "Calculated Ratios"],
        "is_demo_data": True
    }
