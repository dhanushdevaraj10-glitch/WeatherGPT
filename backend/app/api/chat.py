from fastapi import APIRouter, Depends, HTTPException
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.ai_service import AIService
from app.services.weather_service import WeatherService
from app.services.geocoding_service import GeocodingService
from app.core.dependencies import get_ai_service, get_weather_service, get_geocoding_service
import uuid
import re

router = APIRouter()


def extract_location_query(message: str) -> str | None:
    match = re.search(r"\b(?:in|at|near)\s+([^,?.!]+)", message, re.IGNORECASE)
    if not match:
        return None

    candidate = re.split(
        r"\s+(?:today|tomorrow|tonight|now|currently|right now|this morning|this evening)\b",
        match.group(1),
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0].strip()
    return candidate or None

@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    ai: AIService = Depends(get_ai_service),
    weather: WeatherService = Depends(get_weather_service),
    geocoding: GeocodingService = Depends(get_geocoding_service),
):
    session_id = req.session_id or str(uuid.uuid4())
    intent = ai.detect_intent(req.message)
    
    loc = req.location or {"name": "London", "latitude": 51.5074, "longitude": -0.1278}
    location_query = extract_location_query(req.message)
    if location_query:
        matches = await geocoding.search_location(location_query)
        if matches:
            loc = matches[0]
    
    try:
        w_data = await weather.get_current_weather(loc["latitude"], loc["longitude"], loc)

        # Supplying the forecast on every turn lets the assistant answer natural
        # follow-ups ("what about tomorrow?") without relying on keyword matching.
        forecast = await weather.get_forecast(loc["latitude"], loc["longitude"], 7, loc)
        w_data["forecast"] = forecast
        
        from app.engines.risk_engine import RiskEngine
        r_engine = RiskEngine()
        r_data = r_engine.calculate_all_risks(w_data)
        
        response = await ai.generate_response(
            intent, w_data, r_data, req.message, loc, req.history
        )
        
        return ChatResponse(
            response=response,
            intent=intent,
            weather_data=w_data,
            risk_data=r_data,
            session_id=session_id,
            sources=[{"name": "Open-Meteo", "type": "Weather Data"}]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
