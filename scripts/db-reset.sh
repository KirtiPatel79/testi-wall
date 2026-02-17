#!/bin/bash
# Reset database and re-run migrations (use after P3018 migration errors)
# Usage: ./scripts/db-reset.sh

set -e

cd "$(dirname "$0")/.."

if [ ! -f ".env" ]; then
  echo "No .env found. Run deploy.sh first."
  exit 1
fi

# Extract DB name from DATABASE_URL
source .env 2>/dev/null || true
DB_URL="${DATABASE_URL:-}"

if [ -z "$DB_URL" ]; then
  echo "DATABASE_URL not set in .env"
  exit 1
fi

# Parse db name (simple: last path segment)
DB_NAME=$(echo "$DB_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo "$DB_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

echo "This will DROP database '$DB_NAME' and recreate it. All data will be lost."
read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

echo "Dropping and recreating database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "Running migrations..."
npm run db:migrate:deploy

echo "Done. Database reset successfully."
