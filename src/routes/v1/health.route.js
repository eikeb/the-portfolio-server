const httpStatus = require('http-status');
const express = require('express');
const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router.get('/', catchAsync((req, res, next) => {
  // Check mongo db connection
  const connectionState = mongoose.connection.readyState;

  const healthCheck = {
    uptime: process.uptime(),
    mongoDb: mongoose.STATES[connectionState],
    timestamp: Date.now(),
    message: 'OK'
  };

  res.status(httpStatus.OK).send(healthCheck);
}));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Healthcheck
 *   description: Healthcheck retrieval
 */

/**
 * @swagger
 * path:
 *  /health:
 *    get:
 *      summary: Retrieves the status of the server
 *      description: This route returns the status of the server, including the database connection status.
 *      tags: [Healthcheck]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Healthcheck'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */