from backend.app.repositories.train_repository import get_all_trains


def list_trains():
    """Return all trains from the database."""

    return get_all_trains()