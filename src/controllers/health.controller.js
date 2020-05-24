const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

const getHealth = catchAsync(async (req, res) => {
  // Check mongo db connection
  const connectionState = mongoose.connection.readyState;

  const healthCheck = {
    uptime: process.uptime(),
    mongoDb: mongoose.STATES[connectionState],
    timestamp: Date.now(),
    message: 'OK',
  };

  res.status(httpStatus.OK).send(healthCheck);
});

module.exports = {
  getHealth,
};
