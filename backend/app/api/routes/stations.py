from fastapi import APIRouter

from ...services.station_service import list_stations


router = APIRouter(tags=["stations"])


@router.get("/stations")
def get_stations():
    return list_stations()
    