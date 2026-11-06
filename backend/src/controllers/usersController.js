const mongoose = require('mongoose');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.search) {
    // Se escapan los metacaracteres para evitar inyeccion de expresiones regulares (ReDoS).
    const term = String(req.query.search)
      .slice(0, 60)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // mongoose.trusted evita que sanitizeFilter envuelva el operador $or/$regex.
    filter = mongoose.trusted({
      $or: [
        { name: mongoose.trusted({ $regex: term, $options: 'i' }) },
        { email: mongoose.trusted({ $regex: term, $options: 'i' }) },
      ],
    });
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ ok: true, users });
});

const update = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    if (req.body.role && req.body.role !== req.user.role) {
      throw new ApiError(400, 'No puedes cambiar tu propio rol', 'SELF_UPDATE_BLOCKED');
    }
    if (req.body.active === false) {
      throw new ApiError(400, 'No puedes desactivar tu propia cuenta', 'SELF_UPDATE_BLOCKED');
    }
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'Usuario no encontrado', 'NOT_FOUND');

  res.json({ ok: true, user: user.toJSON() });
});

module.exports = { list, update };
