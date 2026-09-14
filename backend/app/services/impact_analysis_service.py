
from datetime import datetime, time

from backend.app.repositories.train_repository import get_all_trains
from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def _parse_time(value):
    """Convert a time or datetime string into a time object."""

    if not value:
        return None

    if "T" in value:
        return datetime.fromisoformat(value).time()

    return time.fromisoformat(value)


def _times_overlap(start_a, end_a, start_b, end_b):
    """Check whether two time ranges overlap."""

    return start_a < end_b and start_b < end_a


def find_affected_trains(section, start_time, end_time):
    """Find trains affected by a proposed maintenance window."""

    requested_start = _parse_time(start_time)
    requested_end = _parse_time(end_time)

    if requested_start is None or requested_end is None:
        return []

    trains = get_all_trains()
    affected_trains = []

    for train in trains:
        if train["section"] != section:
            continue

        train_start = _parse_time(train["departureTime"])
        train_end = _parse_time(train["arrivalTime"])

        if train_start is None or train_end is None:
            continue

        if _times_overlap(
            train_start,
            train_end,
            requested_start,
            requested_end,
        ):
            affected_trains.append(
                {
                    "trainNumber": train["trainNumber"],
                    "section": section,
                    "departureTime": train["departureTime"],
                    "arrivalTime": train["arrivalTime"],
                }
            )

    return affected_trains


def find_maintenance_conflicts(section, start_time, end_time):
    """Find existing maintenance blocks that overlap."""

    requested_start = _parse_time(start_time)
    requested_end = _parse_time(end_time)

    if requested_start is None or requested_end is None:
        return []

    blocks = get_all_maintenance_blocks()
    conflicts = []

    for block in blocks:
        if block["section"] != section:
            continue

        block_start = _parse_time(block["startTime"])
        block_end = _parse_time(block["endTime"])

        if block_start is None or block_end is None:
            continue

        if _times_overlap(
            block_start,
            block_end,
            requested_start,
            requested_end,
        ):
            conflicts.append(
                {
                    "blockId": block["id"],
                    "section": section,
                    "startTime": block["startTime"],
                    "endTime": block["endTime"],
                    "blockType": block["blockType"],
                    "status": block["status"],
                }
            )

    return conflicts


def analyze_maintenance_impact(
    section,
    start_time,
    end_time,
):
    """Analyze the complete impact of a proposed maintenance window."""

    affected_trains = find_affected_trains(
        section,
        start_time,
        end_time,
    )

    maintenance_conflicts = find_maintenance_conflicts(
        section,
        start_time,
        end_time,
    )

    affected_train_count = len(affected_trains)
    maintenance_conflict_count = len(maintenance_conflicts)

    # Impact score is based on affected trains.
    # Maintenance conflicts are reported separately because
    # planning validation already handles their feasibility.
    impact_score = affected_train_count * 10

    if impact_score == 0:
        impact_level = "Low"
    elif impact_score <= 20:
        impact_level = "Medium"
    else:
        impact_level = "High"

    return {
        "section": section,
        "startTime": start_time,
        "endTime": end_time,
        "affectedTrainCount": affected_train_count,
        "affectedTrains": affected_trains,
        "maintenanceConflictCount": maintenance_conflict_count,
        "maintenanceConflicts": maintenance_conflicts,
        "impactScore": impact_score,
        "impactLevel": impact_level,
    }

