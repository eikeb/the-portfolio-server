const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Generate a new token for a user.
 *
 * @param {ObjectId} userId - The user id
 * @param {Moment} expires - The timestamp when this token expires
 * @param {string} [secret] - The JWT Secret, defaults to the configuration value
 * @returns {string} The signed token string
 */
const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };

  return jwt.sign(payload, secret);
};

/**
 * Save a token to the database.
 *
 * @param {string} token - The signed token
 * @param {ObjectId} userId - The user id
 * @param {Moment} expires - The timespan when this token expires
 * @param {string} type - The type of the token
 * @param {boolean} [blacklisted] - Indicates if the token is blacklisted, defaults to false
 * @returns {Promise<Token>} A Promise for the Token object
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });

  return tokenDoc;
};

/**
 * Verify a token and return the Token document (or throws an error if it is not valid).
 *
 * @param {string} token - The signed token
 * @param {string} type - The type of the token
 * @returns {Promise<Token>} A Promise for the Token document
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }

  return tokenDoc;
};

/**
 * Generate auth tokens for the specified user.
 *
 * @param {User} user - The user
 * @returns {Promise<Object>} A Promise for an object that contains the auth tokens
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate a new reset password token for the specified mail.
 *
 * @param {string} email - The email address
 * @returns {Promise<string>} A Promise for the reset password token
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires);
  await saveToken(resetPasswordToken, user.id, expires, 'resetPassword');
  return resetPasswordToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
};
