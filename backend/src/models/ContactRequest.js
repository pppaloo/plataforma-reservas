const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'answered', 'closed'],
      default: 'new',
      index: true,
    },
    // Resultado del envio de correo, util para auditoria interna (no se expone al publico).
    emailStatus: {
      type: String,
      enum: ['sent', 'skipped', 'failed'],
      default: 'skipped',
    },
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

contactRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
