const faker = require('faker');
const mongoose = require('mongoose');
const { describe, test, beforeEach } = require('@jest/globals');

const { Portfolio } = require('../../../src/models');

describe('Portfolio model', () => {
  describe('Portfolio validation', () => {
    let newPortfolio;

    beforeEach(() => {
      newPortfolio = {
        name: faker.lorem.words(2),
        owner: mongoose.Types.ObjectId(),
        public: false,
      };
    });

    test('should correctly validate a valid portfolio', async () => {
      await expect(new Portfolio(newPortfolio).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is not set', async () => {
      delete newPortfolio.name;
      await expect(new Portfolio(newPortfolio).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name is empty', async () => {
      newPortfolio.name = '';
      await expect(new Portfolio(newPortfolio).validate()).rejects.toThrow();
    });

    test('should throw a validation error if owner is not set', async () => {
      delete newPortfolio.owner;
      await expect(new Portfolio(newPortfolio).validate()).rejects.toThrow();
    });

    test('should throw a validation error if owner is empty', async () => {
      delete newPortfolio.owner;
      await expect(new Portfolio(newPortfolio).validate()).rejects.toThrow();
    });
  });
});
