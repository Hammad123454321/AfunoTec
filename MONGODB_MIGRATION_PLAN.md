# PostgreSQL → MongoDB Migration Plan (E2E)

**Project:** ameer_nasr / AfunoTec backend (NestJS 11)
**Current stack:** Prisma 6.13 + PostgreSQL 16
**Target stack:** Mongoose 8 (`@nestjs/mongoose`) + MongoDB Atlas (replica set)
**Decision:** Full ODM rewrite with Mongoose (not the Prisma-Mongo connector). Rationale in §1.
**Date:** 2026-06-13

---

## 0. Executive summary

The backend persists ~30 entities through Prisma against PostgreSQL, with heavy
relational features: foreign-key relations, `onDelete: Cascade`, composite primary
keys (`@@id`), `Decimal(18,2)` money, enums, unique constraints, and **49
`$transaction` call sites across 24 files**. Roughly **70 source files** import from
`@prisma/client`.

We will replace Prisma with **Mongoose via `@nestjs/mongoose`**, model documents with
`@Schema`/`@Prop` decorators, keep money as **`Decimal128`** (preserving the existing
no-floats invariant), and run multi-document **transactions via Mongoose sessions**
against the Atlas replica set. The work is staged so the app stays buildable between
phases.

This is a **schema + data-access rewrite**, not a data copy — there is no production
data yet (greenfield milestone work), so we re-seed rather than ETL. A data-migration
appendix (§9) is included in case the client already has live Postgres data.

---

## 1. Why Mongoose, not the Prisma MongoDB connector

The Prisma MongoDB connector looked like the cheaper path (swap one datasource line),
but it is disqualified by hard, verified limitations against this exact schema:

| Feature this codebase relies on | Prisma-Mongo support | Impact |
|---|---|---|
| `Decimal(18,2)` money + `Prisma.Decimal` math | **Unsupported** | Every monetary field + `money.util.ts` would need rewrite to integer-cents/string anyway |
| Composite IDs `@@id([a,b])` (`ServiceTag`, `ChatRoomMember`, `PromoCodeRedemption`) | **Unsupported** | 3 join models must be redesigned regardless |
| `prisma migrate` (versioned migrations) | **Unsupported** (only `db push`) | Lose migration history |
| `@db.Date`, `@db.Text`, `@db.Decimal` native column attrs | Ignored/unsupported | — |

Since the two most invasive refactors (Decimal money + composite-key join models) are
**forced either way**, the marginal cost of going all the way to Mongoose is small, and
we get the idiomatic, fully-supported MongoDB stack with native session transactions and
`Decimal128`. **Decision: Mongoose.**

> Sources consulted: Prisma ORM "MongoDB" connector docs (Decimal unsupported, no
> `@@id`, no Migrate, `db push` only); NestJS Mongoose technique docs; Mongoose 8
> transactions/`Decimal128` docs.

---

## 2. Connection & environment

**Atlas URI (provided):**
```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<app>
```

**⚠ The password contains reserved URI characters `)`, `(`, `*` and MUST be
percent-encoded**, or the driver will misparse the auth section:

```
)  -> %29
(  -> %28
*  -> %2A
```

Encoded URI (add an explicit database name `ameer_nasr` before the `?`):
```
mongodb+srv://<user>:<urlEncodedPassword>@<cluster>.mongodb.net/ameer_nasr?retryWrites=true&w=majority&appName=<app>
```

`mongodb+srv` resolves to an Atlas replica set, which **automatically satisfies the
replica-set requirement for multi-document transactions** — no extra config needed.

**`.env` / `.env.example` changes:**
- Remove `DATABASE_URL=postgresql://...`
- Add:
  ```
  # ---- Database (MongoDB Atlas) ----
  MONGODB_URI=mongodb+srv://<user>:<urlEncodedPassword>@<cluster>.mongodb.net/ameer_nasr?retryWrites=true&w=majority&appName=<app>
  MONGODB_DB_NAME=ameer_nasr
  ```
- Keep all Redis/JWT/OTP/SMTP/S3/FX/payment vars unchanged.

