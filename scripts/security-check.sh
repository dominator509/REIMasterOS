#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Preserve scanner failures so verification cannot report a false green.
pnpm security:check
echo "security check: ok"
