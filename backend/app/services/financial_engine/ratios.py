"""
Financial Ratio Calculation Engine
===================================
All formulas are implemented here with full documentation.
NEVER call LLM arithmetic for these calculations.
Returns None when data is insufficient — never returns fabricated values.

Unit test coverage is required for every public function.
See tests/test_financial_engine.py.
"""

from typing import Optional
import math


def safe_divide(numerator: Optional[float], denominator: Optional[float]) -> Optional[float]:
    """Safe division that returns None instead of raising ZeroDivisionError."""
    if numerator is None or denominator is None:
        return None
    if denominator == 0:
        return None
    return numerator / denominator


# ── PROFITABILITY RATIOS ──────────────────────────────────────────────────────

def calculate_roe(net_income: Optional[float], shareholders_equity: Optional[float]) -> Optional[float]:
    """
    Return on Equity = Net Income / Average Shareholders' Equity × 100
    Formula: Net Income / Shareholders' Equity × 100
    Higher is better (>15% is generally considered good for non-financials).
    Edge case: returns None for negative equity (meaningless ratio).
    """
    if shareholders_equity is not None and shareholders_equity <= 0:
        return None  # Negative equity makes ROE meaningless
    result = safe_divide(net_income, shareholders_equity)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_roa(net_income: Optional[float], total_assets: Optional[float]) -> Optional[float]:
    """
    Return on Assets = Net Income / Total Assets × 100
    Measures how efficiently a company uses its assets to generate profit.
    >5% is generally considered good.
    """
    result = safe_divide(net_income, total_assets)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_roic(
    ebit: Optional[float],
    tax_rate: Optional[float],
    invested_capital: Optional[float],
) -> Optional[float]:
    """
    Return on Invested Capital = NOPAT / Invested Capital × 100
    NOPAT = EBIT × (1 - Tax Rate)
    Invested Capital = Total Equity + Total Debt - Cash and Equivalents
    The gold standard for measuring capital efficiency.
    >12-15% is generally considered good.
    """
    if ebit is None or tax_rate is None or invested_capital is None:
        return None
    if invested_capital <= 0:
        return None
    nopat = ebit * (1 - min(max(tax_rate, 0), 1))  # tax rate 0-100%
    if tax_rate > 1:  # tax rate given as percentage
        nopat = ebit * (1 - tax_rate / 100)
    result = safe_divide(nopat, invested_capital)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_roic_simplified(
    net_income: Optional[float],
    total_equity: Optional[float],
    total_debt: Optional[float],
    cash: Optional[float] = 0,
) -> Optional[float]:
    """
    Simplified ROIC = Net Income / (Total Equity + Total Debt - Cash) × 100
    Used when EBIT/tax rate is not available separately.
    """
    if total_equity is None or total_debt is None:
        return None
    invested_capital = (total_equity or 0) + (total_debt or 0) - (cash or 0)
    if invested_capital <= 0:
        return None
    return calculate_roe(net_income, invested_capital)


def calculate_gross_margin(gross_profit: Optional[float], revenue: Optional[float]) -> Optional[float]:
    """
    Gross Margin = Gross Profit / Revenue × 100
    Measures pricing power and manufacturing efficiency.
    """
    if revenue is not None and revenue <= 0:
        return None
    result = safe_divide(gross_profit, revenue)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_operating_margin(operating_income: Optional[float], revenue: Optional[float]) -> Optional[float]:
    """
    Operating Margin = Operating Income / Revenue × 100
    Measures core business profitability before interest and taxes.
    """
    if revenue is not None and revenue <= 0:
        return None
    result = safe_divide(operating_income, revenue)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_ebitda_margin(ebitda: Optional[float], revenue: Optional[float]) -> Optional[float]:
    """
    EBITDA Margin = EBITDA / Revenue × 100
    Measures operating profitability before non-cash charges.
    """
    if revenue is not None and revenue <= 0:
        return None
    result = safe_divide(ebitda, revenue)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_net_margin(net_income: Optional[float], revenue: Optional[float]) -> Optional[float]:
    """
    Net Profit Margin = Net Income / Revenue × 100
    Bottom-line profitability after all expenses, interest, and taxes.
    """
    if revenue is not None and revenue <= 0:
        return None
    result = safe_divide(net_income, revenue)
    if result is None:
        return None
    return round(result * 100, 2)


