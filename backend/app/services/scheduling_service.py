from datetime import datetime, timedelta

from backend.app.services.impact_analysis_service import (
    analyze_maintenance_impact,
)
from backend.app.services.planning_validation_service import (
    validate_planning_system,
)


PRIORITY_SCORE = {
    "critical": 4,
    "high": 3,
    "medium": 2,
    "low": 1,
}


def generate_candidate_windows(
    section,
    window_start,
    window_end,
    duration_minutes,
    interval_minutes=30,
    priority="medium",
):
    """Generate valid maintenance windows inside an available time range."""

    start = datetime.fromisoformat(window_start)
    end = datetime.fromisoformat(window_end)

    if start >= end:
        return []

    if duration_minutes <= 0:
        return []

    if interval_minutes <= 0:
        return []

    duration = timedelta(minutes=duration_minutes)

    candidates = []
    current_start = start

    while current_start + duration <= end:
        current_end = current_start + duration

        validation = validate_planning_system(
            section,
            current_start.isoformat(),
            current_end.isoformat(),
        )

        if validation["valid"]:
            impact = analyze_maintenance_impact(
                section,
                current_start.isoformat(),
                current_end.isoformat(),
            )

            candidates.append(
                {
                    "section": section,
                    "startTime": current_start.isoformat(),
                    "endTime": current_end.isoformat(),
                    "durationMinutes": duration_minutes,
                    "priority": priority,
                    "priorityScore": PRIORITY_SCORE.get(
                        priority.lower(),
                        PRIORITY_SCORE["medium"],
                    ),
                    "impactScore": impact["impactScore"],
                    "impactLevel": impact["impactLevel"],
                    "affectedTrainCount": impact[
                        "affectedTrainCount"
                    ],
                }
            )

        current_start += timedelta(minutes=interval_minutes)

    return candidates


def rank_candidate_windows(candidates):
    """Rank candidates by lowest impact, priority, then start time."""

    return sorted(
        candidates,
        key=lambda candidate: (
            candidate["impactScore"],
            -candidate["priorityScore"],
            candidate["startTime"],
        ),
    )


def select_best_candidate(candidates):
    """Select the best maintenance window."""

    ranked_candidates = rank_candidate_windows(candidates)

    if not ranked_candidates:
        return None

    return ranked_candidates[0]


def create_scheduling_result(
    section,
    window_start,
    window_end,
    duration_minutes,
    interval_minutes=30,
    priority="medium",
):
    """Generate, rank, and select the best maintenance window."""

    candidates = generate_candidate_windows(
        section=section,
        window_start=window_start,
        window_end=window_end,
        duration_minutes=duration_minutes,
        interval_minutes=interval_minutes,
        priority=priority,
    )

    ranked_candidates = rank_candidate_windows(candidates)
    best_candidate = select_best_candidate(ranked_candidates)

    return {
        "section": section,
        "priority": priority,
        "requestedWindow": {
            "startTime": window_start,
            "endTime": window_end,
        },
        "durationMinutes": duration_minutes,
        "candidateCount": len(candidates),
        "candidates": ranked_candidates,
        "bestCandidate": best_candidate,
    }