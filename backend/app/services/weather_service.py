import time
from typing import Dict, Any, List
from app.providers.open_meteo import OpenMeteoProvider
from datetime import datetime, timezone

class WeatherService:
    def __init__(self):
        self.provider = OpenMeteoProvider()
        self.cache = {}

    def _get_cache_key(self, lat: float, lon: float, type: str) -> str:
        return f"{lat}_{lon}_{type}"

    async def get_current_weather(self, lat: float, lon: float, location_info: Dict[str, Any]) -> Dict[str, Any]:
        key = self._get_cache_key(lat, lon, "current")
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["time"] < 300: # 5 min
                return entry["data"]

        data = await self.provider.get_current_weather(lat, lon)
        if data.get("error"):
            if key in self.cache:
                old_data = dict(self.cache[key]["data"])
                old_data["data_status"] = "CACHED"
                return old_data
            raise ValueError(f"Failed to fetch weather: {data['error']}")
            
        data["location"] = location_info
        self.cache[key] = {"time": time.time(), "data": data}
        return data

    async def get_forecast(self, lat: float, lon: float, days: int, location_info: Dict[str, Any]) -> Dict[str, Any]:
        hourly = await self.provider.get_hourly_forecast(lat, lon, days)
        daily = await self.provider.get_daily_forecast(lat, lon, days)
        
        # Transform open-meteo hourly to standard list
        h_times = hourly.get("hourly", {}).get("time", [])
        h_data = []
        for i in range(len(h_times)):
            h_data.append({
                "time": h_times[i],
                "temperature": hourly["hourly"]["temperature_2m"][i],
                "apparent_temp": hourly["hourly"]["apparent_temperature"][i],
                "precipitation": hourly["hourly"]["precipitation"][i],
                "precip_probability": hourly["hourly"]["precipitation_probability"][i],
                "humidity": hourly["hourly"]["relative_humidity_2m"][i],
                "wind_speed": hourly["hourly"]["wind_speed_10m"][i],
                "wind_gusts": hourly["hourly"]["wind_gusts_10m"][i],
                "cloud_cover": hourly["hourly"]["cloud_cover"][i],
                "weather_code": hourly["hourly"]["weather_code"][i],
                "weather_description": self.provider._get_weather_description(hourly["hourly"]["weather_code"][i])
            })
            
        # Transform daily
        d_times = daily.get("daily", {}).get("time", [])
        d_data = []
        for i in range(len(d_times)):
            d_data.append({
                "date": d_times[i],
                "temp_max": daily["daily"]["temperature_2m_max"][i],
                "temp_min": daily["daily"]["temperature_2m_min"][i],
                "temp_mean": daily["daily"]["temperature_2m_mean"][i],
                "precipitation_sum": daily["daily"]["precipitation_sum"][i],
                "precip_probability_max": daily["daily"]["precipitation_probability_max"][i],
                "wind_speed_max": daily["daily"]["wind_speed_10m_max"][i],
                "wind_gusts_max": daily["daily"]["wind_gusts_10m_max"][i],
                "weather_code": daily["daily"]["weather_code"][i],
                "weather_description": self.provider._get_weather_description(daily["daily"]["weather_code"][i]),
                "sunrise": daily["daily"]["sunrise"][i],
                "sunset": daily["daily"]["sunset"][i],
                "uv_index_max": daily["daily"]["uv_index_max"][i]
            })

        return {
            "location": location_info,
            "hourly": h_data,
            "daily": d_data,
            "provider": self.provider.get_provider_name(),
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
