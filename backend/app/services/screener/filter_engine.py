"""
Screener Filter Engine
=====================
Evaluates AND / OR criteria on stock records.
"""

from typing import List, Dict, Any

class FilterEngine:
    AVAILABLE_FIELDS = {
        "pe_ratio": {"label": "P/E Ratio", "type": "float"},
        "roic": {"label": "ROIC %", "type": "float"},
        "roe": {"label": "ROE %", "type": "float"},
        "revenue_growth": {"label": "Revenue Growth YoY %", "type": "float"},
        "eps_growth": {"label": "EPS Growth YoY %", "type": "float"},
        "debt_to_equity": {"label": "Debt/Equity", "type": "float"},
        "fcf_yield": {"label": "FCF Yield %", "type": "float"},
        "dividend_yield": {"label": "Dividend Yield %", "type": "float"},
        "piotroski_score": {"label": "Piotroski Score", "type": "int"},
        "overall_score": {"label": "Overall Score", "type": "float"},
        "market_cap": {"label": "Market Cap", "type": "float"},
    }

    def evaluate_stock(self, stock_data: Dict[str, Any], filters: List[Dict[str, Any]]) -> bool:
        if not filters:
            return True

        for f in filters:
            field = f.get("field")
            op = f.get("operator")
            target_val = f.get("value")

            actual_val = stock_data.get(field)
            if actual_val is None:
                return False

            try:
                actual_val = float(actual_val)
                target_val = float(target_val)
            except (ValueError, TypeError):
                continue

            if op == ">" and not (actual_val > target_val):
                return False
            elif op == "<" and not (actual_val < target_val):
                return False
            elif op == ">=" and not (actual_val >= target_val):
                return False
            elif op == "<=" and not (actual_val <= target_val):
                return False
            elif op == "==" and not (actual_val == target_val):
                return False

        return True
