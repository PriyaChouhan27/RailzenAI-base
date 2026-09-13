
from pydantic import BaseModel


class MaintenanceRequest(BaseModel):
    id: str
    maintenanceType: str
    requiredDurationMinutes: int
    priority: str
    preferredTime: str
    section: str | None = None
    severity: int | None = None
    overdueDays: int | None = None
    assetId: str | None = None
    assetCriticality: int | None = None

