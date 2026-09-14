from backend.app.services.maintenance_window_service import (
    validate_maintenance_window,
)
from backend.app.services.conflict_detection_service import (
    proposed_window_conflicts,
)
from backend.app.services.impact_analysis_service import (
    find_affected_trains,
)


def validate_planning_system(
    section,
    start_time,
    end_time,
):
    """Validate a proposed maintenance window."""

    window_result = validate_maintenance_window(
        section,
        start_time,
        end_time,
    )

    maintenance_conflicts = proposed_window_conflicts(
        section,
        start_time,
        end_time,
    )

    affected_trains = find_affected_trains(
        section,
        start_time,
        end_time,
    )

    return {
        "window": window_result,
        "maintenanceConflicts": maintenance_conflicts,
        "trainConflicts": affected_trains,
        "valid": (
            window_result["available"]
            and len(maintenance_conflicts) == 0
            and len(affected_trains) == 0
        ),
    }