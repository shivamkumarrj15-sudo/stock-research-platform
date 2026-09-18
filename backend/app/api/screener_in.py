"""
Screener.in Session & Fundamental Data API Router
=================================================
Provides endpoints to connect Screener.in session cookies, verify live connection status,
and fetch full company fundamentals, ratios, 10-Yr growth, and pros/cons.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from pydantic import BaseModel

from app.providers.screener_in.screener_in_provider import ScreenerInProvider

router = APIRouter()

# Global in-memory Screener provider instance
_screener_provider = ScreenerInProvider()

class ScreenerSessionPayload(BaseModel):
    session_id: str

@router.post("/session")
async def set_screener_session(payload: ScreenerSessionPayload):
    """Save user's Screener.in sessionid cookie and test authentication."""
    _screener_provider.set_session_id(payload.session_id)
    status = await _screener_provider.verify_session()
    return status

@router.get("/status")
async def get_screener_status():
    """Check current Screener.in connection status."""
    return await _screener_provider.verify_session()

@router.get("/company/{ticker}")
async def get_screener_company(ticker: str):
    """Fetch complete live Screener.in data for a given ticker."""
    data = await _screener_provider.get_company_data(ticker)
    if not data:
        raise HTTPException(status_code=404, detail=f"Company '{ticker}' not found on Screener.in")
    return data
