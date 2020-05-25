const { describe, expect, test, beforeEach } = require('@jest/globals');

const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Portfolio } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { portfolioOne, portfolioTwo, portfolioPublic, insertPortfolios } = require('../fixtures/portfolio.fixture');
const { userOneAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Portfolio routes', () => {
  describe('POST /v1/portfolios', () => {
    let newPortfolio;

    beforeEach(() => {
      newPortfolio = {
        name: faker.lorem.words(2),
        public: false,
      };
    });

    test('should return 201 and successfully create new portfolio for user one if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newPortfolio)
        .expect(httpStatus.CREATED);

      // Expect the response to be the portfolio data
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newPortfolio.name,
        owner: userOne._id.toHexString(),
        public: newPortfolio.public,
      });

      const dbPortfolio = await Portfolio.findById(res.body.id);
      expect(dbPortfolio).toBeDefined();
      expect(dbPortfolio).toMatchObject({ name: newPortfolio.name, owner: userOne._id, public: newPortfolio.public });
    });

    test('should be able to create a public portfolio as well', async () => {
      await insertUsers([userOne]);
      newPortfolio.public = true;

      const res = await request(app)
        .post('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newPortfolio)
        .expect(httpStatus.CREATED);

      expect(res.body.public).toBe(true);

      const dbPortfolio = await Portfolio.findById(res.body.id);
      expect(dbPortfolio.public).toBe(true);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/portfolios').send(newPortfolio).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is empty', async () => {
      await insertUsers([userOne]);
      newPortfolio.name = '';

      await request(app)
        .post('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newPortfolio)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if publicity is not defined', async () => {
      await insertUsers([userOne]);
      delete newPortfolio.public;

      await request(app)
        .post('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newPortfolio)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  /*
  describe('GET /v1/portfolios', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toEqual({
        id: portfolioOne._id.toHexString(),
        name: portfolioOne.name,
        owner: userOne._id.toHexString(),
        public: portfolioOne.public,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      await request(app).get('/v1/portfolios').send().expect(httpStatus.UNAUTHORIZED);
    });

    // TODO: Test private portfolios in /portfolios

    test('should correctly apply filter on name field', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ name: portfolioOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(portfolioOne._id.toHexString());
    });

    test('should correctly apply filter on owner field', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ owner: userOne._id.toHexString() })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(portfolioOne._id.toHexString());
      expect(res.body.results[1].id).toBe(portfolioPublic._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const sortedPortfolios = _.sortBy([portfolioOne, portfolioTwo, portfolioPublic], 'name');

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(sortedPortfolios[2]._id.toHexString());
      expect(res.body.results[1].id).toBe(sortedPortfolios[1]._id.toHexString());
      expect(res.body.results[2].id).toBe(sortedPortfolios[0]._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const sortedPortfolios = _.sortBy([portfolioOne, portfolioTwo, portfolioPublic], 'name');

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ sortBy: 'name:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(sortedPortfolios[0]._id.toHexString());
      expect(res.body.results[1].id).toBe(sortedPortfolios[1]._id.toHexString());
      expect(res.body.results[2].id).toBe(sortedPortfolios[2]._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(portfolioOne._id.toHexString());
      expect(res.body.results[1].id).toBe(portfolioTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne, portfolioTwo, portfolioPublic]);

      const res = await request(app)
        .get('/v1/portfolios')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(portfolioPublic._id.toHexString());
    });
  });
*/
  describe('GET /v1/portfolios/:portfolioId', () => {
    test('should return 200 and the portfolio object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      const res = await request(app)
        .get(`/v1/portfolios/${portfolioOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: portfolioOne._id.toHexString(),
        name: portfolioOne.name,
        owner: portfolioOne.owner.toHexString(),
        public: portfolioOne.public,
      });
    });

    test('should return 200 if the user is trying to access another users public portfolio', async () => {
      await insertUsers([userOne, userTwo]);
      await insertPortfolios([portfolioOne, portfolioPublic]);

      const res = await request(app)
        .get(`/v1/portfolios/${portfolioPublic._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: portfolioPublic._id.toHexString(),
        name: portfolioPublic.name,
        owner: portfolioPublic.owner.toHexString(),
        public: portfolioPublic.public,
      });
    });

    test('should return 403 if the user is trying to access another users private portfolio', async () => {
      await insertUsers([userOne, userTwo]);
      await insertPortfolios([portfolioOne, portfolioTwo]);

      await request(app)
        .get(`/v1/portfolios/${portfolioTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app).get(`/v1/portfolios/${portfolioOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if portfolioId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app)
        .get('/v1/portfolios/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if portfolio is not found', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app)
        .get(`/v1/portfolios/${portfolioTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/portfolios/:portfolioId', () => {
    test('should return 204 and delete from database if data is ok', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app)
        .delete(`/v1/portfolios/${portfolioOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbPortfolio = await Portfolio.findById(portfolioOne._id);
      expect(dbPortfolio).toBeNull();
    });

    test('should return 403 if the user is trying to delete another users portfolio', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioTwo]);

      await request(app)
        .delete(`/v1/portfolios/${portfolioTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 403 if the user is trying to delete another users public portfolio', async () => {
      await insertUsers([userTwo]);
      await insertPortfolios([portfolioPublic]);

      await request(app)
        .delete(`/v1/portfolios/${portfolioPublic._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app).delete(`/v1/portfolios/${portfolioOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if portfolioId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete('/v1/portfolios/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if portfolio is not found', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      await request(app)
        .delete(`/v1/portfolios/${portfolioTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/portfolios/:portfolioId', () => {
    test('should return 200 and successfully update portfolio if data is ok', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);

      const updateBody = {
        name: faker.lorem.words(2),
        public: true,
      };

      const res = await request(app)
        .patch(`/v1/portfolios/${portfolioOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: portfolioOne._id.toHexString(),
        name: updateBody.name,
        owner: portfolioOne.owner.toHexString(),
        public: true,
      });

      const dbPortfolio = await Portfolio.findById(portfolioOne._id);
      expect(dbPortfolio).toBeDefined();
      expect(dbPortfolio).toMatchObject({ name: updateBody.name, public: true });
    });

    test('should return 403 if the user is trying to update another users portfolio', async () => {
      await insertUsers([userTwo]);
      await insertPortfolios([portfolioOne]);

      const updateBody = { name: faker.lorem.words(2) };

      await request(app)
        .patch(`/v1/portfolios/${portfolioOne._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 403 if the user is trying to update another users public portfolio', async () => {
      await insertUsers([userTwo]);
      await insertPortfolios([portfolioPublic]);

      const updateBody = { name: faker.lorem.words(2) };

      await request(app)
        .patch(`/v1/portfolios/${portfolioPublic._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);
      const updateBody = { name: faker.lorem.words(2) };

      await request(app).patch(`/v1/portfolios/${portfolioOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if portfolioId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);
      const updateBody = { name: faker.lorem.words(2) };

      await request(app)
        .patch(`/v1/portfolios/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if portfolio is not found', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);
      const updateBody = { name: faker.lorem.words(2) };

      await request(app)
        .patch(`/v1/portfolios/${portfolioTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if owner should be updated', async () => {
      await insertUsers([userOne]);
      await insertPortfolios([portfolioOne]);
      const updateBody = { owner: userTwo._id.toHexString() };

      await request(app)
        .patch(`/v1/portfolios/${portfolioOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
