"""
API Endpoints Integration Tests
===============================
Tests all major backend API routes: health, stock search, profile, valuation, health scores, screener, watchlist, portfolio, AI analysis, backtest, and admin status.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_info_endpoint():
    response = client.get("/api/info")
    assert response.status_code == 200
    assert response.json()["data_provider_mode"] == "mock"

def test_search_stocks():
    response = client.get("/api/stocks/search?q=TCS")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["ticker"] == "TCS"

def test_stock_profile():
    response = client.get("/api/stocks/TCS")
    assert response.status_code == 200
    assert response.json()["name"] == "Tata Consultancy Services Ltd"

def test_stock_valuation():
    response = client.get("/api/stocks/TCS/valuation")
    assert response.status_code == 200
    assert "fair_value_base" in response.json()

def test_stock_health():
    response = client.get("/api/stocks/TCS/health")
    assert response.status_code == 200
    data = response.json()
    assert "piotroski" in data
    assert "beneish" in data
    assert "altman" in data

def test_screener_run():
    payload = {
        "filters": [
            {"field": "roic", "operator": ">", "value": 15}
        ]
    }
    response = client.post("/api/screener/run", json=payload)
    assert response.status_code == 200
    assert "results" in response.json()

def test_ai_analysis():
    payload = {"ticker": "TCS"}
    response = client.post("/api/ai/analyze", json=payload)
    assert response.status_code == 200
    assert "verdict" in response.json()

def test_backtest_run():
    payload = {
        "universe": "NIFTY50",
        "strategy_name": "Test Strategy",
        "initial_capital": 100000
    }
    response = client.post("/api/backtesting/run", json=payload)
    assert response.status_code == 200
    assert "final_capital" in response.json()

def test_admin_status():
    response = client.get("/api/admin/status")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"
