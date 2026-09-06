"""
Watchlist API Router
====================
CRUD endpoints for user watchlists.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

# In-memory storage for watchlists demo
DEMO_WATCHLISTS = {
    "wl_1": {
        "id": "wl_1",
        "name": "Indian Quality Large Caps",
        "description": "High ROIC Indian leaders",
        "items": [
            {"stock": {"ticker": "TCS", "name": "Tata Consultancy Services Ltd", "exchange": "NSE", "sector": "Information Technology"}, "price": 3720.0, "change_pct": 1.2, "added_at": "2026-08-30T10:00:00Z"},
            {"stock": {"ticker": "RELIANCE", "name": "Reliance Industries Ltd", "exchange": "NSE", "sector": "Energy"}, "price": 2845.0, "change_pct": -0.5, "added_at": "2026-08-30T10:00:00Z"},
            {"stock": {"ticker": "INFY", "name": "Infosys Ltd", "exchange": "NSE", "sector": "Information Technology"}, "price": 1524.0, "change_pct": 0.8, "added_at": "2026-08-30T10:00:00Z"}
        ],
        "created_at": "2026-08-30T10:00:00Z"
    }
}

@router.get("")
async def get_watchlists():
    return list(DEMO_WATCHLISTS.values())

@router.post("")
async def create_watchlist(payload: Dict[str, Any]):
    new_id = f"wl_{len(DEMO_WATCHLISTS)+1}"
    wl = {
        "id": new_id,
        "name": payload.get("name", "New Watchlist"),
        "description": payload.get("description", ""),
        "items": [],
        "created_at": "2026-08-30T12:00:00Z"
    }
    DEMO_WATCHLISTS[new_id] = wl
    return wl

@router.get("/{id}")
async def get_watchlist(id: str):
    wl = DEMO_WATCHLISTS.get(id)
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return wl

@router.post("/{id}/stocks")
async def add_to_watchlist(id: str, payload: Dict[str, Any]):
    wl = DEMO_WATCHLISTS.get(id)
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    ticker = payload.get("ticker", "TCS").upper()
    wl["items"].append({
        "stock": {"ticker": ticker, "name": f"{ticker} Ltd", "exchange": "NSE", "sector": "General"},
        "price": 1000.0,
        "change_pct": 0.5,
        "added_at": "2026-08-30T12:00:00Z"
    })
    return wl

@router.delete("/{id}/stocks/{ticker}")
async def remove_from_watchlist(id: str, ticker: str):
    wl = DEMO_WATCHLISTS.get(id)
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    wl["items"] = [item for item in wl["items"] if item["stock"]["ticker"].upper() != ticker.upper()]
    return wl
