const express = require('express');

const slackRouter = require('./slack');

const router = new express.Router();

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.clearCookie('connect.sid');
      res.redirect('/');
    }
  });
});

router.use('/slack', slackRouter);

module.exports = router;
