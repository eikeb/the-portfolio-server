const { beforeAll, beforeEach, afterAll } = require('@jest/globals');

const mongoose = require('mongoose');
const config = require('../../src/config/config');

const setupTestDB = () => {
  beforeAll(async () => {
    // Connect to mongo db before each test run
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
  });

  beforeEach(async () => {
    // Delete all documents from every collection in the test database
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    // Disconnect from the mongo db after the test run
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
