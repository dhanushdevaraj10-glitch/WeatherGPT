from abc import ABC, abstractmethod

class WeatherProvider(ABC):
    @abstractmethod
    async def get_current_weather(self, lat: float, lon: float) -> dict:
        pass

    @abstractmethod
    async def get_hourly_forecast(self, lat: float, lon: float, days: int = 7) -> dict:
        pass

    @abstractmethod
    async def get_daily_forecast(self, lat: float, lon: float, days: int = 7) -> dict:
        pass

    @abstractmethod
    async def get_historical_weather(self, lat: float, lon: float, start_date: str, end_date: str) -> dict:
        pass

    @abstractmethod
    async def get_weather_models(self, lat: float, lon: float) -> dict:
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        pass
