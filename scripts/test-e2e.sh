#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run end-to-end tests
pnpm test:e2e
echo "e2e tests: ok"
