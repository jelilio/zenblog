const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 3,
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
  },
  {
    timestamps: true,
  }
);
