from dataclasses import dataclass


@dataclass
class Route:
    id: str
    name: str
    distance_km: float