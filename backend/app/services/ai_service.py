from backend.app.schemas.ai import (
    AIRecommendationRequest,
    AIRecommendationResponse,
)


def get_ai_recommendation(
    request: AIRecommendationRequest,
) -> AIRecommendationResponse:
    """
    Backend interface for AI-based maintenance recommendation.

    The actual AI/ML model will be connected here later.
    """

    return AIRecommendationResponse(
        section=request.section,
        startTime=request.startTime,
        endTime=request.endTime,
        recommendation="Recommended maintenance window",
        confidence=0.80,
        riskLevel="Low",
    )