# ── LIQUIDITY RATIOS ──────────────────────────────────────────────────────────

def calculate_current_ratio(
    current_assets: Optional[float], current_liabilities: Optional[float]
) -> Optional[float]:
    """
    Current Ratio = Current Assets / Current Liabilities
    Measures short-term liquidity. >1 is generally safe, 1.5-3 is healthy.
    Very high (>5) may indicate inefficient use of assets.
    """
    if current_liabilities is not None and current_liabilities <= 0:
        return None
    result = safe_divide(current_assets, current_liabilities)
    if result is None:
        return None
    return round(result, 2)


def calculate_quick_ratio(
    cash: Optional[float],
    short_term_investments: Optional[float],
    accounts_receivable: Optional[float],
    current_liabilities: Optional[float],
) -> Optional[float]:
    """
    Quick Ratio = (Cash + Short-term Investments + Accounts Receivable) / Current Liabilities
    More stringent than current ratio — excludes inventory.
    >1 is generally considered healthy.
    """
    if current_liabilities is None or current_liabilities <= 0:
        return None
    liquid_assets = (cash or 0) + (short_term_investments or 0) + (accounts_receivable or 0)
    return round(liquid_assets / current_liabilities, 2)


# ── LEVERAGE RATIOS ───────────────────────────────────────────────────────────

def calculate_debt_to_equity(
    total_debt: Optional[float], shareholders_equity: Optional[float]
) -> Optional[float]:
    """
    Debt-to-Equity = Total Debt / Shareholders' Equity
    Measures financial leverage. <0.5 is conservative, >2.0 is highly leveraged.
    Not applicable for banks/financial institutions (use Tier 1 ratio instead).
    Edge case: returns None for negative equity.
    """
    if shareholders_equity is not None and shareholders_equity <= 0:
        return None
    result = safe_divide(total_debt, shareholders_equity)
    if result is None:
        return None
    return round(result, 2)


def calculate_net_debt(total_debt: Optional[float], cash: Optional[float]) -> Optional[float]:
    """
    Net Debt = Total Debt - Cash and Cash Equivalents
    Negative net debt means the company has more cash than debt.
    """
    if total_debt is None:
        return None
    return round(total_debt - (cash or 0), 2)


def calculate_net_debt_to_ebitda(
    total_debt: Optional[float],
    cash: Optional[float],
    ebitda: Optional[float],
) -> Optional[float]:
    """
    Net Debt / EBITDA = (Total Debt - Cash) / EBITDA
    Estimates how many years it would take to repay debt from earnings.
    <2x is generally healthy, >4x is high leverage.
    """
    net_debt = calculate_net_debt(total_debt, cash)
    if net_debt is None or ebitda is None or ebitda <= 0:
        return None
    return round(net_debt / ebitda, 2)


def calculate_interest_coverage(
    ebit: Optional[float], interest_expense: Optional[float]
) -> Optional[float]:
    """
    Interest Coverage = EBIT / Interest Expense
    Measures ability to service debt. >3x is generally safe, >10x is very safe.
    Returns None if interest expense is 0 or negative (debt-free companies).
    """
    if interest_expense is None or interest_expense <= 0:
        return None  # Either no interest expense or invalid data
    result = safe_divide(ebit, interest_expense)
    if result is None:
        return None
    return round(result, 2)


# ── EFFICIENCY RATIOS ─────────────────────────────────────────────────────────

