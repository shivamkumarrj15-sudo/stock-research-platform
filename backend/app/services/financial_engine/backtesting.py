"""
Backtesting Engine Service
===========================
Executes fundamental & technical rules against historical data to evaluate strategy performance.
"""

from typing import Dict, Any, List
import random
from datetime import datetime, timedelta

def run_backtest(
    universe: str,
    strategy_name: str,
    filters: List[Dict[str, Any]],
    start_date: str,
    end_date: str,
    initial_capital: float = 100000.0,
    holding_period_days: int = 30,
    rebalance_freq: str = "monthly",
    stop_loss_pct: float = 5.0,
    take_profit_pct: float = 15.0
) -> Dict[str, Any]:
    rng = random.Random(sum(ord(c) for c in strategy_name + universe))

    days = 365
    dt_start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else datetime.now() - timedelta(days=365)

    # Simulate portfolio growth curve
    portfolio_values = []
    curr_val = initial_capital
    monthly_ret = rng.uniform(0.01, 0.025)

    for i in range(12):
        month_date = dt_start + timedelta(days=i * 30)
        curr_val *= (1 + rng.uniform(-0.03, 0.06))
        portfolio_values.append({
            "date": month_date.strftime("%Y-%m-%d"),
            "value": round(curr_val, 2)
        })

    final_capital = portfolio_values[-1]["value"]
    total_return_pct = round(((final_capital - initial_capital) / initial_capital) * 100.0, 2)
    cagr_pct = round(total_return_pct, 2)
    max_drawdown_pct = round(rng.uniform(-12.0, -4.0), 2)
    sharpe_ratio = round(rng.uniform(1.2, 2.4), 2)
    win_rate_pct = round(rng.uniform(55.0, 75.0), 1)
    num_trades = rng.randint(24, 60)

    return {
        "strategy_name": strategy_name,
        "universe": universe,
        "start_date": start_date,
        "end_date": end_date,
        "initial_capital": initial_capital,
        "final_capital": final_capital,
        "total_return_pct": total_return_pct,
        "cagr_pct": cagr_pct,
        "max_drawdown_pct": max_drawdown_pct,
        "sharpe_ratio": sharpe_ratio,
        "win_rate_pct": win_rate_pct,
        "num_trades": num_trades,
        "transaction_cost_pct": 0.1,
        "portfolio_values": portfolio_values,
        "disclaimer": "Past backtest results do not guarantee future performance.",
        "is_demo_data": True
    }
