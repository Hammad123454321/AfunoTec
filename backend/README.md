# ameer_nasr — Backend

REST + WebSocket API for the ameer_nasr (AfunoTec) Madagascar intermediary booking platform.

## Stack

- **NestJS 11** (TypeScript) — modular architecture, DI, OpenAPI, WebSockets
- **MongoDB** (Atlas) via **Mongoose 8** ODM — Decimal128 money, session transactions
- **Redis 7** for BullMQ background jobs + cache
- **JWT** auth (access + refresh, DB-backed rotation)
- **Argon2** password hashing
- **Pino** structured logging
- **Swagger / OpenAPI** auto-generated docs at `/api/docs`
- **Helmet + CORS + Throttler** security defaults
- **Docker** multi-stage build + docker-compose dev stack

## Quick start (local dev)

```bash
# 1. Bring up Redis (from project root). The database is MongoDB Atlas —
#    no local DB container needed (set MONGODB_URI in .env).
cd ..
docker compose up -d redis

# 2. Install backend deps
cd backend
npm install

# 3. Copy env and set MONGODB_URI to your Atlas connection string
#    (percent-encode reserved characters in the password).
cp .env.example .env

# 4. Seed default admin + categories + currencies
npm run db:seed

# 5. Start the API
npm run start:dev
```

> Mongoose creates collections and indexes on first use (`autoIndex` is on
> outside production); there is no migration step. A replica set (Atlas provides
> one) is required for the multi-document transactions used by bookings/payments.

API is at `http://localhost:4000/api/v1`, Swagger at `http://localhost:4000/api/docs`.

## Layout

```
src/
  config/                 # typed env config (registerAs)
  common/
    decorators/           # @CurrentUser, @Roles, @Public
    filters/              # GlobalHttpExceptionFilter, MongoExceptionFilter
    guards/               # JwtAuthGuard, RolesGuard, OwnershipGuard
    interceptors/         # TransformResponseInterceptor (envelope shape)
    utils/                # money (Decimal128), pagination, referenceCode
  database/
    database.module.ts    # MongooseModule.forRootAsync (Atlas connection)
    transaction.service.ts# session-based withTransaction helper
    schemas/              # all Mongoose @Schema definitions
    seed.ts               # admin, categories, currencies
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
```

## Conventions

- All HTTP responses are wrapped by `TransformResponseInterceptor`:
  ```json
  { "success": true, "statusCode": 200, "message": "...", "data": <T>, "meta": {...} }
  ```
- Errors share a similar envelope (see `GlobalHttpExceptionFilter`).
- Monetary fields are BSON `Decimal128` with a sibling `currency` (ISO 4217);
  all money math goes through `common/utils/money.util` (decimal.js, no floats).
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
| `npm run db:seed` | Seed initial data (admin, categories, currencies) |
