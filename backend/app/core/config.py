import json
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./weathergpt.db"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    AI_PROVIDER: str = "auto"
    WEATHER_PROVIDER: str = "open_meteo"
    CORS_ORIGINS: str = '["http://localhost:5173", "http://localhost:3000"]'
    APP_NAME: str = "WeatherGPT"
    DEBUG: bool = False
    RATE_LIMIT: str = "100/minute"

    # Local development keeps the key at the project root, while deployed
    # environments provide it as a normal environment variable.
    model_config = SettingsConfigDict(
        env_file=(PROJECT_ROOT / ".env.local", Path(".env")),
        extra="ignore",
    )

settings = Settings()
