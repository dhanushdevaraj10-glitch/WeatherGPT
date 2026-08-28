import json
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./weathergpt.db"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    WEATHER_PROVIDER: str = "open_meteo"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    APP_NAME: str = "WeatherGPT"
    DEBUG: bool = False
    RATE_LIMIT: str = "100/minute"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
