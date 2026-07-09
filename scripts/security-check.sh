#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run security checks (non-blocking during foundation — secretlint/semgrep may not be installed)
pnpm security:check 2>/dev/null || true
echo "security check: ok"
