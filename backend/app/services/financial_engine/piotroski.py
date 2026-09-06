"""
Piotroski F-Score Calculator
==============================
Implements the full 9-point Piotroski F-Score financial health scoring system.

Reference: Piotroski, J.D. (2000) "Value Investing: The Use of Historical
Financial Statement Information to Separate Winners from Losers"

Each criterion is binary (0 or 1).
Total score 0-9 where:
- 8-9: Strong financial position
- 5-7: Moderate
- 0-4: Weak financial position

NOT a buy/sell signal. A financial health indicator only.
"""

from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

from app.services.financial_engine.ratios import (
    calculate_roa,
    calculate_current_ratio,
    calculate_gross_margin,
    calculate_asset_turnover,
    safe_divide,
)


@dataclass
class PiotroskiItem:
    """A single Piotroski criterion."""
    criterion_id: int
    name: str
    description: str
    formula: str
    value: Optional[float]  # The actual calculated value
    passed: bool            # 1 (passed) or 0 (failed)
    group: str              # "Profitability" | "Leverage/Liquidity" | "Operating Efficiency"
    interpretation: str     # Plain English explanation


@dataclass
class PiotroskiResult:
    """Complete Piotroski F-Score result."""
    score: int                          # 0-9
    items: List[PiotroskiItem] = field(default_factory=list)
    risk_level: str = ""                # "Strong" | "Moderate" | "Weak"
    interpretation: str = ""
    data_quality: str = ""              # "complete" | "partial" | "insufficient"
    criteria_available: int = 0         # How many criteria had sufficient data
    disclaimer: str = (
        "Piotroski F-Score is a financial health indicator based on historical data. "
        "It is not a buy/sell recommendation and should be used alongside other analysis."
    )


