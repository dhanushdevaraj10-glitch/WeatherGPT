from fastapi import APIRouter, Depends, Query
from app.services.geocoding_service import GeocodingService
from app.core.dependencies import get_geocoding_service
from typing import List
from app.schemas.schemas import LocationResult

router = APIRouter()

@router.get("/search", response_model=List[LocationResult])
async def search_location(
    q: str = Query(..., min_length=1),
    limit: int = 5,
    geo_service: GeocodingService = Depends(get_geocoding_service)
):
    results = await geo_service.search_location(q)
    return results[:limit]

@router.get("/reverse", response_model=LocationResult)
async def reverse_geocode(
    lat: float, 
    lon: float,
    geo_service: GeocodingService = Depends(get_geocoding_service)
):
    return await geo_service.reverse_geocode(lat, lon)
