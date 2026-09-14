from pydantic import BaseModel


class Section(BaseModel):
    name: str
    stations: list[str]
    distanceKm: float
    lineType: str
    traction: str
    capacity: int