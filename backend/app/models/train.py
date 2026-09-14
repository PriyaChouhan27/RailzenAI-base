from dataclasses import dataclass


@dataclass
class Train:
    train_number: str
    train_type: str
    origin: str
    destination: str
    section: str
    arrival_time: str
    departure_time: str
    running_time_minutes: int
    service_days: list[str]