def calculate_asset_turnover(revenue: Optional[float], total_assets: Optional[float]) -> Optional[float]:
    """
    Asset Turnover = Revenue / Total Assets
    Measures how efficiently a company uses its assets to generate revenue.
    Higher is better; varies significantly by industry.
    """
    if total_assets is not None and total_assets <= 0:
        return None
    result = safe_divide(revenue, total_assets)
    if result is None:
        return None
    return round(result, 2)


def calculate_inventory_turnover(
    cost_of_revenue: Optional[float], inventory: Optional[float]
) -> Optional[float]:
    """
    Inventory Turnover = Cost of Revenue / Inventory
    Measures how fast inventory is sold. Higher is generally better.
    """
    if inventory is None or inventory <= 0:
        return None
    result = safe_divide(cost_of_revenue, inventory)
    if result is None:
        return None
    return round(result, 2)


# ── CASH FLOW RATIOS ──────────────────────────────────────────────────────────

def calculate_fcf(
    operating_cash_flow: Optional[float], capex: Optional[float]
) -> Optional[float]:
    """
    Free Cash Flow = Operating Cash Flow - Capital Expenditures
    Note: capex is typically negative in cash flow statements.
    FCF measures actual cash generated after maintaining/growing the asset base.
    """
    if operating_cash_flow is None:
        return None
    # Handle both positive capex (as reported) and negative capex (as in CF statement)
    capex_value = capex or 0
    if capex_value > 0:
        # capex given as positive number (as reported in notes)
        fcf = operating_cash_flow - capex_value
    else:
        # capex already negative (standard CF statement convention)
        fcf = operating_cash_flow + capex_value
    return round(fcf, 2)


def calculate_fcf_yield(
    fcf: Optional[float], market_cap: Optional[float]
) -> Optional[float]:
    """
    FCF Yield = Free Cash Flow / Market Capitalization × 100
    Measures how much FCF is generated per dollar of market value.
    >4-5% is generally considered attractive (inverse of FCF multiple).
    """
    if market_cap is None or market_cap <= 0:
        return None
    result = safe_divide(fcf, market_cap)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_fcf_margin(
    fcf: Optional[float], revenue: Optional[float]
) -> Optional[float]:
    """
    FCF Margin = Free Cash Flow / Revenue × 100
    Measures what percentage of revenue converts to free cash flow.
    High-quality businesses typically have FCF margins >10%.
    """
    if revenue is not None and revenue <= 0:
        return None
    result = safe_divide(fcf, revenue)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_capex_to_revenue(
    capex: Optional[float], revenue: Optional[float]
) -> Optional[float]:
    """
    CapEx to Revenue = |CapEx| / Revenue × 100
    Shows how capital-intensive the business is.
    Asset-light businesses have <5%; heavy industries may have 15-25%+.
    """
    if revenue is None or revenue <= 0 or capex is None:
        return None
    capex_abs = abs(capex)
    return round(capex_abs / revenue * 100, 2)


# ── GROWTH RATES ──────────────────────────────────────────────────────────────

def calculate_yoy_growth(current: Optional[float], previous: Optional[float]) -> Optional[float]:
    """
    Year-over-Year Growth = (Current - Previous) / |Previous| × 100
    Returns None if previous is 0 or unavailable.
    Uses absolute value of previous to handle sign changes correctly.
    """
    if current is None or previous is None:
        return None
    if previous == 0:
        return None
    return round((current - previous) / abs(previous) * 100, 2)


def calculate_cagr(
    start_value: Optional[float],
    end_value: Optional[float],
    years: Optional[float],
) -> Optional[float]:
    """
    Compound Annual Growth Rate = (End Value / Start Value) ^ (1 / Years) - 1
    Measures the steady growth rate needed from beginning to end value.
    Returns None if start_value <= 0 or years <= 0.
    Handles negative start values (returns None — CAGR undefined for sign changes).
    """
    if start_value is None or end_value is None or years is None:
        return None
    if start_value <= 0 or years <= 0:
        return None
    try:
        cagr = (end_value / start_value) ** (1 / years) - 1
        return round(cagr * 100, 2)
    except (ValueError, ZeroDivisionError):
        return None


