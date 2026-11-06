const { hashPassword, verifyPassword } = require('../src/utils/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} = require('../src/utils/token');
const { findBestAnswer, FALLBACK_ANSWER } = require('../src/services/chatbot');

describe('Proteccion de contrasenas', () => {
  test('el hash no contiene la contrasena en texto plano', async () => {
    const hash = await hashPassword('ClaveSegura123');
    expect(hash).not.toBe('ClaveSegura123');
    expect(hash.startsWith('$2')).toBe(true);
  });

  test('verifyPassword acepta la clave correcta y rechaza la incorrecta', async () => {
    const hash = await hashPassword('ClaveSegura123');
    await expect(verifyPassword('ClaveSegura123', hash)).resolves.toBe(true);
    await expect(verifyPassword('OtraClave123', hash)).resolves.toBe(false);
  });

  test('verifyPassword devuelve false si no hay hash', async () => {
    await expect(verifyPassword('ClaveSegura123', undefined)).resolves.toBe(false);
  });
});

describe('Tokens JWT', () => {
  const user = { _id: '507f1f77bcf86cd799439011', role: 'admin' };

  test('el access token contiene sub y role, no datos sensibles', () => {
    const token = signAccessToken(user);
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe(user._id);
    expect(payload.role).toBe('admin');
    expect(payload.passwordHash).toBeUndefined();
    expect(payload.refreshTokenHash).toBeUndefined();
  });

  test('un access token no sirve como refresh token', () => {
    const token = signAccessToken(user);
    expect(() => verifyRefreshToken(token)).toThrow();
  });

  test('el refresh token se identifica como type=refresh', () => {
    const token = signRefreshToken(user);
    expect(verifyRefreshToken(token).type).toBe('refresh');
  });

  test('hashToken es deterministico y no reversible en claro', () => {
    const token = signRefreshToken(user);
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).not.toBe(token);
  });
});

describe('Motor de reglas del chatbot', () => {
  const faqs = [
    {
      _id: '1',
      question: 'Cuales son los horarios de atencion?',
      answer: 'Lunes a viernes de 08:00 a 20:00.',
      keywords: ['horario', 'abierto'],
      category: 'Horarios',
    },
    {
      _id: '2',
      question: 'Cuanto cuestan los servicios?',
      answer: 'Desde $18.000.',
      keywords: ['precio', 'valor'],
      category: 'Precios',
    },
  ];

  test('encuentra la FAQ por palabra clave', () => {
    const match = findBestAnswer('cual es el horario de atencion', faqs);
    expect(match).not.toBeNull();
    expect(match.answer).toContain('08:00');
  });

  test('devuelve null cuando no hay coincidencia suficiente', () => {
    expect(findBestAnswer('quiero hablar de astronomia', faqs)).toBeNull();
    expect(FALLBACK_ANSWER).toContain('contacto');
  });
});
