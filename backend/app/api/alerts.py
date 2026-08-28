from fastapi import APIRouter
from app.schemas.schemas import AlertCreate, AlertResponse
from typing import List
from datetime import datetime, timezone

router = APIRouter()

@router.post("", response_model=AlertResponse)
async def create_alert(req: AlertCreate):
    return AlertResponse(
        id=1,
        location_name=req.location_name,
        alert_type=req.alert_type,
        threshold=req.threshold,
        time_period=req.time_period,
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )

@router.get("", response_model=List[AlertResponse])
async def get_alerts(session_id: str):
    return []

@router.put("/{id}", response_model=AlertResponse)
async def update_alert(id: int):
    return AlertResponse(
        id=id, location_name="Unknown", alert_type="Rain",
        threshold=10, time_period="24h", is_active=True, created_at=datetime.now(timezone.utc)
    )

@router.delete("/{id}")
async def delete_alert(id: int):
    return {"status": "deleted"}

@router.post("/check")
async def check_alerts(lat: float, lon: float):
    return {"triggered": False, "alerts": []}