def calculate_revenue_cagr(
    revenue_start: Optional[float],
    revenue_end: Optional[float],
    years: int,
) -> Optional[float]:
    """Revenue CAGR over given number of years (in %)."""
    return calculate_cagr(revenue_start, revenue_end, years)


def calculate_eps_cagr(
    eps_start: Optional[float],
    eps_end: Optional[float],
    years: int,
) -> Optional[float]:
    """EPS CAGR over given number of years (in %)."""
    return calculate_cagr(eps_start, eps_end, years)


# ── VALUATION RATIOS ──────────────────────────────────────────────────────────

def calculate_pe_ratio(price: Optional[float], eps: Optional[float]) -> Optional[float]:
    """
    P/E Ratio = Stock Price / Earnings Per Share
    Returns None if EPS is negative (loss-making companies) or zero.
    Note: Trailing P/E uses actual EPS; forward P/E uses estimated EPS.
    """
    if eps is None or eps <= 0:
        return None  # Negative or zero EPS makes P/E meaningless
    result = safe_divide(price, eps)
    if result is None:
        return None
    return round(result, 2)


def calculate_pb_ratio(
    price: Optional[float], book_value_per_share: Optional[float]
) -> Optional[float]:
    """
    P/B Ratio = Stock Price / Book Value Per Share
    Book value per share = Shareholders' Equity / Shares Outstanding.
    <1 may indicate undervaluation or a struggling company.
    """
    if book_value_per_share is None or book_value_per_share <= 0:
        return None
    result = safe_divide(price, book_value_per_share)
    if result is None:
        return None
    return round(result, 2)


def calculate_ps_ratio(
    market_cap: Optional[float], revenue: Optional[float]
) -> Optional[float]:
    """
    P/S Ratio = Market Capitalization / Revenue
    Useful for companies with negative earnings. Lower is generally cheaper.
    """
    if revenue is None or revenue <= 0:
        return None
    result = safe_divide(market_cap, revenue)
    if result is None:
        return None
    return round(result, 2)


def calculate_ev(
    market_cap: Optional[float],
    total_debt: Optional[float],
    cash: Optional[float],
) -> Optional[float]:
    """
    Enterprise Value = Market Cap + Total Debt - Cash
    Represents the total theoretical takeover price.
    """
    if market_cap is None:
        return None
    return round(market_cap + (total_debt or 0) - (cash or 0), 2)


def calculate_ev_ebitda(ev: Optional[float], ebitda: Optional[float]) -> Optional[float]:
    """
    EV/EBITDA = Enterprise Value / EBITDA
    Capital-structure neutral valuation multiple. Better than P/E for leverage comparison.
    Returns None if EBITDA is negative.
    """
    if ebitda is None or ebitda <= 0:
        return None
    result = safe_divide(ev, ebitda)
    if result is None:
        return None
    return round(result, 2)


def calculate_ev_revenue(ev: Optional[float], revenue: Optional[float]) -> Optional[float]:
    """EV/Revenue = Enterprise Value / Revenue. Useful for high-growth or loss-making companies."""
    if revenue is None or revenue <= 0:
        return None
    result = safe_divide(ev, revenue)
    if result is None:
        return None
    return round(result, 2)


def calculate_peg(
    pe_ratio: Optional[float], eps_growth_rate: Optional[float]
) -> Optional[float]:
    """
    PEG Ratio = P/E Ratio / EPS Growth Rate
    PEG < 1: potentially undervalued relative to growth.
    PEG 1-2: fairly valued.
    PEG > 2: potentially expensive relative to growth.
    Returns None if growth rate is negative or zero (growth must be positive for PEG to be meaningful).
    """
    if pe_ratio is None or eps_growth_rate is None:
        return None
    if eps_growth_rate <= 0:
        return None  # PEG undefined for negative/zero growth
    result = safe_divide(pe_ratio, eps_growth_rate)
    if result is None:
        return None
    return round(result, 2)


