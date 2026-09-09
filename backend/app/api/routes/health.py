"""Health endpoints for local and proxied service checks."""

from fastapi import APIRouter

from ...schemas.health import HealthStatus

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> HealthStatus:
    return HealthStatus(status="ok", service="RailZen AI", phase="0.1")


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}