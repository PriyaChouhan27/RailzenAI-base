from dataclasses import dataclass


@dataclass
class MaintenanceRequest:
    id: str
    maintenance_type: str
    required_duration_minutes: int
    priority: str
    preferred_time: str
    section: str
