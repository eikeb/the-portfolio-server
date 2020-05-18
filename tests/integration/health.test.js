const { describe, expect } = require('@jest/globals');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Health route', () => {
  describe('GET /v1/health', () => {

    test('should return 200 and contain a valid health check object', async () => {
      const res = await request(app)
        .get('/v1/health')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        uptime: expect.anything(),
        mongoDb: 'connected',
        timestamp: expect.anything(),
        message: 'OK'
      });
    });
  });
});
