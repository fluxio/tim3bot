const express = require('express');

const requireAuthentication = require('../middleware/require-authentication');

const router = new express.Router();

router.all('*', requireAuthentication);

router.get('/profile', (req, res) => {
  const profile = req.session.passport.user;

  res.json({
    name: profile.displayName,
  });
});

module.exports = router;
