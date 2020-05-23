const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createPortfolio = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    public: Joi.boolean().required(),
  }),
};

const getPortfolios = {
  query: Joi.object().keys({
    owner: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPortfolio = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
};

const updatePortfolio = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      public: Joi.boolean(),
    })
    .min(1),
};

const deletePortfolio = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};
