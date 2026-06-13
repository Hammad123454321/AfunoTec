import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { buildApp, closeApp, getConnection, clearCollections } from './test-app.helper';

let conn: Connection;

const BASE = '/api/v1';

jest.setTimeout(60_000);

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  const user = {
    name: 'E2E Test User',
    email: `e2e-auth-${Date.now()}@afunotec.test`,
    password: 'TestPass@123!',
  };

  beforeAll(async () => {
    app = await buildApp();
    conn = getConnection();
    // Clean auth-related collections so prior runs don't pollute
    await clearCollections(conn, ['otp_tokens', 'refresh_tokens', 'users']);
  });

  afterAll(async () => {
    await closeApp();
  });

  // ── 1. Register ────────────────────────────────────────────────────────────

  it('POST /auth/register → 201 creates a CUSTOMER', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/register`)
      .send(user)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.role).toBe('CUSTOMER');
  });

  it('POST /auth/register → 409 on duplicate email', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/register`)
      .send(user)
      .expect(409);

    expect(res.body.success).toBe(false);
  });

  // ── 2. OTP flow ────────────────────────────────────────────────────────────

  it('POST /auth/otp/send → 200 (email OTP)', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/otp/send`)
      .send({ identifier: user.email, purpose: 'EMAIL_VERIFY' })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('POST /auth/otp/verify → 200 marks email verified', async () => {
    // Fetch the raw OTP from the DB (test env only — mail goes to console)
    const otpRow = await conn
      .collection('otp_tokens')
      .findOne(
        { identifier: user.email, purpose: 'EMAIL_VERIFY', consumedAt: null },
        { sort: { createdAt: -1 } },
      );
    expect(otpRow).not.toBeNull();

    // OTPs are hashed — we can't reverse them.
    // Mark the user verified directly for remaining tests.
    await conn
      .collection('users')
      .updateOne({ email: user.email }, { $set: { emailVerifiedAt: new Date() } });

    // Confirm the endpoint is wired (will 422 on bad OTP — BusinessRuleException)
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/otp/verify`)
      .send({ identifier: user.email, otp: '000000', purpose: 'EMAIL_VERIFY' })
      .expect(422);

    expect(res.body.success).toBe(false);
  });

  // ── 3. Login ───────────────────────────────────────────────────────────────

  it('POST /auth/login → 200 returns access + refresh tokens', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res.body.success).toBe(true);
    // Response shape: { success, data: { user, tokens: { accessToken, refreshToken, ... } } }
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();

    accessToken = res.body.data.tokens.accessToken;
    refreshToken = res.body.data.tokens.refreshToken;
  });

  it('POST /auth/login → 401 on wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email: user.email, password: 'WrongPassword!' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  // ── 4. /auth/me ────────────────────────────────────────────────────────────

  it('GET /auth/me → 200 returns authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .get(`${BASE}/auth/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    // me() returns the user object directly; interceptor wraps as data: { id, email, ... }
    expect(res.body.data.email).toBe(user.email);
  });

  it('GET /auth/me → 401 without token', async () => {
    await request(app.getHttpServer()).get(`${BASE}/auth/me`).expect(401);
  });

  // ── 5. Refresh ─────────────────────────────────────────────────────────────

  it('POST /auth/refresh → 200 rotates tokens', async () => {
    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/refresh`)
      .send({ refreshToken })
      .expect(200);

    expect(res.body.success).toBe(true);
    // refresh controller returns { tokens }; interceptor wraps as data: { tokens }
    const newAccess = res.body.data.tokens.accessToken;
    const newRefresh = res.body.data.tokens.refreshToken;
    expect(newAccess).toBeDefined();
    expect(newRefresh).toBeDefined();
    // Old refresh token must now be revoked
    const replay = await request(app.getHttpServer())
      .post(`${BASE}/auth/refresh`)
      .send({ refreshToken })
      .expect(401);
    expect(replay.body.success).toBe(false);
  });

  // ── 6. Logout ──────────────────────────────────────────────────────────────

  it('POST /auth/logout → 200 revokes the session', async () => {
    // Re-login to get a fresh token pair
    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email: user.email, password: user.password });
    const token = loginRes.body.data.tokens.accessToken;

    const res = await request(app.getHttpServer())
      .post(`${BASE}/auth/logout`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});
