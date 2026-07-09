# ExecPlan Standard

An ExecPlan is a self-contained implementation document for one feature or system change. A new agent with no prior conversation must be able to continue from the ExecPlan alone.

## Required Sections

Every ExecPlan must contain these sections in this order:

1. Purpose / Big Picture
2. Scope
3. Non-goals
4. Context and Orientation
5. Files to Read First
6. Files to Change
7. Interfaces and Contracts
8. Milestones
9. Concrete Steps
10. Validation and Acceptance
11. Idempotence and Recovery
12. Progress
13. Surprises & Discoveries
14. Decision Log
15. Outcomes & Retrospective

## Execution Rules

- One active ExecPlan at a time.
- Do not implement from `ROADMAP.md` directly.
- Read `AGENTS.md`, `COMMANDS.md`, this file, and the active ExecPlan before editing.
- Run `sh scripts/preflight.sh` before editing.
- Complete milestones in order.
- Validate every milestone using its listed command.
- Update Progress after every milestone.
- Continue autonomously unless a STOP condition in `AGENTS.md` applies.
- Do not ask the user for next steps unless a STOP condition applies.

## Milestone Rules

Each milestone must include:

- Goal.
- Files to read.
- Files to change.
- Exact edits expected.
- Validation command.
- Expected result.
- Recovery instruction.

A milestone is complete only when its validation passes or the ExecPlan explicitly permits a documented substitute validation.

## Validation Rules

- Use only commands in `COMMANDS.md`.
- Do not invent commands.
- If a command is missing or stale, inspect repository evidence, update `COMMANDS.md`, record the decision, then run it.
- Validation failures follow the bounded retry rule from `AGENTS.md`.

## Acceptance Rules

Every ExecPlan must define objective acceptance criteria. Acceptance criteria must be machine-verifiable where possible.

Examples:

- Command passes.
- Test file exists.
- API route returns specified JSON.
- Database migration creates specified table/constraint.
- UI state appears in E2E test.
- Logs include required redacted structured fields.
- No extra files changed without Decision Log entry.

## Idempotence Rules

Implementation steps must be safe to repeat. Agents must:

- Prefer additive changes.
- Avoid destructive setup.
- Use deterministic fixtures.
- Make scripts fail clearly if prerequisites are missing.
- Make migrations idempotent where tooling supports it.
- Re-run validation after recovery.

## Recovery Rules

When repository reality differs from the ExecPlan:

1. Inspect files.
2. Choose the smallest reversible change consistent with the spec.
3. Record the decision.
4. Continue if safe.
5. Stop only if a STOP condition applies.

When validation fails repeatedly:

1. First failure: smallest targeted fix.
2. Second same-root failure: narrower diagnostic.
3. Third same-root failure: stop that approach, record failed hypotheses, choose simpler safe path, or stop if no safe path exists.

## Progress Update Rules

After each milestone, update the ExecPlan:

- Mark completed checkbox.
- Record command run and result.
- Add any surprises.
- Add any decision.
- Add any remaining risk.

Progress entries must be specific enough for a new agent to resume without hidden context.

## Decision Log Rules

Record decisions when:

- A file outside expected changed files is modified.
- A dependency is added.
- A command changes.
- A schema changes.
- A provider adapter behavior changes.
- A spec ambiguity is resolved.
- A simpler fallback path is chosen after failed validation.
- An assumption is confirmed or changed.

Each decision must include date, decision, reason, and files affected.

## Completion Rules

An ExecPlan is complete only when:

- All milestones are complete.
- All required validation commands pass.
- Acceptance criteria pass.
- Progress is updated.
- Surprises & Discoveries is updated.
- Decision Log is updated.
- Outcomes & Retrospective is updated.
- Final diff reviewed.
- Only expected files changed or extras are justified.
- Remaining risks documented.
