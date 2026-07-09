# Contributing

## Setup

1. Read `AGENTS.md`.
2. Read `COMMANDS.md`.
3. Run:

```sh
sh scripts/preflight.sh
sh scripts/install.sh
```

4. Follow the active ExecPlan for implementation.

## Branch Rules

- One branch per ExecPlan or cohesive change.
- Do not mix unrelated changes.
- Do not implement roadmap items without an ExecPlan.
- Keep generated/build artifacts out of commits unless explicitly required.

## Coding Standards

- Keep domain logic pure and vendor-free.
- Use provider interfaces for integrations.
- Validate inputs at boundaries.
- Return typed errors/verdicts.
- Use tenant scope in every tenant-owned operation.
- Prefer deterministic functions in domain and prompt compiler.
- Keep hidden prefixes out of user-visible paths.
- Keep fallbacks for paid providers.

## Test Requirements

- Add tests for every behavior change.
- Use synthetic data only.
- Do not call live paid providers in default tests.
- Run required commands from `COMMANDS.md`.
- Add regression tests for bug fixes.
- Update fixtures carefully and keep them non-sensitive.

## Documentation Requirements

Update docs when changing:

- Commands.
- Environment variables.
- Architecture boundaries.
- Security behavior.
- Deployment process.
- Release/rollback process.
- API contracts.
- Data model.
- Specs or accepted behavior.

## Commit Guidance

Commit messages should include:

- ExecPlan ID.
- Brief change summary.
- Test/validation summary.

Example:

```text
EP-002: add compliance verdict domain tests
```

## Pull Request Checklist

- [ ] Active ExecPlan linked.
- [ ] Scope matches ExecPlan.
- [ ] Changed files match expected list or extras justified.
- [ ] Tests added/updated.
- [ ] Validation commands run.
- [ ] Docs updated.
- [ ] No secrets.
- [ ] No production data.
- [ ] Security/compliance effects reviewed.
- [ ] Accessibility effects reviewed for UI changes.
- [ ] Observability effects reviewed for runtime changes.

## Code Review Checklist

Reviewers should verify:

- Source-of-truth hierarchy followed.
- Domain boundary preserved.
- Tenant isolation preserved.
- Compliance gates preserved.
- Provider adapters used.
- Manual/self-host fallback preserved.
- No PropStream/Cobras protected content copied.
- No hidden-prefix leakage.
- No raw DNC exposure.
- Tests are meaningful.
- Commands are documented.
- Decisions recorded.

## Agent-Specific Contribution Rules

Coding agents must:

- Read `AGENTS.md`, `COMMANDS.md`, `.agent/PLANS.md`, and the active ExecPlan.
- Run preflight before editing.
- Complete milestones in order.
- Validate after each milestone.
- Update the active ExecPlan as work proceeds.
- Continue by default.
- Stop only for STOP conditions.
- Use bounded retry rules.
- Do not ask for next steps.
- Provide final response required by `AGENTS.md`.
