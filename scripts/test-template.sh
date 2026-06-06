#!/usr/bin/env bash
# Smoke test the template end-to-end:
#   1. degit a fresh checkout into a temp dir
#   2. start Postgres
#   3. install, generate types, build (runs check:migrations gate)
#   4. boot dev server, curl / and /admin
#
# Run from the template repo root: `bash scripts/test-template.sh`
# Requires: docker, node 20+, npm, curl.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SANDBOX="$(mktemp -d -t payload-site-smoke-XXXX)"
PORT=3100  # avoid colliding with a running local dev server

cleanup() {
  echo "→ cleanup"
  if [[ -n "${DEV_PID:-}" ]]; then kill "$DEV_PID" 2>/dev/null || true; fi
  (cd "$SANDBOX" && docker compose down -v 2>/dev/null || true)
  rm -rf "$SANDBOX"
}
trap cleanup EXIT

echo "→ degit $REPO_ROOT → $SANDBOX"
# Use rsync rather than degit so this works without network access; mimics what
# degit would do (no .git history).
rsync -a --exclude='.git' --exclude='node_modules' --exclude='.next' "$REPO_ROOT/" "$SANDBOX/"

cd "$SANDBOX"

echo "→ docker compose up -d postgres"
docker compose up -d

# Point at the sandbox's Postgres (port 5433 per docker-compose.yml)
cat > .env <<EOF
DATABASE_URI=postgres://app:app@localhost:5433/app
PAYLOAD_SECRET=smoke-test-secret-not-for-prod
NEXT_PUBLIC_SERVER_URL=http://localhost:$PORT
PORT=$PORT
EOF

echo "→ wait for Postgres"
for _ in {1..30}; do
  if docker exec payload_site_postgres pg_isready -U app >/dev/null 2>&1; then break; fi
  sleep 1
done

echo "→ npm install"
npm install --no-audit --no-fund

echo "→ payload generate:types"
npm run payload -- generate:types

echo "→ npm run build (runs check:migrations gate first)"
npm run build

echo "→ npm run start (background)"
PORT="$PORT" npm run start &
DEV_PID=$!

echo "→ wait for server"
for _ in {1..30}; do
  if curl -fs "http://localhost:$PORT" >/dev/null 2>&1; then break; fi
  sleep 1
done

echo "→ curl / and /admin"
curl -fsI "http://localhost:$PORT/" >/dev/null
curl -fsI "http://localhost:$PORT/admin" >/dev/null

echo "✓ template smoke test passed"
