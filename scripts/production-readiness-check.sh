#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

required_docs="PRODUCTION_READINESS.md SECURITY.md DEPLOYMENT.md OPERATIONS.md OBSERVABILITY.md RELEASE.md ROLLBACK.md"
for doc in $required_docs; do
  if [ ! -f "$doc" ]; then
    echo "ERROR: Required production-readiness document is missing: $doc" >&2
    exit 1
  fi
done

if [ ! -f package.json ]; then
  echo "ERROR: Replace this placeholder command after repository discovery or EP-001. Production readiness cannot pass before application package scripts exist." >&2
  exit 1
fi

if [ ! -d .agent/checklists ]; then
  echo "ERROR: Missing .agent/checklists directory." >&2
  exit 1
fi

if [ ! -f .agent/checklists/production-readiness.md ]; then
  echo "ERROR: Missing production readiness checklist." >&2
  exit 1
fi

echo "production readiness: ok"
