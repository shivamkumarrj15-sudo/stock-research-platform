"""
Master Stock Scoring Engine (0-100)
==================================
Combines fundamental, valuation, growth, financial health, technical, dividend, and risk scores with configurable weights.
"""

from typing import Dict, Any

def calculate_master_score(
    ratios: Dict[str, Any],
    piotroski_score: int = 5,
    beneish_m: float = -2.5,
    altman_z: float = 3.0,
    technical_score: float = 70.0,
    upside_pct: float = 10.0,
    weights: Dict[str, float] = None
) -> Dict[str, Any]:

    if weights is None:
        weights = {
            "fundamentals": 20,
            "health": 15,
            "growth": 15,
            "valuation": 15,
            "quality": 10,
            "technical": 10,
            "momentum": 5,
            "earnings": 5,
            "risk": 5,
        }

    # 1. Fundamental Score
    roe = ratios.get("roe") or 15.0
    roic = ratios.get("roic") or 12.0
    op_margin = ratios.get("operating_margin") or 15.0
    fundamental_score = min(100.0, max(0.0, (roe * 1.5 + roic * 2.0 + op_margin * 1.5)))

    # 2. Health Score
    piotroski_part = (piotroski_score / 9.0) * 50.0
    beneish_part = 25.0 if beneish_m <= -2.22 else (10.0 if beneish_m <= -1.78 else 0.0)
    altman_part = 25.0 if altman_z >= 2.99 else (15.0 if altman_z >= 1.81 else 5.0)
    health_score = min(100.0, max(0.0, piotroski_part + beneish_part + altman_part))

    # 3. Growth Score
    rev_growth = ratios.get("revenue_growth") or 10.0
    eps_growth = ratios.get("eps_growth") or 12.0
    growth_score = min(100.0, max(0.0, (rev_growth * 2.5 + eps_growth * 2.5)))

    # 4. Valuation Score
    val_score = min(100.0, max(0.0, 50.0 + upside_pct * 1.5))

    # 5. Quality Score
    fcf_yield = ratios.get("fcf_yield") or 4.0
    de_ratio = ratios.get("debt_to_equity") or 0.3
    de_penalty = max(0.0, (de_ratio - 1.0) * 15.0)
    quality_score = min(100.0, max(0.0, (roic * 2.5 + fcf_yield * 5.0 - de_penalty)))

    # 6. Technical Score
    tech_score = min(100.0, max(0.0, technical_score))

    # 7. Momentum Score
    momentum_score = min(100.0, max(0.0, technical_score * 0.9 + 10.0))

    # 8. Dividend Score
    div_yield = ratios.get("dividend_yield") or 1.0
    dividend_score = min(100.0, max(0.0, div_yield * 20.0 + 30.0))

    # 9. Risk Score (Higher score = safer/lower risk)
    risk_score = min(100.0, max(0.0, 100.0 - (de_ratio * 20.0 + (10.0 if beneish_m > -1.78 else 0.0))))

    # Weighted calculation
    total_weight = sum(weights.values())
    overall_score = (
        fundamental_score * weights["fundamentals"] +
        health_score * weights["health"] +
        growth_score * weights["growth"] +
        val_score * weights["valuation"] +
        quality_score * weights["quality"] +
        tech_score * weights["technical"] +
        momentum_score * weights["momentum"] +
        div_yield * 10 * weights["earnings"] +
        risk_score * weights["risk"]
    ) / total_weight

    overall_score = round(min(100.0, max(0.0, overall_score)), 1)

    if overall_score >= 85:
        classification = "Excellent candidate for deeper research"
    elif overall_score >= 70:
        classification = "Strong candidate"
    elif overall_score >= 55:
        classification = "Watchlist"
    elif overall_score >= 40:
        classification = "Weak / high uncertainty"
    else:
        classification = "High risk / unattractive based on current model"

    return {
        "overall_score": overall_score,
        "classification": classification,
        "component_scores": {
            "fundamental_score": round(fundamental_score, 1),
            "valuation_score": round(val_score, 1),
            "growth_score": round(growth_score, 1),
            "health_score": round(health_score, 1),
            "technical_score": round(tech_score, 1),
            "momentum_score": round(momentum_score, 1),
            "dividend_score": round(dividend_score, 1),
            "risk_score": round(risk_score, 1),
            "quality_score": round(quality_score, 1),
        },
        "weights": weights,
        "confidence": "HIGH"
    }
