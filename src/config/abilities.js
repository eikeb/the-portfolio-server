const httpStatus = require('http-status');
const { AbilityBuilder, Ability } = require('@casl/ability');
const ApiError = require('../utils/ApiError');

/**
 * This method defines the abilities for the given user.
 * Based on the role of that user, different abilities will be added.
 *
 * @param {User} user - The logged in user object
 * @returns {Ability} The abilities for the given user
 */
function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  switch (user.role) {
    case 'admin':
      // Can manage all Users
      can('manage', 'User');
      break;

    case 'user':
      // Can read and update their own user
      can(['read'], 'User', { _id: { $eq: user._id } });
      can(['update'], 'User', ['name', 'password'], { _id: { $eq: user._id } });

      // Can manage own Portfolios
      can('manage', 'Portfolio', { owner: { $eq: user._id } });

      // Can read public portfolios
      can('read', 'Portfolio', { public: { $eq: true } });
      break;

    default:
      // Anonymous users dont have any abilities
      cannot('manage', 'all');
  }

  /**
   * @typedef ExtendedAbility
   * @extends Ability
   */
  const ability = build();

  /**
   * Register a shortcut method to check if a user can perform a certain action
   *
   * @method throwUnlessCan
   * @param {String} action - create, read, update, delete, ...
   * @param {String|Object} subject - The subject to check, usually the Model
   * @param {String[]} [fields] - The fields that the user tries to access
   */
  ability.throwUnlessCan = (action, subject, fields = []) => {
    if (fields.length === 0) {
      if (!ability.can(action, subject)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
    } else {
      fields.forEach((field) => {
        if (!ability.can(action, subject, field)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
      });
    }
  };

  return ability;
}

module.exports = defineAbilitiesFor;
