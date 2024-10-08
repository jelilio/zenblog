const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      idnex: { unique: true },
      validate: {
        validator: emailValidator.validate,
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      idnex: { unique: true },
      minlength: 8,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String,
    },
    roles: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function preSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.hasRole = async function hasRole(role) {
  return this.roles.indexOf[role] >= 0;
};

module.exports = mongoose.model('User', UserSchema);
