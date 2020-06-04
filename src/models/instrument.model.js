const mongoose = require('mongoose');
const { accessibleRecordsPlugin } = require('@casl/mongoose');
const { paginate, toJSON } = require('./plugins');

const instrumentSchema = mongoose.Schema(
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
instrumentSchema.plugin(paginate);
instrumentSchema.plugin(toJSON);
instrumentSchema.plugin(accessibleRecordsPlugin);

/**
 * @typedef Instrument
 * @property {ObjectId} _id - The mongo object id
 * @property {string} name - The name of this Instrument
 * @property {ObjectId} portfolio - The portfolio id to which this Instrument belongs
 * @property {Date} createdAt - The creation timestamp
 * @property {Date} updatedAt - The update timestamp
 */
const Instrument = mongoose.model('Instrument', instrumentSchema);

module.exports = Instrument;
