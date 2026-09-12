from backend.app.schemas.alert import Alert


def create_alert(
    alert_id: str,
    alert_type: str,
    severity: str,
    title: str,
    message: str,
    section: str | None = None,
    train_number: str | None = None,
) -> Alert:
    """Create a railway maintenance alert."""

    return Alert(
        id=alert_id,
        alertType=alert_type,
        severity=severity,
        title=title,
        message=message,
        section=section,
        trainNumber=train_number,
        status="active",
    )


def resolve_alert(alert: Alert) -> Alert:
    """Mark an alert as resolved."""

    return alert.model_copy(update={"status": "resolved"})


def create_planning_alerts(
    section: str,
    validation_result: dict,
) -> list[Alert]:
    """Create alerts from planning validation results."""

    alerts = []

    train_conflicts = validation_result.get("trainConflicts", [])
    maintenance_conflicts = validation_result.get(
        "maintenanceConflicts",
        [],
    )

    for index, conflict in enumerate(train_conflicts, start=1):
        alerts.append(
            create_alert(
                alert_id=f"TRAIN-CONFLICT-{index}",
                alert_type="TRAIN_CONFLICT",
                severity="high",
                title="Train conflict detected",
                message=(
                    f"Maintenance planning conflicts with "
                    f"train {conflict['trainNumber']}."
                ),
                section=section,
                train_number=conflict["trainNumber"],
            )
        )

    for index, conflict in enumerate(
        maintenance_conflicts,
        start=1,
    ):
        alerts.append(
            create_alert(
                alert_id=f"MAINTENANCE-CONFLICT-{index}",
                alert_type="MAINTENANCE_CONFLICT",
                severity="medium",
                title="Maintenance conflict detected",
                message=(
                    f"Maintenance window conflicts with "
                    f"block {conflict['blockId']}."
                ),
                section=section,
            )
        )

    return alerts