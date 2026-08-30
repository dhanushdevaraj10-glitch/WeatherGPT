# WeatherGPT 🌐

### *Real Weather Data. Intelligent Risk. Smarter Decisions.*

A full-stack AI-powered global weather intelligence platform combining real meteorological data, multi-model forecast analysis, geospatial intelligence, risk assessment, conversational AI, and climate analytics.

🔗link - https://frontend-zeta-beige-19.vercel.app 
---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Global Location Support** | Cities, towns, villages, regions, coordinates, GPS — worldwide |
| 📡 **Real Weather Data** | Live data from Open-Meteo (free, no key needed) |
| 🤖 **Conversational AI** | Natural language questions grounded in real weather data |
| ⚖️ **Multi-Model Comparison** | ECMWF, GFS, Best-Match model agreement analysis |
| 🎯 **Risk Intelligence** | Rain, Heat, Wind, Storm, Travel, Outdoor risk scoring |
| 📊 **Reliability Scoring** | Transparent 0–100 data quality score |
| 🌡️ **Climate Explorer** | Historical trends and anomaly detection |
| 🎭 **What-If Simulation** | Scenario modeling with clear SIMULATION labels |
| 🗺️ **Interactive Map** | React Leaflet with real-time weather markers |
| 🔔 **Smart Alerts** | Configurable threshold-based alert system |
| ✅ **Forecast Verification** | Track predicted vs actual performance |
| ⚠️ **Official Warnings** | Separate official warnings from AI risk |

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone / navigate to directory
cd WEATHERGPT

# 2. Copy and configure environment
cp .env.example .env
# Edit .env: add your GEMINI_API_KEY (optional but recommended)

# 3. Start everything
docker-compose up --build

# App available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2 — Local Development

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start backend (SQLite default — no database setup needed)
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deploy on Render

The repository includes `render.yaml` for a Render Blueprint deployment.

1. Push the repository to GitHub.
2. In Render, choose **New +** > **Blueprint** and select the repository.
3. Set `GEMINI_API_KEY` for the backend service in Render. Never commit the key.
4. After the services are created, set the frontend `VITE_API_URL` to the backend URL followed by `/api`.
5. Set the backend `CORS_ORIGINS` to a JSON array containing the frontend URL, then redeploy both services.

### Deploy with Vercel + Railway

Use Railway for the backend and PostgreSQL, and Vercel for the frontend.

#### Railway backend

1. Create a Railway project from this GitHub repository.
2. Add a PostgreSQL service.
3. Add a backend service using the repository with root directory `backend`.
4. Add `DATABASE_URL` using the Railway PostgreSQL `DATABASE_URL` reference.
5. Add `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.0-flash`, `WEATHER_PROVIDER=open_meteo`, and `DEBUG=false`.
6. Generate a public domain for the backend service.

#### Vercel frontend

1. Import this GitHub repository into Vercel.
2. Set the project root directory to `frontend`.
3. Use build command `npm run build` and output directory `dist`.
4. Add `VITE_API_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app/api`.
5. Deploy, then copy the Vercel URL.

#### CORS

Set this Railway backend variable to the Vercel URL:

```text
CORS_ORIGINS=["https://YOUR-PROJECT.vercel.app"]
```

Redeploy the Railway backend after changing `CORS_ORIGINS`.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | Defaults to SQLite for local dev |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for AI chat. Get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey). Without it, rule-based AI responses are used. |
| `GEMINI_MODEL` | No | Default: `gemini-2.0-flash` |
| `WEATHER_PROVIDER` | No | Default: `open_meteo` |

> **Weather data works completely without any API key.** Open-Meteo is free and key-free.

---

## 🏗️ Architecture

```
User Browser (React + Vite)
        │
        ▼ HTTP API
FastAPI Backend (Python)
  ├── WeatherProvider (Open-Meteo)
  ├── GeocodingService (Open-Meteo Geocoding + Nominatim)
  ├── RiskEngine
  ├── ReliabilityEngine
  ├── ModelAgreementEngine
  ├── ScenarioEngine
  ├── DecisionEngine
  ├── ForecastVerificationService
  └── AIService (Gemini / Rule-based fallback)
        │
        ▼
PostgreSQL + PostGIS (Docker)
SQLite (local dev fallback)
```

---

## 📂 Project Structure

```
WEATHERGPT/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI route handlers
│   │   ├── core/          # Config, database, dependencies
│   │   ├── engines/       # Risk, Reliability, ModelAgreement, Scenario, Decision
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── providers/     # Weather provider abstraction + Open-Meteo impl
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Weather, Geocoding, Climate, AI, Verification
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios API client
│   │   ├── components/    # Shared, layout, weather, risk, chart, map, chat
│   │   ├── hooks/         # useWeather, useGeolocation
│   │   ├── pages/         # All 11 pages
│   │   ├── store/         # Global state (React Context + useReducer)
│   │   └── types/         # TypeScript interfaces
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🧪 Running Tests

```bash
cd backend
python -m pytest tests/ -v
```

---

## 🎮 Demo Mode

The app includes a **Demo Mode** (toggle in Settings or Navbar) for demonstrations without live internet:

- Clearly labeled **"HACKATHON SIMULATION"** banner
- Simulates: Heavy Rainfall, Heat Wave, Strong Winds, Forecast Disagreement
- Demo data is NEVER presented as real weather

---

## 📡 API Reference

Full interactive docs at: `http://localhost:8000/docs`

| Endpoint | Description |
|---|---|
| `GET /api/weather/current` | Current weather for coordinates |
| `GET /api/weather/hourly` | Hourly forecast (7 days) |
| `GET /api/weather/daily` | Daily forecast (7 days) |
| `GET /api/weather/models` | Multi-model forecast comparison |
| `GET /api/location/search` | Global location search |
| `POST /api/chat` | AI conversational weather query |
| `POST /api/risk/analyze` | Risk assessment |
| `POST /api/scenario/simulate` | What-if simulation |
| `GET /api/climate/trend` | Historical climate trend |
| `GET /api/warnings` | Official warnings status |
| `GET /api/verification/metrics` | Forecast verification metrics |
| `POST /api/locations/compare` | Side-by-side location comparison |

---

## ⚠️ Responsible Weather Intelligence

- WeatherGPT **AI Risk** is an estimate — not an official government warning
- Scenario simulations are labeled **SIMULATION — NOT A GUARANTEED PREDICTION**
- For severe weather, always follow official local authority guidance
- Forecast accuracy varies with location, horizon, and weather model availability

---

## 🌐 Data Sources

| Source | Usage | Cost |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Weather forecasts, historical climate | Free |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | Global location search | Free |
| [Nominatim / OpenStreetMap](https://nominatim.org) | Reverse geocoding | Free |
| [CartoDB](https://carto.com) | Dark map tiles | Free |
| [Google Gemini](https://aistudio.google.com) | Conversational AI | Free tier available |

---

## 📜 License

Built for demonstration purposes. Weather data © respective providers.
