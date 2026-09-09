# RailZen AI

RailZen AI is a future-ready foundation for an AI-assisted Railway Maintenance
Block Planning & Optimization System. Phase 0.1 intentionally provides only the
project shell, backend health check, SQLite setup, and modular boundaries.

## Run & Operate

- `pnpm --filter @workspace/railzen-ai run dev` — run the React frontend
- `pnpm --filter @workspace/api-server run dev` — run the shared API preview service
- `uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000` — run the FastAPI foundation directly
- `pnpm run typecheck` — full TypeScript typecheck
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API clients after OpenAPI changes

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend foundation: Python, FastAPI, Pydantic-compatible project structure
- Database foundation: SQLite via Python's standard library
- Data foundation: JSON/JSONL/CSV-compatible synthetic demo data location
- Workspace: pnpm monorepo with GitHub-ready ignore rules

## Project structure

- `artifacts/railzen-ai/` — runnable React application
- `artifacts/api-server/` — shared preview API adapter exposing the health contract
- `backend/app/` — FastAPI application, SQLite configuration, and future module boundaries
- `backend/app/data/` — documentation for future synthetic demo datasets
- `lib/api-spec/` — OpenAPI source of truth
- `lib/api-client-react/` and `lib/api-zod/` — generated API helpers

## API health endpoint

`GET /api/health` returns:

```json
{
  "status": "ok",
  "service": "RailZen AI",
  "phase": "0.1"
}
```

The FastAPI foundation also exposes `GET /api/healthz` for a minimal liveness
check.

## Current development phase

**Phase 0.1 — Project Foundation.** The complete dashboard, scheduling engine,
AI recommendations, conflict detection, dynamic re-planning, and advanced
features are intentionally not implemented.

This is a hackathon prototype using synthetic/demo data. It is not connected to
live Indian Railways operational systems.

## Future development phases

1. Phase 0.2 — Frontend shell and navigation
2. Phase 0.3 — Synthetic demo data
3. Phase 0.4 — Backend railway domain features
4. Phase 0.6 — Maintenance planning
5. Phase 0.7 — Conflict and impact analysis
6. Phase 0.8 — Dynamic re-planning
7. Phase 0.9 — Recommendation engine