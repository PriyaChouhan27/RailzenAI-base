import json

from backend.app.database import get_connection


def _format_train(row):
    """Convert a database row into the existing API format."""

    train = dict(row)

    return {
        "trainNumber": train["train_number"],
        "trainType": train["train_type"],
        "origin": train["origin"],
        "destination": train["destination"],
        "section": train["section"],
        "arrivalTime": train["arrival_time"],
        "departureTime": train["departure_time"],
        "runningTimeMinutes": train["running_time_minutes"],
        "serviceDays": json.loads(train["service_days"]),
    }


def get_all_trains():
    """Return all trains from the database."""

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

    return [_format_train(row) for row in rows]


def get_train_by_id(train_id: int):
    """Return a train by its database ID."""

    with get_connection() as connection:
        row = connection.execute(
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
            WHERE trains.id = ?
            """,
            (train_id,),
        ).fetchone()

    return _format_train(row) if row else None