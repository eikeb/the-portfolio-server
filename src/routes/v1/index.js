const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const healthRoute = require('./health.route');
const portfoliosRoute = require('./portfolio.route');
const instrumentRoute = require('./instrument.route');

const router = express.Router();

// Misc routes
router.use('/auth', authRoute);
router.use('/docs', docsRoute);
router.use('/health', healthRoute);

// Entities
router.use('/users', userRoute);
router.use('/portfolios', portfoliosRoute);
router.use('/portfolios', instrumentRoute);

module.exports = router;
