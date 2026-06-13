# ameer_nasr (AfunoTec) — Local Setup

Run the platform locally on **Windows, macOS, or Linux**. Same commands on all three.

## Prerequisites (install once)

- **Node.js 20+** — https://nodejs.org
- **pnpm** — `npm install -g pnpm`
- **Docker Desktop** (for Redis) — https://www.docker.com
- A **MongoDB Atlas** connection string (the database is managed; no local DB needed)

## Steps

```bash
# 1. Start Redis (used for jobs/cache)
docker compose up -d redis

# 2. Backend — install
cd backend
npm install

# 3. Backend — configure env (then set MONGODB_URI in backend/.env)
cp .env.example .env        # Windows PowerShell: copy .env.example .env

# 4. Backend — seed initial data (admin, categories, currencies)
npm run db:seed

# 5. Backend — start the API  (http://localhost:4000/api/v1)
npm run start:dev

# 6. Frontend — in a NEW terminal, from the repo root
cd frontend/-ameer_nasr-frontend-main
pnpm install
pnpm dev                    # http://localhost:3000
```

That's it. API docs: http://localhost:4000/api/docs · Default admin: `admin@ameer-nasr.local`.
