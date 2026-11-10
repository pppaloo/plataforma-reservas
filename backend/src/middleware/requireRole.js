const ApiError = require('../utils/ApiError');

// Control de acceso basado en roles (RBAC).
const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'No autenticado', 'TOKEN_MISSING'));
  }
  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(403, 'No tienes permisos para realizar esta accion', 'FORBIDDEN')
    );
  }
  next();
};

module.exports = { requireRole };
