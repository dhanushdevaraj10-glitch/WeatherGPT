from typing import List, Dict, Any
from datetime import datetime, timezone

class OfficialWarningProvider:
    async def get_warnings(self, lat: float, lon: float, country_code: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

class IMDWarningProvider(OfficialWarningProvider):
    async def get_warnings(self, lat: float, lon: float, country_code: str) -> List[Dict[str, Any]]:
        return [{
            "source": "IMD",
            "warning_type": "UNKNOWN",
            "severity": "UNKNOWN",
            "issued_at": datetime.now(timezone.utc).isoformat(),
            "valid_from": datetime.now(timezone.utc).isoformat(),
            "valid_to": datetime.now(timezone.utc).isoformat(),
            "description": "Not connected to official IMD API.",
            "is_connected": False
        }]

class WarningService:
    def __init__(self):
        self.providers = [IMDWarningProvider()]

    async def get_warnings(self, lat: float, lon: float, country_code: str = "IN") -> List[Dict[str, Any]]:
        warnings = []
        for provider in self.providers:
            try:
                res = await provider.get_warnings(lat, lon, country_code)
                warnings.extend(res)
            except Exception:
                pass
        return warnings
