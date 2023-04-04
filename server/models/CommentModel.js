const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 3,
      maxlength: 50,
    },
    author: {
      id: String,
      name: String,
      email: String,
    },
    postId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
