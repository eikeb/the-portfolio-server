/**
 * Validates the value to be a valid mongo object id.
 *
 * @param {String} value - The value
 * @param {Object} helpers - JOI helper functions
 * @returns {String} the value
 */
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo object id');
  }
  return value;
};

/**
 * Validates the value to be a valid password.
 * The password must contain at least 8 characters, a number and a letter.
 *
 * @param {String} value - The value
 * @param {Object} helpers - JOI helper functions
 * @returns {String} the value
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
