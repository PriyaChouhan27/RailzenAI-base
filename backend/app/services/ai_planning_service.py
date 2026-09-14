from backend.app.engine.block_planner import create_maintenance_block
from backend.app.engine.priority_engine import generate_maintenance_plan
from backend.app.services.planning_validation_service import (
    validate_planning_system,
)


def generate_ai_maintenance_plan(tasks):
    """Generate a prioritized maintenance plan using the AI engine."""

    return generate_maintenance_plan(tasks)


def create_ai_maintenance_blocks(tasks, day, start_time, end_time):
    """Convert prioritized AI tasks into maintenance planning blocks."""

    prioritized_tasks = generate_ai_maintenance_plan(tasks)

    blocks = []

    for task in prioritized_tasks:
        block = create_maintenance_block(
            maintenance_task=task,
            day=day,
            start_time=start_time,
            end_time=end_time,
            room=task.get("section", "Unknown"),
        )

        blocks.append(block)

    return blocks


def validate_ai_maintenance_window(
    section,
    start_time,
    end_time,
):
    """Validate an AI-proposed maintenance window using railway rules."""

    return validate_planning_system(
        section=section,
        start_time=start_time,
        end_time=end_time,
    )

def generate_ai_scheduling_result(
    tasks,
    section,
    start_time,
    end_time,
):
    """Generate an AI-prioritized scheduling result using railway validation."""

    prioritized_tasks = generate_ai_maintenance_plan(tasks)

    valid_candidates = []

    for task in prioritized_tasks:
        validation = validate_ai_maintenance_window(
            section=section,
            start_time=start_time,
            end_time=end_time,
        )

        if validation["valid"]:
            valid_candidates.append({
                "task": task,
                "validation": validation,
            })

    return {
        "section": section,
        "startTime": start_time,
        "endTime": end_time,
        "candidates": valid_candidates,
    }