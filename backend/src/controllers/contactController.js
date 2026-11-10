const ContactRequest = require('../models/ContactRequest');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactEmails } = require('../services/mailer');

const create = asyncHandler(async (req, res) => {
  const request = await ContactRequest.create(req.body);

  // El envio de correo no bloquea la respuesta: si el SMTP falla,
  // la solicitud ya quedo registrada y el equipo puede verla en el panel.
  const result = await sendContactEmails(request);
  request.emailStatus = result.status;
  await request.save();

  res.status(201).json({
    ok: true,
    message: 'Solicitud registrada. Te responderemos a la brevedad.',
  });
});

// Solo administradores.
const list = asyncHandler(async (req, res) => {
  const requests = await ContactRequest.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json({ ok: true, requests });
});

const updateStatus = asyncHandler(async (req, res) => {
  const request = await ContactRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!request) throw new ApiError(404, 'Solicitud no encontrada', 'NOT_FOUND');

  res.json({ ok: true, request });
});

module.exports = { create, list, updateStatus };
