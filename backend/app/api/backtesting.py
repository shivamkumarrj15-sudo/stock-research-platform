"""
Backtesting API Router
======================
Run backtests and manage strategy definitions.
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.services.financial_engine.backtesting import run_backtest

router = APIRouter()

@router.post("/run")
async def execute_backtest(payload: Dict[str, Any]):
    universe = payload.get("universe", "NIFTY50")
    strategy_name = payload.get("strategy_name", "Quality Compounders Backtest")
    filters = payload.get("filters", [])
    start_date = payload.get("start_date", "2023-01-01")
    end_date = payload.get("end_date", "2024-01-01")
    initial_capital = float(payload.get("initial_capital", 100000.0))

    return run_backtest(
        universe=universe,
        strategy_name=strategy_name,
        filters=filters,
        start_date=start_date,
        end_date=end_date,
        initial_capital=initial_capital
    )
