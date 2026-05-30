#!/usr/bin/env bash
# =============================================================================
#  ameer_nasr — production deploy
#  Runs on the VPS. Fired by the GitHub Actions workflow on every push to
#  main, and safe to run by hand for hotfixes / rollbacks.
#
#  Pre-conditions on the VPS (one-time setup, see deploy/README.md):
#    - Docker + Docker Compose plugin installed
#    - This repo cloned into the project directory
#    - A .env file next to this script's parent dir with prod values
# =============================================================================
set -euo pipefail

# Always run from the repo root, regardless of where the workflow CDs us.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.."

COMPOSE="docker compose --env-file .env"

echo "▶ Pulling latest main…"
git fetch --prune origin main
git checkout main
git reset --hard origin/main

echo "▶ Building & starting containers…"
${COMPOSE} up -d --build --remove-orphans

echo "▶ Waiting for Postgres to be healthy…"
for i in {1..30}; do
  if ${COMPOSE} ps postgres | grep -q "healthy"; then
    echo "  postgres is healthy"
    break
  fi
  sleep 2
  if [ "${i}" = "30" ]; then
    echo "⚠ Postgres did not become healthy in 60s (continuing — frontend can still serve)"
    ${COMPOSE} logs --tail=40 postgres >&2 || true
    break
  fi
done

# Migrations and seed are non-blocking — if the backend module isn't ready
# yet (e.g. on a frontend-only milestone before M2 lands), we don't want
# the whole deploy to fail. Re-run them by hand on the VPS once backend is
# in scope: `docker compose exec backend npx prisma migrate deploy`.
echo "▶ Running Prisma migrations (tolerant)…"
${COMPOSE} exec -T backend npx prisma migrate deploy 2>&1 \
  || echo "  (migrate skipped — re-run manually when backend is in scope)"

echo "▶ Seeding initial data (tolerant)…"
${COMPOSE} exec -T backend node prisma/seed.js 2>/dev/null \
  || ${COMPOSE} exec -T backend npx ts-node prisma/seed.ts 2>/dev/null \
  || echo "  (seed skipped or already up-to-date)"

echo "▶ Pruning unused docker images…"
docker image prune -f >/dev/null || true

echo "▶ Container status:"
${COMPOSE} ps

echo "✓ Deploy complete."
