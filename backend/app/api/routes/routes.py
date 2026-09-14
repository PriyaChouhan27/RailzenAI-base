from fastapi import APIRouter

from ...services.route_service import list_routes


router = APIRouter(tags=["routes"])


@router.get("/routes")
def get_routes():
    return list_routes()