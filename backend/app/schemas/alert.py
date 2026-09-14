from pydantic import BaseModel


class Alert(BaseModel):
    id: str
    alertType: str
    severity: str
    title: str
    message: str
    section: str | None = None
    trainNumber: str | None = None
    status: str = "active"