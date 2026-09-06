"""
Portfolio API Router
====================
CRUD endpoints for portfolio holdings, performance tracking, and AI portfolio risk analysis.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

DEMO_PORTFOLIOS = {
    "port_1": {
        "id": "port_1",
        "name": "Core Compounders Portfolio",
        "description": "Long-term wealth creation portfolio",
        "currency": "INR",
        "positions": [
            {
                "id": "pos_1",
                "stock": {"ticker": "TCS", "name": "Tata Consultancy Services Ltd", "sector": "Information Technology"},
                "quantity": 50,
                "buy_price": 3400.0,
                "buy_date": "2024-01-15",
                "current_price": 3720.0,
                "current_value": 186000.0,
                "pnl": 16000.0,
                "pnl_pct": 9.41,
                "weight_pct": 52.3
            },
            {
                "id": "pos_2",
                "stock": {"ticker": "RELIANCE", "name": "Reliance Industries Ltd", "sector": "Energy"},
                "quantity": 60,
                "buy_price": 2700.0,
                "buy_date": "2024-02-10",
                "current_price": 2845.0,
                "current_value": 170700.0,
                "pnl": 8700.0,
                "pnl_pct": 5.37,
                "weight_pct": 47.7
            }
        ],
        "total_invested": 332000.0,
        "total_current_value": 356700.0,
        "total_pnl": 24700.0,
        "total_pnl_pct": 7.44,
        "created_at": "2024-01-15T00:00:00Z"
    }
}

@router.get("")
async def get_portfolios():
    return list(DEMO_PORTFOLIOS.values())

@router.post("")
async def create_portfolio(payload: Dict[str, Any]):
    new_id = f"port_{len(DEMO_PORTFOLIOS)+1}"
    port = {
        "id": new_id,
        "name": payload.get("name", "My Portfolio"),
        "description": payload.get("description", ""),
        "currency": payload.get("currency", "INR"),
        "positions": [],
        "total_invested": 0.0,
        "total_current_value": 0.0,
        "total_pnl": 0.0,
        "total_pnl_pct": 0.0,
        "created_at": "2026-08-30T12:00:00Z"
    }
    DEMO_PORTFOLIOS[new_id] = port
    return port

@router.get("/{id}")
async def get_portfolio(id: str):
    port = DEMO_PORTFOLIOS.get(id)
    if not port:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return port

@router.post("/{id}/positions")
async def add_position(id: str, payload: Dict[str, Any]):
    port = DEMO_PORTFOLIOS.get(id)
    if not port:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    qty = float(payload.get("quantity", 10))
    buy_p = float(payload.get("buy_price", 100))
    ticker = payload.get("ticker", "INFY").upper()

    pos = {
        "id": f"pos_{len(port['positions'])+1}",
        "stock": {"ticker": ticker, "name": f"{ticker} Ltd", "sector": "Technology"},
        "quantity": qty,
        "buy_price": buy_p,
        "buy_date": payload.get("buy_date", "2026-08-30"),
        "current_price": buy_p * 1.05,
        "current_value": qty * buy_p * 1.05,
        "pnl": qty * buy_p * 0.05,
        "pnl_pct": 5.0,
        "weight_pct": 20.0
    }
    port["positions"].append(pos)
    return port

@router.get("/{id}/analysis")
async def get_portfolio_analysis(id: str):
    port = DEMO_PORTFOLIOS.get(id)
    if not port:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    return {
        "portfolio_id": id,
        "overall_health_score": 85,
        "risk_level": "Moderate",
        "sector_concentration": [
            {"sector": "Information Technology", "percentage": 52.3},
            {"sector": "Energy", "percentage": 47.7}
        ],
        "top_risks": [
            "High concentration in Information Technology (52.3% of portfolio).",
            "Energy exposure susceptible to crude price volatility."
        ],
        "recommendations": [
            "Consider diversifying into Financials or Healthcare to reduce tech sector concentration.",
            "Rebalance portfolio as TCS weight exceeds target 40% threshold."
        ],
        "is_demo_data": True
    }
