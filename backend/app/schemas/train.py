from pydantic import BaseModel


class Train(BaseModel):
    trainNumber: str
    trainType: str
    origin: str
    destination: str
    section: str
    arrivalTime: str
    departureTime: str
    runningTimeMinutes: int
    serviceDays: list[str]