const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    network: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
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

socialLinkSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('SocialLink', socialLinkSchema);
