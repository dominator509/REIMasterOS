# Validation Checklist

Run commands from repository root.

- [ ] Preflight: `sh scripts/preflight.sh`
- [ ] Install: `sh scripts/install.sh`
- [ ] Lint: `sh scripts/lint.sh`
- [ ] Format check: `sh scripts/format-check.sh`
- [ ] Typecheck/static validation: `sh scripts/typecheck.sh`
- [ ] Unit tests: `sh scripts/test-unit.sh`
- [ ] Integration tests: `sh scripts/test-integration.sh`
- [ ] E2E/acceptance tests: `sh scripts/test-e2e.sh`
- [ ] Build: `sh scripts/build.sh`
- [ ] Security check: `sh scripts/security-check.sh`
- [ ] Dependency audit: `sh scripts/dependency-audit.sh`
- [ ] Smoke test: `sh scripts/smoke-test.sh`
- [ ] Full verify: `sh scripts/verify.sh`
- [ ] Production readiness check when applicable: `sh scripts/production-readiness-check.sh`

For failures:

- [ ] Exact command recorded.
- [ ] Exact error recorded.
- [ ] First/second/third failure count identified.
- [ ] Bounded retry applied.
- [ ] ExecPlan updated.
