#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Check code formatting
pnpm format:check
echo "format check: ok"
