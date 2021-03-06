const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { accessibleRecordsPlugin } = require('@casl/mongoose');
const { paginate, toJSON } = require('./plugins');
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
      private: true, // used by the toJSON plugin
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
    },
  },
  {
    timestamps: true,
  }
);

// add mongoose plugins
userSchema.plugin(paginate);
userSchema.plugin(toJSON);
userSchema.plugin(accessibleRecordsPlugin);

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

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 * @property {ObjectId} _id - The mongo object id
 * @property {string} name - The name of the user
 * @property {string} email - The users email address
 * @property {string} role - The role
 * @property {string} password - The hashed user password
 * @property {Date} createdAt - The creation timestamp
 * @property {Date} updatedAt - The update timestamp
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
