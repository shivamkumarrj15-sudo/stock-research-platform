"""
Beneish M-Score Calculator
==========================
Implements the Beneish M-Score model for detecting earnings manipulation risk.

M-Score = -4.84 + 0.92*DSRI + 0.528*GMI + 0.404*AQI + 0.892*SGI + 0.115*DEPI - 0.172*SGAI + 4.679*TATA - 0.327*LVGI

Interpretation:
- M-Score > -1.78: High likelihood of earnings manipulation (High Risk)
- -2.22 < M-Score <= -1.78: Moderate Risk
- M-Score <= -2.22: Low Risk

IMPORTANT: Statistical warning indicator, NOT evidence of accounting fraud.
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class BeneishResult:
    score: float
    risk_level: str  # LOW | MODERATE | HIGH
    variables: Dict[str, Dict[str, Any]]
    interpretation: str
    disclaimer: str = "Statistical warning indicator, not evidence of accounting fraud."

def calculate_beneish(current_year: Dict[str, Any], previous_year: Dict[str, Any]) -> BeneishResult:
    cy = current_year
    py = previous_year

    def get(d: dict, k: str, default: float = 0.0) -> float:
        val = d.get(k)
        return float(val) if val is not None else default

    # Extract required fields
    cy_rec = get(cy, "accounts_receivable", 1.0)
    py_rec = get(py, "accounts_receivable", 1.0)
    cy_rev = get(cy, "revenue", 1.0)
    py_rev = get(py, "revenue", 1.0)

    cy_gp = get(cy, "gross_profit", 1.0)
    py_gp = get(py, "gross_profit", 1.0)

    cy_ta = get(cy, "total_assets", 1.0)
    py_ta = get(py, "total_assets", 1.0)

    cy_ppe = get(cy, "property_plant_equipment", get(cy, "total_assets", 1.0) * 0.4)
    py_ppe = get(py, "property_plant_equipment", get(py, "total_assets", 1.0) * 0.4)
    cy_ca = get(cy, "current_assets", 1.0)
    py_ca = get(py, "current_assets", 1.0)

    cy_depr = get(cy, "depreciation_amortization", 1.0)
    py_depr = get(py, "depreciation_amortization", 1.0)

    cy_sga = get(cy, "operating_expenses", 1.0)
    py_sga = get(py, "operating_expenses", 1.0)

    cy_lt_debt = get(cy, "long_term_debt", 0.0)
    py_lt_debt = get(py, "long_term_debt", 0.0)
    cy_cl = get(cy, "current_liabilities", 1.0)
    py_cl = get(py, "current_liabilities", 1.0)

    cy_net_inc = get(cy, "net_income", 0.0)
    cy_ocf = get(cy, "operating_cash_flow", 0.0)

    # 1. DSRI: Days Sales in Receivables Index
    dsri = (cy_rec / cy_rev) / (py_rec / py_rev) if py_rec > 0 and py_rev > 0 and cy_rev > 0 else 1.0

    # 2. GMI: Gross Margin Index
    gmi = (py_gp / py_rev) / (cy_gp / cy_rev) if py_rev > 0 and cy_rev > 0 and cy_gp > 0 else 1.0

    # 3. AQI: Asset Quality Index
    cy_non_ca_ppe = cy_ta - cy_ca - cy_ppe
    py_non_ca_ppe = py_ta - py_ca - py_ppe
    aqi = (1.0 - cy_non_ca_ppe / cy_ta) / (1.0 - py_non_ca_ppe / py_ta) if py_ta > 0 and cy_ta > 0 else 1.0

    # 4. SGI: Sales Growth Index
    sgi = cy_rev / py_rev if py_rev > 0 else 1.0

    # 5. DEPI: Depreciation Index
    depi = (py_depr / (py_ppe + py_depr)) / (cy_depr / (cy_ppe + cy_depr)) if (cy_ppe + cy_depr) > 0 and (py_ppe + py_depr) > 0 and cy_depr > 0 else 1.0

    # 6. SGAI: Sales, General and Administrative Expenses Index
    sgai = (cy_sga / cy_rev) / (py_sga / py_rev) if py_sga > 0 and py_rev > 0 and cy_rev > 0 else 1.0

    # 7. LVGI: Leverage Index
    lvgi = ((cy_lt_debt + cy_cl) / cy_ta) / ((py_lt_debt + py_cl) / py_ta) if py_ta > 0 and cy_ta > 0 else 1.0

    # 8. TATA: Total Accruals to Total Assets
    tata = (cy_net_inc - cy_ocf) / cy_ta if cy_ta > 0 else 0.0

    m_score = (
        -4.84
        + 0.92 * dsri
        + 0.528 * gmi
        + 0.404 * aqi
        + 0.892 * sgi
        + 0.115 * depi
        - 0.172 * sgai
        + 4.679 * tata
        - 0.327 * lvgi
    )

    if m_score > -1.78:
        risk_level = "HIGH"
        interp = "High risk of earnings manipulation indicated by statistical model."
    elif m_score > -2.22:
        risk_level = "MODERATE"
        interp = "Moderate earnings manipulation risk. Further qualitative audit recommended."
    else:
        risk_level = "LOW"
        interp = "Low risk of earnings manipulation based on Beneish statistical model."

    variables = {
        "DSRI": {"value": round(dsri, 3), "desc": "Days Sales in Receivables Index"},
        "GMI": {"value": round(gmi, 3), "desc": "Gross Margin Index"},
        "AQI": {"value": round(aqi, 3), "desc": "Asset Quality Index"},
        "SGI": {"value": round(sgi, 3), "desc": "Sales Growth Index"},
        "DEPI": {"value": round(depi, 3), "desc": "Depreciation Index"},
        "SGAI": {"value": round(sgai, 3), "desc": "SGA Expense Index"},
        "LVGI": {"value": round(lvgi, 3), "desc": "Leverage Index"},
        "TATA": {"value": round(tata, 3), "desc": "Total Accruals to Total Assets"},
    }

    return BeneishResult(
        score=round(m_score, 2),
        risk_level=risk_level,
        variables=variables,
        interpretation=interp
    )
