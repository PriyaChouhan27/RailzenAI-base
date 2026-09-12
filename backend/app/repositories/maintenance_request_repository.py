from backend.app.database import get_connection


def _format_maintenance_request(row):
    """Convert a database row into the existing API format."""

    request = dict(row)

    return {
        "id": request["id"],
        "maintenanceType": request["maintenance_type"],
        "requiredDurationMinutes": request["required_duration_minutes"],
        "priority": request["priority"],
        "preferredTime": request["preferred_time"],
        "section": request["section"],
    }


def get_all_maintenance_requests():
    """Return all maintenance requests from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                maintenance_requests.id,
                maintenance_requests.maintenance_type,
                maintenance_requests.required_duration_minutes,
                maintenance_requests.priority,
                maintenance_requests.preferred_time,
                sections.name AS section
            FROM maintenance_requests
            LEFT JOIN sections
                ON maintenance_requests.section_id = sections.id
            ORDER BY maintenance_requests.id
            """
        ).fetchall()

    return [_format_maintenance_request(row) for row in rows]


def get_maintenance_request_by_id(request_id: str):
    """Return a maintenance request by ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                maintenance_requests.id,
                maintenance_requests.maintenance_type,
                maintenance_requests.required_duration_minutes,
                maintenance_requests.priority,
                maintenance_requests.preferred_time,
                sections.name AS section
            FROM maintenance_requests
            LEFT JOIN sections
                ON maintenance_requests.section_id = sections.id
            WHERE maintenance_requests.id = ?
            """,
            (request_id,),
        ).fetchone()

    return _format_maintenance_request(row) if row else None


def create_maintenance_request(
    request_id,
    maintenance_type,
    required_duration_minutes,
    priority,
    preferred_time,
    section_id,
):
    """Create a new maintenance request."""

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO maintenance_requests (
                id,
                maintenance_type,
                required_duration_minutes,
                priority,
                preferred_time,
                section_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request_id,
                maintenance_type,
                required_duration_minutes,
                priority,
                preferred_time,
                section_id,
            ),
        )

        row = connection.execute(
            """
            SELECT
                maintenance_requests.id,
                maintenance_requests.maintenance_type,
                maintenance_requests.required_duration_minutes,
                maintenance_requests.priority,
                maintenance_requests.preferred_time,
                sections.name AS section
            FROM maintenance_requests
            LEFT JOIN sections
                ON maintenance_requests.section_id = sections.id
            WHERE maintenance_requests.id = ?
            """,
            (request_id,),
        ).fetchone()

    return _format_maintenance_request(row)