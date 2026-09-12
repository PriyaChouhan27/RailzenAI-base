from fastapi import APIRouter

from ...schemas.train import Train
from ...services.train_service import list_trains


router = APIRouter(tags=["trains"])


@router.get("/trains", response_model=list[Train])
def get_trains() -> list[Train]:
    return list_trains()