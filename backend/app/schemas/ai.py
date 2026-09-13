from pydantic import BaseModel


class AIRecommendationRequest(BaseModel):
    section: str
    startTime: str
    endTime: str
    durationMinutes: int
    priority: str = "medium"

    severity: int | None = None
    overdueDays: int | None = None
    assetCriticality: int | None = None


class AIRecommendationResponse(BaseModel):
    section: str
    startTime: str
    endTime: str
    recommendation: str
    confidence: float
    riskLevel: str
    priority: str | None = None
    priorityScore: int | None = None