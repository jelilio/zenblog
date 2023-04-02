const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 3,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      required: false,
      trim: true,
      idnex: { unique: true },
    },
    author: {
      id: String,
      name: String,
      email: String,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      votes: Number,
      favs: Number,
    },
    featureImage: {
      type: String,
    },
    comments: [
      {
        message: String,
        date: Date,
        author: {
          id: String,
          name: String,
          email: String,
        },
      },
    ],
    hidden: Boolean,
    published: { type: Boolean, default: false },
    publishedDate: Date,
    categories: {
      type: [String],
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
