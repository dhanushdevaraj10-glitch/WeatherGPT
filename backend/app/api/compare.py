from fastapi import APIRouter, Depends
from app.schemas.schemas import CompareRequest, CompareResponse
from app.services.weather_service import WeatherService
from app.core.dependencies import get_weather_service

router = APIRouter()

@router.post("/compare", response_model=CompareResponse)
async def compare_locations(
    req: CompareRequest,
    weather: WeatherService = Depends(get_weather_service)
):
    results = []
    from app.engines.risk_engine import RiskEngine
    r_engine = RiskEngine()
    
    for loc in req.locations:
        w_data = await weather.get_current_weather(loc["latitude"], loc["longitude"], loc)
        r_data = r_engine.calculate_all_risks(w_data)
        loc_res = dict(loc)
        loc_res["weather"] = w_data
        loc_res["risk"] = r_data
        results.append(loc_res)
        
    return CompareResponse(locations=results)
