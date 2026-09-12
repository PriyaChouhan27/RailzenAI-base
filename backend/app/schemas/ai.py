from pydantic import BaseModel


class AIRecommendationRequest(BaseModel):
    section: str
    startTime: str
    endTime: str
    durationMinutes: int
    priority: str = "medium"


class AIRecommendationResponse(BaseModel):
    section: str
    startTime: str
    endTime: str
    recommendation: str
    confidence: float
    riskLevel: str