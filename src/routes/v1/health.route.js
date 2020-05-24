const express = require('express');
const healthController = require('../../controllers/health.controller');

const router = express.Router();

router.route('/').get(healthController.getHealth);

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
