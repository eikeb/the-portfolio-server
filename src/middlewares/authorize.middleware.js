const passport = require('passport');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const defineAbilitiesFor = require('../config/abilities');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  // Set the authenticated user to the request object
  req.user = user;

  // Define abilities for that user
  req.ability = defineAbilitiesFor(user);

  resolve();
};

const authorize = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = authorize;
