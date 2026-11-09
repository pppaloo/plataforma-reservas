const crypto = require('crypto');
const Faq = require('../models/Faq');
const Service = require('../models/Service');
const Conversation = require('../models/Conversation');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const {
  findBestAnswer,
  buildSuggestions,
  FALLBACK_ANSWER,
} = require('../services/chatbot');
const { generateReply, isConfigured } = require('../services/llm');

const WELCOME =
  'Hola, soy el asistente virtual de ReservaPro. Puedo conversar sobre bienestar y responder tus dudas de servicios, horarios, precios y reservas. ¿Que necesitas saber?';

// Contexto oficial para el modelo: evita que invente datos del negocio.
function buildContext(faqs, services) {
  const faqBlock = faqs
    .slice(0, 12)
    .map((faq) => `- ${faq.question} ${faq.answer}`)
    .join('\n')
    .slice(0, 2800);

  const serviceBlock = services
    .slice(0, 12)
    .map(
      (service) =>
        `- ${service.name}: ${service.description} Duracion ${service.durationMin} minutos. Valor $${service.price} CLP. Cupos por horario: ${service.capacity}.`
    )
    .join('\n')
    .slice(0, 2200);

  return `Preguntas frecuentes:\n${faqBlock || 'Sin datos.'}\n\nServicios:\n${
    serviceBlock || 'Sin datos.'
  }`;
}

const message = asyncHandler(async (req, res) => {
  const sessionId = req.body.sessionId || crypto.randomUUID();
  const userMessage = req.body.message;

  const [faqs, services, conversation] = await Promise.all([
    Faq.find({ active: true }).sort({ order: 1 }).lean(),
    Service.find({ active: true }).sort({ order: 1 }).lean(),
    Conversation.findOne({ sessionId }).lean(),
  ]);

  const match = findBestAnswer(userMessage, faqs);
  const history = (conversation?.messages || []).slice(-8);

  // Camino principal: respuesta generativa con contexto de la base de datos.
  const generated = await generateReply({
    message: userMessage,
    history,
    context: buildContext(faqs, services),
  });

  const reply = generated || (match ? match.answer : FALLBACK_ANSWER);
  const source = generated ? 'llm' : match ? 'rules' : 'fallback';

  await Conversation.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        messages: {
          $each: [
            { role: 'user', text: userMessage, at: new Date() },
            { role: 'bot', text: reply, source, at: new Date() },
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
    source,
    suggestions: buildSuggestions(faqs),
  });
});

const welcome = asyncHandler(async (_req, res) => {
  const faqs = await Faq.find({ active: true }).lean();
  res.json({
    ok: true,
    reply: WELCOME,
    mode: isConfigured() ? 'llm' : 'rules',
    suggestions: buildSuggestions(faqs),
  });
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
