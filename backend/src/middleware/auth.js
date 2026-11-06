const { verifyAccessToken } = require('../utils/token');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Verifica el JWT, vuelve a cargar el usuario desde la base y adjunta req.user.
const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Token de acceso ausente', 'TOKEN_MISSING');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    const expired = error.name === 'TokenExpiredError';
    throw new ApiError(
      401,
      expired ? 'El token de acceso expiro' : 'Token de acceso invalido',
      expired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
    );
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.active) {
    throw new ApiError(401, 'Usuario no autorizado', 'USER_INACTIVE');
  }

  req.user = user;
  next();
});

// Variante que no falla si no hay token: util para endpoints publicos enriquecidos.
const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.active) req.user = user;
  } catch (_error) {
    // Token invalido en ruta publica: se continua como visitante anonimo.
  }
  next();
});

module.exports = { authenticate, optionalAuth };