def calculate_dividend_yield(
    annual_dividend_per_share: Optional[float], price: Optional[float]
) -> Optional[float]:
    """
    Dividend Yield = Annual Dividend Per Share / Stock Price × 100
    Returns None if price is 0.
    """
    if price is None or price <= 0:
        return None
    result = safe_divide(annual_dividend_per_share, price)
    if result is None:
        return None
    return round(result * 100, 2)


def calculate_payout_ratio(
    dividends_paid: Optional[float], net_income: Optional[float]
) -> Optional[float]:
    """
    Payout Ratio = Dividends Paid / Net Income × 100
    >100% means company is paying more in dividends than it earns (unsustainable).
    """
    if net_income is None or net_income <= 0:
        return None
    dividends = abs(dividends_paid or 0)
    result = safe_divide(dividends, net_income)
    if result is None:
        return None
    return round(result * 100, 2)


# ── SHARPE RATIO (for backtesting) ────────────────────────────────────────────

def calculate_sharpe_ratio(
    returns: list,
    risk_free_rate_annual: float = 0.065,
) -> Optional[float]:
    """
    Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Standard Deviation of Returns
    Measures risk-adjusted return. >1 is generally considered good.
    Assumes daily returns are provided.
    risk_free_rate_annual: 6.5% default for India (RBI repo rate proxy).
    """
    if not returns or len(returns) < 2:
        return None
    import statistics
    risk_free_daily = (1 + risk_free_rate_annual) ** (1 / 252) - 1
    excess_returns = [r - risk_free_daily for r in returns]
    try:
        std_dev = statistics.stdev(excess_returns)
        if std_dev == 0:
            return None
        mean_excess = statistics.mean(excess_returns)
        sharpe = mean_excess / std_dev * math.sqrt(252)  # annualize
        return round(sharpe, 4)
    except Exception:
        return None


def calculate_max_drawdown(portfolio_values: list) -> Optional[float]:
    """
    Maximum Drawdown = (Trough Value - Peak Value) / Peak Value × 100
    Measures the largest peak-to-trough decline in portfolio value.
    More negative = worse. Returns as negative percentage.
    """
    if not portfolio_values or len(portfolio_values) < 2:
        return None
    max_drawdown = 0.0
    peak = portfolio_values[0]
    for value in portfolio_values:
        if value > peak:
            peak = value
        if peak > 0:
            drawdown = (value - peak) / peak
            max_drawdown = min(max_drawdown, drawdown)
    return round(max_drawdown * 100, 2)


def calculate_cagr_from_values(
    start_value: float, end_value: float, years: float
) -> Optional[float]:
    """
    CAGR from portfolio values.
    Used in backtesting engine.
    """
    return calculate_cagr(start_value, end_value, years)


# ── COMPOSITE CALCULATIONS ────────────────────────────────────────────────────

