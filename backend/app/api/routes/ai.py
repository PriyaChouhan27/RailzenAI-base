
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.app.schemas.ai import (
    AIRecommendationRequest,
    AIRecommendationResponse,
)
from backend.app.services.ai_service import get_ai_recommendation
from backend.app.services.maintenance_ai_service import (
    generate_maintenance_ai_result,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class MaintenanceAISchedulingRequest(BaseModel):
    maintenanceRequestId: str
    windowStart: str
    windowEnd: str
    intervalMinutes: int = 30


@router.post(
    "/recommend",
    response_model=AIRecommendationResponse,
)
def recommend_maintenance(
    request: AIRecommendationRequest,
):
    """Get an AI-based maintenance recommendation."""

    return get_ai_recommendation(request)


@router.post("/schedule")
def schedule_maintenance_with_ai(
    request: MaintenanceAISchedulingRequest,
):
    """Generate an AI-prioritized maintenance schedule."""

    result = generate_maintenance_ai_result(
        maintenance_request_id=request.maintenanceRequestId,
        window_start=request.windowStart,
        window_end=request.windowEnd,
        interval_minutes=request.intervalMinutes,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Maintenance request not found.",
        )

    return result

