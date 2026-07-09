# Suggested Commands

## Windows-specific notes

- Use PowerShell (pwsh) for native Windows commands; Bash (Git Bash) for POSIX scripts
- Paths: forward slashes in Bash (`C:/dev/REIMasterOS`), backslashes in PowerShell
- `sh scripts/preflight.sh` works in Git Bash; `./scripts/preflight.sh` may not on Windows
- `rtk` wraps most CLI commands transparently via Claude Code hook

## Dev commands (from COMMANDS.md)

| Purpose              | Command                                    |
| -------------------- | ------------------------------------------ |
| Preflight            | `sh scripts/preflight.sh`                  |
| Install deps         | `sh scripts/install.sh`                    |
| Lint                 | `sh scripts/lint.sh`                       |
| Format check         | `sh scripts/format-check.sh`               |
| Typecheck            | `sh scripts/typecheck.sh`                  |
| Unit tests           | `sh scripts/test-unit.sh`                  |
| Integration tests    | `sh scripts/test-integration.sh`           |
| E2E tests            | `sh scripts/test-e2e.sh`                   |
| Build                | `sh scripts/build.sh`                      |
| Security check       | `sh scripts/security-check.sh`             |
| Dependency audit     | `sh scripts/dependency-audit.sh`           |
| Smoke test           | `sh scripts/smoke-test.sh`                 |
| Full verify          | `sh scripts/verify.sh`                     |
| Production readiness | `sh scripts/production-readiness-check.sh` |

## Post-EP-001 (planned)

- `pnpm dev` — start dev environment
- `pnpm db:setup` — start local DB services
- `pnpm db:migrate` — apply migrations

## Repo inspection (read-only)

- `git status --short`
- `git diff --name-only`
- `git ls-files`
- `ls -la`
- `find . -maxdepth 3 -type f | sort`
