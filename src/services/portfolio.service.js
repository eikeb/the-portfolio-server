const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new portfolio.
 *
 * @param {ObjectId} userId - The user id
 * @param {Object} portfolioBody - The portfolio data
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const createPortfolio = async (userId, portfolioBody) => {
  // eslint-disable-next-line no-param-reassign
  portfolioBody.owner = userId;

  return Portfolio.create(portfolioBody);
};

/**
 * Query for portfolios.
 *
 * @param {Object} filter - The mongo filter
 * @param {Object} options - The query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} A Promise for the QueryResult
 */
const queryPortfolios = async (filter, options) => {
  return Portfolio.paginate(filter, options);
};

/**
 * Get Portfolio by id.
 *
 * @param {ObjectId} id - The portfolio id
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const getPortfolioById = async (id) => {
  return Portfolio.findById(id);
};

/**
 * Update Portfolio by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @param {Object} updateBody - The portfolio data
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const updatePortfolioById = async (portfolioId, updateBody) => {
  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Portfolio not found');
  }

  Object.assign(portfolio, updateBody);
  await portfolio.save();
  return portfolio;
};

/**
 * Delete portfolio by id.
 *
 * @param {ObjectId} portfolioId - The portfolio id
 * @returns {Promise<Portfolio>} A Promise for the Portfolio object
 */
const deletePortfolioById = async (portfolioId) => {
  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Portfolio not found');
  }

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
