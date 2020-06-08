const express = require('express');
const authorize = require('../../middlewares/authorize.middleware');
const validate = require('../../middlewares/validate');
const instrumentValidation = require('../../validations/instrument.validation');
const instrumentController = require('../../controllers/instrument.controller');

const router = express.Router();

router
  .route('/:portfolioId/instruments/')
  .post(authorize(), validate(instrumentValidation.createInstrument), instrumentController.createInstrument)
  .get(authorize(), validate(instrumentValidation.getInstruments), instrumentController.getInstruments);

router
  .route('/:portfolioId/instruments/:instrumentId')
  .get(authorize(), validate(instrumentValidation.getInstrument), instrumentController.getInstrument)
  .patch(authorize(), validate(instrumentValidation.updateInstrument), instrumentController.updateInstrument)
  .delete(authorize(), validate(instrumentValidation.deleteInstrument), instrumentController.deleteInstrument);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Instruments
 *   description: Manage Instruments in Portfolios
 */

/**
 * @swagger
 * path:
 *  /portfolios:
 *    post:
 *      summary: Create a new portfolio
 *      description: This route creates a new portfolio for the current user
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - public
 *              properties:
 *                name:
 *                  type: string
 *                public:
 *                  type: boolean
 *                  description: Indicates if the Portfolio is accessible by other users
 *              example:
 *                name: My Portfolio
 *                public: false
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all public Portfolios
 *      description: Get all public Portfolios
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Portfolio name
 *        - in: query
 *          name: owner
 *          schema:
 *            type: string
 *          description: Portfolio owner
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 100
 *          description: Maximum number of Portfolios
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /portfolios/mine:
 *    get:
 *      summary: Get my Portfolios
 *      description: Get all Portfolios of the current user
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Portfolio name
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 100
 *          description: Maximum number of Portfolios
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /portfolios/{id}:
 *    get:
 *      summary: Get a Portfolio
 *      description: Gets the Portfolio details. The Portfolio must be public, or the logged in user has to be the owner of this portfolio.
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a Portfolio
 *      description: Only the owner can modify the Portfolio data.
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                public:
 *                  type: boolean
 *                  description: Indicates if the Portfolio is accessible by other users
 *              example:
 *                name: My public Portfolio
 *                public: true
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a Portfolio
 *      description: Only the owner can delete his portfolio.
 *      tags: [Portfolios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
