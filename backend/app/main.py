import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.database import init_db

from app.api.weather import router as weather_router
from app.api.location import router as location_router
from app.api.chat import router as chat_router
from app.api.risk import router as risk_router
from app.api.scenario import router as scenario_router
from app.api.climate import router as climate_router
from app.api.warnings import router as warnings_router
from app.api.alerts import router as alerts_router
from app.api.verification import router as verification_router
from app.api.compare import router as compare_router

@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    yield

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title=settings.APP_NAME,
    description="Global AI Weather Intelligence Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(settings.CORS_ORIGINS.lstrip("\ufeff")),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])
app.include_router(location_router, prefix="/api/location", tags=["Location"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(risk_router, prefix="/api/risk", tags=["Risk"])
app.include_router(scenario_router, prefix="/api/scenario", tags=["Scenario"])
app.include_router(climate_router, prefix="/api/climate", tags=["Climate"])
app.include_router(warnings_router, prefix="/api/warnings", tags=["Warnings"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(verification_router, prefix="/api/verification", tags=["Verification"])
app.include_router(compare_router, prefix="/api/locations", tags=["Compare"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "The requested resource was not found."},
    )


@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )
