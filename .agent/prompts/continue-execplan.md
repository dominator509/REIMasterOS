# Prompt: Continue Partially Completed ExecPlan

Read `AGENTS.md`, `COMMANDS.md`, `.agent/PLANS.md`, and `[EXECPLAN_PATH]`.

Continue `[EXECPLAN_PATH]` from its current state.

Rules:

- Inspect `Progress`.
- Inspect `Surprises & Discoveries`.
- Inspect `Decision Log`.
- Inspect `Outcomes & Retrospective` if present.
- Validate prior assumptions by reading repository files before editing.
- Resume at the first incomplete milestone.
- Do not redo completed milestones unless validation evidence is missing or stale.
- Run `sh scripts/preflight.sh` before new edits.
- Complete remaining milestones in order.
- Validate after every milestone.
- Update the ExecPlan as you work.
- Use only commands from `COMMANDS.md`.
- Do not ask for next steps.
- Stop only for STOP conditions in `AGENTS.md`.
- At the end, run required verification, run `git diff --name-only`, update `Outcomes & Retrospective`, and report results.