**Security note (flagging per project rules):** these are **live credentials pasted in
chat**. After migration, rotate the Atlas password, store it only in `.env`/secrets
manager (never committed), and restrict the Atlas Network Access list to the backend
server's IP rather than `0.0.0.0/0`.

---

## 3. Dependency changes

**Remove:** `@prisma/client`, `prisma`, and the `prisma:*` / `db:seed`(rewire) scripts.

**Add:**
```
@nestjs/mongoose   mongoose
```
(`Decimal128` and sessions ship with `mongoose`; no extra package.)

`package.json` script changes:
- Delete `prisma:generate`, `prisma:migrate:*`, `prisma:studio`.
- Replace `db:seed` to run the new Mongoose seed (`ts-node src/database/seed.ts`).
- Remove the top-level `"prisma": { "seed": ... }` block.

---

## 4. Schema translation — the model layer

Each Prisma `model` becomes a Mongoose schema class in
`src/database/schemas/<entity>.schema.ts`. Translation rules:

### 4.1 IDs
- Prisma `@id @default(cuid())` `String` → Mongoose default `_id: ObjectId`.
- Keep a stable string id on the wire: expose `id` as the hex string of `_id` (virtual /
  transform). **All `xxxId: String` foreign keys become `Types.ObjectId` + `ref`.**
- Slugs / reference codes / promo codes stay as their own unique-indexed string fields
  (they are business keys, not the PK).

### 4.2 Relations
Mongoose has no FK engine; relations are modeled as:
- **Reference + `populate`** for cross-aggregate links (e.g. `Booking.serviceId → Service`).
- **Embedded subdocuments** for owned, always-loaded children — strong candidates:
  `ServiceImage`, `ServiceDetailPoint`, `ServiceAddOn`, `ServicePackageItem` (collapse the
  3-way discriminator into one embedded array with a `kind` field),
  `Booking.guestsJson`/`lineItemsJson` (already JSON), `CartItem` under `Cart`,
  `BookingRoom` under `Booking`, `ChatRoomMember` under `ChatRoom`.
- Keep as **separate collections with refs** where independently queried or high-volume:
  `Service`, `Booking`, `Payment`, `Review`, `ChatMessage`, `ServiceAvailability`,
  `ServiceRoom` (referenced by bookings), `User`, profiles, `AuditLog`, `IdempotencyKey`.

> Embedding decisions are listed per-entity in §4.7. The guiding rule: embed when the
> child is only ever read/written through its parent and is bounded in size; reference
> when it is queried on its own or unbounded.

### 4.3 Composite-key join models (must redesign)
- `ServiceTag (@@id([serviceId,tagId]))` → store `tags: ObjectId[]` (ref `Tag`) embedded on
  `Service`; drop the join collection. Unique-per-service enforced in app logic.
- `ChatRoomMember (@@id([roomId,userId]))` → embedded `members[]` subdoc array on `ChatRoom`
  with a unique compound index on `{_id, members.userId}` via schema validation.
- `PromoCodeRedemption (@@unique([promoCodeId,bookingId]))` → own collection with a
  **compound unique index** `{ promoCodeId: 1, bookingId: 1 }`.

### 4.4 Money / Decimal
- Every `Decimal @db.Decimal(18,2)` / `Decimal(10,2)` / `Decimal(5,2)` / `Decimal(18,6)` /
  `Decimal(10,6)` → `@Prop({ type: SchemaTypes.Decimal128 })`, typed `Types.Decimal128`.
- **Rewrite `src/common/utils/money.util.ts`** to drop `Prisma.Decimal` and use a
  decimal library that round-trips with `Decimal128`. Recommended: keep the existing
  arithmetic semantics by wrapping **`decimal.js`** (Prisma's Decimal is `decimal.js`
  under the hood, so the API — `.plus/.minus/.times/.dividedBy/.toDecimalPlaces/
  ROUND_HALF_UP/.isNegative/.isZero` — maps 1:1). Convert `Decimal128 ⇄ Decimal` at the
  persistence boundary (`new Decimal(d128.toString())` / `Decimal128.fromString(dec.toFixed(2))`).
- This preserves the "money math never touches IEEE-754" invariant end-to-end.

