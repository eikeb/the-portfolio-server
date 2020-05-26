const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');

/**
 * Login a user with email and password.
 * If the email address or password is invalid, this method throws an ApiError.
 *
 * @param {string} email - The email address
 * @param {string} password - The password
 * @returns {Promise<User>} A promise for the User object
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

/**
 * Refresh auth tokens.
 *
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<Object>} A Promise for the new auth tokwns
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await userService.getUserById(refreshTokenDoc.user);

    // Delete the refresh token that was used
    await refreshTokenDoc.remove();

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset a user password.
 *
 * @param {string} resetPasswordToken - The password reset token
 * @param {string} newPassword - The new password
 * @returns {Promise} A Promise that resolved when the password has been changed
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
    const user = await userService.getUserById(resetPasswordTokenDoc.user);

    // Delete all reset password tokens for the user
    await Token.deleteMany({ user: user.id, type: 'resetPassword' });

    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  refreshAuth,
  resetPassword,
};
