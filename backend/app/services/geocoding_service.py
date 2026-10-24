import httpx
from typing import List, Dict, Any

class GeocodingService:
    BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
    BIGDATA_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    async def search_location(self, query: str) -> List[Dict[str, Any]]:
        params = {"name": query, "count": 10, "language": "en", "format": "json"}
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
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
        # 1. Try BigDataCloud first (fast, accurate, no api key required)
        try:
            headers = {"User-Agent": "WeatherGPT/2.0 (Mozilla/5.0)"}
            async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
                res = await client.get(
                    self.BIGDATA_URL, 
                    params={"latitude": lat, "longitude": lon, "localityLanguage": "en"},
                    headers=headers
                )
                if res.status_code == 200:
                    data = res.json()
                    name = (
                        data.get("city") or 
                        data.get("locality") or 
                        data.get("principalSubdivision") or 
                        data.get("countryName")
                    )
                    if name:
                        return {
                            "name": name,
                            "country": data.get("countryName") or "",
                            "region": data.get("principalSubdivision") or "",
                            "latitude": lat,
                            "longitude": lon,
                            "timezone": None,
                            "elevation": None
                        }
        except Exception:
            pass

        # 2. Try OpenStreetMap Nominatim as fallback
        try:
            params = {
                "lat": lat, 
                "lon": lon, 
                "format": "jsonv2", 
                "zoom": 14, 
                "addressdetails": 1
            }
            headers = {"User-Agent": "WeatherGPT-Platform/2.0 (contact@weathergpt.local)"}
            async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
                response = await client.get(self.NOMINATIM_URL, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    address = data.get("address", {})
                    name = (
                        address.get("city") or 
                        address.get("town") or 
                        address.get("village") or 
                        address.get("municipality") or 
                        address.get("suburb") or 
                        address.get("county") or 
                        address.get("state_district") or 
                        address.get("hamlet") or 
                        (data.get("display_name", "").split(",")[0] if data.get("display_name") else None)
                    )
                    if name:
                        return {
                            "name": name,
                            "country": address.get("country") or "",
                            "region": address.get("state") or address.get("region") or "",
                            "latitude": lat,
                            "longitude": lon,
                            "timezone": None,
                            "elevation": None
                        }
        except Exception:
            pass

        # 3. Final guaranteed fallback with formatted coordinates
        return {
            "name": f"Location ({lat:.2f}, {lon:.2f})",
            "country": "Earth",
            "region": "GPS Coordinates",
            "latitude": lat,
            "longitude": lon,
            "timezone": None,
            "elevation": None
        }

    async def get_elevation(self, lat: float, lon: float) -> float:
        return 0.0
