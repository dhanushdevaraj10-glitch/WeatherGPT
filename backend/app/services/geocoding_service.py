import httpx
from typing import List, Dict, Any

class GeocodingService:
    BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
    REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"

    async def search_location(self, query: str) -> List[Dict[str, Any]]:
        params = {"name": query, "count": 10, "language": "en", "format": "json"}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("results", [])
                
                return [
                    {
                        "name": r.get("name"),
                        "country": r.get("country"),
                        "region": r.get("admin1"),
                        "latitude": r.get("latitude"),
                        "longitude": r.get("longitude"),
                        "timezone": r.get("timezone"),
                        "elevation": r.get("elevation")
                    }
                    for r in results
                ]
            except Exception:
                return []

    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        params = {"lat": lat, "lon": lon, "format": "json"}
        headers = {"User-Agent": "WeatherGPT/1.0"}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.REVERSE_URL, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                address = data.get("address", {})
                
                name = address.get("city") or address.get("town") or address.get("village") or "Unknown"
                
                return {
                    "name": name,
                    "country": address.get("country"),
                    "region": address.get("state"),
                    "latitude": lat,
                    "longitude": lon,
                    "timezone": None,
                    "elevation": None
                }
            except Exception:
                return {
                    "name": "Unknown",
                    "latitude": lat,
                    "longitude": lon
                }

    async def get_elevation(self, lat: float, lon: float) -> float:
        return 0.0
