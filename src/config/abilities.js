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
      can(['read', 'update'], 'User', { _id: { $eq: user._id } });

      // Can manage own Portfolios
      can('manage', 'Portfolio', { owner: user._id });

      // Can read public portfolios
      can('read', 'Portfolio', { public: true });
      break;

    default:
      // Anonymous users dont have any abilities
      cannot('manage', 'all');
  }

  const ability = build();

  /**
   * Register a shortcut method to check if a user can perform a certain action
   *
   * @typedef ExtendedAbility
   * @extends Ability
   * @method throwUnlessCan
   */
  ability.throwUnlessCan = (...args) => {
    if (!ability.can(...args)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  };

  return ability;
}

module.exports = defineAbilitiesFor;
