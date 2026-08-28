from fastapi import APIRouter, Depends, HTTPException
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.ai_service import AIService
from app.services.weather_service import WeatherService
from app.core.dependencies import get_ai_service, get_weather_service
import uuid

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    ai: AIService = Depends(get_ai_service),
    weather: WeatherService = Depends(get_weather_service)
):
    session_id = req.session_id or str(uuid.uuid4())
    intent = ai.detect_intent(req.message)
    
    loc = req.location or {"name": "London", "latitude": 51.5074, "longitude": -0.1278}
    
    try:
        w_data = await weather.get_current_weather(loc["latitude"], loc["longitude"], loc)
        
        from app.engines.risk_engine import RiskEngine
        r_engine = RiskEngine()
        r_data = r_engine.calculate_all_risks(w_data)
        
        response = await ai.generate_response(intent, w_data, r_data, req.message, loc)
        
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