### 4.5 Enums
- Prisma enums (`UserRole`, `BookingStatus`, `PaymentStatus`, `CategoryType`, …) → plain
  TS `enum`/`as const` union in `src/common/enums/*.ts`, used as
  `@Prop({ enum: Object.values(X), default: ... })`.
- **This removes the `@prisma/client` enum import in all 51 files** — they re-import from
  the new local enums module. Mechanical find-and-replace per enum.

### 4.6 Field-type mapping table

| Prisma | Mongoose |
|---|---|
| `String` | `@Prop()` String |
| `String?` | `@Prop({ required: false })` |
| `String @unique` | `@Prop({ unique: true, index: true })` |
| `Int @default(0)` | `@Prop({ default: 0 })` Number |
| `Boolean @default(true)` | `@Prop({ default: true })` |
| `DateTime @default(now())` | `@Prop({ default: () => new Date() })` (or `timestamps:true`) |
| `DateTime @updatedAt` | schema `{ timestamps: true }` |
| `DateTime? @db.Date` | `@Prop()` Date (store date-only at 00:00 UTC) |
| `Decimal @db.Decimal(_,_)` | `@Prop({ type: SchemaTypes.Decimal128 })` |
| `Json?` | `@Prop({ type: SchemaTypes.Mixed })` or a typed subschema |
| `@@map("table")` | `@Schema({ collection: 'table' })` (reuse same names) |
| `@@index([...])` | `Schema.index({ ... })` |
| `@@unique([...])` | `Schema.index({ ... }, { unique: true })` |
| relation field | `@Prop({ type: ObjectId, ref: 'Model' })` |

### 4.7 Per-entity disposition (embed vs reference)

| Entity | Disposition |
|---|---|
| User | Collection. `customerProfile`/`serviceProviderProfile` → embed (1:1, owned). |
| RefreshToken, OtpToken | Collections (queried by hash/identifier; TTL index on `expiresAt`). |
| Category | Collection; self-ref `parentId` kept as ObjectId ref. |
| Tag | Collection; referenced from `Service.tags[]`. |
| Service | Collection. Embed: images, detailPoints, addOns, packageItems(kind), rooms? (rooms referenced by bookings → keep as collection w/ ref). discounts → embed. tags → ObjectId[]. |
| ServiceAvailability | Collection (per-date rows, queried by date range; unique `{serviceId,date}`). |
| ServiceRoom | Collection (referenced by BookingRoom). |
| Cart / CartItem | Cart collection, items embedded. |
| Booking | Collection. rooms embedded; guests/lineItems already JSON → typed subdocs. |
| Payment | Collection (own lifecycle, gateway refs, queried independently). |
| PromoCode | Collection; redemptions → own collection (compound unique index). |
| GiftCard | Collection. |
| WishlistItem | Collection (unique `{userId,serviceId}`). |
| Review | Collection. |
| ChatRoom | Collection; members embedded; messages → own collection (`ChatMessage`, unbounded). |
| AdBanner, HomepageShowcase | Collections. |
| Currency, LocaleString | Collections. |
| FileObject, AuditLog, IdempotencyKey, NewsletterSubscriber | Collections. |

---

## 5. Data-access layer rewrite

### 5.1 Connection module
Replace `src/common/prisma/` (`PrismaModule`, `PrismaService`) with
`src/database/database.module.ts`:
```ts
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    uri: c.getOrThrow('MONGODB_URI'),
    dbName: c.get('MONGODB_DB_NAME', 'ameer_nasr'),
    retryWrites: true,
  }),
})
```
Each feature module registers its schemas with `MongooseModule.forFeature([...])`.

