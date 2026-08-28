from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.schemas.schemas import RiskAssessmentResponse, LocationResult
from app.services.weather_service import WeatherService
from app.core.dependencies import get_weather_service
from app.engines.risk_engine import RiskEngine
from datetime import datetime, timezone

router = APIRouter()

class RiskAnalyzeRequest(BaseModel):
    lat: float
    lon: float
    location_name: str
    category: Optional[str] = "general"
    activity: Optional[str] = "general"

@router.post("/analyze", response_model=RiskAssessmentResponse)
async def analyze_risk(
    req: RiskAnalyzeRequest,
    weather: WeatherService = Depends(get_weather_service)
):
    try:
        loc = {"name": req.location_name, "latitude": req.lat, "longitude": req.lon}
        w_data = await weather.get_current_weather(req.lat, req.lon, loc)
        
        r_engine = RiskEngine()
        risks = r_engine.calculate_all_risks(w_data)
        
        return RiskAssessmentResponse(
            location=LocationResult(**loc),
            rain_risk=risks["rain_risk"],
            heat_risk=risks["heat_risk"],
            wind_risk=risks["wind_risk"],
            storm_risk=risks["storm_risk"],
            travel_risk=risks["travel_risk"],
            outdoor_risk=risks["outdoor_risk"],
            overall_risk=risks["overall_risk"],
            assessed_at=datetime.now(timezone.utc)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
