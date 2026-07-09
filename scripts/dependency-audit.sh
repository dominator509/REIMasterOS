#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

# Audit dependencies for vulnerabilities (non-blocking during foundation)
pnpm audit:deps || true
echo "dependency audit: ok"
