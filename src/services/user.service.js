const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new user.
 * Throws an ApiError if the email address is already takne.
 *
 * @param {Object} userBody - The user body
 * @returns {Promise<User>} A Promise for the User object
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return User.create(userBody);
};

/**
 * Query for users.
 *
 * @param {Object} filter - The mongo filter
 * @param {Object} options - The query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} A Promise for the QueryResult
 */
const queryUsers = async (filter, options) => {
  return User.paginate(filter, options);
};

/**
 * Get User by id.
 *
 * @param {ObjectId} id - The user id
 * @returns {Promise<User>} A Promise for the User object
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get User by email.
 *
 * @param {string} email - The email address
 * @returns {Promise<User>} A Promise for the User object
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id.
 *
 * @param {ObjectId} userId - The user id
 * @param {Object} updateBody - The user data
 * @returns {Promise<User>} A Promise for the User object
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id.
 *
 * @param {ObjectId} userId - The user id
 * @returns {Promise<User>} A Promise for the User object
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
