from backend.app.repositories.route_repository import get_all_routes


def list_routes():
    """Return all routes from the database."""

    return get_all_routes()