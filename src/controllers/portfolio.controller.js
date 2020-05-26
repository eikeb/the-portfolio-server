const httpStatus = require('http-status');
const { pick } = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

const createPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.createPortfolio(req.user.id, req.body, req.ability);

  res.status(httpStatus.CREATED).send(portfolio);
});

const getPortfolios = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'owner']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Only return public portfolios
  filter.public = true;

  const result = await portfolioService.queryPortfolios(filter, options, req.ability);

  res.send(result);
});

const getPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.getPortfolioById(req.params.portfolioId, req.ability);

  res.send(portfolio);
});

const updatePortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.updatePortfolioById(req.params.portfolioId, req.body, req.ability);

  res.send(portfolio);
});

const deletePortfolio = catchAsync(async (req, res) => {
  await portfolioService.deletePortfolioById(req.params.portfolioId, req.ability);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};
