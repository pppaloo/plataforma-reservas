const rateLimit = require('express-rate-limit');

const base = {
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Demasiadas solicitudes. Intenta nuevamente mas tarde.',
    code: 'RATE_LIMITED',
  },
};

// Limite general de la API.
const apiLimiter = rateLimit({ ...base, windowMs: 60 * 1000, max: 200 });

// Registro y refresh: frena fuerza bruta y abuso de cuentas.
const authLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, max: 30 });

// Login: mas estricto para dificultar ataques de credenciales.
const loginLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, max: 10 });

// Formulario de contacto: antispam.
const contactLimiter = rateLimit({ ...base, windowMs: 10 * 60 * 1000, max: 5 });

// Chatbot: evita inundacion de mensajes.
const chatLimiter = rateLimit({ ...base, windowMs: 60 * 1000, max: 30 });

module.exports = { apiLimiter, authLimiter, loginLimiter, contactLimiter, chatLimiter };
