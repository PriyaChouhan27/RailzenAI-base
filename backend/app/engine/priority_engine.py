def calculate_priority_score(
    severity: int,
    overdue_days: int,
    asset_criticality: int
) -> int:

    if not 1 <= severity <= 5:
        raise ValueError("Severity must be between 1 and 5")

    if overdue_days < 0:
        raise ValueError("Overdue days cannot be negative")

    if not 1 <= asset_criticality <= 5:
        raise ValueError("Asset criticality must be between 1 and 5")

    return (
        severity * 3
        + overdue_days * 2
        + asset_criticality * 3
    )


def classify_priority(score: int) -> str:
    if score >= 40:
        return "HIGH"
    elif score >= 20:
        return "MEDIUM"
    else:
        return "LOW"


def prioritize_tasks(tasks: list) -> list:
    prioritized_tasks = []

    for task in tasks:
        score = calculate_priority_score(
            task["severity"],
            task["overdue_days"],
            task["asset_criticality"]
        )

        prioritized_tasks.append({
            **task,
            "priority_score": score,
            "priority": classify_priority(score)
        })

    prioritized_tasks.sort(
        key=lambda task: task["priority_score"],
        reverse=True
    )

    return prioritized_tasks
def process_maintenance_tasks(tasks: list) -> list:
    return prioritize_tasks(tasks)
def get_maintenance_recommendation(task: dict) -> dict:
    score = calculate_priority_score(
        task["severity"],
        task["overdue_days"],
        task["asset_criticality"]
    )

    priority = classify_priority(score)

    if priority == "HIGH":
        recommendation = "Schedule maintenance at the earliest available window"
    elif priority == "MEDIUM":
        recommendation = "Schedule maintenance in the next suitable window"
    else:
        recommendation = "Maintenance can be scheduled during a normal window"

    return {
        **task,
        "priority_score": score,
        "priority": priority,
        "recommendation": recommendation
    }


def generate_maintenance_plan(tasks: list) -> list:
    plan = []

    for task in tasks:
        plan.append(get_maintenance_recommendation(task))

    plan.sort(
        key=lambda task: task["priority_score"],
        reverse=True
    )

    return plan