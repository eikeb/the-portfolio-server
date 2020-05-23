const mongoose = require('mongoose');
const faker = require('faker');
const Portfolio = require('../../src/models/portfolio.model');
const { userOne, userTwo } = require('./user.fixture');

const portfolioOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(2),
  owner: userOne._id,
  public: false,
};

const portfolioTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(2),
  owner: userTwo._id,
  public: false,
};

const portfolioPublic = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(2),
  owner: userOne._id,
  public: true,
};

const insertPortfolios = async (portfolios) => {
  await Portfolio.insertMany(portfolios);
};

module.exports = {
  portfolioOne,
  portfolioTwo,
  portfolioPublic,
  insertPortfolios,
};
