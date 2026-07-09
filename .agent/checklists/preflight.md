# Preflight Checklist

Run before edits.

Repository:

- [ ] Current directory is repository root containing `AGENTS.md`.
- [ ] `git status --short` reviewed.
- [ ] Existing uncommitted user changes identified.
- [ ] Active ExecPlan selected.
- [ ] Source-of-truth docs read.

Dependencies/tools:

- [ ] `sh` available.
- [ ] `git` available.
- [ ] `pnpm` available for default stack.
- [ ] Node version acceptable after EP-001.
- [ ] Docker available before persistence/deployment plans.
- [ ] Python/Go/Rust checked only when relevant.

Environment:

- [ ] `.env.example` exists after EP-001.
- [ ] `.env.local` is not committed.
- [ ] Required secrets documented.
- [ ] Missing paid-service credentials have fallback or STOP condition.

Commands:

- [ ] `sh scripts/preflight.sh` run.
- [ ] Required validation scripts exist.
- [ ] Placeholder scripts are expected only before their implementation phase.

Local services:

- [ ] Database service state checked when persistence tests require it.
- [ ] Redis/search/object storage state checked when integration tests require them.
- [ ] No live provider sends enabled in default tests.

Known blockers:

- [ ] Missing tools recorded.
- [ ] Missing secrets recorded.
- [ ] Repository conflicts recorded.
- [ ] STOP conditions evaluated.
