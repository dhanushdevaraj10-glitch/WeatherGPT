from fastapi import APIRouter
from app.services.climate_service import ClimateService

router = APIRouter()
climate_service = ClimateService()

@router.get("/history")
async def get_history(lat: float, lon: float, years: int = 5):
    import datetime
    current_year = datetime.datetime.now().year
    return await climate_service.get_climate_data(lat, lon, current_year - years, current_year)

@router.get("/trend")
async def get_trend(lat: float, lon: float, years: int = 10):
    return await climate_service.get_climate_trend(lat, lon, years)

@router.get("/monthly")
async def get_monthly(lat: float, lon: float, year: int):
    return await climate_service.get_monthly_averages(lat, lon, year)

@router.get("/anomalies")
async def get_anomalies(lat: float, lon: float):
    return await climate_service.get_anomalies(lat, lon)
