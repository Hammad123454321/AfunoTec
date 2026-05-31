# Deployment — baodeals.com

This folder holds everything the CI/CD pipeline and the VPS need to run a
production deploy.

```
deploy/
├── deploy.sh                  # runs on the VPS — git pull + docker compose
├── nginx/baodeals.com.conf    # host nginx reverse proxy (frontend + API)
└── README.md                  # this file

.github/workflows/deploy.yml   # GitHub Actions workflow (root)
docker-compose.yml             # single compose for dev + prod (root)
.env.example                   # template for the VPS .env
frontend/-ameer_nasr-frontend-main/Dockerfile
backend/Dockerfile
```

The flow is intentionally simple:

```
git push origin main
        │
        ▼
GitHub Actions  ─SSH─▶  VPS  ─▶  deploy.sh  ─▶  git pull  ─▶  docker compose up -d --build
                                                      │
                                                      ▼
                                            host nginx (80/443)
                                              │            │
                                              ▼            ▼
                                       Next.js:3000   NestJS:4000
                                                          │
                                                          ▼
                                                  Postgres / Redis
```

---

## 1. GitHub repository secrets

Set these in the repo: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret              | Example                                  | Notes                                              |
|---------------------|------------------------------------------|----------------------------------------------------|
| `VPS_HOST`          | `72.62.210.174` or `vps.baodeals.com`    | IP or DNS reachable from GitHub-hosted runners.    |
| `VPS_USER`          | `root`                                   | The user the workflow logs in as.                  |
| `VPS_PASSWORD`      | (the SSH password)                       | Plain SSH password auth. (Key auth is supported too — swap `password:` for `key:` in `.github/workflows/deploy.yml` and use `VPS_SSH_KEY` instead.) |
| `VPS_PORT`          | `22` (optional)                          | Only set if SSH listens on a non-standard port.    |
| `VPS_PROJECT_PATH`  | `/opt/afuno_tech`                        | Where the repo is cloned on the VPS.               |

No DB / JWT / payment secrets are stored on GitHub — they live exclusively
in `.env` on the VPS.

---

## 2. One-time VPS setup

Run these once after spinning up a fresh Ubuntu 22.04 / Debian 12 VPS.

### 2.1 Base packages

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install ca-certificates curl gnupg ufw nginx git

# Docker engine + compose plugin (official Docker repo)
curl -fsSL https://get.docker.com | sudo sh
sudo apt -y install docker-compose-plugin
```

### 2.2 Deploy user

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo mkdir -p /home/deploy/.ssh && sudo chmod 700 /home/deploy/.ssh
sudo cp /root/.ssh/authorized_keys /home/deploy/.ssh/   # or paste the public key
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2.3 Clone repo + create .env

```bash
sudo mkdir -p /opt/afuno_tech && sudo chown deploy:deploy /opt/afuno_tech
sudo -u deploy git clone <repo-url> /opt/afuno_tech
cd /opt/afuno_tech
sudo -u deploy cp .env.example .env
sudo -u deploy nano .env       # fill in real values (Postgres password, JWT secrets, etc.)
```

Generate strong secrets:

```bash
openssl rand -hex 48   # for JWT_ACCESS_SECRET / JWT_REFRESH_SECRET / Postgres password
```

### 2.4 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw --force enable
```

Postgres / Redis / backend / frontend ports are bound to `127.0.0.1` inside
the compose file, so they are not reachable from the public internet — only
the host nginx talks to them.

### 2.5 Nginx site config

```bash
sudo cp /opt/afuno_tech/deploy/nginx/baodeals.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/baodeals.com.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 2.6 DNS

Point three A records at the VPS IP:

```
baodeals.com        →  <VPS_IP>
www.baodeals.com    →  <VPS_IP>
api.baodeals.com    →  <VPS_IP>
```

Wait for DNS to resolve (`dig baodeals.com +short` should return the IP).

### 2.7 First deploy

```bash
sudo -u deploy bash /opt/afuno_tech/deploy/deploy.sh
```

This builds the images, starts every container, runs the Prisma migrations
and seeds the default admin. It takes ~3–5 minutes on a 2-vCPU VPS.

Verify:

```bash
curl http://127.0.0.1:4000/api/v1/health           # → {"status":"ok",...}
curl -I http://baodeals.com                        # → HTTP/1.1 200
```

### 2.8 HTTPS via Let's Encrypt

```bash
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx \
  -d baodeals.com -d www.baodeals.com -d api.baodeals.com \
  --email you@yourdomain.com --agree-tos --redirect
```

Certbot edits the nginx config in place, adds the `listen 443` blocks plus
an HTTP → HTTPS redirect, installs the certs, and sets up the renewal
timer. Re-deploys do not touch the nginx config so HTTPS keeps working.

---

## 3. Day-2 operations

Routine deploys happen automatically from `main`. The manual equivalents:

```bash
# Re-run the deploy by hand
sudo -u deploy bash /opt/afuno_tech/deploy/deploy.sh

# Tail logs
sudo -u deploy docker compose -f /opt/afuno_tech/docker-compose.yml logs -f backend
sudo -u deploy docker compose -f /opt/afuno_tech/docker-compose.yml logs -f frontend

# Rollback to a previous commit
cd /opt/afuno_tech
sudo -u deploy git checkout <old-sha>
sudo -u deploy bash deploy/deploy.sh

# DB backup (run from cron once it matters)
sudo -u deploy docker compose -f /opt/afuno_tech/docker-compose.yml \
  exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "/var/backups/ameer_nasr-$(date +%F).sql.gz"
```

---

## 4. Local development

Same compose file, only bring up the data services and run the apps on
your host (faster iteration, hot reload):

```bash
docker compose up -d postgres redis

cd backend  &&  npm install  &&  npm run start:dev   # http://localhost:4000
cd frontend/-ameer_nasr-frontend-main  &&  pnpm install  &&  pnpm dev  # http://localhost:3000
```
