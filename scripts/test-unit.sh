#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Run unit tests
pnpm test:unit
echo "unit tests: ok"
