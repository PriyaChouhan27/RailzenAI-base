
import json
from pathlib import Path

from backend.app.database import get_connection, initialize_database


DATA_DIR = Path("backend/app/data")


def load_json(filename):
    """Load JSON data from the backend data directory."""

    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


def migrate_sections(connection):
    """Insert sections from sections.json."""

    sections = load_json("sections.json")

    for section in sections:
        connection.execute(
            """
            INSERT OR IGNORE INTO sections (
                name,
                distance_km,
                line_type,
                traction,
                capacity
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                section["name"],
                section["distanceKm"],
                section["lineType"],
                section["traction"],
                section["capacity"],
            ),
        )


def migrate_stations(connection):
    """Insert unique stations from sections.json."""

    sections = load_json("sections.json")

    stations = set()

    for section in sections:
        stations.update(section["stations"])

    for station in sorted(stations):
        connection.execute(
            """
            INSERT OR IGNORE INTO stations (name)
            VALUES (?)
            """,
            (station,),
        )


def migrate_section_stations(connection):
    """Create section-to-station relationships."""

    sections = load_json("sections.json")

    for section in sections:
        section_row = connection.execute(
            """
            SELECT id
            FROM sections
            WHERE name = ?
            """,
            (section["name"],),
        ).fetchone()

        if not section_row:
            continue

        section_id = section_row["id"]

        for sequence_order, station_name in enumerate(
            section["stations"],
            start=1,
        ):
            station_row = connection.execute(
                """
                SELECT id
                FROM stations
                WHERE name = ?
                """,
                (station_name,),
            ).fetchone()

            if not station_row:
                continue

            connection.execute(
                """
                INSERT OR IGNORE INTO section_stations (
                    section_id,
                    station_id,
                    sequence_order
                )
                VALUES (?, ?, ?)
                """,
                (
                    section_id,
                    station_row["id"],
                    sequence_order,
                ),
            )


def migrate_trains(connection):
    """Insert trains from trains.json."""

    trains = load_json("trains.json")

    for train in trains:
        section = connection.execute(
            """
            SELECT id
            FROM sections
            WHERE name = ?
            """,
            (train["section"],),
        ).fetchone()

        section_id = section["id"] if section else None

        connection.execute(
            """
            INSERT OR IGNORE INTO trains (
                train_number,
                train_type,
                origin,
                destination,
                section_id,
                arrival_time,
                departure_time,
                running_time_minutes,
                service_days
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                train["trainNumber"],
                train["trainType"],
                train["origin"],
                train["destination"],
                section_id,
                train["arrivalTime"],
                train["departureTime"],
                train["runningTimeMinutes"],
                json.dumps(train["serviceDays"]),
            ),
        )


def migrate_maintenance_requests(connection):
    """Insert maintenance requests and connect them to sections."""

    requests = load_json("maintenance_requests.json")

    for request in requests:
        section = connection.execute(
            """
            SELECT id
            FROM sections
            WHERE name = ?
            """,
            (request["section"],),
        ).fetchone()

        section_id = section["id"] if section else None

        connection.execute(
            """
            INSERT OR IGNORE INTO maintenance_requests (
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
                request["id"],
                request["maintenanceType"],
                request["requiredDurationMinutes"],
                request["priority"],
                request["preferredTime"],
                section_id,
            ),
        )

        # Update existing requests as well.
        connection.execute(
            """
            UPDATE maintenance_requests
            SET
                maintenance_type = ?,
                required_duration_minutes = ?,
                priority = ?,
                preferred_time = ?,
                section_id = ?
            WHERE id = ?
            """,
            (
                request["maintenanceType"],
                request["requiredDurationMinutes"],
                request["priority"],
                request["preferredTime"],
                section_id,
                request["id"],
            ),
        )


def migrate_maintenance_blocks(connection):
    """Insert maintenance blocks from JSON."""

    blocks = load_json("maintenance_blocks.json")

    for block in blocks:
        section = connection.execute(
            """
            SELECT id
            FROM sections
            WHERE name = ?
            """,
            (block["section"],),
        ).fetchone()

        section_id = section["id"] if section else None

        connection.execute(
            """
            INSERT OR IGNORE INTO maintenance_blocks (
                id,
                section_id,
                start_time,
                end_time,
                block_type,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                block["id"],
                section_id,
                block["startTime"],
                block["endTime"],
                block["blockType"],
                block["status"],
            ),
        )


def migrate_assets(connection):
    """Insert assets from assets.json."""

    assets = load_json("assets.json")

    for asset in assets:
        section = connection.execute(
            """
            SELECT id
            FROM sections
            WHERE name = ?
            """,
            (asset["section"],),
        ).fetchone()

        section_id = section["id"] if section else None

        connection.execute(
            """
            INSERT OR IGNORE INTO assets (
                id,
                asset_type,
                name,
                section_id,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                asset["id"],
                asset["assetType"],
                asset["name"],
                section_id,
                asset["status"],
            ),
        )

        # Update existing assets as well.
        connection.execute(
            """
            UPDATE assets
            SET
                asset_type = ?,
                name = ?,
                section_id = ?,
                status = ?
            WHERE id = ?
            """,
            (
                asset["assetType"],
                asset["name"],
                section_id,
                asset["status"],
                asset["id"],
            ),
        )


def migrate_routes(connection):
    """Insert routes from routes.json."""

    routes = load_json("routes.json")

    for route in routes:
        connection.execute(
            """
            INSERT OR IGNORE INTO routes (
                id,
                name,
                distance_km
            )
            VALUES (?, ?, ?)
            """,
            (
                route["id"],
                route["name"],
                route["distanceKm"],
            ),
        )

        # Update existing routes as well.
        connection.execute(
            """
            UPDATE routes
            SET
                name = ?,
                distance_km = ?
            WHERE id = ?
            """,
            (
                route["name"],
                route["distanceKm"],
                route["id"],
            ),
        )


def migrate():
    """Initialize the database and migrate all demo data."""

    initialize_database()

    with get_connection() as connection:
        migrate_sections(connection)
        migrate_stations(connection)
        migrate_section_stations(connection)
        migrate_trains(connection)
        migrate_maintenance_requests(connection)
        migrate_maintenance_blocks(connection)
        migrate_assets(connection)
        migrate_routes(connection)

    print("Demo data migration completed successfully.")


if __name__ == "__main__":
    migrate()

