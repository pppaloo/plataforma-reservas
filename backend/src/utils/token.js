const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const ISSUER = 'reservas-api';
const AUDIENCE = 'reservas-web';

// El payload solo lleva el id y el rol. Nunca datos sensibles:
// el contenido de un JWT es Base64, no cifrado.
function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.jwt.accessSecret, {
    subject: String(user._id || user.id),
    expiresIn: env.jwt.accessTtl,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ type: 'refresh' }, env.jwt.refreshSecret, {
    subject: String(user._id || user.id),
    expiresIn: `${env.jwt.refreshDays}d`,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, { issuer: ISSUER, audience: AUDIENCE });
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.jwt.refreshSecret, { issuer: ISSUER, audience: AUDIENCE });
  if (payload.type !== 'refresh') throw new Error('Tipo de token invalido');
  return payload;
}

// Solo guardamos el hash del refresh token: si filtran la base, no pueden reutilizarlo.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
