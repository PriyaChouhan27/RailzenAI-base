from datetime import datetime

from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def _parse_time(value):
    """Convert an ISO datetime string into a datetime object."""

    return datetime.fromisoformat(value)


def blocks_overlap(block_a, block_b):
    """Return True when two maintenance blocks overlap in time."""

    if block_a["section"] != block_b["section"]:
        return False

    start_a = _parse_time(block_a["startTime"])
    end_a = _parse_time(block_a["endTime"])

    start_b = _parse_time(block_b["startTime"])
    end_b = _parse_time(block_b["endTime"])

    return start_a < end_b and start_b < end_a


def find_conflicts():
    """Find overlapping maintenance blocks on the same section."""

    blocks = get_all_maintenance_blocks()
    conflicts = []

    for i in range(len(blocks)):
        for j in range(i + 1, len(blocks)):
            block_a = blocks[i]
            block_b = blocks[j]

            if blocks_overlap(block_a, block_b):
                conflicts.append(
                    {
                        "blockA": block_a["id"],
                        "blockB": block_b["id"],
                        "section": block_a["section"],
                    }
                )

    return conflicts


def proposed_window_conflicts(
    section,
    start_time,
    end_time,
):
    """Find existing maintenance blocks that conflict with a proposed window."""

    requested_start = _parse_time(start_time)
    requested_end = _parse_time(end_time)

    conflicts = []

    for block in get_all_maintenance_blocks():
        if block["section"] != section:
            continue

        block_start = _parse_time(block["startTime"])
        block_end = _parse_time(block["endTime"])

        if requested_start < block_end and block_start < requested_end:
            conflicts.append(
                {
                    "blockId": block["id"],
                    "section": section,
                    "startTime": block["startTime"],
                    "endTime": block["endTime"],
                }
            )

    return conflicts