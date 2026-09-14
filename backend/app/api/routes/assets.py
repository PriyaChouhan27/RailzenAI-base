from fastapi import APIRouter

from ...services.asset_service import list_assets


router = APIRouter(tags=["assets"])


@router.get("/assets")
def get_assets():
    return list_assets()