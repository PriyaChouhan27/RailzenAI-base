from backend.app.database import get_connection


def get_all_stations():
    """Return all stations from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, name
            FROM stations
            ORDER BY name
            """
        ).fetchall()

    return [dict(row) for row in rows]


def get_station_by_id(station_id: int):
    """Return a station by its database ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT id, name
            FROM stations
            WHERE id = ?
            """,
            (station_id,),
        ).fetchone()

    return dict(row) if row else None


def create_station(name: str):
    """Create a station and return the stored record."""

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO stations (name)
            VALUES (?)
            """,
            (name,),
        )

        station_id = cursor.lastrowid

        row = connection.execute(
            """
            SELECT id, name
            FROM stations
            WHERE id = ?
            """,
            (station_id,),
        ).fetchone()

    return dict(row)