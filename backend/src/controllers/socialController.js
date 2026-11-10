const SocialLink = require('../models/SocialLink');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const showAll = req.query.all === '1' && req.user?.role === 'admin';
  const filter = showAll ? {} : { active: true };

  const links = await SocialLink.find(filter).sort({ order: 1, network: 1 }).lean();
  res.json({ ok: true, links });
});

const create = asyncHandler(async (req, res) => {
  const link = await SocialLink.create(req.body);
  res.status(201).json({ ok: true, link });
});

const update = asyncHandler(async (req, res) => {
  const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!link) throw new ApiError(404, 'Enlace no encontrado', 'NOT_FOUND');
  res.json({ ok: true, link });
});

const remove = asyncHandler(async (req, res) => {
  const link = await SocialLink.findByIdAndDelete(req.params.id);
  if (!link) throw new ApiError(404, 'Enlace no encontrado', 'NOT_FOUND');
  res.json({ ok: true, message: 'Enlace eliminado' });
});

module.exports = { list, create, update, remove };