def calculate_piotroski(
    current_year: Dict[str, Any],
    previous_year: Optional[Dict[str, Any]] = None,
    shares_issued_this_year: bool = False,
) -> PiotroskiResult:
    """
    Calculate the 9-point Piotroski F-Score.

    Parameters
    ----------
    current_year : dict
        Current year financial data with keys matching FinancialStatement model.
    previous_year : dict, optional
        Previous year financial data for trend-based criteria.
    shares_issued_this_year : bool
        Whether new shares were issued (for criterion 7).

    Returns
    -------
    PiotroskiResult with all 9 criteria, score, and interpretation.
    """
    items: List[PiotroskiItem] = []
    score = 0
    available = 0

    # ── Helper ─────────────────────────────────────────────────────────────────
    def get(d: dict, key: str) -> Optional[float]:
        v = d.get(key)
        return float(v) if v is not None else None

    # Aliases
    cy = current_year
    py = previous_year or {}

    cy_net_income = get(cy, "net_income")
    cy_total_assets = get(cy, "total_assets")
    cy_ocf = get(cy, "operating_cash_flow")
    cy_gross_profit = get(cy, "gross_profit")
    cy_revenue = get(cy, "revenue")
    cy_current_assets = get(cy, "current_assets")
    cy_current_liabilities = get(cy, "current_liabilities")
    cy_long_term_debt = get(cy, "long_term_debt")
    cy_shares = get(cy, "shares_diluted")

    py_net_income = get(py, "net_income")
    py_total_assets = get(py, "total_assets")
    py_gross_profit = get(py, "gross_profit")
    py_revenue = get(py, "revenue")
    py_current_assets = get(py, "current_assets")
    py_current_liabilities = get(py, "current_liabilities")
    py_long_term_debt = get(py, "long_term_debt")
    py_shares = get(py, "shares_diluted")

    # ── GROUP 1: Profitability ──────────────────────────────────────────────────

    # Criterion 1: Positive ROA (Net Income > 0)
    roa = calculate_roa(cy_net_income, cy_total_assets)
    if roa is not None:
        available += 1
        passed = roa > 0
        if passed:
            score += 1
        items.append(PiotroskiItem(
            criterion_id=1,
            name="Positive ROA",
            description="Return on Assets > 0 (company is profitable)",
            formula="ROA = Net Income / Total Assets × 100",
            value=roa,
            passed=passed,
            group="Profitability",
            interpretation=f"ROA = {roa:.2f}%. {'✓ Positive — company generates profit from assets.' if passed else '✗ Negative — company is unprofitable.'}",
        ))

    # Criterion 2: Positive Operating Cash Flow
    if cy_ocf is not None:
        available += 1
        passed = cy_ocf > 0
        if passed:
            score += 1
        items.append(PiotroskiItem(
            criterion_id=2,
            name="Positive Operating Cash Flow",
            description="Operating Cash Flow > 0 (company generates real cash)",
            formula="OCF from Cash Flow Statement",
            value=cy_ocf,
            passed=passed,
            group="Profitability",
            interpretation=f"OCF = {cy_ocf:,.0f}. {'✓ Positive cash generation from operations.' if passed else '✗ Negative OCF — operations consuming cash.'}",
        ))

    # Criterion 3: Improving ROA (ROA increasing vs prior year)
    if roa is not None and py_net_income is not None and py_total_assets is not None:
        available += 1
        py_roa = calculate_roa(py_net_income, py_total_assets)
        if py_roa is not None:
            passed = roa > py_roa
            if passed:
                score += 1
            items.append(PiotroskiItem(
                criterion_id=3,
                name="Improving ROA",
                description="ROA increased year-over-year",
                formula="Current ROA > Prior Year ROA",
                value=roa - py_roa,
                passed=passed,
                group="Profitability",
                interpretation=f"ROA change: {roa - py_roa:+.2f}%. {'✓ ROA improved year-over-year.' if passed else '✗ ROA declined year-over-year.'}",
            ))

    # Criterion 4: Accruals (Quality of Earnings)
    # Accrual ratio = OCF/Assets - ROA; negative is better (cash earnings > accounting earnings)
    if cy_ocf is not None and cy_total_assets is not None and cy_total_assets > 0 and roa is not None:
        available += 1
        accruals = (cy_ocf / cy_total_assets) - (roa / 100)  # both in ratio form
        passed = accruals > 0  # OCF/Assets > ROA means OCF > Net Income
        if passed:
            score += 1
        items.append(PiotroskiItem(
            criterion_id=4,
            name="Earnings Quality (Accruals)",
            description="Operating Cash Flow > Net Income (high earnings quality)",
            formula="(OCF / Total Assets) > ROA",
            value=accruals,
            passed=passed,
            group="Profitability",
            interpretation=f"{'✓ Cash earnings exceed accounting earnings — high quality.' if passed else '✗ Accounting earnings exceed cash — potential accruals concern.'}",
        ))

    # ── GROUP 2: Leverage / Liquidity ─────────────────────────────────────────

    # Criterion 5: Lower Leverage (Long-term debt ratio decreased)
    if cy_long_term_debt is not None and cy_total_assets is not None and cy_total_assets > 0:
        if py_long_term_debt is not None and py_total_assets is not None and py_total_assets > 0:
            available += 1
            cy_leverage = cy_long_term_debt / cy_total_assets
            py_leverage = py_long_term_debt / py_total_assets
            passed = cy_leverage < py_leverage
            if passed:
                score += 1
            items.append(PiotroskiItem(
                criterion_id=5,
                name="Lower Financial Leverage",
                description="Long-term debt ratio decreased vs prior year",
                formula="LTD/Assets (current) < LTD/Assets (prior)",
                value=cy_leverage - py_leverage,
                passed=passed,
                group="Leverage/Liquidity",
                interpretation=f"Leverage change: {(cy_leverage - py_leverage) * 100:+.2f}%. {'✓ Leverage decreased.' if passed else '✗ Leverage increased.'}",
            ))

    # Criterion 6: Improving Current Ratio
    cy_cr = calculate_current_ratio(cy_current_assets, cy_current_liabilities)
    if cy_cr is not None and py and py_current_assets is not None and py_current_liabilities is not None:
        py_cr = calculate_current_ratio(py_current_assets, py_current_liabilities)
        if py_cr is not None:
            available += 1
            passed = cy_cr > py_cr
            if passed:
                score += 1
            items.append(PiotroskiItem(
                criterion_id=6,
                name="Improving Liquidity",
                description="Current ratio improved vs prior year",
                formula="Current Ratio (current) > Current Ratio (prior)",
                value=cy_cr - py_cr,
                passed=passed,
                group="Leverage/Liquidity",
                interpretation=f"Current ratio: {cy_cr:.2f} vs prior {py_cr:.2f}. {'✓ Liquidity improved.' if passed else '✗ Liquidity declined.'}",
            ))

    # Criterion 7: No New Share Issuance
    if cy_shares is not None and py_shares is not None:
        available += 1
        passed = cy_shares <= py_shares * 1.02  # allow 2% tolerance for rounding
        if passed:
            score += 1
        items.append(PiotroskiItem(
            criterion_id=7,
            name="No Dilution",
            description="No new shares issued (no dilution of existing shareholders)",
            formula="Shares outstanding (current) <= Shares outstanding (prior)",
            value=cy_shares - py_shares if py_shares else None,
            passed=passed,
            group="Leverage/Liquidity",
            interpretation=f"{'✓ No significant share dilution.' if passed else '✗ New shares issued — potential dilution concern.'}",
        ))
    elif not shares_issued_this_year:
        available += 1
        score += 1  # Benefit of the doubt if no data
        items.append(PiotroskiItem(
            criterion_id=7,
            name="No Dilution",
            description="No new shares issued (assumed from available data)",
            formula="Shares outstanding (current) <= Shares outstanding (prior)",
            value=None,
            passed=True,
            group="Leverage/Liquidity",
            interpretation="✓ No new share issuance detected.",
        ))

    # ── GROUP 3: Operating Efficiency ──────────────────────────────────────────

    # Criterion 8: Improving Gross Margin
    cy_gm = calculate_gross_margin(cy_gross_profit, cy_revenue)
    if cy_gm is not None and py_gross_profit is not None and py_revenue is not None:
        py_gm = calculate_gross_margin(py_gross_profit, py_revenue)
        if py_gm is not None:
            available += 1
            passed = cy_gm > py_gm
            if passed:
                score += 1
            items.append(PiotroskiItem(
                criterion_id=8,
                name="Improving Gross Margin",
                description="Gross margin increased vs prior year",
                formula="Gross Margin (current) > Gross Margin (prior)",
                value=cy_gm - py_gm,
                passed=passed,
                group="Operating Efficiency",
                interpretation=f"Gross margin: {cy_gm:.2f}% vs prior {py_gm:.2f}%. {'✓ Margin expanding.' if passed else '✗ Margin contracting.'}",
            ))

    # Criterion 9: Improving Asset Turnover
    cy_at = cy_revenue / cy_total_assets if (cy_revenue and cy_total_assets and cy_total_assets > 0) else None
    if cy_at is not None and py_revenue is not None and py_total_assets is not None and py_total_assets > 0:
        available += 1
        py_at = py_revenue / py_total_assets
        passed = cy_at > py_at
        if passed:
            score += 1
        items.append(PiotroskiItem(
            criterion_id=9,
            name="Improving Asset Turnover",
            description="Asset turnover ratio increased vs prior year",
            formula="Revenue / Total Assets (current) > (prior)",
            value=cy_at - py_at,
            passed=passed,
            group="Operating Efficiency",
            interpretation=f"Asset turnover: {cy_at:.2f}x vs prior {py_at:.2f}x. {'✓ Efficiency improving.' if passed else '✗ Efficiency declining.'}",
        ))

    # ── Risk Level ─────────────────────────────────────────────────────────────
    if score >= 8:
        risk_level = "Strong"
        interpretation = f"F-Score {score}/9: Strong financial position. Most profitability, leverage, and efficiency indicators are positive."
    elif score >= 5:
        risk_level = "Moderate"
        interpretation = f"F-Score {score}/9: Moderate financial position. Mixed signals — some areas of strength and some weakness."
    else:
        risk_level = "Weak"
        interpretation = f"F-Score {score}/9: Weak financial indicators. Multiple areas of financial stress detected."

    # ── Data Quality ───────────────────────────────────────────────────────────
    if available >= 8:
        data_quality = "complete"
    elif available >= 5:
        data_quality = "partial"
    else:
        data_quality = "insufficient"

    return PiotroskiResult(
        score=score,
        items=items,
        risk_level=risk_level,
        interpretation=interpretation,
        data_quality=data_quality,
        criteria_available=available,
    )
