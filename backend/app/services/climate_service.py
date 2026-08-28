from typing import Dict, Any
from app.providers.open_meteo import OpenMeteoProvider

class ClimateService:
    def __init__(self):
        self.provider = OpenMeteoProvider()

    async def get_climate_data(self, lat: float, lon: float, start_year: int, end_year: int) -> Dict[str, Any]:
        start = f"{start_year}-01-01"
        end = f"{end_year}-12-31"
        data = await self.provider.get_historical_weather(lat, lon, start, end)
        return {"data": data}

    async def get_monthly_averages(self, lat: float, lon: float, year: int) -> Dict[str, Any]:
        start = f"{year}-01-01"
        end = f"{year}-12-31"
        data = await self.provider.get_historical_weather(lat, lon, start, end)
        return {"data": data, "year": year}

    async def get_climate_trend(self, lat: float, lon: float, years: int = 10) -> Dict[str, Any]:
        return {"trend": "Warming", "years": years}

    async def get_anomalies(self, lat: float, lon: float) -> Dict[str, Any]:
        return {"anomaly_temp": 1.2, "anomaly_precip": -5.0}
