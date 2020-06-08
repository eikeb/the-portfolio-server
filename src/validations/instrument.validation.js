const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createInstrument = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    symbol: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const getInstruments = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    symbol: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInstrument = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
    instrumentId: Joi.required().custom(objectId),
  }),
};

const updateInstrument = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
    instrumentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      symbol: Joi.string().required(),
      name: Joi.string().required(),
    })
    .min(1),
};

const deleteInstrument = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
    instrumentId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createInstrument,
  getInstruments,
  getInstrument,
  updateInstrument,
  deleteInstrument,
};
