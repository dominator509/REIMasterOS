#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

need_file() {
  if [ ! -e "$1" ]; then
    echo "ERROR: Required file or directory is missing: $1" >&2
    exit 1
  fi
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: Required command is missing: $1" >&2
    exit 1
  fi
}

need_file "AGENTS.md"
need_file "COMMANDS.md"
need_file ".agent/PLANS.md"
need_file ".agent/EXECUTION_RULES.md"
need_file "scripts"

need_cmd git
need_cmd pnpm

if [ -f package.json ]; then
  for script_name in lint format:check typecheck test:unit test:integration test:e2e build security:check audit:deps smoke; do
    if ! grep -q "\"$script_name\"[[:space:]]*:" package.json; then
      echo "ERROR: package.json is missing required script: $script_name" >&2
      exit 1
    fi
  done
else
  echo "preflight: package.json not found; blueprint-only greenfield state is allowed before EP-001." >&2
fi

if [ -f .env.local ]; then
  echo "preflight: .env.local present; ensure it is gitignored and contains no production secrets." >&2
else
  echo "preflight: .env.local not present; ok before runtime services are configured." >&2
fi

if git status --short | grep -q '^?? .*\.env.local$'; then
  echo "ERROR: .env.local appears untracked; ensure it is ignored before continuing." >&2
  exit 1
fi

echo "preflight: ok"
