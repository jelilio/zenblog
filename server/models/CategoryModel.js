const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 3,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      idnex: { unique: true },
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', CategorySchema);
