from backend.app.repositories.maintenance_request_repository import (
    get_all_maintenance_requests,
)
from backend.app.repositories.maintenance_block_repository import (
    get_all_maintenance_blocks,
)


def get_pending_maintenance_requests():
    """Return all maintenance requests that need planning."""

    return get_all_maintenance_requests()


def get_existing_maintenance_blocks():
    """Return all existing maintenance blocks."""

    return get_all_maintenance_blocks()


def get_maintenance_planning_data():
    """Return the data required for maintenance planning."""

    return {
        "requests": get_pending_maintenance_requests(),
        "blocks": get_existing_maintenance_blocks(),
    }


def find_matching_blocks(request_id):
    """Find maintenance blocks on the same section as a request."""

    requests = get_all_maintenance_requests()
    blocks = get_all_maintenance_blocks()

    request = next(
        (item for item in requests if item["id"] == request_id),
        None,
    )

    if request is None:
        return []

    request_section = request.get("section")

    if not request_section:
        return []

    matching_blocks = []

    for block in blocks:
        if block["section"] == request_section:
            matching_blocks.append(block)

    return matching_blocks