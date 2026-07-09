@RTK.md

# ═══════════════════════════════════════════════════════════
# CACHE ANCHOR — NEVER CHANGE THIS SECTION
# DeepSeek prompt cache boundary. Every byte above the
# "EDITABLE SECTION" marker is cache fuel. Edit below only.
# ═══════════════════════════════════════════════════════════

## Project Identity

**Real Estate Investor / Acquisitions OS** — self-hostable, AI-native, provider-agnostic,
compliance-gated real estate intelligence, CRM, outreach, negotiation, activity, and
automation platform for investors and acquisition teams.

Investor/acquisitions-first. Licensed-agent and brokerage workflows are optional modules.
Paid SaaS integrations are optional accelerators; core CRM, local AI, SMTP email, manual
direct-mail export, activity tracking, follow-ups, dashboard, and basic automation must
work without mandatory paid vendors.

## Source-of-Truth Priority (immutable)

1. Current user instruction in the active coding-agent session
2. `AGENTS.md`
3. Active ExecPlan under `.agent/execplans/`
4. Existing repository code and tests
5. `ARCHITECTURE.md`
6. Relevant spec under `.agent/specs/`
7. `ROADMAP.md` (strategic only — never implement directly from it)

## Architecture Invariants (immutable)

Six-layer paradigm. Any architectural change must go through an ADR:

| Layer | Name | Key Rule |
|-------|------|----------|
| 1 | Experience & Agent Surfaces | Next.js dashboard/PWA, Telegram, Voice, Mobile |
| 2 | API/BFF & Application Services | NestJS API/BFF, request validation, auth hooks, WS/SSE |
| 3 | Domain & Policy Core | **Pure TypeScript — NO framework, DB, vendor, UI, or network imports** |
| 4 | Data/Search/Storage | PostgreSQL/PostGIS (authoritative), OpenSearch (projections), Redis (cache/queues), S3-compatible (artifacts) |
| 5 | Provider, Worker, MCP & AI | Adapters, workers, MCP gateway, LLM gateway (Hermes/DeepSeek hybrid) |
| 6 | Platform, Security & Observability | Docker Compose, K8s/Helm, OTEL/Prometheus/Grafana/Loki/Tempo |

**Domain purity**: packages/domain/ must never import from: `@nestjs/*`, `next/*`, `typeorm/*`,
`pg/*`, any vendor SDK, any provider SDK, any UI library, `express`, `fastify`, `socket.io`.

## Repository Map (immutable)

```
/
  apps/
    web/                  # Next.js dashboard/PWA
    api/                  # NestJS API/BFF, REST/WebSocket/SSE
  packages/
    domain/               # Pure domain & policy core (no framework imports)
    contracts/            # Shared schemas, DTOs, API contracts
    config/               # Typed configuration & env validation
    ui/                   # Shared UI components
    adapters/             # Provider interface definitions & light wrappers
    testing/              # Shared test factories & fixtures
  services/
    ai-gateway/           # Python AI routing, prompt compiler, sanitizer, MCP clients
    ingestion-worker/     # Optional Go high-throughput ingestion worker
    token-compressor/     # Optional Rust token compression service
  workers/
    campaign-worker/      # Campaign orchestration
    webhook-worker/       # Provider callbacks
    mail-render-worker/   # Direct-mail PDF/CSV rendering
    compliance-worker/    # DNC/vendor sync, suppression refresh
    cache-warmup-worker/  # LLM prefix cache warmup
  db/
    migrations/           # Database migrations
    seeds/                # Synthetic local/test seed data only
  infra/
    compose/              # Docker Compose deployment profiles
    helm/                 # Kubernetes/Helm charts
    otel/                 # Observability config
  scripts/                # Build, test, lint, verify shell scripts
  .agent/
    execplans/            # Active implementation plans (one at a time)
    specs/                # Technical specifications
    templates/            # Document templates
    checklists/           # Validation & review checklists
    prompts/              # Agent prompt fragments
```

## STOP Conditions (immutable)

Stop autonomously and report the blocker ONLY when:
- Missing: secret, credential, paid service, external account, DNC credential, MLS license,
  property-data license, telephony, SMS, postage/direct-mail, or hosted AI key with no
  local/manual fallback specified in active ExecPlan
- Destructive: action may destroy user or production data
- Deployment: production deploy, live campaign launch, irreversible/destructive migration
  without explicit permission
- Do NOT stop for: missing optional dependency, failing preflight (fix it), missing package
  (install it), unclear spec (resolve from source-of-truth priority order)

## Tech Stack (immutable)

| Component | Tech | Notes |
|-----------|------|-------|
| Default PM | pnpm | Monorepo root |
| Python PM | uv or Poetry | Only after Python service created |
| Go PM | Go modules | Per-service directory |
| Rust PM | Cargo | Per-service directory |
| API/BFF | NestJS | TypeScript |
| Web | Next.js | TypeScript, PWA |
| Domain | TypeScript | Pure, no framework imports |
| Primary DB | PostgreSQL + PostGIS | Authoritative records |
| Search | OpenSearch | Projections |
| Cache | Redis | Queues, rate limits |
| Storage | S3-compatible (MinIO) | Artifacts |
| Observability | OTEL, Prometheus, Grafana, Loki, Tempo | |
| AI Gateway | Python | Hermes/local + DeepSeek/hybrid |
| Container | Docker Compose (dev), K8s/Helm (prod) | |

