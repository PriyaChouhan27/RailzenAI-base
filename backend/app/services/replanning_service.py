from backend.app.services.planning_validation_service import (
    validate_planning_system,
)
from backend.app.services.scheduling_service import (
    create_scheduling_result,
)


def is_current_plan_valid(
    section,
    start_time,
    end_time,
):
    """Check whether the current maintenance plan is still valid."""

    result = validate_planning_system(
        section=section,
        start_time=start_time,
        end_time=end_time,
    )

    return result["valid"], result


def replan_maintenance(
    section,
    current_start_time,
    current_end_time,
    duration_minutes,
    priority="medium",
    interval_minutes=30,
    search_window_start=None,
    search_window_end=None,
):
    """Recalculate the maintenance plan when the current plan is invalid."""

    current_valid, validation = is_current_plan_valid(
        section=section,
        start_time=current_start_time,
        end_time=current_end_time,
    )

    current_plan = {
        "section": section,
        "startTime": current_start_time,
        "endTime": current_end_time,
        "durationMinutes": duration_minutes,
        "priority": priority,
    }

    if current_valid:
        return {
            "replanned": False,
            "reason": "Current maintenance plan is still valid.",
            "currentPlan": current_plan,
            "validation": validation,
            "newPlan": None,
        }

    search_start = search_window_start or current_start_time
    search_end = search_window_end or current_end_time

    new_schedule = create_scheduling_result(
        section=section,
        window_start=search_start,
        window_end=search_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        priority=priority,
    )

    return {
        "replanned": True,
        "reason": "Current maintenance plan is no longer valid.",
        "currentPlan": current_plan,
        "validation": validation,
        "searchWindow": {
            "startTime": search_start,
            "endTime": search_end,
        },
        "newPlan": new_schedule,
    }