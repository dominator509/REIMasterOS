#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run type checking / static validation
pnpm typecheck
echo "typecheck: ok"
