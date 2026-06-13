import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as argon2 from 'argon2';
import { Connection, Types } from 'mongoose';
import { buildApp, closeApp, getConnection } from './test-app.helper';

let conn: Connection;
const d128 = (v: string | number) => Types.Decimal128.fromString(String(v));

const BASE = '/api/v1';

jest.setTimeout(60_000);

/**
 * Seeds a minimal fixture set:
 *  - 1 admin user (for category creation)
 *  - 1 provider user + ServiceProviderProfile (verified)
 *  - 1 category
 *  - 1 ACTIVE service linked to that category + provider
 * Returns ids + slugs needed by tests.
 */
async function seedFixtures() {
  const hash = await argon2.hash('TestPass@123!');
  const now = new Date();

  const users = conn.collection('users');
  const profiles = conn.collection('service_provider_profiles');
  const categories = conn.collection('categories');
  const services = conn.collection('services');

  // Admin
  await users.updateOne(
    { email: 'e2e-admin@afunotec.test' },
    {
      $set: { role: 'ADMIN', emailVerifiedAt: now },
      $setOnInsert: {
        email: 'e2e-admin@afunotec.test',
        name: 'E2E Admin',
        passwordHash: hash,
        isActive: true,
        preferredLocale: 'en',
        preferredCurrency: 'MGA',
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  const admin = await users.findOne({ email: 'e2e-admin@afunotec.test' });

  // Provider user
  await users.updateOne(
    { email: 'e2e-provider@afunotec.test' },
    {
      $set: { role: 'SERVICE_PROVIDER', emailVerifiedAt: now },
      $setOnInsert: {
        email: 'e2e-provider@afunotec.test',
        name: 'E2E Provider',
        passwordHash: hash,
        isActive: true,
        preferredLocale: 'en',
        preferredCurrency: 'MGA',
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  const providerUser = await users.findOne({ email: 'e2e-provider@afunotec.test' });

  // Provider profile (verified)
  await profiles.updateOne(
    { userId: providerUser!._id },
    {
      $set: { isVerified: true },
      $setOnInsert: {
        userId: providerUser!._id,
        businessName: 'E2E Tours Ltd',
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  const profile = await profiles.findOne({ userId: providerUser!._id });

  // Category
  await categories.updateOne(
    { slug: 'e2e-tours' },
    {
      $setOnInsert: {
        slug: 'e2e-tours',
        name: 'E2E Tours',
        type: 'TOUR',
        isActive: true,
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  const category = await categories.findOne({ slug: 'e2e-tours' });

  // Service — delete existing to avoid slug collision, then insert fresh
  await services.deleteMany({ slug: 'e2e-beach-tour' });
  const serviceDoc = {
    slug: 'e2e-beach-tour',
    name: 'E2E Beach Tour',
    title: 'E2E Beach Tour',
    description: 'A beautiful beach tour for testing.',
    providerId: profile!._id,
    categoryId: category!._id,
    basePrice: d128(150000),
    commissionValue: d128(0),
    commissionType: 'PERCENTAGE',
    currency: 'MGA',
    priceUnit: 'per_night',
    status: 'ACTIVE',
    location: 'Nosy Be',
    rating: d128(4.5),
    reviewCount: 10,
    viewCount: 0,
    images: [],
    detailPoints: [],
    packageItems: [],
    addOns: [],
    discounts: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
  const inserted = await services.insertOne(serviceDoc);
  const service = { _id: inserted.insertedId, ...serviceDoc };

  return { admin, providerUser, profile, category, service };
}

describe('Services (E2E)', () => {
  let app: INestApplication;
  let fixtures: Awaited<ReturnType<typeof seedFixtures>>;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildApp();
    conn = getConnection();
    fixtures = await seedFixtures();

    // Login as admin for protected routes
    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email: 'e2e-admin@afunotec.test', password: 'TestPass@123!' });
    adminToken = loginRes.body.data?.tokens?.accessToken;
  });

  afterAll(async () => {
    await closeApp();
  });

  // ── Public listing ─────────────────────────────────────────────────────────

  it('GET /services → 200 returns paginated list with envelope', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /services?categorySlug=e2e-tours → filters by category', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services?categorySlug=e2e-tours`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    const slugs = res.body.data.map((s: any) => s.slug);
    expect(slugs).toContain('e2e-beach-tour');
  });

  it('GET /services?query=Beach → full-text search match', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services?query=Beach`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /services?minPrice=100000&maxPrice=200000 → price range filter', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services?minPrice=100000&maxPrice=200000`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.some((s: any) => s.slug === 'e2e-beach-tour')).toBe(true);
  });

  // ── Service detail ─────────────────────────────────────────────────────────

  it('GET /services/:slug → 200 returns full detail with pricing', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services/e2e-beach-tour`)
      .expect(200);

    expect(res.body.success).toBe(true);
    const svc = res.body.data;
    expect(svc.slug).toBe('e2e-beach-tour');
    expect(svc.name).toBe('E2E Beach Tour');
    expect(svc.basePrice).toBeDefined();
    expect(svc.effectivePrice).toBeDefined();
    expect(svc.images).toBeDefined();
    expect(svc.rooms).toBeDefined();
    expect(svc.addOns).toBeDefined();
  });

  it('GET /services/:slug → 404 for unknown slug', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services/this-service-does-not-exist`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  // ── Pagination ─────────────────────────────────────────────────────────────

  it('GET /services?page=1&limit=1 → honours limit', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/services?page=1&limit=1`)
      .expect(200);

    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.meta.limit).toBe(1);
  });

  // ── Envelope shape ─────────────────────────────────────────────────────────

  it('GET /services → response matches {success, statusCode, data, meta} envelope', async () => {
    const res = await request(app.getHttpServer()).get(`${BASE}/services`).expect(200);
    expect(res.body).toMatchObject({
      success: true,
      statusCode: 200,
    });
    expect(res.body.data).toBeDefined();
    expect(res.body.meta).toBeDefined();
  });

  // ── Provider's own services ────────────────────────────────────────────────

  it('GET /services/me/list → 200 for authenticated provider', async () => {
    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email: 'e2e-provider@afunotec.test', password: 'TestPass@123!' });
    const providerToken = loginRes.body.data?.tokens?.accessToken;

    const res = await request(app.getHttpServer())
      .get(`${BASE}/services/me/list`)
      .set('Authorization', `Bearer ${providerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /services/me/list → 403 without SERVICE_PROVIDER role', async () => {
    // Register and login as a plain customer
    const email = `e2e-cust-${Date.now()}@afunotec.test`;
    await request(app.getHttpServer())
      .post(`${BASE}/auth/register`)
      .send({ name: 'E2E Cust', email, password: 'TestPass@123!' });
    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email, password: 'TestPass@123!' });
    const custToken = loginRes.body.data?.tokens?.accessToken;

    await request(app.getHttpServer())
      .get(`${BASE}/services/me/list`)
      .set('Authorization', `Bearer ${custToken}`)
      .expect(403);
  });
});
