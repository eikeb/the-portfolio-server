const httpStatus = require('http-status');
const { subject } = require('@casl/ability');

const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new portfolio.
 *
 * @param {ObjectId} userId - The user id
 * @param {Object} portfolioBody - The portfolio data
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const createPortfolio = async (userId, portfolioBody, ability) => {
  ability.throwUnlessCan('create', 'Portfolio');

  return Portfolio.create({ ...portfolioBody, owner: userId });
};

/**
 * Query for portfolios.
 *
 * @param {Object} filter - The mongo filter
 * @param {Object} options - The query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<QueryResult>} A Promise for the QueryResult
 */
const queryPortfolios = async (filter, options, ability) => {
  return Portfolio.paginate(filter, options, ability);
};

/**
 * Get Portfolio by id.
 * Throws an ApiError if the portfolio is not found.
 *
 * @param {ObjectId} id - The portfolio id
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const getPortfolioById = async (id, ability) => {
  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Portfolio not found');
  }

  ability.throwUnlessCan('read', subject('Portfolio', portfolio));

  return portfolio;
};

/**
 * Update Portfolio by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @param {Object} updateBody - The portfolio data
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const updatePortfolioById = async (portfolioId, updateBody, ability) => {
  const portfolio = await getPortfolioById(portfolioId, ability);

  ability.throwUnlessCan(
    'update',
    subject('Portfolio', { ...updateBody, owner: portfolio.owner._id }),
    Object.keys(updateBody)
  );

  Object.assign(portfolio, updateBody);
  await portfolio.save();

  return portfolio;
};

/**
 * Delete portfolio by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @param {ExtendedAbility} ability - The users abilities
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const deletePortfolioById = async (portfolioId, ability) => {
  const portfolio = await getPortfolioById(portfolioId, ability);

  ability.throwUnlessCan('delete', portfolio);

  await portfolio.remove();
  return portfolio;
};

module.exports = {
  createPortfolio,
  queryPortfolios,
  getPortfolioById,
  updatePortfolioById,
  deletePortfolioById,
};
