# Execution Rules for Coding Agents

## One Active ExecPlan Rule

Implement exactly one active ExecPlan. Do not switch plans mid-run. Do not pull work from another ExecPlan unless the active ExecPlan explicitly says to do so.

## No Hidden Context Rule

Assume no prior conversation exists. Every decision must be supported by repository files, specs, the active ExecPlan, or a recorded assumption.

## No Roadmap-Only Implementation Rule

`ROADMAP.md` is strategic. Do not implement directly from it. Implementation must happen through an ExecPlan.

## Continue-by-Default Rule

Continue autonomously until the active ExecPlan is complete. Do not ask for next steps.

## STOP-Only Rule

Stop only for STOP conditions in `AGENTS.md`. If stopping, include blocker evidence and recommended default.

## Anti-Drift Rule

Do not broaden scope, perform unrelated cleanup, reorganize files, swap dependencies, or implement extra features outside the active ExecPlan.

## Anti-Hallucination Rule

Do not invent commands, APIs, env vars, routes, tables, provider capabilities, package methods, config keys, or tests. Verify or create them within the active ExecPlan.

## Anti-Fixation Rule

Use the bounded retry rule:

1. First failure: inspect error and make smallest fix.
2. Second same-root failure: run/create narrower diagnostic.
3. Third same-root failure: stop that approach, record failed hypotheses, choose simpler safe path, or stop if no safe path exists.

## Test-before-Completion Rule

No feature is complete without tests and validation commands.

## Diff Review Rule

Before final response, run:

```sh
git diff --name-only
```

Compare changed files to the active ExecPlan expected changed files. Justify extras in the Decision Log.

## Final Response Rule

Final response must include:

- ExecPlan completed.
- Changed files.
- Commands run.
- Command results.
- Acceptance criteria status.
- Decisions made.
- Assumptions confirmed/changed.
- Remaining risks.
- Production readiness status.
