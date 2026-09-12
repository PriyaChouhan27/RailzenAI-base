"""Block planning and timetable conflict preparation logic."""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class TimeBlock:
    """Represents a planned timetable block."""

    subject: str
    teacher: str
    room: str
    day: str
    start_time: str
    end_time: str


def create_block(
    subject: str,
    teacher: str,
    room: str,
    day: str,
    start_time: str,
    end_time: str,
) -> TimeBlock:
    """Create a timetable block."""
    return TimeBlock(
        subject=subject,
        teacher=teacher,
        room=room,
        day=day,
        start_time=start_time,
        end_time=end_time,
    )


def blocks_overlap(block1: TimeBlock, block2: TimeBlock) -> bool:
    """Check whether two blocks occur at the same time on the same day."""

    if block1.day != block2.day:
        return False

    return (
        block1.start_time < block2.end_time
        and block2.start_time < block1.end_time
    )


def find_conflicts(blocks: List[TimeBlock]) -> List[str]:
    """Find scheduling conflicts between timetable blocks."""

    conflicts: List[str] = []

    for i, block1 in enumerate(blocks):
        for block2 in blocks[i + 1 :]:
            if blocks_overlap(block1, block2):
                conflicts.append(
                    f"Conflict: {block1.subject} and {block2.subject} "
                    f"overlap on {block1.day}."
                )

    return conflicts