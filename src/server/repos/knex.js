const knex = require('knex');

const config = require('../../../config/server-config');
const knexConfig = require('../../../knexfile');

const connectionConfig = Object.assign({}, knexConfig[config.NODE_ENV], {
  debug: config.DEBUG,
});

if (!connectionConfig) {
  throw new Error(`Must specify knex configuration for the ${config.NODE_ENV} environment`);
}

const connection = knex(connectionConfig);

module.exports = connection;
