# ameer_nasr — Backend

REST + WebSocket API for the ameer_nasr (AfunoTec) Madagascar intermediary booking platform.

## Stack

- **NestJS 11** (TypeScript) — modular architecture, DI, OpenAPI, WebSockets
- **PostgreSQL 16** via **Prisma ORM**
- **Redis 7** for BullMQ background jobs + cache
- **JWT** auth (access + refresh, DB-backed rotation)
- **Argon2** password hashing
- **Pino** structured logging
- **Swagger / OpenAPI** auto-generated docs at `/api/docs`
- **Helmet + CORS + Throttler** security defaults
- **Docker** multi-stage build + docker-compose dev stack

## Quick start (local dev)

```bash
# 1. Bring up Postgres + Redis (from project root)
cd ..
docker compose up -d postgres redis

# 2. Install backend deps
cd backend
npm install

# 3. Copy env
cp .env.example .env

# 4. Generate Prisma client + run migrations
npm run prisma:generate
npm run prisma:migrate:dev -- --name init

# 5. Seed default admin + categories + currencies
npm run db:seed

# 6. Start the API
npm run start:dev
```

API is at `http://localhost:4000/api/v1`, Swagger at `http://localhost:4000/api/docs`.

## Layout

```
src/
  config/                 # typed env config (registerAs)
  common/
    decorators/           # @CurrentUser, @Roles, @Public
    filters/              # GlobalHttpExceptionFilter, PrismaExceptionFilter
    guards/               # JwtAuthGuard, RolesGuard
    interceptors/         # TransformResponseInterceptor (envelope shape)
    prisma/               # PrismaService + global PrismaModule
    utils/                # pagination, referenceCode
  modules/
    health/               # /health, /health/ready (public)
    auth/                 # login, register, refresh, OTP, password reset
    users/                # CRUD, profile, role assignment
    providers/            # ServiceProviderProfile
    categories/           # public list + admin CRUD
    tags/                 # admin CRUD
    services/             # provider/admin CRUD, public listings
    availability/         # date-window availability checks
    cart/                 # session/user cart
    bookings/             # create from cart, status transitions
    payments/             # gateway abstraction + per-provider adapters
    promotions/           # promo codes, gift cards, coupons
    reviews/              # public read, customer write
    chat/                 # WebSocket gateway + history
    uploads/              # presigned URL issuer (R2/S3)
    ads/                  # banners + homepage showcase
    admin/                # admin-only dashboard metrics
    analytics/            # event ingestion / GA / FB pixel
    i18n/                 # admin-editable strings + currency rates
    audit/                # audit log
    ai/                   # PLACEHOLDER — returns 501 until specced
prisma/
  schema.prisma           # full ERD
  seed.ts                 # admin, categories, currencies
```

## Conventions

- All HTTP responses are wrapped by `TransformResponseInterceptor`:
  ```json
  { "success": true, "statusCode": 200, "message": "...", "data": <T>, "meta": {...} }
  ```
- Errors share a similar envelope (see `GlobalHttpExceptionFilter`).
- Monetary fields are `Decimal(18,2)` with a sibling `currency` (ISO 4217).
- All admin mutations write to `AuditLog`.
- All `POST /bookings` and `POST /payments/*` accept an `Idempotency-Key` header.

## Scripts

| Script | What it does |
|---|---|
| `npm run start:dev` | Dev with watch + Pino pretty logs |
| `npm run build` | Compile to `dist/` |
| `npm run lint` | ESLint + Prettier |
| `npm run test` | Jest unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run prisma:migrate:dev` | Create + apply a new migration |
| `npm run db:seed` | Seed initial data |
