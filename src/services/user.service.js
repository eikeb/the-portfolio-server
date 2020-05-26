const httpStatus = require('http-status');
const { subject } = require('@casl/ability');

const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new user.
 * Throws an ApiError if the email address is already taken.
 *
 * @param {Object} userBody - The user body
 * @param {ExtendedAbility} [ability] - The users abilities
 * @returns {Promise<User>} A Promise for the User object
 */
const createUser = async (userBody, ability) => {
  const user = new User(userBody);

  if (ability) {
    ability.throwUnlessCan('create', user);
  }

  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return user.save();
};

/**
 * Query for users.
 *
 * @param {Object} filter - The mongo filter
 * @param {Object} options - The query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {ExtendedAbility} [ability] - The users abilities
 * @returns {Promise<QueryResult>} A Promise for the QueryResult
 */
const queryUsers = async (filter, options, ability) => {
  return User.paginate(filter, options, ability);
};

/**
 * Get User by id.
 * Throws an ApiError if the user is not found.
 *
 * @param {ObjectId} id - The user id
 * @param {ExtendedAbility} [ability] - The users abilities
 * @returns {Promise<User>} A Promise for the User object
 */
const getUserById = async (id, ability) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (ability) {
    ability.throwUnlessCan('read', user);
  }

  return user;
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
 * @param {ExtendedAbility} [ability] - The users abilities
 * @returns {Promise<User>} A Promise for the User object
 */
const updateUserById = async (userId, updateBody, ability) => {
  const user = await getUserById(userId, ability);

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (ability) {
    ability.throwUnlessCan('update', subject('User', { ...updateBody, _id: user._id }), Object.keys(updateBody));
  }

  Object.assign(user, updateBody);
  await user.save();

  return user;
};

/**
 * Delete user by id.
 *
 * @param {ObjectId} userId - The user id
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<User>} A Promise for the User object
 */
const deleteUserById = async (userId, ability) => {
  const user = await getUserById(userId, ability);

  ability.throwUnlessCan('delete', user);

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
