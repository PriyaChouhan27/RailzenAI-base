# RailZen AI backend foundation

This directory contains the Phase 0.1 FastAPI foundation. It intentionally
does not implement timetable processing, maintenance planning, scheduling,
optimization, recommendations, conflict detection, or other future logic.

## Run

From the project root:

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

The health endpoint is available at `GET /api/health`.