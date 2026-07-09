#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Build all projects
pnpm build
echo "build: ok"
