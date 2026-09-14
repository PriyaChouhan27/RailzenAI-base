"""SQLite database setup for the RailZen AI backend."""

from pathlib import Path
import sqlite3

from .config import settings


def get_database_path() -> Path:
    """Return the configured SQLite database path."""

    return Path(settings.database_path)


def get_connection() -> sqlite3.Connection:
    """Open a SQLite database connection."""

    database_path = get_database_path()
    database_path.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row

<<<<<<< HEAD
    # Enforce foreign-key relationships in SQLite.
    connection.execute("PRAGMA foreign_keys = ON")

=======
>>>>>>> origin/backend
    return connection


def initialize_database() -> None:
    """Create the RailZen database tables."""

    with get_connection() as connection:
        connection.execute("PRAGMA foreign_keys = ON")

        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS stations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS sections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                distance_km REAL NOT NULL,
                line_type TEXT NOT NULL,
                traction TEXT NOT NULL,
                capacity INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS section_stations (
                section_id INTEGER NOT NULL,
                station_id INTEGER NOT NULL,
                sequence_order INTEGER NOT NULL,
                PRIMARY KEY (section_id, station_id),
                FOREIGN KEY (section_id) REFERENCES sections(id),
                FOREIGN KEY (station_id) REFERENCES stations(id)
            );

            CREATE TABLE IF NOT EXISTS trains (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                train_number TEXT NOT NULL UNIQUE,
                train_type TEXT NOT NULL,
                origin TEXT NOT NULL,
                destination TEXT NOT NULL,
                section_id INTEGER,
                arrival_time TEXT NOT NULL,
                departure_time TEXT NOT NULL,
                running_time_minutes INTEGER NOT NULL,
                service_days TEXT NOT NULL,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );

            CREATE TABLE IF NOT EXISTS routes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                distance_km REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS assets (
                id TEXT PRIMARY KEY,
                asset_type TEXT NOT NULL,
                name TEXT NOT NULL,
                section_id INTEGER,
                status TEXT NOT NULL,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );

            CREATE TABLE IF NOT EXISTS maintenance_requests (
                id TEXT PRIMARY KEY,
                maintenance_type TEXT NOT NULL,
                required_duration_minutes INTEGER NOT NULL,
                priority TEXT NOT NULL,
                preferred_time TEXT NOT NULL,
                section_id INTEGER,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );

            CREATE TABLE IF NOT EXISTS maintenance_blocks (
                id TEXT PRIMARY KEY,
                section_id INTEGER,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                block_type TEXT NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );
            """
        )