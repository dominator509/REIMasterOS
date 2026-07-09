# Commands

Coding agents must use this file as the command source of truth.

**Coding agents must not invent commands. If a command is missing, update this file first with evidence from the repository.**

## Working Directory Rule

Run commands from the repository root. The repository root is the directory that contains `AGENTS.md`, `COMMANDS.md`, `.agent/`, and `scripts/`.

## Package Manager Rule

Default package manager: `pnpm`.

- Use `pnpm` for TypeScript/JavaScript monorepo commands.
- Use `uv` or Poetry for Python services only after a Python service is created and documented.
- Use Go modules only inside Go service directories.
- Use Cargo only inside Rust service directories.
- Do not mix npm/yarn with pnpm unless an ADR approves it.

## Allowed Repository Inspection Commands

These read-only inspection commands are allowed when executing discovery, validation, or final review:

```sh
pwd
ls -la
find . -maxdepth 3 -type f | sort
git status --short
git diff --name-only
git ls-files
find . -maxdepth 4 \( -name package.json -o -name pnpm-workspace.yaml -o -name turbo.json -o -name pyproject.toml -o -name go.mod -o -name Cargo.toml -o -name '*.yml' -o -name '*.yaml' \) | sort
```

Do not use destructive shell commands for inspection. Do not print secrets or raw production data.

## Allowed Local Commands

| Purpose                     | Command                                    | Expected Success Output    |
| --------------------------- | ------------------------------------------ | -------------------------- |
| Preflight                   | `sh scripts/preflight.sh`                  | `preflight: ok`            |
| Install dependencies        | `sh scripts/install.sh`                    | `install: ok`              |
| Lint                        | `sh scripts/lint.sh`                       | `lint: ok`                 |
| Format check                | `sh scripts/format-check.sh`               | `format check: ok`         |
| Typecheck/static validation | `sh scripts/typecheck.sh`                  | `typecheck: ok`            |
| Unit tests                  | `sh scripts/test-unit.sh`                  | `unit tests: ok`           |
| Integration tests           | `sh scripts/test-integration.sh`           | `integration tests: ok`    |
| E2E/acceptance tests        | `sh scripts/test-e2e.sh`                   | `e2e tests: ok`            |
| Build                       | `sh scripts/build.sh`                      | `build: ok`                |
| Security check              | `sh scripts/security-check.sh`             | `security check: ok`       |
| Dependency audit            | `sh scripts/dependency-audit.sh`           | `dependency audit: ok`     |
| Smoke test                  | `sh scripts/smoke-test.sh`                 | `smoke test: ok`           |
| Full verification           | `sh scripts/verify.sh`                     | `verify: ok`               |
| Production readiness check  | `sh scripts/production-readiness-check.sh` | `production readiness: ok` |

## Package Scripts Expected After EP-001

EP-001 must create or confirm these root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format:check": "prettier --check .",
    "typecheck": "turbo typecheck",
    "test:unit": "turbo test:unit",
    "test:integration": "turbo test:integration",
    "test:e2e": "turbo test:e2e",
    "build": "turbo build",
    "security:check": "pnpm dlx secretlint \"**/*\" && pnpm dlx semgrep ci --config auto || true",
    "audit:deps": "pnpm audit --audit-level moderate",
    "smoke": "tsx scripts/smoke/local-smoke.ts",
    "verify": "sh scripts/verify.sh",
    "db:setup": "docker compose -f infra/compose/solo-budget.yml up -d postgres redis minio opensearch",
    "db:migrate": "pnpm --filter @rei-os/api db:migrate"
  }
}
```

If the repository proves a different command is correct, update this file with evidence before using it.

## Local Development Command

After EP-001 creates the monorepo skeleton:

```sh
pnpm dev
```

Expected result: web, API, and required local development services start or print actionable configuration errors.

## Local Database Setup Command

After EP-003 creates Compose and migration files:

```sh
pnpm db:setup
```

Expected result: local Postgres/PostGIS, Redis, MinIO, and search services start in the `healthy` or `running` state.

## Migration Command

After EP-003 creates the API/persistence layer:

```sh
pnpm db:migrate
```

Expected result: migrations apply idempotently to the local development database.

## Forbidden Commands

Do not run these unless the active ExecPlan explicitly permits them and STOP conditions are not triggered:

- `rm -rf` against project, database, storage, or generated user data directories.
- `docker compose down -v` outside disposable local development environments.
- `dropdb`, `DROP DATABASE`, `TRUNCATE`, destructive migrations, or irreversible schema changes.
- Production deployment commands.
- Live provider campaign sends.
- Live DNC, MLS, skip-trace, SMS, voice, direct-mail, or hosted LLM calls using real credentials.
- Commands that print secrets or raw production data.
- Commands that upload repository data to third-party tools without documented approval.

## Recovery Instructions

When a command fails:

1. Copy the exact command and error into the active ExecPlan.
2. Apply the anti-fixation rules in `AGENTS.md`.
3. Prefer narrower diagnostics over broad rewrites.
4. If the command itself is stale, inspect repository files, update this file with the corrected command, record the decision, then rerun.
5. If a required external service or secret is missing and no fallback exists, stop under `AGENTS.md` STOP conditions.

## Placeholder Behavior

Scripts may fail with `ERROR: Replace this placeholder command after repository discovery.` in a blueprint-only greenfield repository. EP-001 must replace placeholder state by creating package scripts and baseline test/build commands.
