#!/usr/bin/env bash
set -euo pipefail

echo "--- Installing dependencies (backend and frontend) ---"
echo "--- Creating env files from examples (if absent) ---"
cd expense-tracker-backend
cp .env.example .env
npm ci
cd ../expense-tracker-frontend
cp .env.example .env
npm ci
cd ..

echo "--- Starting Docker services ---"
docker compose up -d --build

echo "--- Waiting for database to be ready ---"
sleep 5

echo "--- Pushing Prisma schema to database ---"
docker compose exec backend npx prisma db push || true

cat <<'EOF'
Done.
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
Examples:
  docker compose logs -f backend
  docker compose logs -f frontend
EOF
