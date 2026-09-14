from datetime import datetime

from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def _parse_datetime(value):
    """Convert an ISO datetime string into a datetime object."""

    return datetime.fromisoformat(value)


def is_window_available(section, start_time, end_time):
    """Check whether a maintenance window is available."""

    requested_start = _parse_datetime(start_time)
    requested_end = _parse_datetime(end_time)

    if requested_start >= requested_end:
        return False

    blocks = get_all_maintenance_blocks()

    for block in blocks:
        if block["section"] != section:
            continue

        block_start = _parse_datetime(block["startTime"])
        block_end = _parse_datetime(block["endTime"])

        if requested_start < block_end and block_start < requested_end:
            return False

    return True


def validate_maintenance_window(section, start_time, end_time):
    """Return a validation result for a proposed maintenance window."""

    available = is_window_available(
        section,
        start_time,
        end_time,
    )

    if available:
        return {
            "available": True,
            "section": section,
            "startTime": start_time,
            "endTime": end_time,
            "reason": "Maintenance window is available.",
        }

    return {
        "available": False,
        "section": section,
        "startTime": start_time,
        "endTime": end_time,
        "reason": "Maintenance window conflicts with an existing block.",
    }