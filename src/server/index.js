const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const errorHandler = require('errorhandler');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const authRouter = require('./auth');
const apiRouter = require('./api');

const userRepo = require('./repos/user-repo');

const config = require('../../config/server-config');

const app = express();
const redisClient = redis.createClient({
  url: config.REDIS_URL,
  port: config.REDIS_PORT,
});

const sessionStore = new RedisStore({
  client: redisClient,
});

// Starts the Slack bot
require('./slack');

app.use(logger('dev'));
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  store: sessionStore,
  secret: config.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userRepo.selectOne({ query: { id } })
    .catch(done)
    .then(user => done(null, user));
});

if (config.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });
}

app.use('/auth', authRouter);

app.use('/api', apiRouter);

if (!config.DEBUG) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/', express.static(path.join(__dirname, 'public')));
}

if (config.DEBUG) {
  app.use(errorHandler());
}

module.exports = app;
