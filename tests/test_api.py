
from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_trains():
    response = client.get("/api/trains")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 5
    assert data[0]["trainNumber"] == "12723"


def test_sections():
    response = client.get("/api/sections")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3
    assert data[0]["name"] == "HYD-NGP"


def test_maintenance_requests():
    response = client.get("/api/maintenance-requests")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_maintenance_blocks():
    response = client.get("/api/maintenance-blocks")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_ai_recommendation():
    response = client.post(
        "/api/ai/recommend",
        json={
            "section": "HYD-NGP",
            "startTime": "2026-09-12T02:00:00",
            "endTime": "2026-09-12T03:30:00",
            "durationMinutes": 90,
            "priority": "high",
            "severity": 4,
            "overdueDays": 3,
            "assetCriticality": 5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["section"] == "HYD-NGP"
    assert data["startTime"] == "2026-09-12T02:00:00"
    assert data["endTime"] == "2026-09-12T03:30:00"
    assert data["recommendation"] == (
        "Schedule maintenance in the next suitable window"
    )
    assert data["confidence"] == 1.0
    assert data["riskLevel"] == "Medium"
    assert data["priority"] == "MEDIUM"
    assert data["priorityScore"] == 33


def test_planning_validation_generates_alerts():
    response = client.post(
        "/api/planning/validate",
        json={
            "section": "HYD-NGP",
            "startTime": "2026-09-12T01:00:00",
            "endTime": "2026-09-12T02:00:00",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["valid"] is False
    assert len(data["alerts"]) > 0
    assert data["alerts"][0]["alertType"] == "MAINTENANCE_CONFLICT"
    assert data["alerts"][0]["section"] == "HYD-NGP"
    assert data["alerts"][0]["status"] == "active"

