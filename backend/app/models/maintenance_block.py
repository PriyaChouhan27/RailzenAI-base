from dataclasses import dataclass


@dataclass
class MaintenanceBlock:
    id: str
    section: str
    start_time: str
    end_time: str
    block_type: str
    status: str