from fastapi import APIRouter

from backend.app.schemas.alert import Alert
from backend.app.services.alert_service import (
    create_alert,
    resolve_alert,
)


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
)


@router.post("", response_model=Alert)
def create_new_alert(alert: Alert):
    """Create a new railway alert."""

    return create_alert(
        alert_id=alert.id,
        alert_type=alert.alertType,
        severity=alert.severity,
        title=alert.title,
        message=alert.message,
        section=alert.section,
        train_number=alert.trainNumber,
    )


@router.post("/{alert_id}/resolve", response_model=Alert)
def resolve_existing_alert(alert: Alert):
    """Resolve an existing railway alert."""

    return resolve_alert(alert)