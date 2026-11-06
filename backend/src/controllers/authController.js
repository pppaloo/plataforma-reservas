const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { hashPassword, verifyPassword } = require('../utils/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/token');
const { env } = require('../config/env');

const REFRESH_MAX_AGE = env.jwt.refreshDays * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  path: env.cookie.path,
};

function clearRefreshCookie(res) {
  res.clearCookie(env.cookie.name, cookieOptions);
}

/**
 * Emite un nuevo refresh token, guarda solo su hash en la base
 * y lo envia en una cookie httpOnly (no accesible desde JavaScript).
 */
async function issueSession(user, res) {
  const refreshToken = signRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpires = new Date(Date.now() + REFRESH_MAX_AGE);
  await user.save();

  res.cookie(env.cookie.name, refreshToken, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
  return refreshToken;
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Ya existe una cuenta con ese correo', 'EMAIL_IN_USE');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  await issueSession(user, res);

  res.status(201).json({
    ok: true,
    user: user.toJSON(),
    accessToken: signAccessToken(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  const validPassword = await verifyPassword(password, user?.passwordHash);

  // Mismo mensaje para usuario inexistente y contrasena incorrecta:
  // evita enumerar cuentas por diferencias en la respuesta.
  if (!user || !validPassword) {
    throw new ApiError(401, 'Credenciales invalidas', 'INVALID_CREDENTIALS');
  }
  if (!user.active) {
    throw new ApiError(403, 'La cuenta se encuentra desactivada', 'ACCOUNT_DISABLED');
  }

  user.lastLoginAt = new Date();
  await issueSession(user, res);

  res.json({
    ok: true,
    user: user.toJSON(),
    accessToken: signAccessToken(user),
  });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[env.cookie.name];
  if (!token) {
    throw new ApiError(401, 'Sesion no iniciada', 'REFRESH_MISSING');
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (_error) {
    clearRefreshCookie(res);
    throw new ApiError(401, 'Sesion expirada o invalida', 'REFRESH_INVALID');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash +refreshTokenExpires');

  const storedHash = user?.refreshTokenHash;
  const notExpired = user?.refreshTokenExpires && user.refreshTokenExpires > new Date();

  // Comparacion del hash: si no coincide, el token fue revocado o reutilizado.
  if (!user || !user.active || !storedHash || !notExpired || hashToken(token) !== storedHash) {
    clearRefreshCookie(res);
    throw new ApiError(401, 'Sesion invalida', 'REFRESH_REVOKED');
  }

  // Rotacion: cada refresh invalida el token anterior.
  await issueSession(user, res);

  res.json({
    ok: true,
    user: user.toJSON(),
    accessToken: signAccessToken(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[env.cookie.name];

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.updateOne(
        { _id: payload.sub },
        { $unset: { refreshTokenHash: 1, refreshTokenExpires: 1 } }
      );
    } catch (_error) {
      // Token ya invalido: solo se limpia la cookie.
    }
  }

  clearRefreshCookie(res);
  res.json({ ok: true, message: 'Sesion cerrada' });
});

const me = asyncHandler(async (req, res) => {
  res.json({ ok: true, user: req.user.toJSON() });
});

module.exports = { register, login, refresh, logout, me };
