from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db

async def get_weather_service():
    from app.services.weather_service import WeatherService
    return WeatherService()

async def get_geocoding_service():
    from app.services.geocoding_service import GeocodingService
    return GeocodingService()

async def get_ai_service():
    from app.services.ai_service import AIService
    return AIService()
