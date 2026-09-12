from fastapi import APIRouter

from backend.app.schemas.ai import (
    AIRecommendationRequest,
    AIRecommendationResponse,
)
from backend.app.services.ai_service import get_ai_recommendation


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/recommend",
    response_model=AIRecommendationResponse,
)
def recommend_maintenance(
    request: AIRecommendationRequest,
):
    """Get an AI-based maintenance recommendation."""

    return get_ai_recommendation(request)