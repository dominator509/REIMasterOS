# REIMasterOS - Core

Real Estate Investor / Acquisitions OS: self-hostable, AI-native, provider-agnostic, compliance-gated platform.

## Source-of-Truth Priority

1. Current user instruction in the active coding-agent session
2. `AGENTS.md`
3. Active ExecPlan under `.agent/execplans/`
4. Existing repository code and tests
5. `ARCHITECTURE.md`
6. Relevant spec under `.agent/specs/`
7. `ROADMAP.md` (strategic only — do not implement from it)

## Key invariants

- One active ExecPlan at a time; implement from ExecPlans, never from ROADMAP.md
- `pnpm` is the default package manager; `uv`/Poetry for Python, Go modules for Go, Cargo for Rust
- Six-layer architecture: Experience → API/BFF → Domain → Data → Providers/Workers/AI → Platform/Observability
- Domain layer is pure TypeScript — no framework, database, vendor, UI, or network imports
- Coding agents must run `sh scripts/preflight.sh` before editing
- Coding agents proceed autonomously through ExecPlans unless STOP conditions in AGENTS.md apply

## Module map

- `apps/web/` — Next.js dashboard/PWA (future)
- `apps/api/` — NestJS API/BFF (future)
- `packages/domain/` — Pure domain/policy core (future)
- `packages/contracts/` — Shared schemas, DTOs (future)
- `services/ai-gateway/` — Python AI routing (future)
- `services/ingestion-worker/` — Go ingestion worker (future)
- `services/token-compressor/` — Rust token compression (future)
- `workers/` — Campaign, webhook, mail-render, compliance, cache-warmup workers (future)
- `db/migrations/` — Database migrations (future)
- `scripts/` — Build, test, lint, verify shell scripts
- `.agent/` — ExecPlans, specs, templates, checklists, prompts
- `.claude/` — Claude Code project config
- `.serena/` — Serena code intelligence config
- `.obsidian/` — Obsidian vault config

## Key docs (see individual files for full content)

- `AGENTS.md` — Agent control plane (mission, workflow, STOP conditions)
- `COMMANDS.md` — Allowed commands source of truth
- `ARCHITECTURE.md` — Six-layer architecture boundaries
- `PROJECT_BRIEF.md` — Product vision, target users, outcomes
- Read `mem:tech_stack` for language/tooling details
- Read `mem:suggested_commands` for dev commands
- Read `mem:conventions` for code standards
- Read `mem:task_completion` for validation checklist
