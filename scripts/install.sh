#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Install dependencies
pnpm install
echo "install: ok"
