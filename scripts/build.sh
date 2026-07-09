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

run_pnpm_script() {
  script_name="$1"
  if [ ! -f package.json ]; then
    echo "ERROR: Replace this placeholder command after repository discovery or EP-001 by creating package.json with script '$script_name'." >&2
    exit 1
  fi
  if ! grep -q "\"$script_name\"[[:space:]]*:" package.json; then
    echo "ERROR: Replace this placeholder command after repository discovery or EP-001 by adding package.json script '$script_name'." >&2
    exit 1
  fi
  need_cmd pnpm
  pnpm run "$script_name"
}

run_pnpm_script "build"
echo "build: ok"
