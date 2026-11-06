const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: { type: String, trim: true, maxlength: 60, default: 'General' },
    keywords: {
      type: [String],
      default: [],
      validate: {
        validator: (list) => list.length <= 20,
        message: 'Maximo 20 palabras clave por pregunta',
      },
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
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

faqSchema.index({ active: 1, category: 1, order: 1 });

module.exports = mongoose.model('Faq', faqSchema);
