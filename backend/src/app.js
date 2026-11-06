const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { env } = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimits');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

// Detras del proxy de Render: necesario para IP real y cookies seguras.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Cabeceras de seguridad (mitiga XSS, clickjacking, sniffing y downgrade a HTTP).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        ...(env.isProd ? { upgradeInsecureRequests: [] } : {}),
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: env.isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'no-referrer' },
  })
);

// CORS restringido a los origenes declarados (nunca "*" con credenciales).
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // health checks y clientes sin navegador
      if (env.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new ApiError(403, 'Origen no permitido', 'CORS_BLOCKED'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Permissions-Policy no viene en Helmet por defecto y OWASP ZAP lo reporta.
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

if (!env.isTest) {
  app.use(morgan(env.isProd ? 'combined' : 'dev'));
}

// Limite global de peticiones + rutas de la API.
app.use('/api', apiLimiter, routes);

// En produccion el backend sirve el build de React (mismo origen: cookies simples).
if (fs.existsSync(env.frontendDist)) {
  app.use(express.static(env.frontendDist, { maxAge: '1h', index: false }));
  app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(env.frontendDist, 'index.html'));
  });
}

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Recurso no encontrado', 'NOT_FOUND'));
});

app.use(errorHandler);

module.exports = app;
