const httpStatus = require('http-status');
const { pick } = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { instrumentService } = require('../services');

const createInstrument = catchAsync(async (req, res) => {
  const instrument = await instrumentService.createInstrument(req.params.portfolioId, req.body, req.ability);

  res.status(httpStatus.CREATED).send(instrument);
});

const getInstruments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'symbol']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await instrumentService.queryInstruments(req.params.portfolioId, filter, options, req.ability);

  res.send(result);
});

const getInstrument = catchAsync(async (req, res) => {
  const instrument = await instrumentService.getInstrumentById(req.params.portfolioId, req.params.instrumentId, req.ability);

  res.send(instrument);
});

const updateInstrument = catchAsync(async (req, res) => {
  const instrument = await instrumentService.updateInstrumentById(
    req.params.portfolioId,
    req.params.instrumentId,
    req.body,
    req.ability
  );

  res.send(instrument);
});

const deleteInstrument = catchAsync(async (req, res) => {
  await instrumentService.deleteInstrumentById(req.params.portfolioId, req.params.instrumentId, req.ability);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInstrument,
  getInstruments,
  getInstrument,
  updateInstrument,
  deleteInstrument,
};
