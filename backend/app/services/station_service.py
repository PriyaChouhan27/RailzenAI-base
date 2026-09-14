from backend.app.repositories.station_repository import get_all_stations


def list_stations():
    """Return all stations from the database."""

    return get_all_stations()