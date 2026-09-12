from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def list_maintenance_blocks():
    """Return all maintenance blocks from the database."""

    return get_all_maintenance_blocks()