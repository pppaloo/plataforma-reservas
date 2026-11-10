const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Publico: solo servicios activos. Admin con ?all=1 ve tambien los inactivos.
const list = asyncHandler(async (req, res) => {
  const showAll = req.query.all === '1' && req.user?.role === 'admin';
  const filter = showAll ? {} : { active: true };

  const services = await Service.find(filter).sort({ order: 1, name: 1 }).lean();
  res.json({ ok: true, services });
});

const create = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ ok: true, service });
});

const update = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new ApiError(404, 'Servicio no encontrado', 'NOT_FOUND');
  res.json({ ok: true, service });
});

// Baja logica: conserva el historial de reservas asociadas.
const remove = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );
  if (!service) throw new ApiError(404, 'Servicio no encontrado', 'NOT_FOUND');
  res.json({ ok: true, message: 'Servicio desactivado', service });
});

module.exports = { list, create, update, remove };
