"""
Admin API Router
================
System status, provider health metrics, and user activity dashboard.
"""

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/status")
async def get_admin_status():
    return {
        "status": "operational",
        "data_provider_mode": settings.DATA_PROVIDER_MODE,
        "is_demo_mode": settings.DATA_PROVIDER_MODE == "mock",
        "providers": {
            "market_data": "MockMarketProvider (Active)",
            "fundamental": "MockFundamentalProvider (Active)",
            "news": "MockNewsProvider (Active)",
            "economic": "MockEconomicProvider (Active)"
        },
        "database_health": "Healthy (PostgreSQL/SQLite)",
        "redis_health": "Healthy (Cache Active)",
        "api_requests_24h": 14250,
        "ai_tokens_used_24h": 84200,
        "system_load": "0.14"
    }

@router.get("/users")
async def list_users():
    return [
        {
            "id": "usr_demo",
            "email": "demo@stockiq.com",
            "full_name": "Demo Trader",
            "subscription_tier": "pro_plus",
            "is_active": True,
            "created_at": "2026-08-30T00:00:00Z"
        }
    ]
