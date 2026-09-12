from fastapi import APIRouter

from ...schemas.section import Section
from ...services.section_service import list_sections


router = APIRouter(tags=["sections"])


@router.get("/sections", response_model=list[Section])
def get_sections() -> list[Section]:
    return list_sections()