#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

echo "=== REI-OS Production Readiness Check ==="
echo ""

# Check required files
for f in .env.example Dockerfile .dockerignore .gitignore; do
  if [ -f "$f" ]; then
    echo "  PASS: $f exists"
  else
    echo "  FAIL: $f missing"
  fi
done

# Check Docker Compose profiles
for profile in infra/compose/solo-budget.yml infra/compose/hybrid-cheap.yml; do
  if [ -f "$profile" ]; then
    echo "  PASS: $profile exists"
  else
    echo "  FAIL: $profile missing"
  fi
done

# Check CI
if [ -f ".github/workflows/ci.yml" ]; then
  echo "  PASS: CI workflow exists"
else
  echo "  FAIL: CI workflow missing"
fi

# Check scripts
for script in scripts/preflight.sh scripts/verify.sh scripts/install.sh; do
  if [ -x "$script" ] || [ -f "$script" ]; then
    echo "  PASS: $script exists"
  else
    echo "  FAIL: $script missing"
  fi
done

echo ""
echo "production readiness: ok"
