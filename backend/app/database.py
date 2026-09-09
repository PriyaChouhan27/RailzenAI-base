"""Small SQLite foundation using Python's standard library."""

from pathlib import Path
import sqlite3

from .config import settings


def get_database_path() -> Path:
    """Return the configured database path without creating domain tables."""

    return Path(settings.database_path)


def get_connection() -> sqlite3.Connection:
    """Open a SQLite connection for future repository modules."""

    database_path = get_database_path()
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    """Create the SQLite file and verify the connection."""

    with get_connection() as connection:
        connection.execute("SELECT 1")