# TestiWall - Ubuntu VPS Deployment

Deploy TestiWall on Ubuntu 20.04/22.04/24.04 from clone to running app.

## Prerequisites (Optional - Script Installs These)

- **Node.js 18+** (script installs Node 20 LTS if missing)
- **PostgreSQL** (script installs if missing)
- **Git** (for cloning)

## Quick Deploy (Clone + Deploy)

```bash
# 1. Clone your repo
git clone https://github.com/KirtiPatel79/testi-wall.git
cd testi-wall

# 2. Run deploy script (installs Node, Postgres, builds, starts)
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The script will:
- Install Node.js 20 and PostgreSQL if not present
- Create database `testiwall` and user (you'll be prompted for password)
- Generate `.env` from `.env.example`
- Run migrations, build, start with PM2

## One-Line Clone + Deploy

```bash
curl -fsSL https://raw.githubusercontent.com/KirtiPatel79/testi-wall/main/scripts/clone-and-deploy.sh | bash -s -- https://github.com/KirtiPatel79/testi-wall.git
```

## Environment Variables

Create `.env` (or let the script generate it). Required:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://testiwall:password@localhost:5432/testiwall` |
| `AUTH_SECRET` | NextAuth secret (32+ chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public app URL | `https://testiwall.example.com` |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL | `https://testiwall.example.com` |
| `AUTH_TRUST_HOST` | Set `true` for reverse proxy | `true` |

## Manual Deploy

```bash
# Install Node 20 & PostgreSQL (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib

# Create DB
sudo -u postgres createuser -P testiwall
sudo -u postgres createdb -O testiwall testiwall

# Setup
cp .env.example .env
# Edit .env with your values

npm install
npm run db:migrate:deploy
npm run build

# Run with PM2
sudo npm i -g pm2
pm2 start npm --name testiwall -- start
pm2 save && pm2 startup
```

## Non-Interactive Deploy (CI/VPS Automation)

```bash
export TESTIWALL_DB_PASS="your-secure-password"
export TESTIWALL_DB_USER="testiwall"
export TESTIWALL_DB_NAME="testiwall"
./scripts/deploy.sh
# When prompted for URL, script will use env or you can pipe: echo "https://yourdomain.com" | ...
```

## Post-Deploy

- **Seed demo data:** `npm run db:seed` (creates `demo@testiwall.local` / `password123`)
- **PM2:** `pm2 status`, `pm2 logs testiwall`, `pm2 restart testiwall`
- **Nginx reverse proxy:** See `scripts/nginx-example.conf`

## Updating

```bash
cd /path/to/repo
git pull
npm install
npm run db:migrate:deploy
npm run build
pm2 restart testiwall
```

## GitHub Push Checklist

Before pushing to GitHub:

1. [ ] Verify `.env` is gitignored (never commit secrets)
2. [ ] Ensure `.env.example` is committed (template for deploy)
3. [ ] Commit: `scripts/deploy.sh`, `scripts/clone-and-deploy.sh`, `scripts/nginx-example.conf`, `DEPLOY.md`, `.env.example`, `.nvmrc`
4. [ ] Push: `git push origin main` (or your default branch)

## Files Added for Deployment

| File | Purpose |
|------|---------|
| `.env.example` | Env template (copy to .env, fill values) |
| `scripts/deploy.sh` | Full deploy: Node, Postgres, build, PM2 |
| `scripts/clone-and-deploy.sh` | Clone from GitHub + run deploy |
| `scripts/nginx-example.conf` | Nginx reverse proxy template |
| `DEPLOY.md` | This deployment guide |
