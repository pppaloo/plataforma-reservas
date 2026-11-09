const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['bot', 'user'], required: true },
    text: { type: String, required: true, maxlength: 1200 },
    // Origen de la respuesta del bot: IA generativa, reglas o respaldo.
    source: { type: String, enum: ['llm', 'rules', 'fallback'] },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    // Identificador anonimo generado por el navegador (no contiene datos personales).
    // unique ya crea el indice; no se declara index para evitar indices duplicados.
    sessionId: { type: String, required: true, unique: true },
    messages: { type: [messageSchema], default: [] },
    lastActivityAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
