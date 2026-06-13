import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { buildApp, closeApp, getConnection } from './test-app.helper';

const BASE = '/api/v1';

/**
 * Smoke suite: one route per module.
 * Goal: every registered endpoint path exists and is reachable
 * (correct HTTP status — never a 404 / 500 at boot time).
 * Auth-protected routes are hit without a token → expect 401, NOT 404.
 */
jest.setTimeout(60_000);

describe('Smoke (E2E) — full API surface', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildApp();

    // Register + login an admin for routes that need ADMIN role
    const email = `e2e-smoke-admin-${Date.now()}@afunotec.test`;
    await request(app.getHttpServer())
      .post(`${BASE}/auth/register`)
      .send({ name: 'Smoke Admin', email, password: 'SmokePass@123!' });

    // Elevate to ADMIN directly in the DB (test env only)
    await getConnection()
      .collection('users')
      .updateOne({ email }, { $set: { role: 'ADMIN', emailVerifiedAt: new Date() } });

    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email, password: 'SmokePass@123!' });
    adminToken = loginRes.body.data?.tokens?.accessToken ?? '';
  });

  afterAll(async () => {
    await closeApp();
  });

  const auth = () => ({ Authorization: `Bearer ${adminToken}` });
  const noAuth = () => ({});

  // ── Health ─────────────────────────────────────────────────────────────────
  it('GET /health → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/health`).expect(200));

  // ── Auth ───────────────────────────────────────────────────────────────────
  it('GET /auth/me without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/auth/me`).expect(401));

  // ── Users ──────────────────────────────────────────────────────────────────
  it('GET /users without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/users`).expect(401));

  it('GET /users with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/users`)
      .set(auth())
      .expect(200));

  // ── Providers ──────────────────────────────────────────────────────────────
  it('GET /providers without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/providers`).expect(401));

  // ── Categories (public) ────────────────────────────────────────────────────
  it('GET /categories → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/categories`).expect(200));

  // ── Tags (public) ──────────────────────────────────────────────────────────
  it('GET /tags → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/tags`).expect(200));

  // ── Services (public) ─────────────────────────────────────────────────────
  it('GET /services → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/services`).expect(200));

  // ── Cart (auth) ────────────────────────────────────────────────────────────
  it('GET /cart without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/cart`).expect(401));

  // ── Wishlist (auth) ────────────────────────────────────────────────────────
  it('GET /wishlist without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/wishlist`).expect(401));

  // ── Bookings (auth) ────────────────────────────────────────────────────────
  it('GET /bookings/me without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/bookings/me`).expect(401));

  it('GET /bookings/admin with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/bookings/admin`)
      .set(auth())
      .expect(200));

  // ── Payments ───────────────────────────────────────────────────────────────
  it('GET /payments without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/payments`).expect(401));

  // ── Promotions ─────────────────────────────────────────────────────────────
  it('GET /promo-codes without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/promo-codes`).expect(401));

  it('GET /promo-codes with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/promo-codes`)
      .set(auth())
      .expect(200));

  it('GET /gift-cards with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/gift-cards`)
      .set(auth())
      .expect(200));

  // ── Ads (public) ───────────────────────────────────────────────────────────
  it('GET /ads → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/ads`).expect(200));

  it('GET /homepage-showcases → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/homepage-showcases`).expect(200));

  // ── Reviews (public) ───────────────────────────────────────────────────────
  it('GET /services/e2e-beach-tour/reviews → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/services/e2e-beach-tour/reviews`)
      .expect(200));

  // ── Chat (auth) ────────────────────────────────────────────────────────────
  it('GET /chat/rooms without token → 401', () =>
    request(app.getHttpServer()).get(`${BASE}/chat/rooms`).expect(401));

  // ── Uploads (auth, 501) ────────────────────────────────────────────────────
  it('POST /uploads/presign → 501 (not implemented)', () =>
    request(app.getHttpServer())
      .post(`${BASE}/uploads/presign`)
      .set(auth())
      .send({ contentType: 'image/jpeg', sizeBytes: 1024 })
      .expect(501));

  // ── Currencies (public) ────────────────────────────────────────────────────
  it('GET /currencies → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/currencies`).expect(200));

  // ── i18n (public) ──────────────────────────────────────────────────────────
  it('GET /i18n/strings → 200', () =>
    request(app.getHttpServer()).get(`${BASE}/i18n/strings`).expect(200));

  // ── Newsletter (public subscribe) ──────────────────────────────────────────
  it('POST /newsletter/subscribe → 200', () =>
    request(app.getHttpServer())
      .post(`${BASE}/newsletter/subscribe`)
      .send({ email: `smoke-nl-${Date.now()}@afunotec.test` })
      .expect(200));

  // ── Analytics (public events) ──────────────────────────────────────────────
  it('POST /analytics/events → 202', () =>
    request(app.getHttpServer())
      .post(`${BASE}/analytics/events`)
      .send({ events: [{ name: 'page_view', properties: { path: '/' } }] })
      .expect(202));

  // ── Admin metrics (auth) ───────────────────────────────────────────────────
  it('GET /admin/metrics/overview → 401 without token', () =>
    request(app.getHttpServer())
      .get(`${BASE}/admin/metrics/overview`)
      .expect(401));

  it('GET /admin/metrics/overview with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/admin/metrics/overview`)
      .set(auth())
      .expect(200));

  it('GET /admin/metrics/categories with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/admin/metrics/categories`)
      .set(auth())
      .expect(200));

  it('GET /admin/audit with ADMIN token → 200', () =>
    request(app.getHttpServer())
      .get(`${BASE}/admin/audit`)
      .set(auth())
      .expect(200));

  // ── AI (public/stub) ───────────────────────────────────────────────────────
  it('POST /ai/chat → 501', () =>
    request(app.getHttpServer())
      .post(`${BASE}/ai/chat`)
      .send({ message: 'hello' })
      .expect(501));
});
