from fastapi import APIRouter
from app.schemas.schemas import ScenarioRequest, ScenarioResponse
from app.engines.scenario_engine import ScenarioEngine

router = APIRouter()

@router.post("/simulate", response_model=ScenarioResponse)
async def simulate_scenario(req: ScenarioRequest):
    engine = ScenarioEngine()
    return engine.simulate(req.baseline, req.modifications, req.location)
