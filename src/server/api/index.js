const express = require('express');

const requireAuthentication = require('../middleware/require-authentication');

const router = new express.Router();

router.all('*', requireAuthentication);

router.get('/profile', (req, res) => {
  res.json({
    name: req.user.name,
  });
});

module.exports = router;
