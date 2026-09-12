"""Top-level API router."""

from fastapi import APIRouter

from .routes.health import router as health_router
from .routes.trains import router as trains_router
from .routes.sections import router as sections_router
from .routes.stations import router as stations_router
from .routes.assets import router as assets_router
from .routes.routes import router as routes_router
from .routes.maintenance_requests import router as maintenance_requests_router
from .routes.maintenance_blocks import router as maintenance_blocks_router
from .routes.planning import router as planning_router
from .routes.ai import router as ai_router
from .routes.alerts import router as alerts_router


api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(trains_router)
api_router.include_router(sections_router)
api_router.include_router(stations_router)
api_router.include_router(assets_router)
api_router.include_router(routes_router)
api_router.include_router(maintenance_requests_router)
api_router.include_router(maintenance_blocks_router)
api_router.include_router(planning_router)
api_router.include_router(ai_router)
api_router.include_router(alerts_router)