# Prompt: Debug Validation Failure

Read `AGENTS.md`, `COMMANDS.md`, `.agent/PLANS.md`, and `[EXECPLAN_PATH]`.

Debug the failing validation command for the active ExecPlan.

Rules:

- Do not rewrite unrelated code.
- Capture the exact failing command.
- Capture the exact error output.
- Identify whether this is the first, second, or third same-root failure.
- Form one concrete hypothesis.
- Make the smallest targeted fix.
- Rerun the narrowest relevant command from `COMMANDS.md`.
- If the same root cause fails a second time, create or run a narrower diagnostic.
- If the same root cause fails a third time, stop that approach, record failed hypotheses in `Surprises & Discoveries`, choose a simpler safe implementation path if one exists, and continue only if it remains within scope.
- Update the ExecPlan with command, result, hypothesis, fix, and remaining risk.
- Do not ask for next steps unless a STOP condition applies.
