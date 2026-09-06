"""
Altman Z-Score Calculator
=========================
Calculates the Altman Z-Score for bankruptcy risk assessment.

Z-Score = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5

Where:
X1 = Working Capital / Total Assets
X2 = Retained Earnings / Total Assets
X3 = EBIT / Total Assets
X4 = Market Value of Equity / Total Liabilities
X5 = Sales / Total Assets

Zones:
- Safe Zone: Z > 2.99
- Grey Zone: 1.81 <= Z <= 2.99
- Distress Zone: Z < 1.81
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class AltmanResult:
    score: float
    zone: str  # safe | grey | distress
    risk_level: str  # Low Risk | Moderate Risk | High Bankruptcy Risk
    variables: Dict[str, float]
    interpretation: str
    disclaimer: str = "Altman Z-Score is a statistical model. Applicability varies by company sector and structure."

def calculate_altman_z(
    financials: Dict[str, Any],
    market_cap: float,
    is_manufacturing: bool = True
) -> AltmanResult:
    def get(k: str, default: float = 0.0) -> float:
        val = financials.get(k)
        return float(val) if val is not None else default

    total_assets = get("total_assets", 1.0)
    if total_assets <= 0:
        total_assets = 1.0

    current_assets = get("current_assets", 0.0)
    current_liabilities = get("current_liabilities", 0.0)
    working_capital = current_assets - current_liabilities

    retained_earnings = get("retained_earnings", get("net_income", 0.0) * 0.5)
    ebit = get("operating_income", get("net_income", 0.0) * 1.2)
    total_liabilities = get("total_liabilities", 1.0)
    if total_liabilities <= 0:
        total_liabilities = 1.0

    sales = get("revenue", 1.0)

    x1 = working_capital / total_assets
    x2 = retained_earnings / total_assets
    x3 = ebit / total_assets
    x4 = market_cap / total_liabilities
    x5 = sales / total_assets

    if is_manufacturing:
        z_score = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5
        safe_thresh = 2.99
        distress_thresh = 1.81
    else:
        # Non-manufacturing (Z'-Score model)
        z_score = 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4
        safe_thresh = 2.60
        distress_thresh = 1.10

    if z_score >= safe_thresh:
        zone = "safe"
        risk_level = "Low Risk"
        interp = f"Safe Zone (Z = {round(z_score, 2)}). Company displays strong financial stability."
    elif z_score >= distress_thresh:
        zone = "grey"
        risk_level = "Moderate Risk"
        interp = f"Grey Zone (Z = {round(z_score, 2)}). Financial condition requires ongoing monitoring."
    else:
        zone = "distress"
        risk_level = "High Bankruptcy Risk"
        interp = f"Distress Zone (Z = {round(z_score, 2)}). Significant financial distress warning."

    variables = {
        "X1_Working_Capital_to_Assets": round(x1, 3),
        "X2_Retained_Earnings_to_Assets": round(x2, 3),
        "X3_EBIT_to_Assets": round(x3, 3),
        "X4_Market_Cap_to_Liabilities": round(x4, 3),
        "X5_Sales_to_Assets": round(x5, 3),
    }

    return AltmanResult(
        score=round(z_score, 2),
        zone=zone,
        risk_level=risk_level,
        variables=variables,
        interpretation=interp
    )
