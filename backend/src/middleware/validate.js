const ApiError = require('../utils/ApiError');

// Valida req.body con un esquema Zod y reemplaza el body por los datos normalizados.
const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.') || source,
      message: issue.message,
    }));
    return next(new ApiError(400, 'Datos invalidos', 'VALIDATION_ERROR', details));
  }

  req[source] = result.data;
  next();
};

module.exports = { validate };
