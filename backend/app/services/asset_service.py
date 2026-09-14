from backend.app.repositories.asset_repository import get_all_assets


def list_assets():
    """Return all assets from the database."""

    return get_all_assets()