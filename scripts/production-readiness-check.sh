#!/bin/sh
set -e
cd "$(dirname "$0")/.." || exit 1

echo "=== REI-OS Production Readiness Check ==="
echo ""
echo "scope: repository artifact validation only; this is not deployment or runtime proof"
echo ""

failed=0

require_file() {
  if [ -f "$1" ]; then
    echo "  PASS: $1 exists"
  else
    echo "  FAIL: $1 missing"
    failed=1
  fi
}

require_text() {
  if grep -Fq -- "$2" "$1"; then
    echo "  PASS: $1 contains $2"
  else
    echo "  FAIL: $1 missing required marker $2"
    failed=1
  fi
}

# Check required files
for f in .env.example Dockerfile .dockerignore .gitignore; do
  require_file "$f"
done

# Check every documented Docker Compose profile and existing runtime image.
for profile in infra/compose/solo-budget.yml infra/compose/hybrid-cheap.yml infra/compose/vendor-fast.yml infra/compose/enterprise-self-host.yml; do
  require_file "$profile"
done
for artifact in Dockerfile apps/web/Dockerfile .dockerignore; do
  require_file "$artifact"
done

# Helm is optional for budget mode. These checks prove the repository chart
# contract exists; they do not replace helm lint/template or cluster admission.
for chart_file in infra/helm/Chart.yaml infra/helm/values.yaml infra/helm/templates/_helpers.tpl infra/helm/templates/configmap.yaml infra/helm/templates/api-deployment.yaml infra/helm/templates/api-service.yaml infra/helm/templates/web-deployment.yaml infra/helm/templates/web-service.yaml infra/helm/templates/ingress.yaml infra/helm/templates/NOTES.txt; do
  require_file "$chart_file"
done
require_text infra/helm/values.yaml 'tag: ""'
require_text infra/helm/values.yaml "secretRef:"
require_text infra/helm/values.yaml "runAsNonRoot: true"
require_text infra/helm/templates/api-deployment.yaml "/health/live"
require_text infra/helm/templates/api-deployment.yaml "/health/ready"
require_text infra/helm/templates/api-deployment.yaml "secretKeyRef:"
require_text infra/helm/templates/api-deployment.yaml "workers.enabled cannot be true"
require_text infra/helm/templates/api-deployment.yaml "mountPath: /tmp"
require_text infra/helm/templates/web-deployment.yaml "mountPath: /app/apps/web/.next/cache"
require_text infra/helm/templates/ingress.yaml "networking.k8s.io/v1"
require_text DEPLOYMENT.md "EP-009 Helm Chart Contract"

# Check CI builds and blocks on HIGH/CRITICAL scans for both images.
require_file ".github/workflows/ci.yml"
require_text .github/workflows/ci.yml "Build API image"
require_text .github/workflows/ci.yml "Build web image"
require_text .github/workflows/ci.yml "Scan API image"
require_text .github/workflows/ci.yml "Scan web image"
require_text .github/workflows/ci.yml "exit-code: \"1\""
require_text .github/workflows/ci.yml "severity: HIGH,CRITICAL"

# Check scripts and release/rollback evidence contracts.
for script in scripts/preflight.sh scripts/verify.sh scripts/install.sh scripts/smoke-test.sh scripts/smoke/local-smoke.ts; do
  require_file "$script"
done
for release_doc in RELEASE.md ROLLBACK.md DEPLOYMENT.md COMMANDS.md; do
  require_file "$release_doc"
done
require_text scripts/smoke/local-smoke.ts "DEPLOYMENT_SMOKE_API_URL"
require_text scripts/smoke/local-smoke.ts "/health/ready"
require_text RELEASE.md "EP-009 Release Candidate Procedure"
require_text RELEASE.md "does not publish"
require_text ROLLBACK.md "EP-009 Immutable-Artifact Rollback Drill"
require_text ROLLBACK.md "Never improvise reverse SQL"
require_text ROLLBACK.md "--no-deps api web"
require_text ROLLBACK.md "helm rollback"

# Check self-hosted observability artifacts and stable cross-file names.
for f in infra/otel/collector-config.yml infra/prometheus/prometheus.yml infra/prometheus/alerts.yml infra/grafana/dashboards/overview.json OBSERVABILITY.md OPERATIONS.md; do
  require_file "$f"
done

require_text infra/otel/collector-config.yml "traces:"
require_text infra/otel/collector-config.yml "prometheus:"
require_text infra/prometheus/prometheus.yml "alerts.yml"
require_text infra/prometheus/alerts.yml "ReiOsAiSanitizerBlockedOutput"
require_text infra/grafana/dashboards/overview.json "rei_ai_cache_requests_total"
require_text OBSERVABILITY.md "rei_compliance_verdicts_total"
require_text OPERATIONS.md "Observability Alert Triage"

if ! node -e "JSON.parse(require('fs').readFileSync('infra/grafana/dashboards/overview.json', 'utf8'))"; then
  echo "  FAIL: Grafana dashboard JSON is invalid"
  failed=1
else
  echo "  PASS: Grafana dashboard JSON is valid"
fi

echo ""
if [ "$failed" -ne 0 ]; then
  echo "production readiness: failed"
  exit 1
fi

echo "production readiness: ok"