### 5.2 Repository pattern (recommended)
To contain blast radius and keep services testable, introduce a thin
`@InjectModel(X.name)` model per service (Mongoose's native DI). Services move from
`this.prisma.x.findMany(...)` to `this.xModel.find(...)`. Query-shape translations:

| Prisma | Mongoose |
|---|---|
| `findUnique({where:{id}})` | `findById(id)` |
| `findFirst({where})` | `findOne(filter)` |
| `findMany({where,skip,take,orderBy})` | `find(filter).skip().limit().sort()` |
| `create({data})` | `create(doc)` / `new Model().save()` |
| `update({where,data})` | `findByIdAndUpdate(id, patch, {new:true})` |
| `delete` / soft-delete | `findByIdAndUpdate(id,{deletedAt:new Date()})` |
| `count({where})` | `countDocuments(filter)` |
| `include: { rel: true }` | `.populate('rel')` or read embedded |
| `$transaction([a,b])` (batch) | `Promise.all` inside one `session.withTransaction` |
| `$transaction(async tx => …)` | `session.withTransaction(async () => …)` |
| pagination `[items,total]` | `Promise.all([find…, countDocuments])` |

### 5.3 Transactions (49 call sites)
Add a small helper `withTransaction(fn)` wrapping
`connection.startSession()` + `session.withTransaction()`, injected via
`@InjectConnection()`. All model ops inside pass `{ session }`. Each of the 24 files in
§0 is migrated individually; the booking/payment flows (the real money paths) get
explicit review and tests. Atlas replica set makes these first-class.

### 5.4 Cross-cutting components to rewrite
- `src/common/filters/prisma-exception.filter.ts` → `mongo-exception.filter.ts`:
  map Mongo error `11000` (duplicate key) → 409, `CastError`/`ValidationError` → 400,
  document-not-found → 404. Wire into `main.ts`/global filters.
- `src/common/audit/audit.service.ts` (`Prisma.JsonValue` diff) → use plain objects.
- `src/common/idempotency/idempotency.service.ts` (`Prisma` types + unique index) →
  Mongoose model with compound unique `{key,userId,path}`; keep durable de-dup logic.
- `src/common/decorators/owns-resource.decorator.ts` + `guards/ownership.guard.ts` →
  ObjectId-aware ownership lookups.
- `src/common/dto/pagination-query.dto.ts` — Prisma `orderBy` shape → Mongoose sort obj.
- `src/modules/services/service-query.builder.ts` — the `Prisma.ServiceWhereInput` builder
  → a Mongoose filter builder (largest single query-builder rewrite).
- `src/common/strategies/jwt.strategy.ts` — user lookup via Mongoose model.
- `src/modules/health/health.controller.ts` — replace `$queryRaw\`SELECT 1\`` with
  `connection.db.admin().ping()` (or `connection.readyState === 1`).
- `src/common/utils/slug.util.ts` — uniqueness check via Mongoose.

### 5.5 Type sources
~51 `import … from '@prisma/client'` become imports from
`src/common/enums/*` (enums) and `src/database/schemas/*` (document types / interfaces).
Mechanical but touches many files — do per-module in §7.

---

## 6. Indexes, constraints & integrity

MongoDB won't enforce FKs or cascades — we replace them explicitly:

- **Unique indexes:** recreate every `@unique` / `@@unique` as a Mongoose unique index
  (email, phone, slugs, codes, `providerRef`, `idempotencyKey`, `{userId,serviceId}`,
  `{serviceId,date}`, `{promoCodeId,bookingId}`, `{bucket,key}`).
- **Query indexes:** recreate every `@@index` (role, deletedAt, category/status, location,
  booking status, payment status, audit `{entity,entityId}`, etc.).
- **TTL indexes (new win):** `RefreshToken.expiresAt`, `OtpToken.expiresAt`,
  `IdempotencyKey.createdAt`, `Booking.expiresAt` reaper — TTL indexes can auto-expire.
- **Cascade deletes** (`onDelete: Cascade`) → implement via Mongoose `pre('deleteOne'/
  'findOneAndDelete')` hooks **or** explicit service-layer cleanup inside the same
  transaction. Document each former cascade and its replacement.
- Set `runValidators: true` on updates; enable `optimisticConcurrency` where needed
  (booking/availability/payment to prevent oversell/double-charge — replaces the implicit
  row-locking we got from Postgres transactions).

---

## 7. Execution phases (staged, app stays green)

> Each phase ends with `npm run build` + `npm test` passing before the next starts.
> No commits without approval (per project rule).

**Phase 0 — Prep & spike (0.5d)**
- Add `@nestjs/mongoose` + `mongoose`; remove Prisma deps.
- Stand up `DatabaseModule` + Atlas connection; verify `/health/ready` pings Mongo.
- Add `withTransaction` helper + `mongo-exception.filter`.

**Phase 1 — Enums & money primitives (0.5d)**
- Create `src/common/enums/*` from all Prisma enums.
- Rewrite `money.util.ts` onto `decimal.js` ↔ `Decimal128`. Unit tests first (it already
  has the semantics; port `money.util` spec).

**Phase 2 — Schemas (1–1.5d)**
- Author all `@Schema` classes per §4.7 with indexes (§6). No business logic yet.
- Seed script rewrite (`src/database/seed.ts`) including the default admin (project rule).

**Phase 3 — Core auth & users (1d)**
- Migrate `auth`, `users`, `token`, `otp` services + their specs. Login/refresh/lockout
  paths are security-critical — test thoroughly.

**Phase 4 — Catalog (1d)**
- `categories`, `tags`, `providers`, `services` (incl. `service-query.builder` +
  `service-pricing`), `availability`. Largest query surface.

**Phase 5 — Commerce (1.5d)**
- `cart`, `bookings` (+ `bookings-pricing`), `payments`, `promotions`, `wishlist`,
  `reviews`. All transaction-heavy money paths — explicit review, oversell/double-charge
  tests.

**Phase 6 — Ancillary (0.5d)**
- `chat` (+ gateway), `ads`, `analytics`, `admin`, `i18n` (currency/locale),
  `newsletter`, `uploads`, audit, idempotency.

**Phase 7 — Cleanup & infra (0.5d)**
- Delete `prisma/`, Prisma scripts/config, `prisma-exception.filter`.
- `docker-compose.yml`: drop the `postgres` service + `postgres_data` volume + Adminer's
  Postgres default; app uses Atlas `MONGODB_URI` (optionally add a local `mongo:7` replica
  for offline dev — see §8). Update healthcheck/`depends_on`.
- Update `.env`, `.env.example`, `README.md`, `Dockerfile` (no `prisma generate` step).
- CI (`.github/workflows/ci.yml`): remove Prisma generate/migrate steps; point tests at a
  Mongo service container or `mongodb-memory-server`.

**Total estimate: ~7–8 dev-days** plus a buffer for the booking/payment hardening.

---

## 8. Testing strategy

- **Unit:** keep the existing `*.spec.ts` set; swap mocked `PrismaService` for mocked
  Mongoose models (`@golevelup/ts-jest` or `jest-mock-extended`). Money util gets a
  Decimal128 round-trip suite.
- **Integration/e2e:** run against **`mongodb-memory-server`** (spins an ephemeral replica
  set so transactions work in CI) — populate `test/` e2e specs there.
- **Acceptance gates:** booking creation under concurrency (no oversell), payment
  idempotency (duplicate key replays), promo per-user-limit, availability reservation,
  soft-delete + cascade-replacement correctness.

## 9. Appendix — live-data migration (only if existing Postgres data)

If the client already has production Postgres data:
1. Freeze writes / maintenance window.
2. Export per-table to JSON (`pg`/`COPY … TO`).
3. Run a one-off transform script: map `cuid` PKs → deterministic `ObjectId` map, rewrite
   FK fields through that map, convert `Decimal` → `Decimal128`, fold embedded children,
   collapse the 3 join tables (§4.3).
4. `bulkWrite` insert into Atlas; build indexes after load.
5. Validate row counts + spot-check money totals byte-for-byte; reconcile; cut over.
6. Keep Postgres read-only as rollback for one cycle.

(Current milestone has no prod data → **re-seed instead of ETL**; this appendix is the
contingency.)

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Lost FK/cascade integrity | Explicit indexes + transactional cleanup + Mongoose hooks (§6) |
| Money precision regressions | `Decimal128` end-to-end + `decimal.js` math + round-trip tests (§4.4) |
| Oversell / double-charge (no row locks) | Session transactions + optimistic concurrency on availability/booking/payment |
| Credentials leaked in chat | Rotate Atlas password, lock Network Access, secrets manager (§2) |
| Big-bang regressions | Staged phases, app green after each, per-module specs (§7) |
| Composite-key data shape change | Redesigned join models documented (§4.3) before any code |
```
