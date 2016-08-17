const knex = require('./knex');

const USER_TABLE = 'users';

function createUser({ slackId, displayName, name }) {
  return knex.transaction(trx => (
    knex(USER_TABLE)
      .transacting(trx)
      .insert({
        slackId,
        name: name || displayName,
      })
      .then(trx.commit)
      .catch(trx.rollback)
  ));
}

function findUser({ query = {}, select = ['id', 'name'] }) {
  if (!query.id && !query.slackId) {
    throw new Error('Must supply query.id or query.slackId');
  }

  return knex.transaction(trx => (
    knex(USER_TABLE)
      .transacting(trx)
      .first(...select)
      .where(query)
      .then(trx.commit)
      .catch(trx.rollback)
  ));
}

module.exports = {
  createUser,
  findUser,
};
