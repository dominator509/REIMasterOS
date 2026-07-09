#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run smoke tests
pnpm smoke
echo "smoke test: ok"
