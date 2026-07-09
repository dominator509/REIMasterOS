#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run integration tests
pnpm test:integration
echo "integration tests: ok"
