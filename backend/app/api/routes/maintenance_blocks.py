from fastapi import APIRouter

from ...schemas.maintenance_block import MaintenanceBlock
from ...services.maintenance_block_service import list_maintenance_blocks


router = APIRouter(tags=["maintenance"])


@router.get("/maintenance-blocks", response_model=list[MaintenanceBlock])
def get_maintenance_blocks() -> list[MaintenanceBlock]:
    return list_maintenance_blocks()