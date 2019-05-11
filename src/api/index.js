const express = require('express');

const router = express.Router();


/**
 * GET status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET docs
 */
router.use('/docs', express.static('docs'));

// routes
router.use('/', __require('api/User/routes'));
router.use('/', __require('api/JsonWebToken/routes'));

module.exports = router;