const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [80, 'El nombre no puede superar los 80 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo no es valido'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Se almacena solo el hash SHA-256 del refresh token (nunca el token en claro).
    refreshTokenHash: { type: String, select: false },
    refreshTokenExpires: { type: Date, select: false },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        delete ret.refreshTokenExpires;
        return ret;
      },
    },
  }
);

userSchema.index({ role: 1, active: 1 });

module.exports = mongoose.model('User', userSchema);
