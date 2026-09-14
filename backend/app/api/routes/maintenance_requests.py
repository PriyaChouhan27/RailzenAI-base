from fastapi import APIRouter

from ...schemas.maintenance_request import MaintenanceRequest
from ...services.maintenance_request_service import list_maintenance_requests


router = APIRouter(tags=["maintenance"])


@router.get("/maintenance-requests", response_model=list[MaintenanceRequest])
def get_maintenance_requests() -> list[MaintenanceRequest]:
    return list_maintenance_requests()