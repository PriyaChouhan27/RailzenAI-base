from backend.app.database import get_connection


def get_all_routes():
    """Return all routes from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                name,
                distance_km
            FROM routes
            ORDER BY id
            """
        ).fetchall()

    return [dict(row) for row in rows]


def get_route_by_id(route_id: str):
    """Return a route by its ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                id,
                name,
                distance_km
            FROM routes
            WHERE id = ?
            """,
            (route_id,),
        ).fetchone()

    return dict(row) if row else None


def create_route(
    route_id: str,
    name: str,
    distance_km: float,
):
    """Create a route and return the stored record."""

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO routes (
                id,
                name,
                distance_km
            )
            VALUES (?, ?, ?)
            """,
            (
                route_id,
                name,
                distance_km,
            ),
        )

        row = connection.execute(
            """
            SELECT
                id,
                name,
                distance_km
            FROM routes
            WHERE id = ?
            """,
            (route_id,),
        ).fetchone()

    return dict(row)