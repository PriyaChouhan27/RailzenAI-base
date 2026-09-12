from backend.app.repositories.section_repository import get_all_sections


def list_sections():
    """Return all sections from the database."""

    return get_all_sections()