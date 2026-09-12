from backend.app.services.replanning_service import (
    replan_maintenance,
)
from backend.app.services.alert_service import (
    create_planning_alerts,
)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.app.services.planning_validation_service import (
    validate_planning_system,
)
from backend.app.services.scheduling_service import (
    create_scheduling_result,
)
from backend.app.services.impact_analysis_service import (
    analyze_maintenance_impact,
)
from backend.app.services.replanning_service import (
    replan_maintenance,
)
from backend.app.repositories.maintenance_request_repository import (
    get_maintenance_request_by_id,
)


router = APIRouter(
    prefix="/planning",
    tags=["Planning"],
)


class PlanningValidationRequest(BaseModel):
    section: str
    startTime: str
    endTime: str


class SchedulingRequest(BaseModel):
    section: str
    windowStart: str
    windowEnd: str
    durationMinutes: int
    intervalMinutes: int = 30
    priority: str = "medium"


class MaintenanceRequestPlanning(BaseModel):
    maintenanceRequestId: str
    windowStart: str
    windowEnd: str
    intervalMinutes: int = 30


class ReplanningRequest(BaseModel):
    section: str
    currentStartTime: str
    currentEndTime: str
    searchWindowStart: str
    searchWindowEnd: str
    durationMinutes: int
    priority: str = "medium"
    intervalMinutes: int = 30


@router.post("/validate")
def validate_planning(request: PlanningValidationRequest):
    """Validate a proposed maintenance window and generate alerts."""

    validation_result = validate_planning_system(
        request.section,
        request.startTime,
        request.endTime,
    )

    alerts = create_planning_alerts(
        section=request.section,
        validation_result=validation_result,
    )

    validation_result["alerts"] = alerts

    return validation_result

@router.post("/schedule")
def schedule_maintenance(request: SchedulingRequest):
    """Generate and select the best maintenance window."""

    return create_scheduling_result(
        section=request.section,
        window_start=request.windowStart,
        window_end=request.windowEnd,
        duration_minutes=request.durationMinutes,
        interval_minutes=request.intervalMinutes,
        priority=request.priority,
    )


@router.post("/schedule-request")
def schedule_maintenance_request(
    request: MaintenanceRequestPlanning,
):
    """Generate a schedule directly from a maintenance request."""

    maintenance_request = get_maintenance_request_by_id(
        request.maintenanceRequestId
    )

    if maintenance_request is None:
        raise HTTPException(
            status_code=404,
            detail="Maintenance request not found.",
        )

    section = maintenance_request["section"]

    if not section:
        raise HTTPException(
            status_code=400,
            detail="Maintenance request has no section assigned.",
        )

    return create_scheduling_result(
        section=section,
        window_start=request.windowStart,
        window_end=request.windowEnd,
        duration_minutes=maintenance_request[
            "requiredDurationMinutes"
        ],
        interval_minutes=request.intervalMinutes,
        priority=maintenance_request["priority"],
    )


@router.post("/impact")
def analyze_impact(request: PlanningValidationRequest):
    """Analyze trains affected by a proposed maintenance window."""

    return analyze_maintenance_impact(
        section=request.section,
        start_time=request.startTime,
        end_time=request.endTime,
    )


@router.post("/replan")
def replan(request: ReplanningRequest):
    """Recalculate a maintenance plan when conditions change."""

    return replan_maintenance(
        section=request.section,
        current_start_time=request.currentStartTime,
        current_end_time=request.currentEndTime,
        duration_minutes=request.durationMinutes,
        priority=request.priority,
        interval_minutes=request.intervalMinutes,
        search_window_start=request.searchWindowStart,
        search_window_end=request.searchWindowEnd,
    )

