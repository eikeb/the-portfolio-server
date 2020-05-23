const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const portfolioSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add mongoose plugins for pagination, toJSON transformation and ID validation
portfolioSchema.plugin(toJSON);
portfolioSchema.plugin(paginate);

/**
 * @typedef Portfolio
 * @property {ObjectId} _id - The mongo object id
 * @property {string} name - The name of the portfolio
 * @property {ObjectId} owner - The user id of the owner
 * @property {boolean} public - Indicates if the portfolio is public
 * @property {Date} createdAt - The creation timestamp
 * @property {Date} updatedAt - The update timestamp
 */
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
