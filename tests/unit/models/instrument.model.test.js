const faker = require('faker');
const mongoose = require('mongoose');
const { describe, test, beforeEach } = require('@jest/globals');

const { Instrument } = require('../../../src/models');

describe('Instrument model', () => {
  describe('Instrument validation', () => {
    let newInstrument;

    beforeEach(() => {
      newInstrument = {
        portfolio: mongoose.Types.ObjectId(),
        name: faker.lorem.words(2),
        symbol: faker.lorem.words(1),
      };
    });

    test('should correctly validate a valid instrument', async () => {
      await expect(new Instrument(newInstrument).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if portfolio is not set', async () => {
      delete newInstrument.portfolio;
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if portfolio is empty', async () => {
      newInstrument.portfolio = '';
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name is not set', async () => {
      delete newInstrument.name;
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name is empty', async () => {
      newInstrument.name = '';
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if symbol is not set', async () => {
      delete newInstrument.symbol;
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if symbol is empty', async () => {
      delete newInstrument.symbol;
      await expect(new Instrument(newInstrument).validate()).rejects.toThrow();
    });
  });
});
