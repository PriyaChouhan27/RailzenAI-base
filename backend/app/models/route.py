from dataclasses import dataclass


@dataclass
class Route:
    id: str
    name: str
    stations: list[str]
    sections: list[str]
    distance_km: float