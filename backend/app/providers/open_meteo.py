import httpx
from datetime import datetime, timezone
from typing import Dict, Any
from .base import WeatherProvider

BASE_URL = "https://api.open-meteo.com/v1"
HISTORICAL_URL = "https://archive-api.open-meteo.com/v1"

class OpenMeteoProvider(WeatherProvider):
    def get_provider_name(self) -> str:
        return "open_meteo"

    def _get_weather_description(self, code: int) -> str:
        descriptions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow fall",
            73: "Moderate snow fall",
            75: "Heavy snow fall",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail",
        }
        return descriptions.get(code, "Unknown")

    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,visibility,uv_index"
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/forecast", params=params)
                response.raise_for_status()
                data = response.json()
                current = data.get("current", {})
                return {
                    "temperature": current.get("temperature_2m", 0),
                    "apparent_temp": current.get("apparent_temperature", 0),
                    "precipitation": current.get("precipitation", 0),
                    "precip_probability": None,
                    "humidity": current.get("relative_humidity_2m", 0),
                    "wind_speed": current.get("wind_speed_10m", 0),
                    "wind_direction": current.get("wind_direction_10m", 0),
                    "wind_gusts": current.get("wind_gusts_10m", 0),
                    "cloud_cover": current.get("cloud_cover", 0),
                    "visibility": current.get("visibility", 0),
                    "uv_index": current.get("uv_index", 0),
                    "weather_code": current.get("weather_code", 0),
                    "weather_description": self._get_weather_description(current.get("weather_code", 0)),
                    "pressure": current.get("surface_pressure", 0),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "provider": self.get_provider_name(),
                    "data_status": "LIVE"
                }
            except Exception as e:
                return {"error": str(e), "data_status": "ERROR"}

    async def get_hourly_forecast(self, lat: float, lon: float, days: int = 7) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m,visibility,uv_index",
            "forecast_days": days
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/forecast", params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                return {"error": str(e)}

    async def get_daily_forecast(self, lat: float, lon: float, days: int = 7) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max",
            "forecast_days": days
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/forecast", params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                return {"error": str(e)}

    async def get_historical_weather(self, lat: float, lon: float, start_date: str, end_date: str) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max"
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{HISTORICAL_URL}/archive", params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                return {"error": str(e)}

    async def get_weather_models(self, lat: float, lon: float) -> Dict[str, Any]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "models": "best_match,gfs_global,ecmwf_ifs025",
            "current": "temperature_2m,precipitation,wind_speed_10m,relative_humidity_2m"
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/forecast", params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                return {"error": str(e)}
