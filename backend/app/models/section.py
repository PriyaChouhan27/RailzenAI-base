from dataclasses import dataclass


@dataclass
class Section:
    name: str
    stations: list[str]
    distance_km: float
    line_type: str
    traction: str
    capacity: int