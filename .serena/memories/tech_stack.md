# Tech Stack

## Planned (from ARCHITECTURE.md and ROADMAP.md)

- **Primary**: TypeScript (NestJS API, Next.js web, domain packages)
- **Python**: ai-gateway service (AI routing, prompt compiler, sanitizer, MCP clients)
- **Go**: ingestion-worker (high-throughput ingestion)
- **Rust**: token-compressor service
- **Shell**: build/test/lint/verify scripts

## Package management

- `pnpm` — default for TS/JS monorepo
- `uv` or Poetry — Python services (after service creation)
- Go modules — Go services (per-service directory)
- Cargo — Rust services (per-service directory)

## Key frameworks (planned)

- NestJS — API/BFF layer
- Next.js — Dashboard/PWA
- PostgreSQL/PostGIS — authoritative records
- OpenSearch/Elasticsearch — search projections
- Redis — cache/queues/rate limits
- S3-compatible (MinIO) — artifact storage
- Docker Compose — local dev
- Kubernetes/Helm — production
- OpenTelemetry, Prometheus, Grafana, Loki, Tempo — observability

## Current state

- Greenfield/blueprint phase — no application code yet
- `.agent/execplans/EP-000-repository-discovery.md` is the starting ExecPlan
- Scripts in `scripts/` are placeholder stubs that print "ERROR: Replace this placeholder"
