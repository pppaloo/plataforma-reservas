const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connectDatabase, disconnectDatabase } = require('../src/config/db');
const { hashPassword } = require('../src/utils/password');
const User = require('../src/models/User');
const Service = require('../src/models/Service');
const ContactRequest = require('../src/models/ContactRequest');

// Se ejecuta solo si existe una base de pruebas disponible (CI o MongoDB local).
const TEST_URI = process.env.TEST_MONGODB_URI;
const describeIfDb = TEST_URI ? describe : describe.skip;

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

describeIfDb('Flujo integrado con base de datos', () => {
  let clientToken;
  let clientCookies;
  let adminToken;
  let serviceId;
  let reservationId;

  beforeAll(async () => {
    await connectDatabase(TEST_URI);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  test('registra un cliente sin exponer el hash de la contrasena', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Cliente Demo',
      email: 'cliente@test.cl',
      password: 'ClaveSegura123',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('cliente@test.cl');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.accessToken).toBeDefined();

    clientToken = res.body.accessToken;
    clientCookies = res.headers['set-cookie'];
    expect(clientCookies?.[0]).toContain('HttpOnly');
  });

  test('rechaza correo duplicado con 409', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Otro Cliente',
      email: 'cliente@test.cl',
      password: 'ClaveSegura123',
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_IN_USE');
  });

  test('rechaza credenciales invalidas sin enumerar usuarios', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@test.cl', password: 'ClaveIncorrecta123' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  test('rechaza inyeccion de operadores NoSQL en el login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: 'x' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('la ruta protegida devuelve el perfil con token valido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('client');
  });

  test('un cliente no puede acceder al modulo de usuarios (403)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('crea un administrador y permite crear un servicio', async () => {
    await User.create({
      name: 'Admin Demo',
      email: 'admin@test.cl',
      passwordHash: await hashPassword('AdminSegura123'),
      role: 'admin',
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.cl', password: 'AdminSegura123' });

    expect(login.status).toBe(200);
    adminToken = login.body.accessToken;

    const created = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Sesion de prueba',
        description: 'Servicio creado por la prueba automatizada',
        durationMin: 60,
        price: 25000,
        capacity: 1,
      });

    expect(created.status).toBe(201);
    serviceId = created.body.service._id;
  });

  test('un cliente puede reservar y la segunda reserva agota el cupo', async () => {
    const first = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ serviceId, startAt: FUTURE, partySize: 1 });

    expect(first.status).toBe(201);
    reservationId = first.body.reservation._id;

    const second = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ serviceId, startAt: FUTURE, partySize: 1 });

    expect(second.status).toBe(409);
    expect(second.body.code).toBe('NO_SLOTS');
  });

  test('el cliente ve solo sus reservas', async () => {
    const res = await request(app)
      .get('/api/reservations/mine')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.reservations).toHaveLength(1);
  });

  test('el administrador cambia el estado de la reserva', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.reservation.status).toBe('confirmed');
  });

  test('el formulario de contacto persiste la solicitud', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Visitante',
      email: 'visitante@test.cl',
      subject: 'Consulta de horarios',
      message: 'Quisiera saber si atienden los sabados por la tarde.',
    });

    expect(res.status).toBe(201);

    const stored = await ContactRequest.findOne({ email: 'visitante@test.cl' });
    expect(stored).not.toBeNull();
    expect(stored.emailStatus).toBe('skipped'); // SMTP no configurado en pruebas
  });

  test('el chatbot responde con la FAQ administrada', async () => {
    await request(app)
      .post('/api/chatbot/faqs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        question: 'Cual es el horario de atencion?',
        answer: 'Atendemos de lunes a viernes de 08:00 a 20:00.',
        category: 'Horarios',
        keywords: 'horario, atencion',
      });

    const res = await request(app)
      .post('/api/chatbot/message')
      .send({ message: 'Cual es el horario?', sessionId: 'sesion-de-prueba-01' });

    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(true);
    expect(res.body.reply).toContain('08:00');
  });

  test('el refresh rota el token y el anterior queda revocado', async () => {
    const rotated = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', clientCookies);

    expect(rotated.status).toBe(200);
    expect(rotated.body.accessToken).toBeDefined();

    const reused = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', clientCookies);

    expect(reused.status).toBe(401);
    expect(reused.body.code).toBe('REFRESH_REVOKED');
  });

  test('el logout revoca la sesion', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@test.cl', password: 'ClaveSegura123' });

    const cookies = login.headers['set-cookie'];

    const logout = await request(app).post('/api/auth/logout').set('Cookie', cookies);
    expect(logout.status).toBe(200);

    const refresh = await request(app).post('/api/auth/refresh').set('Cookie', cookies);
    expect(refresh.status).toBe(401);
  });

  test('desactivar un usuario invalida su acceso', async () => {
    const client = await User.findOne({ email: 'cliente@test.cl' });
    await request(app)
      .patch(`/api/users/${client._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ active: false });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('USER_INACTIVE');
  });
});
