#!/bin/bash
# Clone TestiWall from GitHub and deploy in one command
# Usage: ./scripts/clone-and-deploy.sh GITHUB_REPO_URL [DEPLOY_DIR]
# Example: ./scripts/clone-and-deploy.sh https://github.com/KirtiPatel79/testi-wall.git

set -e

REPO_URL="${1:?Usage: $0 GITHUB_REPO_URL [DEPLOY_DIR]}"
DEPLOY_DIR="${2:-/var/www/testiwall}"

# Need to clone - so run this script from a temp dir or pass deploy dir
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP_CLONE="/tmp/testiwall-clone-$$"

log() { echo "[clone-deploy] $1"; }

log "Cloning from $REPO_URL..."
rm -rf "$TEMP_CLONE"
git clone --depth 1 "$REPO_URL" "$TEMP_CLONE"

log "Deploying to $DEPLOY_DIR..."
mkdir -p "$(dirname "$DEPLOY_DIR")"
rm -rf "$DEPLOY_DIR"
mv "$TEMP_CLONE" "$DEPLOY_DIR"

cd "$DEPLOY_DIR"
chmod +x scripts/deploy.sh 2>/dev/null || true
./scripts/deploy.sh

log "Done. App at $DEPLOY_DIR"
