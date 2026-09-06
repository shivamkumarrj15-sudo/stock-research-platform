"""
Valuation Engine
================
Calculates intrinsic fair value using DCF, relative multiples, and scenario models (Bear/Base/Bull).
"""

from typing import Dict, Any, List

def calculate_dcf(
    fcf: float,
    growth_rate_5y: float,
    terminal_growth_rate: float,
    discount_rate: float,
    shares_outstanding: float,
    net_debt: float,
    projection_years: int = 5
) -> float:
    if fcf <= 0 or shares_outstanding <= 0:
        return 0.0

    current_fcf = fcf
    pv_fcf_sum = 0.0

    for year in range(1, projection_years + 1):
        current_fcf *= (1 + growth_rate_5y / 100.0)
        pv = current_fcf / ((1 + discount_rate / 100.0) ** year)
        pv_fcf_sum += pv

    # Terminal value
    terminal_value = (current_fcf * (1 + terminal_growth_rate / 100.0)) / ((discount_rate - terminal_growth_rate) / 100.0)
    pv_terminal_value = terminal_value / ((1 + discount_rate / 100.0) ** projection_years)

    enterprise_value = pv_fcf_sum + pv_terminal_value
    equity_value = enterprise_value - net_debt

    fair_value_per_share = equity_value / shares_outstanding
    return max(round(fair_value_per_share, 2), 0.0)

def calculate_scenarios(
    current_price: float,
    fcf: float,
    shares_outstanding: float,
    net_debt: float,
    base_growth: float = 10.0,
    base_discount: float = 11.0,
    industry_pe: float = 20.0,
    eps: float = 10.0
) -> Dict[str, Any]:
    # Bear Case: Lower growth, higher discount rate
    bear_dcf = calculate_dcf(
        fcf=fcf * 0.85,
        growth_rate_5y=max(base_growth - 5.0, 2.0),
        terminal_growth_rate=2.0,
        discount_rate=base_discount + 2.0,
        shares_outstanding=shares_outstanding,
        net_debt=net_debt
    )
    bear_pe_val = eps * (industry_pe * 0.75) if eps > 0 else 0
    bear_val = round((bear_dcf * 0.5 + bear_pe_val * 0.5) if bear_pe_val > 0 else bear_dcf, 2)

    # Base Case
    base_dcf = calculate_dcf(
        fcf=fcf,
        growth_rate_5y=base_growth,
        terminal_growth_rate=3.0,
        discount_rate=base_discount,
        shares_outstanding=shares_outstanding,
        net_debt=net_debt
    )
    base_pe_val = eps * industry_pe if eps > 0 else 0
    base_val = round((base_dcf * 0.5 + base_pe_val * 0.5) if base_pe_val > 0 else base_dcf, 2)

    # Bull Case: Higher growth, lower discount rate
    bull_dcf = calculate_dcf(
        fcf=fcf * 1.15,
        growth_rate_5y=base_growth + 5.0,
        terminal_growth_rate=3.5,
        discount_rate=max(base_discount - 1.5, 7.5),
        shares_outstanding=shares_outstanding,
        net_debt=net_debt
    )
    bull_pe_val = eps * (industry_pe * 1.25) if eps > 0 else 0
    bull_val = round((bull_dcf * 0.5 + bull_pe_val * 0.5) if bull_pe_val > 0 else bull_dcf, 2)

    if base_val <= 0:
        base_val = current_price * 1.05
        bear_val = current_price * 0.80
        bull_val = current_price * 1.35

    upside_pct = round(((base_val - current_price) / current_price) * 100.0, 2) if current_price > 0 else 0.0

    return {
        "current_price": current_price,
        "fair_value_base": base_val,
        "fair_value_low": bear_val,
        "fair_value_high": bull_val,
        "upside_pct": upside_pct,
        "bear": {
            "fair_value": bear_val,
            "key_assumptions": [
                f"Slower growth rate of {max(base_growth - 5.0, 2.0)}%",
                f"Higher discount rate of {base_discount + 2.0}%",
                "Multiple contraction of 25%"
            ]
        },
        "base": {
            "fair_value": base_val,
            "key_assumptions": [
                f"Moderate growth rate of {base_growth}%",
                f"Discount rate of {base_discount}%",
                f"Industry average multiple P/E = {industry_pe}x"
            ]
        },
        "bull": {
            "fair_value": bull_val,
            "key_assumptions": [
                f"Accelerated growth rate of {base_growth + 5.0}%",
                f"Lower discount rate of {max(base_discount - 1.5, 7.5)}%",
                "Multiple expansion of 25%"
            ]
        },
        "disclaimer": "Fair value is model-dependent and not a guaranteed future price."
    }
