from enum import Enum

from pydantic import BaseModel


class MaintenanceBlockStatus(str, Enum):
    PLANNED = "Planned"
    ACTIVE = "Active"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class MaintenanceBlock(BaseModel):
    id: str
    section: str
    startTime: str
    endTime: str
    blockType: str
    status: MaintenanceBlockStatus