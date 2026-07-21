#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Preserve failures so verification cannot report a false green when the
# registry is unavailable or findings exceed the configured threshold.
pnpm audit:deps
echo "dependency audit: ok"
