"""Database access helpers for the planning engine."""

from backend.app.database import get_connection


def get_sections() -> list[str]:
    """Return all railway section names."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT name
            FROM sections
            ORDER BY id
            """
        ).fetchall()

    return [row["name"] for row in rows]


def get_trains() -> list[dict]:
    """Return trains in the format expected by the planning engine."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                trains.train_number,
                trains.train_type,
                trains.origin,
                trains.destination,
                sections.name AS section,
                trains.arrival_time,
                trains.departure_time,
                trains.running_time_minutes,
                trains.service_days
            FROM trains
            LEFT JOIN sections
                ON trains.section_id = sections.id
            ORDER BY trains.id
            """
        ).fetchall()

    return [
        {
            "trainNumber": row["train_number"],
            "trainType": row["train_type"],
            "origin": row["origin"],
            "destination": row["destination"],
            "section": row["section"],
            "arrivalTime": row["arrival_time"],
            "departureTime": row["departure_time"],
            "runningTimeMinutes": row["running_time_minutes"],
            "serviceDays": row["service_days"],
        }
        for row in rows
    ]


def get_maintenance_blocks() -> list[dict]:
    """Return maintenance blocks in the format expected by the engine."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                maintenance_blocks.id,
                sections.name AS section,
                maintenance_blocks.start_time,
                maintenance_blocks.end_time,
                maintenance_blocks.block_type,
                maintenance_blocks.status
            FROM maintenance_blocks
            LEFT JOIN sections
                ON maintenance_blocks.section_id = sections.id
            ORDER BY maintenance_blocks.id
            """
        ).fetchall()

    return [
        {
            "id": row["id"],
            "section": row["section"],
            "startTime": row["start_time"],
            "endTime": row["end_time"],
            "blockType": row["block_type"],
            "status": row["status"],
        }
        for row in rows
    ]