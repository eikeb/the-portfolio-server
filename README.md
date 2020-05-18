# the:portfolio - A modern portfolio analysis tool

[![Build Status](https://travis-ci.org/eikeb/the-portfolio-server.svg?branch=master)](https://travis-ci.org/eikeb/the-portfolio-server)
[![Coverage Status](https://coveralls.io/repos/github/eikeb/the-portfolio-server/badge.svg?branch=master)](https://coveralls.io/github/eikeb/the-portfolio-server?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3dfe239849164fe1b007886708df23fe)](https://app.codacy.com/manual/eikeb/the-portfolio-server?utm_source=github.com&utm_medium=referral&utm_content=eikeb/the-portfolio-server&utm_campaign=Badge_Grade_Dashboard)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Technology Stack

- **ES9**: latest ECMAScript features
- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **CI**: continuous integration with [Travis CI](https://travis-ci.org)
- **Code coverage**: using [coveralls](https://coveralls.io)
- **Code quality**: with [Codacy](https://www.codacy.com)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Getting Started

### Installation

Clone the repo:

```bash
git clone git@github.com:eikeb/the-portfolio-server.git
cd the-portfolio-server
```

Install dependencies:

```bash
npm install
```

Set environment variables:

```bash
cp .env.example .env
# Open .env and set the environment variables accordingly
```

### Commands

Running locally:

```bash
npm run start:dev
```

Running in production:

```bash
npm start
```

Unit and integration tests:

```bash
# Run all tests
npm run test

# Run all tests in watch mode
npm run test:watch

# Run test coverage
npm run coverage
```

Linting:

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Run prettier
npm run prettier

# Fix prettier errors
npm run prettier:fix
```

## Project Structure

```
the-portfolio-server\   # the:portfolio REST API Server
 |--src\
   |--config\           # Environment variables and configuration related things
   |--controllers\      # Route controllers (controller layer)
   |--docs\             # Swagger files
   |--middlewares\      # Custom express middlewares
   |--models\           # Mongoose models (data layer)
   |--routes\           # Routes
   |--services\         # Business logic (service layer)
   |--utils\            # Utility classes and functions
   |--validations\      # Request data validation schemas
   |--app.js            # Express app
   |--index.js          # App entry point
 |--tests\
   |--fixtures          # Test data fixtures
   |--integration       # Integration tests
   |--unit              # Unit tests
   |--utils             # Test utility functions
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Inspirations

- [hagopj13/node-express-mongoose-boilerplate](https://github.com/hagopj13/node-express-mongoose-boilerplate)

## License

[MIT](LICENSE)
