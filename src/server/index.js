const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const errorHandler = require('errorhandler');

const devStaticMiddleware = require('./dev-static-middleware');
const config = require('../../config/server-config');

const app = express();

app.use(logger('dev'));
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
}));

if (config.DEBUG) {
  app.use(devStaticMiddleware());
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

if (config.DEBUG) {
  app.use(errorHandler());
}

module.exports = app;
