# Conventions

## Code style (planned)
- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- No framework/database/UI imports in domain packages
- Pure functions preferred in domain layer

## Naming
- ExecPlans: `EP-NNN-short-description.md` under `.agent/execplans/`
- Specs: `SPEC-NNN-short-description.md` under `.agent/specs/`
- kebab-case for files, camelCase for JS/TS symbols
- ADRs in Decision Log within ExecPlans

## Agent workflow (from AGENTS.md)
1. Read AGENTS.md → COMMANDS.md → .agent/PLANS.md → active ExecPlan
2. Run `sh scripts/preflight.sh`
3. Complete milestones in order
4. Validate after every milestone
5. Update ExecPlan Progress, Surprises, Decision Log, Outcomes
6. Continue autonomously; stop only on STOP conditions

## Commit style
- Descriptive, imperative mood
- Reference ExecPlan ID (e.g., "EP-001: scaffold monorepo")
- End with `Co-Authored-By: Claude <noreply@anthropic.com>`

## Documentation
- All docs are Markdown in repo root
- `.agent/` for agent-facing docs; root `*.md` for human-facing
- Each ExecPlan is self-contained — a new agent must be able to continue from it alone
