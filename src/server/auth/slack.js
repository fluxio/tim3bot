const express = require('express');
const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;

const userRepo = require('../repos/user-repo');

const config = require('../../../config/server-config');

const router = new express.Router();

passport.use(new SlackStrategy({
  clientID: config.SLACK_CLIENT_ID,
  clientSecret: config.SLACK_CLIENT_SECRET,
  callbackURL: `${config.BASE_URL}/auth/slack/callback`,
  scope: 'chat:write:bot,dnd:read,dnd:write,emoji:read',
  extendedUserProfile: false,
}, (accessToken, refreshToken, profile, done) => {
  const slackId = profile.id;

  userRepo
    .findUser({ query: { slackId } })
    .then(user => (
      user || userRepo.createUser({
        slackId,
        name: profile.displayName,
      })
    ))
    .catch(done)
    .then(user => done(null, user));
}));

router.get('/', passport.authenticate('slack'));
router.get('/callback', passport.authenticate('slack', {
  failureRedirect: '/login',
}));

router.get('/callback', (req, res) => {
  res.redirect(config.BASE_URL);
});

module.exports = router;
