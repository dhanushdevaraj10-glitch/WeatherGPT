from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.weather_service import WeatherService
from app.core.dependencies import get_weather_service
from app.schemas.schemas import CurrentWeather, WeatherForecastResponse
from typing import Optional

router = APIRouter()

@router.get("/current", response_model=CurrentWeather)
async def get_current(
    lat: float, 
    lon: float, 
    location_name: Optional[str] = "Unknown",
    weather_service: WeatherService = Depends(get_weather_service)
):
    try:
        location_info = {"name": location_name, "latitude": lat, "longitude": lon}
        data = await weather_service.get_current_weather(lat, lon, location_info)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/hourly", response_model=WeatherForecastResponse)
async def get_hourly(
    lat: float, 
    lon: float, 
    days: int = 7,
    weather_service: WeatherService = Depends(get_weather_service)
):
    try:
        location_info = {"name": "Unknown", "latitude": lat, "longitude": lon}
        return await weather_service.get_forecast(lat, lon, days, location_info)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/daily", response_model=WeatherForecastResponse)
async def get_daily(
    lat: float, 
    lon: float, 
    days: int = 7,
    weather_service: WeatherService = Depends(get_weather_service)
):
    try:
        location_info = {"name": "Unknown", "latitude": lat, "longitude": lon}
        return await weather_service.get_forecast(lat, lon, days, location_info)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/models")
async def get_models(
    lat: float, 
    lon: float,
    weather_service: WeatherService = Depends(get_weather_service)
):
    try:
        return await weather_service.provider.get_weather_models(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/model-agreement")
async def get_model_agreement(
    lat: float, 
    lon: float,
    weather_service: WeatherService = Depends(get_weather_service)
):
    from app.engines.model_agreement_engine import ModelAgreementEngine
    engine = ModelAgreementEngine()
    try:
        models = await weather_service.provider.get_weather_models(lat, lon)
        return engine.compare_models(models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
