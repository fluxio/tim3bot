const express = require('express');

const slackRouter = require('./slack');

const router = new express.Router();

router.use('/slack', slackRouter);

module.exports = router;
