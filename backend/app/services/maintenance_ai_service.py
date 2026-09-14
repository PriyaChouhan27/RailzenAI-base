
from backend.app.engine.priority_engine import (
    calculate_priority_score,
    classify_priority,
)
from backend.app.repositories.maintenance_request_repository import (
    get_maintenance_request_by_id,
)
from backend.app.services.scheduling_service import (
    create_scheduling_result,
)


def generate_maintenance_ai_result(
    maintenance_request_id: str,
    window_start: str,
    window_end: str,
    interval_minutes: int = 30,
):
    """Generate an AI-prioritized maintenance scheduling result."""

    maintenance_request = get_maintenance_request_by_id(
        maintenance_request_id
    )

    if maintenance_request is None:
        return None

    severity = maintenance_request.get("severity")
    overdue_days = maintenance_request.get("overdueDays")
    asset_criticality = maintenance_request.get("assetCriticality")

    if (
        severity is None
        or overdue_days is None
        or asset_criticality is None
    ):
        return {
            "maintenanceRequest": maintenance_request,
            "ai": {
                "available": False,
                "reason": (
                    "AI priority calculation requires "
                    "severity, overdueDays, and assetCriticality."
                ),
            },
            "schedule": None,
        }

    priority_score = calculate_priority_score(
        severity=severity,
        overdue_days=overdue_days,
        asset_criticality=asset_criticality,
    )

    priority = classify_priority(priority_score)

    schedule = create_scheduling_result(
        section=maintenance_request["section"],
        window_start=window_start,
        window_end=window_end,
        duration_minutes=maintenance_request[
            "requiredDurationMinutes"
        ],
        interval_minutes=interval_minutes,
        priority=priority,
    )

    # Preserve the AI priority information separately
    # from the scheduler's internal priority score.
    schedule["aiPriorityScore"] = priority_score
    schedule["aiPriority"] = priority

    return {
        "maintenanceRequest": maintenance_request,
        "ai": {
            "available": True,
            "priority": priority,
            "priorityScore": priority_score,
            "severity": severity,
            "overdueDays": overdue_days,
            "assetCriticality": asset_criticality,
        },
        "schedule": schedule,
    }
