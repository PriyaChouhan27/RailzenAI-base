from backend.app.engine.priority_engine import (
    calculate_priority_score,
    classify_priority,
)
from backend.app.schemas.ai import (
    AIRecommendationRequest,
    AIRecommendationResponse,
)


def get_ai_recommendation(
    request: AIRecommendationRequest,
) -> AIRecommendationResponse:
    """Generate a maintenance recommendation using the AI priority engine."""

    if (
        request.severity is None
        or request.overdueDays is None
        or request.assetCriticality is None
    ):
        return AIRecommendationResponse(
            section=request.section,
            startTime=request.startTime,
            endTime=request.endTime,
            recommendation=(
                "AI priority calculation requires "
                "severity, overdueDays, and assetCriticality."
            ),
            confidence=0.0,
            riskLevel="Unknown",
        )

    priority_score = calculate_priority_score(
        severity=request.severity,
        overdue_days=request.overdueDays,
        asset_criticality=request.assetCriticality,
    )

    priority = classify_priority(priority_score)

    if priority == "HIGH":
        recommendation = (
            "Schedule maintenance at the earliest available window"
        )
        risk_level = "High"
    elif priority == "MEDIUM":
        recommendation = (
            "Schedule maintenance in the next suitable window"
        )
        risk_level = "Medium"
    else:
        recommendation = (
            "Maintenance can be scheduled during a normal window"
        )
        risk_level = "Low"

    return AIRecommendationResponse(
        section=request.section,
        startTime=request.startTime,
        endTime=request.endTime,
        recommendation=recommendation,
        confidence=1.0,
        riskLevel=risk_level,
        priority=priority,
        priorityScore=priority_score,
    )