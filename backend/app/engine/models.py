"""Data structures used by the planning engine."""

from dataclasses import dataclass


@dataclass
class MaintenancePlanRequest:
    """Input required to generate maintenance windows."""

    section: str
    search_start: str
    search_end: str
    duration_minutes: int
    interval_minutes: int = 30
    preferred_time: str | None = None


@dataclass
class MaintenanceWindow:
    """A possible maintenance window."""

    start_time: str
    end_time: str
    duration_minutes: int


@dataclass
class PlanningResult:
    """Result returned by the planning engine."""

    section: str
    windows: list[MaintenanceWindow]


@dataclass
class ScheduleResult:
    """Selected maintenance schedule."""

    section: str
    selected_window: MaintenanceWindow | None
    reason: str


@dataclass
class ImpactResult:
    """Impact analysis result for a maintenance window."""

    section: str
    start_time: str
    end_time: str
    affected_trains: list[dict]
    affected_maintenance_blocks: list[dict]
    impact_level: str


@dataclass
class ReplanningResult:
    """Result returned when an existing schedule must be replanned."""

    section: str
    original_window: MaintenanceWindow
    new_window: MaintenanceWindow | None
    replanned: bool
    reason: str