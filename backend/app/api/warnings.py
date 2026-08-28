from fastapi import APIRouter
from app.services.warning_service import WarningService
from typing import List
from app.schemas.schemas import OfficialWarning

router = APIRouter()
warning_service = WarningService()

@router.get("", response_model=List[OfficialWarning])
async def get_warnings(lat: float, lon: float, country: str = "IN"):
    return await warning_service.get_warnings(lat, lon, country)

@router.get("/official", response_model=List[OfficialWarning])
async def get_official(lat: float, lon: float):
    return await warning_service.get_warnings(lat, lon, "IN")
