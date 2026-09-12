from datetime import datetime, time

from backend.app.repositories.train_repository import get_all_trains
from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def _parse_time(value):
    """Convert a time or ISO datetime string into a time object."""

    if not value:
        return None

    if "T" in value:
        return datetime.fromisoformat(value).time()

    return time.fromisoformat(value)


def _times_overlap(start_a, end_a, start_b, end_b):
    """Return True when two time ranges overlap."""

    return start_a < end_b and start_b < end_a


def train_conflicts_with_block(train, block):
    """Return True when a train overlaps a maintenance block."""

    if train["section"] != block["section"]:
        return False

    train_start = _parse_time(train["departureTime"])
    train_end = _parse_time(train["arrivalTime"])

    block_start = _parse_time(block["startTime"])
    block_end = _parse_time(block["endTime"])

    if not all(
        value is not None
        for value in (
            train_start,
            train_end,
            block_start,
            block_end,
        )
    ):
        return False

    return _times_overlap(
        train_start,
        train_end,
        block_start,
        block_end,
    )


def find_train_conflicts():
    """Find trains that overlap existing maintenance blocks."""

    trains = get_all_trains()
    blocks = get_all_maintenance_blocks()

    conflicts = []

    for train in trains:
        for block in blocks:
            if train_conflicts_with_block(train, block):
                conflicts.append(
                    {
                        "trainNumber": train["trainNumber"],
                        "maintenanceBlock": block["id"],
                        "section": train["section"],
                    }
                )

    return conflicts