const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const ACTIVE_STATUSES = ['pending', 'confirmed'];

const create = asyncHandler(async (req, res) => {
  const { serviceId, startAt, partySize, contactPhone, notes } = req.body;

  const service = await Service.findById(serviceId);
  if (!service || !service.active) {
    throw new ApiError(404, 'El servicio no esta disponible', 'SERVICE_UNAVAILABLE');
  }

  const now = Date.now();
  if (startAt.getTime() < now + 15 * 60 * 1000) {
    throw new ApiError(400, 'La reserva debe ser al menos 15 minutos en el futuro', 'INVALID_DATE');
  }
  if (startAt.getTime() > now + 180 * 24 * 60 * 60 * 1000) {
    throw new ApiError(400, 'No se pueden reservar con mas de 180 dias de anticipacion', 'INVALID_DATE');
  }
  if (partySize > service.capacity) {
    throw new ApiError(400, `El maximo para este servicio es ${service.capacity} personas`, 'CAPACITY_EXCEEDED');
  }

  // Cupos ocupados para ese servicio en esa misma franja horaria.
  // sanitizeFilter esta activo: los bloques con operadores legitimos se marcan
  // con mongoose.trusted() para que no sean tratados como entrada del usuario.
  const occupied = await Reservation.countDocuments({
    service: service._id,
    startAt,
    status: mongoose.trusted({ $in: ACTIVE_STATUSES }),
  });
  if (occupied >= service.capacity) {
    throw new ApiError(409, 'No quedan cupos disponibles para ese horario', 'NO_SLOTS');
  }

  const reservation = await Reservation.create({
    user: req.user._id,
    service: service._id,
    startAt,
    partySize,
    contactPhone,
    notes,
  });

  await reservation.populate('service', 'name description durationMin price');

  res.status(201).json({ ok: true, reservation });
});

const mine = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .sort({ startAt: -1 })
    .populate('service', 'name durationMin price')
    .lean();

  res.json({ ok: true, reservations });
});

const cancel = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) throw new ApiError(404, 'Reserva no encontrada', 'NOT_FOUND');

  const isOwner = String(reservation.user) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'No puedes modificar una reserva ajena', 'FORBIDDEN');
  }
  if (['cancelled', 'completed'].includes(reservation.status)) {
    throw new ApiError(409, 'La reserva ya no se puede cancelar', 'INVALID_STATE');
  }

  reservation.status = 'cancelled';
  await reservation.save();

  res.json({ ok: true, reservation });
});

// Solo administradores.
const listAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.serviceId) filter.service = req.query.serviceId;

  const reservations = await Reservation.find(filter)
    .sort({ startAt: -1 })
    .limit(200)
    .populate('user', 'name email')
    .populate('service', 'name price')
    .lean();

  res.json({ ok: true, reservations });
});

const updateStatus = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  )
    .populate('user', 'name email')
    .populate('service', 'name price');

  if (!reservation) throw new ApiError(404, 'Reserva no encontrada', 'NOT_FOUND');
  res.json({ ok: true, reservation });
});

module.exports = { create, mine, cancel, listAll, updateStatus };
