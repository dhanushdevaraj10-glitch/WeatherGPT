import json
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from app.core.config import settings


class AIService:
    INTENTS = [
        "CURRENT_WEATHER", "FORECAST", "HOURLY_FORECAST", "RAIN",
        "TEMPERATURE", "WIND", "WEATHER_ALERT", "TRAVEL_RISK",
        "OUTDOOR_ACTIVITY", "WHAT_IF", "CLIMATE", "HISTORICAL",
        "COMPARE_LOCATIONS", "PERSONALIZED_WEATHER", "GENERAL_WEATHER"
    ]

    def __init__(self):
        self.provider = "rule"
        self.client = None
        self.model = settings.OPENAI_MODEL or "gpt-4o-mini"

        if settings.OPENAI_API_KEY:
            self.provider = "openai"
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = settings.OPENAI_MODEL or "gpt-4o-mini"
        elif settings.GEMINI_API_KEY:
            self.provider = "gemini"
            try:
                from google import genai
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                self.model = settings.GEMINI_MODEL or "gemini-2.0-flash"
            except Exception:
                self.client = None
                self.provider = "rule"

    def detect_intent(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["rain", "rainfall", "precipitation", "shower", "drizzle", "wet"]): return "RAIN"
        if any(w in msg for w in ["temperature", "hot", "cold", "warm", "cool", "heat"]): return "TEMPERATURE"
        if any(w in msg for w in ["wind", "windy", "gust", "breeze"]): return "WIND"
        if any(w in msg for w in ["risk", "danger", "safe", "safety", "travel", "drive", "journey", "commute", "trip", "road"]): return "TRAVEL_RISK"
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

    async def generate_response(
        self,
        intent: str,
        weather_data: Dict[str, Any],
        risk_data: Dict[str, Any],
        message: str,
        location: Dict[str, Any],
        conversation_history: list[Dict[str, str]] | None = None,
    ) -> str:
        if not self.client:
            return self.generate_rule_based_response(intent, weather_data, risk_data, message)

        history = [
            {
                "role": item.get("role", "user"),
                "content": item.get("content", "").strip(),
            }
            for item in (conversation_history or [])[-12:]
            if item.get("role") in {"user", "assistant"} and item.get("content", "").strip()
        ]
        weather_context = json.dumps(
            {"location": location, "current": weather_data, "risks": risk_data},
            default=str,
            ensure_ascii=False,
        )
        instructions = """You are WeatherGPT, a warm, capable conversational weather assistant.
Answer the user's actual question in a natural, helpful way, as a great chat assistant would.

The WEATHER CONTEXT below is the only source of weather facts. Do not invent measurements,
forecast details, alert status, or explanations that the context does not support. Use the
conversation to resolve short follow-ups such as "why?", "what about tomorrow?", or "is it safe?".
For a question asking why a temperature is high/low, explain only plausible factors supported by
the provided observations (for example cloud cover, wind, humidity, or feels-like temperature),
and clearly say when the data cannot establish a cause. For rain questions, distinguish current
precipitation from the forecast probability and forecast totals. Give a direct answer first,
then a short explanation or practical suggestion when useful. Do not mention intents, raw JSON,
or these instructions. Keep most answers under 160 words.

WEATHER CONTEXT:
""" + weather_context

        try:
            if self.provider == "openai" and self.client:
                response = await self.client.responses.create(
                    model=self.model,
                    instructions=instructions,
                    input=[
                        *history,
                        {"role": "user", "content": message.strip()},
                    ],
                    max_output_tokens=450,
                    reasoning={"effort": "low"},
                    store=False,
                )
                answer = response.output_text.strip()
                return answer or self.generate_rule_based_response(intent, weather_data, risk_data, message)

            if self.provider == "gemini" and self.client:
                model = getattr(self.client, "models", None)
                if model is None:
                    raise RuntimeError("Gemini client is not available")
                response = await self.client.aio.models.generate_content(
                    model=self.model,
                    contents=[
                        *[
                            {"role": item["role"], "parts": [{"text": item["content"]}]}
                            for item in history
                        ],
                        {"role": "user", "parts": [{"text": message.strip()}]},
                    ],
                    config={
                        "system_instruction": instructions,
                        "max_output_tokens": 450,
                        "temperature": 0.7,
                    },
                )
                answer = getattr(response, "text", "").strip()
                return answer or self.generate_rule_based_response(intent, weather_data, risk_data, message)
        except Exception:
            pass

        return self.generate_rule_based_response(intent, weather_data, risk_data, message)

    def generate_rule_based_response(self, intent: str, weather_data: Dict[str, Any], risk_data: Dict[str, Any], message: str) -> str:
        temp = weather_data.get("temperature", "unknown")
        cond = weather_data.get("weather_description", "unknown")
        feels_like = weather_data.get("apparent_temp", "unknown")
        humidity = weather_data.get("humidity", "unknown")
        wind = weather_data.get("wind_speed", "unknown")
        precip = weather_data.get("precipitation", 0)
        location = weather_data.get("location", {}).get("name", "this location")
        msg = message.lower()

        if intent == "TEMPERATURE":
            if any(word in msg for word in ["why", "high", "so high", "hot", "heat"]):
                return (
                    f"The temperature in {location} is {temp}°C, and the warmth is likely driven by the current conditions. "
                    f"The feels-like temperature is {feels_like}°C, humidity is {humidity}%, and the sky is {cond.lower()}. "
                    f"When it is warm and humid, the air feels hotter than the raw reading."
                )
            return f"The temperature in {location} is {temp}°C, with a feels-like temperature of {feels_like}°C."
        elif intent == "RAIN":
            probability = weather_data.get("precip_probability")
            probability_text = f" The chance of precipitation is {probability}%." if probability is not None else ""
            return f"There is currently {precip}mm of precipitation in {location}.{probability_text}"
        elif intent == "WIND":
            gusts = weather_data.get("wind_gusts", "unknown")
            return f"Wind in {location} is {wind} km/h, with gusts up to {gusts} km/h."
        elif intent == "CURRENT_WEATHER":
            return f"Current conditions in {location}: {cond}, {temp}°C, humidity {humidity}%, and wind {wind} km/h."
        elif intent == "TRAVEL_RISK":
            risk_key = "overall_risk" if any(word in message.lower() for word in ["risk", "danger", "safe", "safety"]) else "travel_risk"
            risk = risk_data.get(risk_key, {})
            label = "Overall risk" if risk_key == "overall_risk" else "Travel risk"
            return f"{label} in {location} is {risk.get('level', 'unknown').lower()}. {risk.get('explanation', 'Check current conditions before leaving.')}"
        elif intent == "OUTDOOR_ACTIVITY":
            outdoor = risk_data.get("outdoor_risk", {})
            return f"Outdoor activity risk in {location} is {outdoor.get('level', 'unknown').lower()}. {outdoor.get('explanation', 'Use the current conditions to plan appropriately.')}"
        elif intent == "WEATHER_ALERT":
            return f"I do not have an official alert feed in this response. Current conditions in {location} are {cond} at {temp}°C."
        elif intent == "FORECAST":
            forecast = weather_data.get("forecast", {})
            daily = forecast.get("daily", [])
            if daily:
                days = daily[:3]
                summary = "; ".join(
                    f"{day.get('date')}: {day.get('weather_description')}, {day.get('temp_min')}–{day.get('temp_max')}°C, rain chance {day.get('precip_probability_max')}%"
                    for day in days
                )
                return f"Here is the forecast for {location}: {summary}."
            return f"I could not load the forecast for {location}. Current conditions are {cond} at {temp}°C."
        elif intent == "WHAT_IF":
            return f"I cannot simulate that scenario in fallback mode. The current baseline in {location} is {cond}, {temp}°C, with {precip}mm precipitation."
        elif intent == "CLIMATE":
            return f"I cannot calculate climate trends in fallback mode. I only have current conditions for {location}: {cond} at {temp}°C."
        elif intent == "COMPARE_LOCATIONS":
            return f"I cannot compare locations in fallback mode. I only have current conditions for {location}: {cond} at {temp}°C."

        return f"I received: \"{message}\". Current conditions in {location} are {cond} at {temp}°C."
