from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Location
from app.schemas.schemas import ForecastVerificationRequest, VerificationMetrics
from app.services.forecast_verification_service import ForecastVerificationService

router = APIRouter()
async def get_location(db: AsyncSession, lat: float, lon: float) -> Location:
    location = (await db.execute(
        select(Location).where(Location.latitude == lat, Location.longitude == lon)
    )).scalars().first()
    if not location:
        location = Location(name=f"{lat}, {lon}", latitude=lat, longitude=lon)
        db.add(location)
        await db.commit()
        await db.refresh(location)
    return location

@router.get("", response_model=VerificationMetrics)
async def get_verification(lat: float, lon: float, db: AsyncSession = Depends(get_db)):
    location = await get_location(db, lat, lon)
    return await ForecastVerificationService(db).get_verification_metrics(location.id)

@router.get("/metrics", response_model=VerificationMetrics)
async def get_metrics(lat: float, lon: float, db: AsyncSession = Depends(get_db)):
    location = await get_location(db, lat, lon)
    return await ForecastVerificationService(db).get_verification_metrics(location.id)

@router.post("/store")
async def store_forecast(
    lat: float,
    lon: float,
    request: ForecastVerificationRequest,
    db: AsyncSession = Depends(get_db),
):
    location = await get_location(db, lat, lon)
    return await ForecastVerificationService(db).store_forecast(
        location.id, request.forecast_data, request.model_name
    )

@router.post("/verify")
async def verify_forecast(
    lat: float,
    lon: float,
    date: str,
    db: AsyncSession = Depends(get_db),
):
    location = await get_location(db, lat, lon)
    records = await ForecastVerificationService(db).verify_forecast(location.id, date)
    return {"status": "verified", "records_count": len(records)}
