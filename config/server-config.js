const baseConfig = require('./base-config');

const HOT = !!process.env.HOT;
const PROXY_PORT = process.env.PROXY_PORT || 4000;
const API_PORT = process.env.PORT || process.env.API_PORT || 4001;
const STATIC_PORT = process.env.STATIC_PORT || 4002;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_URL = process.env.REDIS_URL;
const HOSTNAME = process.env.HOSTNAME || (baseConfig.DEBUG ? 'localhost' : '');
const BASE_URL = process.env.BASE_URL || `http://${HOSTNAME}:${PROXY_PORT}`;

const secrets = {
  SESSION_SECRET: process.env.SESSION_SECRET || 'keyboard cat',
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
  SLACK_API_TOKEN: process.env.SLACK_API_TOKEN,
};

if (baseConfig.env === 'production') {
  Object.keys(secrets).forEach(secret => {
    if (!secrets[secret]) {
      throw new Error(`${secret} must be set in the environment`);
    }
  });
}

module.exports = Object.assign({}, baseConfig, secrets, {
  HOT,
  PROXY_PORT,
  API_PORT,
  STATIC_PORT,
  REDIS_PORT,
  REDIS_URL,
  HOSTNAME,
  BASE_URL,
});
