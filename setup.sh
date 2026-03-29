#!/usr/bin/env bash
set -euo pipefail

echo "--- Creating env files from examples (if absent) ---"
[ -f expense-tracker-backend/.env ] || cp expense-tracker-backend/.env.example expense-tracker-backend/.env
[ -f expense-tracker-frontend/.env ] || cp expense-tracker-frontend/.env.example expense-tracker-frontend/.env

echo "--- Installing dependencies (backend and frontend) ---"
cd expense-tracker-backend
npm ci
cd ../expense-tracker-frontend
npm ci
cd ..

echo "--- Starting Docker services ---"
docker compose up -d --build

echo "--- Running Prisma migrations on backend ---"
docker compose exec backend npx prisma migrate deploy --preview-feature || true

cat <<'EOF'
Done.
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
Examples:
  docker compose logs -f backend
  docker compose logs -f frontend
EOF
