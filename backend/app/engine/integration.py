"""Integration helpers for connecting the planning engine to the backend."""

from .models import MaintenancePlanRequest, MaintenanceWindow
from .planning_engine import PlanningEngine


PRIORITY_SCORE = {
    "critical": 4,
    "high": 3,
    "medium": 2,
    "low": 1,
}


def create_planning_engine() -> PlanningEngine:
    """Create a planning engine instance."""

    return PlanningEngine()


def _build_request(
    section: str,
    search_start: str,
    search_end: str,
    duration_minutes: int,
    interval_minutes: int = 30,
    preferred_time: str | None = None,
) -> MaintenancePlanRequest:
    """Build a planning-engine request."""

    return MaintenancePlanRequest(
        section=section,
        search_start=search_start,
        search_end=search_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        preferred_time=preferred_time,
    )


def plan_maintenance(
    section: str,
    search_start: str,
    search_end: str,
    duration_minutes: int,
    interval_minutes: int = 30,
    preferred_time: str | None = None,
) -> dict:
    """Generate conflict-free maintenance windows from database data."""

    engine = create_planning_engine()

    request = _build_request(
        section=section,
        search_start=search_start,
        search_end=search_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        preferred_time=preferred_time,
    )

    return engine.plan_from_database(request)


def schedule_maintenance(
    section: str,
    search_start: str,
    search_end: str,
    duration_minutes: int,
    interval_minutes: int = 30,
    priority: str = "medium",
    preferred_time: str | None = None,
) -> dict:
    """Generate and rank maintenance windows using the planning engine."""

    engine = create_planning_engine()

    request = _build_request(
        section=section,
        search_start=search_start,
        search_end=search_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        preferred_time=preferred_time,
    )

    planning_result = engine.plan_from_database(request)

    safe_windows = planning_result["safeWindows"]

    priority_key = priority.lower()

    if priority_key not in PRIORITY_SCORE:
        priority_key = "medium"

    priority_score = PRIORITY_SCORE[priority_key]

    candidates = []

    for window in safe_windows:
        maintenance_window = engine.calculate_impact(
            section=section,
            start_time=window["startTime"],
            end_time=window["endTime"],
        )

        affected_train_count = len(
            maintenance_window.affected_trains
        )

        impact_score = affected_train_count * 10

        if impact_score == 0:
            impact_level = "Low"
        elif impact_score <= 20:
            impact_level = "Medium"
        else:
            impact_level = "High"

        candidates.append(
            {
                "section": section,
                "startTime": window["startTime"],
                "endTime": window["endTime"],
                "durationMinutes": window["durationMinutes"],
                "priority": priority,
                "priorityScore": priority_score,
                "impactScore": impact_score,
                "impactLevel": impact_level,
                "affectedTrainCount": affected_train_count,
            }
        )

    candidates.sort(
        key=lambda candidate: (
            candidate["impactScore"],
            -candidate["priorityScore"],
            candidate["startTime"],
        )
    )

    best_candidate = candidates[0] if candidates else None

    return {
        "section": section,
        "priority": priority,
        "requestedWindow": {
            "startTime": search_start,
            "endTime": search_end,
        },
        "durationMinutes": duration_minutes,
        "candidateCount": len(candidates),
        "candidates": candidates,
        "bestCandidate": best_candidate,
    }


def analyze_maintenance_impact(
    section: str,
    start_time: str,
    end_time: str,
) -> dict:
    """Analyze the impact of a maintenance window using the engine."""

    engine = create_planning_engine()

    result = engine.calculate_impact(
        section=section,
        start_time=start_time,
        end_time=end_time,
    )

    return {
        "section": result.section,
        "startTime": result.start_time,
        "endTime": result.end_time,
        "affectedTrainCount": len(result.affected_trains),
        "affectedTrains": result.affected_trains,
        "maintenanceConflictCount": len(
            result.affected_maintenance_blocks
        ),
        "maintenanceConflicts": result.affected_maintenance_blocks,
        "impactScore": len(result.affected_trains) * 10,
        "impactLevel": (
            "Low"
            if len(result.affected_trains) == 0
            else (
                "Medium"
                if len(result.affected_trains) <= 2
                else "High"
            )
        ),
    }


def replan_maintenance(
    section: str,
    current_start_time: str,
    current_end_time: str,
    search_start: str,
    search_end: str,
    duration_minutes: int,
    interval_minutes: int = 30,
    preferred_time: str | None = None,
) -> dict:
    """Replan a maintenance window when the current window is unavailable."""

    engine = create_planning_engine()

    request = _build_request(
        section=section,
        search_start=search_start,
        search_end=search_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        preferred_time=preferred_time,
    )

    original_window = MaintenanceWindow(
        start_time=current_start_time,
        end_time=current_end_time,
        duration_minutes=duration_minutes,
    )

    result = engine.replan(
        request=request,
        original_window=original_window,
    )

    new_window = result.new_window

    return {
        "section": result.section,
        "originalWindow": {
            "startTime": result.original_window.start_time,
            "endTime": result.original_window.end_time,
            "durationMinutes": result.original_window.duration_minutes,
        },
        "newWindow": (
            {
                "startTime": new_window.start_time,
                "endTime": new_window.end_time,
                "durationMinutes": new_window.duration_minutes,
            }
            if new_window
            else None
        ),
        "replanned": result.replanned,
        "reason": result.reason,
    }