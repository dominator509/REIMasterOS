#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Lint all projects
pnpm lint
echo "lint: ok"
