"""Core railway maintenance planning engine."""

from datetime import datetime, timedelta

from .data_access import (
    get_maintenance_blocks,
    get_sections,
    get_trains,
)
from .models import (
    ImpactResult,
    MaintenancePlanRequest,
    MaintenanceWindow,
    PlanningResult,
    ReplanningResult,
    ScheduleResult,
)


class PlanningEngine:
    """Core engine for generating and validating maintenance windows."""

    def __init__(self):
        """Initialize the planning engine."""

    def validate_time_window(
        self,
        start_time: str,
        end_time: str,
    ) -> bool:
        """Return True when the start time is before the end time."""

        try:
            start = datetime.fromisoformat(start_time)
            end = datetime.fromisoformat(end_time)
        except ValueError:
            return False

        return start < end

    def generate_window(
        self,
        start_time: str,
        duration_minutes: int,
    ) -> dict:
        """Generate one maintenance window."""

        if duration_minutes <= 0:
            raise ValueError("duration_minutes must be greater than zero")

        try:
            start = datetime.fromisoformat(start_time)
        except ValueError as exc:
            raise ValueError("Invalid start_time format") from exc

        end = start + timedelta(minutes=duration_minutes)

        return {
            "startTime": start.isoformat(),
            "endTime": end.isoformat(),
            "durationMinutes": duration_minutes,
        }

    def generate_candidate_windows(
        self,
        search_start: str,
        search_end: str,
        duration_minutes: int,
        interval_minutes: int = 30,
    ) -> list[dict]:
        """Generate possible maintenance windows within a search period."""

        if duration_minutes <= 0:
            raise ValueError("duration_minutes must be greater than zero")

        if interval_minutes <= 0:
            raise ValueError("interval_minutes must be greater than zero")

        try:
            search_start_dt = datetime.fromisoformat(search_start)
            search_end_dt = datetime.fromisoformat(search_end)
        except ValueError as exc:
            raise ValueError("Invalid search window format") from exc

        if search_start_dt >= search_end_dt:
            raise ValueError("search_start must be before search_end")

        candidates = []

        current_start = search_start_dt
        duration = timedelta(minutes=duration_minutes)
        interval = timedelta(minutes=interval_minutes)

        while current_start + duration <= search_end_dt:
            current_end = current_start + duration

            candidates.append(
                {
                    "startTime": current_start.isoformat(),
                    "endTime": current_end.isoformat(),
                    "durationMinutes": duration_minutes,
                }
            )

            current_start += interval

        return candidates

    def validate_request(
        self,
        request: MaintenancePlanRequest,
    ) -> tuple[bool, list[str]]:
        """Validate a maintenance planning request."""

        errors = []

        if not request.section.strip():
            errors.append("section is required")

        if request.duration_minutes <= 0:
            errors.append("duration_minutes must be greater than zero")

        if request.interval_minutes <= 0:
            errors.append("interval_minutes must be greater than zero")

        try:
            search_start = datetime.fromisoformat(request.search_start)
            search_end = datetime.fromisoformat(request.search_end)

            if search_start >= search_end:
                errors.append("search_start must be before search_end")

        except ValueError:
            errors.append("Invalid search window format")

        if request.preferred_time is not None:
            try:
                datetime.fromisoformat(
                    f"{request.search_start[:10]}T{request.preferred_time}"
                )
            except ValueError:
                errors.append("Invalid preferred_time format")

        return len(errors) == 0, errors

    def validate_section(
        self,
        section: str,
        valid_sections: list[str],
    ) -> tuple[bool, str | None]:
        """Validate that the requested railway section exists."""

        if not section.strip():
            return False, "section is required"

        if section not in valid_sections:
            return False, f"Unknown railway section: {section}"

        return True, None

    def validate_candidate_windows(
        self,
        windows: list[MaintenanceWindow],
    ) -> tuple[list[MaintenanceWindow], list[str]]:
        """Validate generated maintenance windows."""

        valid_windows = []
        errors = []

        for index, window in enumerate(windows, start=1):

            if window.duration_minutes <= 0:
                errors.append(
                    f"Window {index}: duration must be greater than zero"
                )
                continue

            if not self.validate_time_window(
                window.start_time,
                window.end_time,
            ):
                errors.append(
                    f"Window {index}: start time must be before end time"
                )
                continue

            valid_windows.append(window)

        return valid_windows, errors

    def validate_plan(
        self,
        request: MaintenancePlanRequest,
        valid_sections: list[str],
    ) -> tuple[bool, list[str]]:
        """Validate a complete maintenance planning request."""

        errors = []

        request_valid, request_errors = self.validate_request(request)

        if not request_valid:
            errors.extend(request_errors)

        section_valid, section_error = self.validate_section(
            request.section,
            valid_sections,
        )

        if not section_valid and section_error:
            errors.append(section_error)

        return len(errors) == 0, errors

    def windows_overlap(
        self,
        start_time_a: str,
        end_time_a: str,
        start_time_b: str,
        end_time_b: str,
    ) -> bool:
        """Return True when two time windows overlap."""

        try:
            start_a = datetime.fromisoformat(start_time_a)
            end_a = datetime.fromisoformat(end_time_a)
            start_b = datetime.fromisoformat(start_time_b)
            end_b = datetime.fromisoformat(end_time_b)
        except ValueError:
            return False

        return start_a < end_b and start_b < end_a

    def find_maintenance_block_conflicts(
        self,
        section: str,
        start_time: str,
        end_time: str,
        blocks: list[dict],
    ) -> list[dict]:
        """Find existing maintenance blocks that conflict with a window."""

        conflicts = []

        for block in blocks:
            if block.get("section") != section:
                continue

            if self.windows_overlap(
                start_time,
                end_time,
                block["startTime"],
                block["endTime"],
            ):
                conflicts.append(block)

        return conflicts

    def find_train_conflicts(
        self,
        section: str,
        start_time: str,
        end_time: str,
        trains: list[dict],
    ) -> list[dict]:
        """
        Find trains that conflict with a maintenance window.

        The database represents train occupancy on a section from
        arrivalTime to departureTime.
        """

        conflicts = []

        for train in trains:
            if train.get("section") != section:
                continue

            if self.windows_overlap(
                start_time,
                end_time,
                train["arrivalTime"],
                train["departureTime"],
            ):
                conflicts.append(train)

        return conflicts

    def find_conflicts(
        self,
        section: str,
        start_time: str,
        end_time: str,
        trains: list[dict],
        blocks: list[dict],
    ) -> dict:
        """Find all train and maintenance-block conflicts."""

        train_conflicts = self.find_train_conflicts(
            section=section,
            start_time=start_time,
            end_time=end_time,
            trains=trains,
        )

        maintenance_conflicts = self.find_maintenance_block_conflicts(
            section=section,
            start_time=start_time,
            end_time=end_time,
            blocks=blocks,
        )

        return {
            "hasConflict": bool(
                train_conflicts or maintenance_conflicts
            ),
            "trainConflicts": train_conflicts,
            "maintenanceConflicts": maintenance_conflicts,
        }

    def filter_conflicting_windows(
        self,
        section: str,
        windows: list[MaintenanceWindow],
        trains: list[dict],
        blocks: list[dict],
    ) -> tuple[list[MaintenanceWindow], list[dict]]:
        """Remove windows that conflict with trains or maintenance blocks."""

        safe_windows = []
        rejected_windows = []

        for window in windows:
            conflicts = self.find_conflicts(
                section=section,
                start_time=window.start_time,
                end_time=window.end_time,
                trains=trains,
                blocks=blocks,
            )

            if conflicts["hasConflict"]:
                rejected_windows.append(
                    {
                        "startTime": window.start_time,
                        "endTime": window.end_time,
                        "reason": "conflict",
                        "trainConflicts": conflicts["trainConflicts"],
                        "maintenanceConflicts": conflicts[
                            "maintenanceConflicts"
                        ],
                    }
                )
            else:
                safe_windows.append(window)

        return safe_windows, rejected_windows

    def plan(
        self,
        request: MaintenancePlanRequest,
    ) -> PlanningResult:
        """Generate and validate candidate maintenance windows."""

        is_valid, errors = self.validate_request(request)

        if not is_valid:
            raise ValueError("; ".join(errors))

        candidate_windows = self.generate_candidate_windows(
            search_start=request.search_start,
            search_end=request.search_end,
            duration_minutes=request.duration_minutes,
            interval_minutes=request.interval_minutes,
        )

        windows = [
            MaintenanceWindow(
                start_time=window["startTime"],
                end_time=window["endTime"],
                duration_minutes=window["durationMinutes"],
            )
            for window in candidate_windows
        ]

        valid_windows, window_errors = self.validate_candidate_windows(
            windows
        )

        if window_errors:
            raise ValueError("; ".join(window_errors))

        return PlanningResult(
            section=request.section,
            windows=valid_windows,
        )

    def plan_from_database(
        self,
        request: MaintenancePlanRequest,
    ) -> dict:
        """Generate maintenance windows using railway data from SQLite."""

        valid_sections = get_sections()

        is_valid, errors = self.validate_plan(
            request=request,
            valid_sections=valid_sections,
        )

        if not is_valid:
            raise ValueError("; ".join(errors))

        trains = get_trains()
        maintenance_blocks = get_maintenance_blocks()

        candidate_data = self.generate_candidate_windows(
            search_start=request.search_start,
            search_end=request.search_end,
            duration_minutes=request.duration_minutes,
            interval_minutes=request.interval_minutes,
        )

        candidate_windows = [
            MaintenanceWindow(
                start_time=window["startTime"],
                end_time=window["endTime"],
                duration_minutes=window["durationMinutes"],
            )
            for window in candidate_data
        ]

        valid_windows, window_errors = self.validate_candidate_windows(
            candidate_windows
        )

        if window_errors:
            raise ValueError("; ".join(window_errors))

        safe_windows, rejected_windows = self.filter_conflicting_windows(
            section=request.section,
            windows=valid_windows,
            trains=trains,
            blocks=maintenance_blocks,
        )

        return {
            "section": request.section,
            "requestedDurationMinutes": request.duration_minutes,
            "searchStart": request.search_start,
            "searchEnd": request.search_end,
            "candidateCount": len(candidate_windows),
            "safeWindowCount": len(safe_windows),
            "rejectedWindowCount": len(rejected_windows),
            "safeWindows": [
                {
                    "startTime": window.start_time,
                    "endTime": window.end_time,
                    "durationMinutes": window.duration_minutes,
                }
                for window in safe_windows
            ],
            "rejectedWindows": rejected_windows,
        }

    def calculate_window_score(
        self,
        window: MaintenanceWindow,
        preferred_time: str | None,
    ) -> float:
        """Calculate an optimization score. Lower is better."""

        window_start = datetime.fromisoformat(window.start_time)

        if preferred_time is None:
            return window_start.timestamp()

        try:
            preferred_datetime = datetime.fromisoformat(
                f"{window_start.date().isoformat()}T{preferred_time}"
            )
        except ValueError as exc:
            raise ValueError("Invalid preferred_time format") from exc

        return abs(
            (window_start - preferred_datetime).total_seconds()
        )

    def optimize_windows(
        self,
        windows: list[MaintenanceWindow],
        preferred_time: str | None = None,
    ) -> MaintenanceWindow | None:
        """Select the best safe maintenance window."""

        if not windows:
            return None

        scored_windows = [
            (
                self.calculate_window_score(
                    window=window,
                    preferred_time=preferred_time,
                ),
                window,
            )
            for window in windows
        ]

        scored_windows.sort(
            key=lambda item: (
                item[0],
                datetime.fromisoformat(item[1].start_time),
            )
        )

        return scored_windows[0][1]

    def schedule_from_database(
        self,
        request: MaintenancePlanRequest,
    ) -> ScheduleResult:
        """Select the best safe maintenance window from the database."""

        planning_result = self.plan_from_database(request)

        safe_windows = [
            MaintenanceWindow(
                start_time=window["startTime"],
                end_time=window["endTime"],
                duration_minutes=window["durationMinutes"],
            )
            for window in planning_result["safeWindows"]
        ]

        selected_window = self.optimize_windows(
            windows=safe_windows,
            preferred_time=request.preferred_time,
        )

        if selected_window is None:
            return ScheduleResult(
                section=request.section,
                selected_window=None,
                reason="No conflict-free maintenance window is available",
            )

        if request.preferred_time is not None:
            reason = (
                "Best conflict-free window closest to preferred "
                "maintenance time selected"
            )
        else:
            reason = "Earliest conflict-free maintenance window selected"

        return ScheduleResult(
            section=request.section,
            selected_window=selected_window,
            reason=reason,
        )

    def calculate_impact(
        self,
        section: str,
        start_time: str,
        end_time: str,
    ) -> ImpactResult:
        """Analyze railway operations affected by a maintenance window."""

        if not self.validate_time_window(start_time, end_time):
            raise ValueError("Invalid maintenance time window")

        valid_sections = get_sections()

        section_valid, section_error = self.validate_section(
            section=section,
            valid_sections=valid_sections,
        )

        if not section_valid:
            raise ValueError(section_error)

        trains = get_trains()
        maintenance_blocks = get_maintenance_blocks()

        affected_trains = self.find_train_conflicts(
            section=section,
            start_time=start_time,
            end_time=end_time,
            trains=trains,
        )

        affected_blocks = self.find_maintenance_block_conflicts(
            section=section,
            start_time=start_time,
            end_time=end_time,
            blocks=maintenance_blocks,
        )

        affected_count = len(affected_trains) + len(affected_blocks)

        if affected_count == 0:
            impact_level = "LOW"
        elif affected_count <= 2:
            impact_level = "MEDIUM"
        else:
            impact_level = "HIGH"

        return ImpactResult(
            section=section,
            start_time=start_time,
            end_time=end_time,
            affected_trains=affected_trains,
            affected_maintenance_blocks=affected_blocks,
            impact_level=impact_level,
        )

    def replan(
        self,
        request: MaintenancePlanRequest,
        original_window: MaintenanceWindow,
    ) -> ReplanningResult:
        """
        Replan maintenance when the original window becomes unavailable.

        The original window is checked first. If it is still safe, it is
        retained. If it conflicts, the engine searches for safe alternatives
        and selects the best one.
        """

        valid_sections = get_sections()

        is_valid, errors = self.validate_plan(
            request=request,
            valid_sections=valid_sections,
        )

        if not is_valid:
            raise ValueError("; ".join(errors))

        if original_window.duration_minutes <= 0:
            raise ValueError(
                "original_window duration must be greater than zero"
            )

        if not self.validate_time_window(
            original_window.start_time,
            original_window.end_time,
        ):
            raise ValueError("Invalid original maintenance window")

        if (
            original_window.duration_minutes
            != request.duration_minutes
        ):
            raise ValueError(
                "original_window duration does not match request duration"
            )

        trains = get_trains()
        maintenance_blocks = get_maintenance_blocks()

        original_conflicts = self.find_conflicts(
            section=request.section,
            start_time=original_window.start_time,
            end_time=original_window.end_time,
            trains=trains,
            blocks=maintenance_blocks,
        )

        if not original_conflicts["hasConflict"]:
            return ReplanningResult(
                section=request.section,
                original_window=original_window,
                new_window=original_window,
                replanned=False,
                reason="Original maintenance window is still conflict-free",
            )

        candidate_data = self.generate_candidate_windows(
            search_start=request.search_start,
            search_end=request.search_end,
            duration_minutes=request.duration_minutes,
            interval_minutes=request.interval_minutes,
        )

        candidate_windows = [
            MaintenanceWindow(
                start_time=window["startTime"],
                end_time=window["endTime"],
                duration_minutes=window["durationMinutes"],
            )
            for window in candidate_data
        ]

        safe_windows, _ = self.filter_conflicting_windows(
            section=request.section,
            windows=candidate_windows,
            trains=trains,
            blocks=maintenance_blocks,
        )

        alternative_windows = [
            window
            for window in safe_windows
            if (
                window.start_time != original_window.start_time
                or window.end_time != original_window.end_time
            )
        ]

        new_window = self.optimize_windows(
            windows=alternative_windows,
            preferred_time=request.preferred_time,
        )

        if new_window is None:
            return ReplanningResult(
                section=request.section,
                original_window=original_window,
                new_window=None,
                replanned=False,
                reason=(
                    "Original maintenance window conflicts with railway "
                    "operations and no safe alternative is available"
                ),
            )

        return ReplanningResult(
            section=request.section,
            original_window=original_window,
            new_window=new_window,
            replanned=True,
            reason=(
                "Original maintenance window conflicts with railway "
                "operations; a new conflict-free window was selected"
            ),
        )