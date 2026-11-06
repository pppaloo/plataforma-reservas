const crypto = require('crypto');
const Faq = require('../models/Faq');
const Conversation = require('../models/Conversation');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const {
  findBestAnswer,
  buildSuggestions,
  FALLBACK_ANSWER,
} = require('../services/chatbot');

const WELCOME =
  'Hola, soy el asistente de ReservaPro. Puedo ayudarte con horarios, precios, reservas y formas de contacto. ¿Que necesitas saber?';

const message = asyncHandler(async (req, res) => {
  const sessionId = req.body.sessionId || crypto.randomUUID();
  const userMessage = req.body.message;

  const faqs = await Faq.find({ active: true }).lean();
  const match = findBestAnswer(userMessage, faqs);
  const reply = match ? match.answer : FALLBACK_ANSWER;

  await Conversation.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        messages: {
          $each: [
            { role: 'user', text: userMessage, at: new Date() },
            { role: 'bot', text: reply, at: new Date() },
          ],
          // Se conservan solo los ultimos 40 mensajes por sesion.
          $slice: -40,
        },
      },
      $set: { lastActivityAt: new Date() },
      $setOnInsert: { sessionId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({
    ok: true,
    sessionId,
    reply,
    matched: Boolean(match),
    suggestions: buildSuggestions(faqs),
  });
});

const welcome = asyncHandler(async (_req, res) => {
  const faqs = await Faq.find({ active: true }).lean();
  res.json({ ok: true, reply: WELCOME, suggestions: buildSuggestions(faqs) });
});

const listFaqs = asyncHandler(async (_req, res) => {
  const faqs = await Faq.find().sort({ order: 1, category: 1 }).lean();
  res.json({ ok: true, faqs });
});

const createFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.create(req.body);
  res.status(201).json({ ok: true, faq });
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) throw new ApiError(404, 'Pregunta no encontrada', 'NOT_FOUND');
  res.json({ ok: true, faq });
});

const removeFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) throw new ApiError(404, 'Pregunta no encontrada', 'NOT_FOUND');
  res.json({ ok: true, message: 'Pregunta eliminada' });
});

module.exports = { message, welcome, listFaqs, createFaq, updateFaq, removeFaq };
