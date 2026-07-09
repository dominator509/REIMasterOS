# Task Completion

When a coding task is considered done, run these in order:

1. `sh scripts/format-check.sh` — format validation
2. `sh scripts/lint.sh` — lint check
3. `sh scripts/typecheck.sh` — static type validation
4. `sh scripts/test-unit.sh` — unit tests
5. `sh scripts/test-integration.sh` — integration tests
6. `sh scripts/build.sh` — build verification
7. `sh scripts/security-check.sh` — security scan
8. `sh scripts/dependency-audit.sh` — dependency audit
9. `sh scripts/verify.sh` — full verification

After validation:
- Run `git diff --name-only` and compare changed files to expected files
- Document any justified extra files in the active ExecPlan Decision Log
- Update ExecPlan Progress, Surprises & Discoveries, Decision Log, Outcomes & Retrospective
- If all milestones complete, mark ExecPlan as done
