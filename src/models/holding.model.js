const mongoose = require('mongoose');
const { accessibleRecordsPlugin } = require('@casl/mongoose');
const { paginate, toJSON } = require('./plugins');

const holdingSchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    portfolio: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add mongoose plugins
holdingSchema.plugin(paginate);
holdingSchema.plugin(toJSON);
holdingSchema.plugin(accessibleRecordsPlugin);

/**
 * @typedef Holding
 * @property {ObjectId} _id - The mongo object id
 * @property {string} name - The name of this holding
 * @property {ObjectId} portfolio - The portfolio id to which this holding belongs
 * @property {Date} createdAt - The creation timestamp
 * @property {Date} updatedAt - The update timestamp
 */
const Holding = mongoose.model('Holding', holdingSchema);

module.exports = Holding;
