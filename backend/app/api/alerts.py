"""
Alerts API Router
=================
Manage real-time price and indicator alert triggers.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

DEMO_ALERTS = [
    {
        "id": "alt_1",
        "stock": {"ticker": "TCS", "name": "Tata Consultancy Services Ltd"},
        "alert_type": "fair_value",
        "condition": "below",
        "threshold_value": 3500.0,
        "is_triggered": False,
        "triggered_at": None,
        "is_active": True,
        "created_at": "2026-08-30T10:00:00Z"
    },
    {
        "id": "alt_2",
        "stock": {"ticker": "RELIANCE", "name": "Reliance Industries Ltd"},
        "alert_type": "rsi",
        "condition": "below",
        "threshold_value": 30.0,
        "is_triggered": True,
        "triggered_at": "2026-08-29T14:30:00Z",
        "is_active": True,
        "created_at": "2026-08-25T10:00:00Z"
    }
]

@router.get("")
async def get_alerts():
    return DEMO_ALERTS

@router.post("")
async def create_alert(payload: Dict[str, Any]):
    new_alert = {
        "id": f"alt_{len(DEMO_ALERTS)+1}",
        "stock": {"ticker": payload.get("ticker", "TCS"), "name": f"{payload.get('ticker', 'TCS')} Ltd"},
        "alert_type": payload.get("alert_type", "price"),
        "condition": payload.get("condition", "below"),
        "threshold_value": float(payload.get("threshold_value", 3000.0)),
        "is_triggered": False,
        "triggered_at": None,
        "is_active": True,
        "created_at": "2026-08-30T12:00:00Z"
    }
    DEMO_ALERTS.append(new_alert)
    return new_alert

@router.delete("/{id}")
async def delete_alert(id: str):
    global DEMO_ALERTS
    DEMO_ALERTS = [a for a in DEMO_ALERTS if a["id"] != id]
    return {"status": "success", "deleted_id": id}
