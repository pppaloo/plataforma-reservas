// Motor de reglas del chatbot: coincidencia por palabras clave sobre las FAQ de MongoDB.
// No usa IA, por lo que no hay costos ni riesgo de filtrar informacion privada.

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOPWORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'o', 'que', 'en', 'por',
  'para', 'con', 'sin', 'al', 'del', 'es', 'son', 'mi', 'tu', 'se', 'como',
  'donde', 'cuando', 'cuanto', 'puedo', 'quiero', 'necesito', 'hola', 'porfavor',
]);

// Reduce plurales simples para que "precios" coincida con "precio".
const stem = (token) => {
  if (token.length > 5 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1);
  return token;
};

function tokenize(value) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !STOPWORDS.has(token))
    .map(stem);
}

function scoreFaq(messageTokens, faq) {
  const questionTokens = new Set(tokenize(faq.question));
  const keywordTokens = new Set((faq.keywords || []).flatMap((keyword) => tokenize(keyword)));

  let score = 0;
  for (const token of messageTokens) {
    if (keywordTokens.has(token)) score += 3;
    if (questionTokens.has(token)) score += 1;
  }
  return score;
}

function findBestAnswer(message, faqs) {
  const messageTokens = tokenize(message);
  if (!messageTokens.length) return null;

  let best = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const score = scoreFaq(messageTokens, faq);
    if (score > bestScore) {
      best = faq;
      bestScore = score;
    }
  }

  // Umbral minimo para evitar respuestas poco relacionadas.
  return bestScore >= 2 ? best : null;
}

const FALLBACK_ANSWER =
  'No tengo una respuesta registrada para esa consulta. Puedes escribirnos desde la seccion de contacto y un ejecutivo te respondera.';

function buildSuggestions(faqs) {
  const categories = [...new Set(faqs.map((faq) => faq.category).filter(Boolean))];
  return categories.slice(0, 4);
}

module.exports = { findBestAnswer, buildSuggestions, normalize, FALLBACK_ANSWER };
