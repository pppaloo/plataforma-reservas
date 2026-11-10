const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio'],
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      trim: true,
      maxlength: 500,
    },
    durationMin: {
      type: Number,
      required: true,
      min: 15,
      max: 480,
      default: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 1,
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

serviceSchema.index({ active: 1, order: 1 });
serviceSchema.index({ name: 1 });

module.exports = mongoose.model('Service', serviceSchema);
