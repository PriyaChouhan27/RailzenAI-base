from backend.app.repositories.maintenance_request_repository import (
    get_all_maintenance_requests,
)


def list_maintenance_requests():
    """Return all maintenance requests from the database."""

    return get_all_maintenance_requests()