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

| Purpose                     | Command                                                                                 | Expected Success Output    |
| --------------------------- | --------------------------------------------------------------------------------------- | -------------------------- |
| Preflight                   | `sh scripts/preflight.sh`                                                               | `preflight: ok`            |
| Install dependencies        | `sh scripts/install.sh`                                                                 | `install: ok`              |
| Lint                        | `sh scripts/lint.sh`                                                                    | `lint: ok`                 |
| Format check                | `sh scripts/format-check.sh`                                                            | `format check: ok`         |
| Format changed source       | `pnpm format:fix`                                                                       | Prettier writes source     |
| Typecheck/static validation | `sh scripts/typecheck.sh`                                                               | `typecheck: ok`            |
| Unit tests                  | `sh scripts/test-unit.sh`                                                               | `unit tests: ok`           |
| Integration tests           | `sh scripts/test-integration.sh`                                                        | `integration tests: ok`    |
| E2E/acceptance tests        | `sh scripts/test-e2e.sh`                                                                | `e2e tests: ok`            |
| Build                       | `sh scripts/build.sh`                                                                   | `build: ok`                |
| API runtime image           | `docker build --target api-runtime --tag rei-os-api:local .`                            | Image build succeeds       |
| Web runtime image           | `docker build --file apps/web/Dockerfile --target web-runtime --tag rei-os-web:local .` | Image build succeeds       |
| Security check              | `sh scripts/security-check.sh`                                                          | `security check: ok`       |
| Dependency audit            | `sh scripts/dependency-audit.sh`                                                        | `dependency audit: ok`     |
| Smoke test                  | `sh scripts/smoke-test.sh`                                                              | `smoke test: ok`           |
| Full verification           | `sh scripts/verify.sh`                                                                  | `verify: ok`               |
| Production readiness check  | `sh scripts/production-readiness-check.sh`                                              | `production readiness: ok` |

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
    "test:e2e": "turbo test:e2e --filter=@rei-os/web",
    "build": "turbo build",
    "security:check": "node scripts/security/local-security-scan.mjs",
    "audit:deps": "pnpm audit --audit-level moderate",
    "smoke": "tsx scripts/smoke/local-smoke.ts",
    "verify": "sh scripts/verify.sh",
    "db:setup": "docker compose -f infra/compose/solo-budget.yml up -d postgres redis minio opensearch",
    "db:migrate": "pnpm --filter @rei-os/persistence db:migrate"
  }
}
```

If the repository proves a different command is correct, update this file with evidence before using it.

The web package `prebuild` removes only its generated `.next` directory before
each production build. On Windows, Next omits symlink-dependent standalone output
unless `REI_OS_NEXT_STANDALONE=1`; Linux CI/container builds continue producing
standalone output. The cleanup never removes source, configuration, or user data.

## Local Container Build Validation

These commands build release-shaped images locally without pushing or deploying
them. They use only synthetic build-time defaults and must not receive production
secrets as build arguments:

```sh
docker build --target api-runtime --tag rei-os-api:local .
docker build --file apps/web/Dockerfile --target web-runtime --tag rei-os-web:local .
```

Expected result: both images build successfully, run as the unprivileged `node`
user, and contain only their production runtime output and dependencies. Image
publication and deployment remain operator-owned release actions.

## Helm Chart Validation

When Helm 3 is installed, render the enterprise chart with synthetic references
before a release review:

```sh
helm lint infra/helm \
  --set api.image.tag=0.0.0-local \
  --set web.image.tag=0.0.0-local \
  --set secretRef.name=rei-os-synthetic \
  --set config.appBaseUrl=https://rei-os.example.invalid \
  --set config.apiBaseUrl=https://api.rei-os.example.invalid \
  --set config.corsAllowedOrigins=https://rei-os.example.invalid
helm template rei-os infra/helm \
  --set api.image.tag=0.0.0-local \
  --set web.image.tag=0.0.0-local \
  --set secretRef.name=rei-os-synthetic \
  --set config.appBaseUrl=https://rei-os.example.invalid \
  --set config.apiBaseUrl=https://api.rei-os.example.invalid \
  --set config.corsAllowedOrigins=https://rei-os.example.invalid
```

These commands render manifests only; they do not contact a cluster or create a
Secret. The repository readiness script performs bounded structural checks when
Helm is unavailable, but that substitute is not runtime or Kubernetes admission
proof.

## Deployment Smoke Validation

The default smoke command remains offline. To add read-only checks against an
explicitly selected local, staging, or approved production target, supply both
base URLs:

```sh
DEPLOYMENT_SMOKE_API_URL=https://api.rei-os.example.invalid \
DEPLOYMENT_SMOKE_WEB_URL=https://rei-os.example.invalid \
sh scripts/smoke-test.sh
```

The target mode checks only `/health/live`, `/health/ready`, and the web root. It
does not log URL credentials, mutate data, or call campaign/provider routes. A
missing URL, credential-bearing URL, non-HTTP(S) URL, timeout, non-ready API, or
unreachable web app fails the command.

## Local Development Command

## Dependency Audit Diagnostics

When `sh scripts/dependency-audit.sh` reports findings, use these read-only diagnostics before changing versions:

```sh
pnpm audit --json
pnpm --recursive why <package-name>
```

The JSON output is for local diagnosis only and must not be committed.

## Local Development Command

After EP-001 creates the monorepo skeleton:

```sh
pnpm dev
```

Expected result: web, API, and required local development services start or print actionable configuration errors.

## Local Database Setup Command

To include the opt-in live PostgreSQL repository isolation test after starting
the local database, set `REI_OS_RUN_DB_INTEGRATION=1` and point `DATABASE_URL`
at the synthetic local `rei_os` database before running the documented
integration wrapper. On Windows with the alternate port recovery above:

```powershell
$env:REI_OS_RUN_DB_INTEGRATION = "1"
$env:DATABASE_URL = "postgresql://rei:rei@127.0.0.1:5433/rei_os"
sh scripts/test-integration.sh
```

Integration test tasks are intentionally uncached so environment-gated database
tests cannot be replaced by a prior local or CI result.

After EP-003 creates Compose and migration files:

```sh
pnpm db:setup
```

Expected result: local Postgres/PostGIS, Redis, MinIO, and search services start in the `healthy` or `running` state.

For migration recovery, start only the authoritative database before retrying the
full profile:

```sh
pnpm db:setup:postgres
```

Expected result: the local Postgres/PostGIS service starts without waiting on
projection or cache service images.

If another local development container owns port 5432, use the documented
`POSTGRES_HOST_PORT` override. On Windows:

```powershell
$env:POSTGRES_HOST_PORT = "5433"
pnpm db:setup:postgres
```

If setup times out or a migration reports that PostgreSQL is not running, inspect the
same local Compose profile without changing service state:

```sh
docker compose -f infra/compose/solo-budget.yml ps -a
docker compose -f infra/compose/solo-budget.yml logs --tail 100 postgres
docker ps --filter publish=5432 --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"
```

Expected result: service state and bounded PostgreSQL startup diagnostics are shown
without printing application secrets or production data; the final command identifies
any container already owning the default local PostgreSQL port.

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
