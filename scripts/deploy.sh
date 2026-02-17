#!/bin/bash
# TestiWall - Ubuntu VPS Deployment Script
# Run from project root: ./scripts/deploy.sh
# Or from anywhere: ./scripts/deploy.sh /path/to/cloned/repo

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err() { echo -e "${RED}[ERR]${NC} $1"; }

# Determine project root
if [ -n "$1" ] && [ -d "$1" ]; then
  APP_DIR="$(cd "$1" && pwd)"
else
  APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
fi

cd "$APP_DIR"

if [ ! -f "package.json" ] || [ ! -d "prisma" ]; then
  log_err "Not a TestiWall project. Run from project root or pass path."
  exit 1
fi

log_info "Deploying from: $APP_DIR"

# --- Check/Install Node.js 18+ ---
check_node() {
  if command -v node &>/dev/null; then
    local v
    v=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
    if [ "$v" -ge 18 ] 2>/dev/null; then
      log_info "Node.js $(node -v) found"
      return 0
    fi
  fi
  return 1
}

install_node() {
  log_info "Installing Node.js 20 LTS..."
  if command -v curl &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    log_err "curl required. Run: sudo apt-get install -y curl"
    exit 1
  fi
}

if ! check_node; then
  install_node
fi

# --- Check/Install PostgreSQL ---
check_pg() {
  if command -v psql &>/dev/null; then
    log_info "PostgreSQL $(psql --version 2>/dev/null | head -1) found"
    return 0
  fi
  return 1
}

install_pg() {
  log_info "Installing PostgreSQL..."
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
}

if ! check_pg; then
  install_pg
fi

# --- Ensure PostgreSQL is running ---
if ! sudo systemctl is-active --quiet postgresql 2>/dev/null; then
  log_info "Starting PostgreSQL..."
  sudo systemctl start postgresql || true
fi

# --- Create database and user (interactive) ---
DB_NAME="${TESTIWALL_DB_NAME:-testiwall}"
DB_USER="${TESTIWALL_DB_USER:-testiwall}"
DB_PASS="${TESTIWALL_DB_PASS:-}"

create_db() {
  if [ -z "$DB_PASS" ]; then
    echo
    read -sp "Enter PostgreSQL password for user '$DB_USER' (will be created): " DB_PASS
    echo
    read -sp "Confirm password: " DB_PASS2
    echo
    if [ "$DB_PASS" != "$DB_PASS2" ]; then
      log_err "Passwords do not match"
      exit 1
    fi
  fi

  log_info "Creating database and user..."
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null | grep -q 1 && {
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';" 2>/dev/null || true
  } || {
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
  }
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
  sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>/dev/null || true
  log_info "Database ready"
}

# Try to connect; if fails, create
if ! sudo -u postgres psql -lqt 2>/dev/null | cut -d'|' -f1 | grep -qw "$DB_NAME"; then
  create_db
else
  log_info "Database '$DB_NAME' exists"
  if [ -z "$DB_PASS" ] && [ ! -f "$APP_DIR/.env" ]; then
    read -sp "Enter PostgreSQL password for '$DB_USER': " DB_PASS
    echo
  fi
fi

# --- Create .env ---
if [ ! -f "$APP_DIR/.env" ]; then
  log_info "Creating .env from .env.example..."
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"

  # Generate AUTH_SECRET
  AUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
  sed -i "s|generate-a-random-32-byte-secret-here|$AUTH_SECRET|" "$APP_DIR/.env"

  # Set DATABASE_URL (password with @:#/ should be URL-encoded)
  DB_HOST="${TESTIWALL_DB_HOST:-localhost}"
  DB_PORT="${TESTIWALL_DB_PORT:-5432}"
  DB_PASS_ENC=$(printf '%s' "$DB_PASS" | sed 's/@/%40/g; s/:/%3A/g; s/\//%2F/g; s/\\/\\\\/g')
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASS_ENC}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
  grep -v '^DATABASE_URL=' "$APP_DIR/.env" > "$APP_DIR/.env.tmp" 2>/dev/null || true
  echo "DATABASE_URL=\"$DATABASE_URL\"" >> "$APP_DIR/.env.tmp"
  mv "$APP_DIR/.env.tmp" "$APP_DIR/.env"

  echo
  log_warn "Edit .env and set NEXTAUTH_URL and NEXT_PUBLIC_APP_URL to your domain or IP"
  log_warn "Example: https://testiwall.example.com or http://YOUR_VPS_IP:3000"
  echo
  read -p "Enter your app URL (e.g. https://yourdomain.com or http://IP:3000): " APP_URL
  if [ -n "$APP_URL" ]; then
    APP_URL=$(echo "$APP_URL" | sed 's|/$||')
    sed -i "s|https://your-domain.com|$APP_URL|g" "$APP_DIR/.env"
  fi

  log_info ".env created. You can edit it: nano $APP_DIR/.env"
else
  log_info ".env already exists"
fi

# --- Install deps ---
log_info "Installing dependencies..."
npm ci 2>/dev/null || npm install

# --- Run migrations ---
log_info "Running database migrations..."
npm run db:migrate:deploy

# --- Build ---
log_info "Building application..."
npm run build

# --- PM2 ---
log_info "Setting up PM2..."
if ! command -v pm2 &>/dev/null; then
  sudo npm install -g pm2
fi

# Stop existing if any
pm2 delete testiwall 2>/dev/null || true

# Start
pm2 start npm --name testiwall -- start
pm2 save
pm2 startup 2>/dev/null || log_warn "Run 'pm2 startup' manually to enable auto-start on boot"

# --- Summary ---
echo
log_info "=============================================="
log_info "TestiWall deployed successfully!"
log_info "=============================================="
echo
log_info "App running at: $(grep NEXT_PUBLIC_APP_URL "$APP_DIR/.env" 2>/dev/null | cut -d= -f2- || echo 'Check .env')"
log_info "PM2 status: pm2 status"
log_info "Logs: pm2 logs testiwall"
log_info "Restart: pm2 restart testiwall"
echo
log_warn "Optional: Run 'npm run db:seed' to add demo data (creates demo@testiwall.local / password123)"
echo