## Domain Glossary (immutable)

Core domain concepts. These map to entities in `packages/domain/`:

- **Property**: A real estate property (address, parcel, characteristics, status)
- **Owner**: A property owner (contact info, portfolio, skip-trace status)
- **Contact**: Any person in the CRM (owner, agent, buyer, vendor, team member)
- **Lead**: A property+owner pair with acquisition potential (source, score, status)
- **Lead List**: A curated collection of leads (CSV import, provider query, manual)
- **Campaign**: An outreach sequence (email, direct mail, calls, SMS) targeting leads
- **Offer**: A purchase offer on a property (price, terms, contingencies, status)
- **Negotiation**: Back-and-forth on an offer (messages, counter-offers, timeline)
- **Contract**: An accepted offer under contract (closing timeline, earnest money)
- **Task**: An action item for a team member (follow-up, inspection, paperwork)
- **Activity**: A recorded event (call, email, meeting, note, status change)
- **Compliance Gate**: A rule that must pass before an action (DNC check, opt-out, license)
- **Approval Rule**: A policy that gates a decision (max offer, min margin, risk threshold)
- **Provider Adapter**: An interface for external services (property data, skip trace, SMS)
- **Tenant**: A self-hosted instance (multi-tenant, schema-per-tenant or row-level)

## RTK Integration (immutable)

- All Bash commands auto-routed through `rtk hook claude` via PreToolUse hook
- Use `rtk gain` to see token savings analytics
- Use `rtk discover` to find missed optimization opportunities
- Use `rtk proxy <cmd>` to execute raw without filtering (debugging)
- RTK is configured in both global (`~/.claude/settings.json`) and project
  (`.claude/settings.json`) for defense in depth

## Tool Ecosystem (immutable)

Four tools work together cohesively. See `TOOLS.md` for full documentation:

| Tool | Role | Config Dir | Key Principle |
|------|------|------------|---------------|
| Claude Code | Agentic coding harness | `.claude/` | Follow AGENTS.md workflow |
| Serena | Code intelligence & symbolic editing | `.serena/` | Prefer over Grep/Read for code |
| Obsidian | Knowledge management & docs | `.obsidian/` | Open repo as vault for wiki nav |
| RTK | Token-optimized CLI proxy | Global hook | Transparent 60-90% token savings |

**Serena rule**: For code exploration, prefer `get_symbols_overview` → `find_symbol` with
`include_body=True` over built-in Read/Grep. For edits, prefer `replace_symbol_body` /
`replace_content` over built-in Edit. Use built-in tools only when Serena tools aren't
appropriate for the task.

# ═══════════════════════════════════════════════════════════
# EDITABLE SECTION — changes below this line invalidate
# cache from the edit point down. Keep edits minimal.
# Most-static content (rarely changes) first within this section.
# ═══════════════════════════════════════════════════════════

## Agent Protocol (rarely changes)

This repo is governed by `AGENTS.md`. Every coding session must:

1. Read `AGENTS.md` → `COMMANDS.md` → `.agent/PLANS.md` → active ExecPlan
2. Run `sh scripts/preflight.sh` before editing
3. Complete milestones in the active ExecPlan in order
4. Validate after every milestone using the command listed for that milestone
5. Update the active ExecPlan: Progress, Surprises & Discoveries, Decision Log, Outcomes
6. Continue autonomously through the active ExecPlan
7. Stop only under STOP conditions (see cache anchor section above)
8. Before final response: run validation, `git diff --name-only`, compare to expected files

**Do not ask the user for next steps. Proceed autonomously unless a STOP condition applies.**

## Key Files (may change as repo evolves)

- `AGENTS.md` — Agent control plane (mission, workflow, STOP conditions)
- `COMMANDS.md` — Allowed commands source of truth
- `ARCHITECTURE.md` — Six-layer architecture boundaries
- `PROJECT_BRIEF.md` — Product vision, target users, outcomes
- `ROADMAP.md` — Strategic only; do not implement from it directly
- `TOOLS.md` — Tool ecosystem documentation
- `.agent/PLANS.md` — ExecPlan standard and execution rules
- `.agent/execplans/` — Active implementation plans (one at a time)
- `.agent/specs/` — Technical specifications
- `scripts/` — Build, test, lint, verify shell scripts

## Available Slash Commands

| Command | Purpose |
|---------|---------|
| `/execplan` | List, show active, or create ExecPlans |
| `/verify` | Run verification suite (quick, full, or preflight) |
| `/docs` | Search or update project documentation |
| `/rtk` | Check RTK savings and optimization status |

## Current Phase

Phase 0: Repository Discovery and Foundation. Active ExecPlan: `EP-000-repository-discovery.md`.
Goal: confirm repository state, establish baseline, detect deviations from greenfield assumptions.
