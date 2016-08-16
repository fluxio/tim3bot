const baseConfig = require('./base-config');

const secrets = {
  SESSION_SECRET: process.env.SESSION_SECRET || 'keyboard cat',
};

if (baseConfig.env === 'production') {
  Object.keys(secrets).forEach(secret => {
    if (!secrets[secret]) {
      throw new Error(`${secret} must be set in the environment`);
    }
  });
}

module.exports = Object.assign({}, baseConfig, secrets);
