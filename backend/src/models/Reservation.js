const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    startAt: {
      type: Date,
      required: [true, 'La fecha y hora son obligatorias'],
      index: true,
    },
    partySize: {
      type: Number,
      min: 1,
      max: 20,
      default: 1,
    },
    contactPhone: { type: String, trim: true, maxlength: 30, default: '' },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
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

// Evita dobles reservas duplicadas exactas y acelera las consultas del panel.
reservationSchema.index({ service: 1, startAt: 1, status: 1 });
reservationSchema.index({ user: 1, startAt: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
