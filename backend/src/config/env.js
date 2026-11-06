const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isTest = NODE_ENV === 'test';
const isProd = NODE_ENV === 'production';

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(
      `Falta la variable de entorno obligatoria "${name}". Revisa backend/.env (ver .env.example).`
    );
  }
  return value;
}

const env = {
  nodeEnv: NODE_ENV,
  isTest,
  isProd,
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || (isTest ? 'mongodb://127.0.0.1:27017/reservas_test' : required('MONGODB_URI')),
  clientOrigins: (
    process.env.CLIENT_ORIGIN ||
    ['http://localhost:5173', process.env.RENDER_EXTERNAL_URL].filter(Boolean).join(',')
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ||
      (isTest ? 'test_access_secret_with_at_least_32_characters_ok' : required('JWT_ACCESS_SECRET')),
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      (isTest ? 'test_refresh_secret_with_at_least_32_characters_ok' : required('JWT_REFRESH_SECRET')),
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshDays: Number(process.env.JWT_REFRESH_DAYS || 7),
  },
  cookie: {
    name: 'refreshToken',
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
    secure: isProd,
    path: '/api/auth',
  },
  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'ReservaPro <no-reply@reservapro.local>',
    institutionalTo: process.env.MAIL_INSTITUTIONAL_TO || 'contacto@reservapro.local',
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@reservapro.cl',
    password: process.env.ADMIN_PASSWORD || 'CambiarEstaClave123!',
  },
  frontendDist: path.resolve(__dirname, '../../../frontend/dist'),
};

function validateEnvironment() {
  if (!isProd) return;

  const missing = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'].filter(
    (name) => !process.env[name]
  );
  if (missing.length) {
    throw new Error(`Variables de entorno faltantes en produccion: ${missing.join(', ')}`);
  }
  if (process.env.JWT_ACCESS_SECRET.length < 32) {
    throw new Error('JWT_ACCESS_SECRET debe tener al menos 32 caracteres.');
  }
  if (process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET debe tener al menos 32 caracteres.');
  }
  if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser distintos.');
  }
}

module.exports = { env, validateEnvironment };
