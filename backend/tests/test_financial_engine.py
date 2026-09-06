"""
Financial Engine Unit Tests
===========================
Tests for ROE, ROIC, Piotroski F-Score, Beneish M-Score, Altman Z-Score, and DCF calculations.
"""

import pytest
from app.services.financial_engine.ratios import (
    calculate_roe,
    calculate_roic,
    calculate_gross_margin,
    calculate_net_margin,
    calculate_cagr,
    calculate_pe_ratio,
)
from app.services.financial_engine.piotroski import calculate_piotroski
from app.services.financial_engine.beneish import calculate_beneish
from app.services.financial_engine.altman import calculate_altman_z
from app.services.financial_engine.valuation import calculate_dcf

def test_roe_calculation():
    assert calculate_roe(100.0, 500.0) == 20.0
    assert calculate_roe(50.0, -100.0) is None  # Negative equity

def test_gross_margin():
    assert calculate_gross_margin(40.0, 100.0) == 40.0
    assert calculate_gross_margin(0.0, 0.0) is None

def test_cagr():
    assert calculate_cagr(100.0, 200.0, 3) == 25.99

def test_pe_ratio():
    assert calculate_pe_ratio(150.0, 10.0) == 15.0
    assert calculate_pe_ratio(100.0, -5.0) is None  # Negative earnings

def test_piotroski_score():
    cy = {
        "net_income": 100,
        "total_assets": 1000,
        "operating_cash_flow": 120,
        "gross_profit": 400,
        "revenue": 1000,
        "current_assets": 500,
        "current_liabilities": 250,
        "long_term_debt": 100,
        "shares_diluted": 100,
    }
    py = {
        "net_income": 80,
        "total_assets": 950,
        "gross_profit": 350,
        "revenue": 900,
        "current_assets": 400,
        "current_liabilities": 250,
        "long_term_debt": 120,
        "shares_diluted": 100,
    }
    res = calculate_piotroski(cy, py)
    assert res.score >= 7
    assert res.risk_level == "Strong"

def test_beneish_score():
    cy = {"revenue": 1000, "gross_profit": 400, "total_assets": 1000, "net_income": 100, "operating_cash_flow": 120}
    py = {"revenue": 900, "gross_profit": 350, "total_assets": 950, "net_income": 80, "operating_cash_flow": 90}
    res = calculate_beneish(cy, py)
    assert res.score <= -1.78

def test_altman_z():
    fin = {"total_assets": 1000, "current_assets": 500, "current_liabilities": 200, "operating_income": 150, "revenue": 1200}
    res = calculate_altman_z(fin, market_cap=1500)
    assert res.score > 2.0
    assert res.zone in ["safe", "grey"]

def test_dcf_valuation():
    fv = calculate_dcf(
        fcf=100.0,
        growth_rate_5y=10.0,
        terminal_growth_rate=3.0,
        discount_rate=10.0,
        shares_outstanding=10.0,
        net_debt=0.0
    )
    assert fv > 0
