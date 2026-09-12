from backend.app.database import get_connection


def _format_section(row):
    """Convert a database row into the existing API format."""

    section = dict(row)

    return {
        "name": section["name"],
        "stations": section["stations"],
        "distanceKm": section["distance_km"],
        "lineType": section["line_type"],
        "traction": section["traction"],
        "capacity": section["capacity"],
    }


def get_all_sections():
    """Return all sections from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                sections.id,
                sections.name,
                sections.distance_km,
                sections.line_type,
                sections.traction,
                sections.capacity,
                GROUP_CONCAT(stations.name, ',') AS stations
            FROM sections
            LEFT JOIN section_stations
                ON sections.id = section_stations.section_id
            LEFT JOIN stations
                ON section_stations.station_id = stations.id
            GROUP BY
                sections.id,
                sections.name,
                sections.distance_km,
                sections.line_type,
                sections.traction,
                sections.capacity
            ORDER BY sections.name
            """
        ).fetchall()

    formatted = []

    for row in rows:
        section = dict(row)

        station_names = (
            section["stations"].split(",")
            if section["stations"]
            else []
        )

        section["stations"] = station_names
        formatted.append(_format_section(section))

    return formatted


def get_section_by_id(section_id: int):
    """Return a section by its database ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                sections.id,
                sections.name,
                sections.distance_km,
                sections.line_type,
                sections.traction,
                sections.capacity,
                GROUP_CONCAT(stations.name, ',') AS stations
            FROM sections
            LEFT JOIN section_stations
                ON sections.id = section_stations.section_id
            LEFT JOIN stations
                ON section_stations.station_id = stations.id
            WHERE sections.id = ?
            GROUP BY
                sections.id,
                sections.name,
                sections.distance_km,
                sections.line_type,
                sections.traction,
                sections.capacity
            """,
            (section_id,),
        ).fetchone()

    if not row:
        return None

    section = dict(row)

    section["stations"] = (
        section["stations"].split(",")
        if section["stations"]
        else []
    )

    return _format_section(section)


def create_section(
    name,
    distance_km,
    line_type,
    traction,
    capacity,
):
    """Create a new section."""

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO sections (
                name,
                distance_km,
                line_type,
                traction,
                capacity
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                name,
                distance_km,
                line_type,
                traction,
                capacity,
            ),
        )

        section_id = cursor.lastrowid

        row = connection.execute(
            """
            SELECT
                id,
                name,
                distance_km,
                line_type,
                traction,
                capacity
            FROM sections
            WHERE id = ?
            """,
            (section_id,),
        ).fetchone()

    section = dict(row)
    section["stations"] = []

    return _format_section(section)