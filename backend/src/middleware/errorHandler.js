const { env } = require('../config/env');

// Manejador central de errores: nunca expone trazas ni detalles internos en produccion.
module.exports = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  let status = err.status || 500;
  let code = err.code || 'SERVER_ERROR';
  let message = err.message || 'Error interno del servidor';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Datos invalidos';
    details = Object.values(err.errors).map((item) => item.message);
  } else if (err.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = 'Identificador invalido';
  } else if (err.code === 11000) {
    status = 409;
    code = 'DUPLICATE_KEY';
    message = 'El recurso ya existe';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'El contenido enviado es demasiado grande';
  } else if (err instanceof SyntaxError && 'body' in err) {
    status = 400;
    code = 'INVALID_JSON';
    message = 'El cuerpo de la solicitud no es JSON valido';
  }

  if (status >= 500) {
    console.error('[error]', err);
    if (env.isProd) message = 'Error interno del servidor';
  }

  const body = { ok: false, message, code };
  if (details) body.details = details;
  if (!env.isProd && status >= 500) body.stack = err.stack;

  res.status(status).json(body);
};
