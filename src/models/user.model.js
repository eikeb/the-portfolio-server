const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { omit, pick } = require('lodash');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

/**
 * Checks if an email address is already taken.
 * If the excludeUserId parameter is given, that user will be excluded.
 *
 * @param {String} email - The email address
 * @param {ObjectId} [excludeUserId] - A user id that should be excluded
 * @returns {Promise<boolean>} - A Promise that indicates if the email address is taken
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Checks if the password matches.
 *
 * @param {string} password - The password that should be checked
 * @returns {Promise<boolean>} - A Promise that indicates if the password matches
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Returns a JSON representation of this User entity.
 * This method omits the password.
 *
 * @returns {Object} - The JSON representation
 */
userSchema.methods.toJSON = function () {
  const user = this;
  return omit(user.toObject(), ['password']);
};

/**
 * Returns a JSON representation of this User entity.
 * This method omits the password.
 *
 * @returns {Object} - The JSON representation
 */
userSchema.methods.transform = function () {
  const user = this;
  return pick(user.toJSON(), ['id', 'email', 'name', 'role']);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
