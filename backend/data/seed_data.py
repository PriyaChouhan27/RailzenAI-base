"""Seed demo railway data for RailZen AI."""

import json

from backend.app.database import get_connection, initialize_database


def seed_database() -> None:
    """Insert demo railway data if the database is empty."""

    initialize_database()

    with get_connection() as connection:
        # Avoid inserting duplicate demo data.
        existing = connection.execute(
            "SELECT COUNT(*) FROM stations"
        ).fetchone()[0]

        if existing > 0:
            print("Database already contains railway data.")
            return

        # Stations
        stations = [
            ("Central",),
            ("North Junction",),
            ("East Junction",),
            ("South Terminal",),
        ]

        connection.executemany(
            "INSERT INTO stations (name) VALUES (?)",
            stations,
        )

        station_ids = {
            row["name"]: row["id"]
            for row in connection.execute(
                "SELECT id, name FROM stations"
            ).fetchall()
        }

        # Sections
        sections = [
            (
                "SEC-01",
                45.0,
                "mainline",
                "electric",
                2,
            ),
            (
                "SEC-02",
                32.0,
                "mainline",
                "electric",
                2,
            ),
            (
                "SEC-03",
                28.0,
                "branch",
                "electric",
                1,
            ),
        ]

        connection.executemany(
            """
            INSERT INTO sections
            (name, distance_km, line_type, traction, capacity)
            VALUES (?, ?, ?, ?, ?)
            """,
            sections,
        )

        section_ids = {
            row["name"]: row["id"]
            for row in connection.execute(
                "SELECT id, name FROM sections"
            ).fetchall()
        }

        # Section-to-station relationships
        section_stations = [
            (section_ids["SEC-01"], station_ids["Central"], 1),
            (section_ids["SEC-01"], station_ids["North Junction"], 2),
            (section_ids["SEC-01"], station_ids["East Junction"], 3),

            (section_ids["SEC-02"], station_ids["East Junction"], 1),
            (section_ids["SEC-02"], station_ids["South Terminal"], 2),

            (section_ids["SEC-03"], station_ids["Central"], 1),
            (section_ids["SEC-03"], station_ids["South Terminal"], 2),
        ]

        connection.executemany(
            """
            INSERT INTO section_stations
            (section_id, station_id, sequence_order)
            VALUES (?, ?, ?)
            """,
            section_stations,
        )

        # Trains
        trains = [
            (
                "TR1001",
                "passenger",
                "Central",
                "East Junction",
                section_ids["SEC-01"],
                "2026-09-12T08:00:00",
                "2026-09-12T08:10:00",
                60,
                json.dumps(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
            ),
            (
                "TR1002",
                "passenger",
                "East Junction",
                "South Terminal",
                section_ids["SEC-02"],
                "2026-09-12T09:00:00",
                "2026-09-12T09:10:00",
                45,
                json.dumps(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
            ),
            (
                "TR2001",
                "freight",
                "Central",
                "North Junction",
                section_ids["SEC-01"],
                "2026-09-12T10:00:00",
                "2026-09-12T10:15:00",
                75,
                json.dumps(["Monday", "Wednesday", "Friday"]),
            ),
        ]

        connection.executemany(
            """
            INSERT INTO trains
            (
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
            trains,
        )

        # Routes
        routes = [
            ("ROUTE-01", "Central-East Corridor", 45.0),
            ("ROUTE-02", "East-South Corridor", 32.0),
            ("ROUTE-03", "Central-South Branch", 28.0),
        ]

        connection.executemany(
            """
            INSERT INTO routes
            (id, name, distance_km)
            VALUES (?, ?, ?)
            """,
            routes,
        )

        # Assets
        assets = [
            (
                "AST-001",
                "signal",
                "Signal SEC-01-A",
                section_ids["SEC-01"],
                "operational",
            ),
            (
                "AST-002",
                "track",
                "Track SEC-01",
                section_ids["SEC-01"],
                "operational",
            ),
            (
                "AST-003",
                "signal",
                "Signal SEC-02-A",
                section_ids["SEC-02"],
                "operational",
            ),
            (
                "AST-004",
                "track",
                "Track SEC-03",
                section_ids["SEC-03"],
                "operational",
            ),
        ]

        connection.executemany(
            """
            INSERT INTO assets
            (id, asset_type, name, section_id, status)
            VALUES (?, ?, ?, ?, ?)
            """,
            assets,
        )

        # Maintenance requests
        maintenance_requests = [
            (
                "MR-001",
                "track_inspection",
                60,
                "high",
                "2026-09-12T11:00:00",
                section_ids["SEC-01"],
            ),
            (
                "MR-002",
                "signal_maintenance",
                45,
                "medium",
                "2026-09-12T13:00:00",
                section_ids["SEC-02"],
            ),
            (
                "MR-003",
                "track_repair",
                90,
                "critical",
                "2026-09-12T15:00:00",
                section_ids["SEC-03"],
            ),
        ]

        connection.executemany(
            """
            INSERT INTO maintenance_requests
            (
                id,
                maintenance_type,
                required_duration_minutes,
                priority,
                preferred_time,
                section_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            maintenance_requests,
        )

        # Existing maintenance block used for conflict testing.
        maintenance_blocks = [
            (
                "MB-001",
                section_ids["SEC-01"],
                "2026-09-12T12:00:00",
                "2026-09-12T13:00:00",
                "planned",
                "active",
            ),
            (
                "MB-002",
                section_ids["SEC-02"],
                "2026-09-12T14:00:00",
                "2026-09-12T14:45:00",
                "inspection",
                "active",
            ),
        ]

        connection.executemany(
            """
            INSERT INTO maintenance_blocks
            (
                id,
                section_id,
                start_time,
                end_time,
                block_type,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            maintenance_blocks,
        )

        print("Demo railway data inserted successfully.")


if __name__ == "__main__":
    seed_database()