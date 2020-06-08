const httpStatus = require('http-status');

const { Instrument } = require('../models');
const portfolioService = require('./portfolio.service');
const ApiError = require('../utils/ApiError');

/**
 * Check access to the portfolio.
 * If the user does not have the necessary rights, this method throws an Exception.
 *
 * @param {ObjectId} portfolioId - The Portfolio id
 * @param {String} action - The action
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<void>}
 */
const checkPortfolioAccess = async (portfolioId, action, ability) => {
  // Check that the portfolio exists and the user can access it
  const portfolio = await portfolioService.getPortfolioById(portfolioId, ability);
  ability.throwUnlessCan(action, portfolio);
};

/**
 * Create a new Instrument.
 *
 * @param {ObjectId} portfolioId - The Portfolio id
 * @param {Object} instrumentBody - The Instrument data
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Instrument>} A Promise for the Instrument object
 */
const createInstrument = async (portfolioId, instrumentBody, ability) => {
  await checkPortfolioAccess(portfolioId, 'manage', ability);

  const instrumentData = { ...instrumentBody, portfolio: portfolioId };
  return Instrument.create(instrumentData);
};

/**
 * Query for Instruments.
 *
 * @param {ObjectId} portfolioId - The Portfolio id
 * @param {Object} filter - The mongo filter
 * @param {Object} options - The query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<QueryResult>} A Promise for the QueryResult
 */
const queryInstruments = async (portfolioId, filter, options, ability) => {
  await checkPortfolioAccess(portfolioId, 'read', ability);

  // Only find instruments for the requested portfolio
  return Instrument.paginate({ ...filter, portfolio: portfolioId }, options);
};

/**
 * Get Instrument by id.
 * Throws an ApiError if the Instrument is not found.
 *
 * @param {ObjectId} portfolioId - The Portfolio id
 * @param {ObjectId} instrumentId - The Instrument id
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Instrument object
 */
const getInstrumentById = async (portfolioId, instrumentId, ability) => {
  await checkPortfolioAccess(portfolioId, 'read', ability);

  const instrument = await Instrument.findOne({ portfolio: portfolioId, _id: instrumentId });
  if (!instrument) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instrument not found');
  }

  return instrument;
};

/**
 * Update Instrument by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @param {ObjectId} instrumentId - The Instrument id
 * @param {Object} updateBody - The Instrument data
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Instrument object
 */
const updateInstrumentById = async (portfolioId, instrumentId, updateBody, ability) => {
  await checkPortfolioAccess(portfolioId, 'manage', ability);

  const instrument = await getInstrumentById(portfolioId, instrumentId, ability);
  Object.assign(instrument, updateBody);
  await instrument.save();

  return instrument;
};

/**
 * Delete Instrument by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @param {ObjectId} instrumentId - The Instrument id
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Instrument object
 */
const deleteInstrumentById = async (portfolioId, instrumentId, ability) => {
  await checkPortfolioAccess(portfolioId, 'manage', ability);

  const instrument = await getInstrumentById(portfolioId, instrumentId, ability);
  await instrument.remove();
  return instrument;
};

module.exports = {
  createInstrument,
  queryInstruments,
  getInstrumentById,
  updateInstrumentById,
  deleteInstrumentById,
};
