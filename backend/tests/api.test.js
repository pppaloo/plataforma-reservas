const request = require('supertest');
const app = require('../src/app');

describe('API base (sin base de datos)', () => {
  test('GET /api/health responde 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('up');
  });

  test('aplica cabeceras de seguridad', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  test('GET /api/auth/me sin token responde 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('TOKEN_MISSING');
  });

  test('GET /api/auth/me con token invalido responde 401 TOKEN_INVALID', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.falso.invalido');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('TOKEN_INVALID');
  });

  test('GET /api/users sin token responde 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/register con datos invalidos responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'no-es-correo', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('POST /api/contact sin campos responde 400', async () => {
    const res = await request(app).post('/api/contact').send({});
    expect(res.status).toBe(400);
  });

  test('rutas inexistentes responden 404 controlado', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });

  test('bloquea origenes CORS no autorizados', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://sitio-malicioso.example');

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('CORS_BLOCKED');
  });
});