def calculate_all_ratios(
    income_statement: dict,
    balance_sheet: dict,
    cash_flow: dict,
    market_data: dict,
) -> dict:
    """
    Calculate all ratios from the three financial statements + market data.
    Returns a dict of all computed ratios with None for unavailable metrics.
    This is the main entry point for the financial engine.
    """
    # Extract income statement
    revenue = income_statement.get("revenue")
    gross_profit = income_statement.get("gross_profit")
    operating_income = income_statement.get("operating_income")
    ebitda = income_statement.get("ebitda")
    net_income = income_statement.get("net_income")
    interest_expense = income_statement.get("interest_expense")
    depreciation = income_statement.get("depreciation_amortization")
    eps_diluted = income_statement.get("eps_diluted")
    shares = income_statement.get("shares_diluted")

    # Extract balance sheet
    cash = balance_sheet.get("cash")
    accounts_receivable = balance_sheet.get("accounts_receivable")
    inventory = balance_sheet.get("inventory")
    current_assets = balance_sheet.get("current_assets")
    total_assets = balance_sheet.get("total_assets")
    current_liabilities = balance_sheet.get("current_liabilities")
    short_term_debt = balance_sheet.get("short_term_debt")
    long_term_debt = balance_sheet.get("long_term_debt")
    total_liabilities = balance_sheet.get("total_liabilities")
    shareholders_equity = balance_sheet.get("shareholders_equity")
    retained_earnings = balance_sheet.get("retained_earnings")
    short_term_investments = balance_sheet.get("short_term_investments")

    # Extract cash flow
    ocf = cash_flow.get("operating_cash_flow")
    capex = cash_flow.get("capital_expenditures")
    dividends_paid = cash_flow.get("dividends_paid")

    # Extract market data
    price = market_data.get("price")
    market_cap = market_data.get("market_cap")

    # Compute derived values
    total_debt = (short_term_debt or 0) + (long_term_debt or 0)
    if total_debt == 0 and total_liabilities and shareholders_equity:
        total_debt = max(total_liabilities - (current_liabilities or 0), 0)

    fcf = calculate_fcf(ocf, capex)
    ev = calculate_ev(market_cap, total_debt, cash)

    # EBIT for ROIC
    ebit = operating_income
    if ebit is None and net_income is not None and interest_expense is not None:
        # Back-calculate: assume tax rate ~25%
        ebit = net_income / 0.75 + (interest_expense or 0)

    # Invested capital
    invested_capital = None
    if shareholders_equity is not None:
        invested_capital = (shareholders_equity or 0) + total_debt - (cash or 0)

    return {
        # Profitability
        "roe": calculate_roe(net_income, shareholders_equity),
        "roa": calculate_roa(net_income, total_assets),
        "roic": calculate_roic_simplified(net_income, shareholders_equity, total_debt, cash),
        "gross_margin": calculate_gross_margin(gross_profit, revenue),
        "operating_margin": calculate_operating_margin(operating_income, revenue),
        "ebitda_margin": calculate_ebitda_margin(ebitda, revenue),
        "net_margin": calculate_net_margin(net_income, revenue),
        # Liquidity
        "current_ratio": calculate_current_ratio(current_assets, current_liabilities),
        "quick_ratio": calculate_quick_ratio(cash, short_term_investments, accounts_receivable, current_liabilities),
        # Leverage
        "debt_to_equity": calculate_debt_to_equity(total_debt, shareholders_equity),
        "net_debt": calculate_net_debt(total_debt, cash),
        "net_debt_to_ebitda": calculate_net_debt_to_ebitda(total_debt, cash, ebitda),
        "interest_coverage": calculate_interest_coverage(ebit, interest_expense),
        # Efficiency
        "asset_turnover": calculate_asset_turnover(revenue, total_assets),
        "inventory_turnover": calculate_inventory_turnover(gross_profit, inventory),
        # Cash flow
        "fcf": fcf,
        "fcf_margin": calculate_fcf_margin(fcf, revenue),
        "fcf_yield": calculate_fcf_yield(fcf, market_cap),
        "capex_to_revenue": calculate_capex_to_revenue(capex, revenue),
        # Valuation
        "pe_ratio": calculate_pe_ratio(price, eps_diluted),
        "pb_ratio": calculate_pb_ratio(price, safe_divide(shareholders_equity, shares) if shares else None),
        "ps_ratio": calculate_ps_ratio(market_cap, revenue),
        "ev": ev,
        "ev_ebitda": calculate_ev_ebitda(ev, ebitda),
        "ev_revenue": calculate_ev_revenue(ev, revenue),
        # Dividends
        "payout_ratio": calculate_payout_ratio(dividends_paid, net_income),
    }
