import json
from google import genai
from typing import Dict, Any, Optional
from app.core.config import settings

class AIService:
    INTENTS = [
        "CURRENT_WEATHER", "FORECAST", "HOURLY_FORECAST", "RAIN",
        "TEMPERATURE", "WIND", "WEATHER_ALERT", "TRAVEL_RISK",
        "OUTDOOR_ACTIVITY", "WHAT_IF", "CLIMATE", "HISTORICAL",
        "COMPARE_LOCATIONS", "PERSONALIZED_WEATHER", "GENERAL_WEATHER"
    ]

    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None

    def detect_intent(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["rain", "rainfall", "precipitation", "shower", "drizzle", "wet"]): return "RAIN"
        if any(w in msg for w in ["temperature", "hot", "cold", "warm", "cool", "heat"]): return "TEMPERATURE"
        if any(w in msg for w in ["wind", "windy", "gust", "breeze"]): return "WIND"
        if any(w in msg for w in ["travel", "drive", "journey", "commute", "trip", "road"]): return "TRAVEL_RISK"
        if any(w in msg for w in ["trek", "outdoor", "hike", "sport", "play", "walk", "run", "suitable"]): return "OUTDOOR_ACTIVITY"
        if any(w in msg for w in ["what if", "if rainfall", "scenario", "suppose", "increase by", "simulate"]): return "WHAT_IF"
        if any(w in msg for w in ["climate", "trend", "historical", "average", "over the years"]): return "CLIMATE"
        if any(w in msg for w in ["compare", "vs", "versus", "better", "which location"]): return "COMPARE_LOCATIONS"
        if any(w in msg for w in ["warning", "alert", "official", "imd", "government"]): return "WEATHER_ALERT"
        if any(w in msg for w in ["tomorrow", "forecast", "next", "week", "weekend"]): return "FORECAST"
        if any(w in msg for w in ["now", "current", "today", "right now"]): return "CURRENT_WEATHER"
        
        return "GENERAL_WEATHER"

    def extract_location(self, message: str) -> Optional[str]:
        # Simple extraction or use AI
        return None

    def extract_time_range(self, message: str) -> Dict[str, Any]:
        return {"start": None, "end": None, "description": "current"}

    async def generate_response(self, intent: str, weather_data: Dict[str, Any], risk_data: Dict[str, Any], message: str, location: Dict[str, Any]) -> str:
        if not self.client:
            return self.generate_rule_based_response(intent, weather_data, risk_data, message)
            
        prompt = f"""
You are WeatherGPT. Use ONLY the provided weather data. Do NOT invent numbers.
User Message: {message}
Intent: {intent}
Location: {location.get('name', 'Unknown')}
Weather Data: {json.dumps(weather_data)}
Risk Data: {json.dumps(risk_data)}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
            )
            return response.text
        except Exception:
            return self.generate_rule_based_response(intent, weather_data, risk_data, message)

    def generate_rule_based_response(self, intent: str, weather_data: Dict[str, Any], risk_data: Dict[str, Any], message: str) -> str:
        temp = weather_data.get("temperature", "unknown")
        cond = weather_data.get("weather_description", "unknown")
        
        if intent == "TEMPERATURE":
            return f"The temperature is {temp}°C."
        elif intent == "RAIN":
            precip = weather_data.get("precipitation", 0)
            return f"The precipitation is {precip}mm."
            
        return f"The current weather is {cond} with a temperature of {temp}°C."
