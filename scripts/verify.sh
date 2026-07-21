#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Full verification pipeline: install -> lint -> format -> typecheck -> unit -> integration -> build -> e2e -> security -> audit -> smoke
sh scripts/install.sh
sh scripts/lint.sh
sh scripts/format-check.sh
sh scripts/typecheck.sh
sh scripts/test-unit.sh
sh scripts/test-integration.sh
sh scripts/build.sh
sh scripts/test-e2e.sh
sh scripts/security-check.sh
sh scripts/dependency-audit.sh
sh scripts/smoke-test.sh

echo "verify: ok"
