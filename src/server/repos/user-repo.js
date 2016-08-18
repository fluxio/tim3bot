const knex = require('./knex');

const USER_TABLE = 'users';

const DEFAULT_SELECT = ['id', 'name'];

function createUser({ data = {}, select = DEFAULT_SELECT } = {}) {
  const { slackId, name, displayName } = data;

  if (!slackId) {
    throw new Error('Must supply data.slackId');
  }

  return knex.transaction(trx => (
    knex(USER_TABLE)
      .transacting(trx)
      .insert({
        slackId,
        name: name || displayName,
      }, select)
      .then(trx.commit)
      .catch(trx.rollback)
  ));
}

function findUser({ query = {}, select = DEFAULT_SELECT } = {}) {
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

function updateUser({ query = {}, data = {}, select = DEFAULT_SELECT } = {}) {
  if (!query.id && !query.slackId) {
    throw new Error('Must supply query.id or query.slackId');
  }

  return knex.transaction(trx => (
    knex(USER_TABLE)
      .transacting(trx)
      .where(query)
      .update(data, select)
      .then(trx.commit)
      .catch(trx.rollback)
  ));
}

function upsertUser({ data = {}, select = DEFAULT_SELECT }) {
  if (!data.slackId) {
    throw new Error('Must supply data.slackId');
  }

  return updateUser({
    query: { slackId: data.slackId, },
    select,
  })
    .then(user => user || createUser({ data, select }));
}

function findOrCreateUser({ data = {}, select = DEFAULT_SELECT }) {
  if (!data.slackId) {
    throw new Error('Must supply data.slackId');
  }

  return findUser({
    query: { slackId: data.slackId, },
    select,
  })
    .then(user => user || createUser({ data, select }));
}

module.exports = {
  createUser,
  findUser,
  updateUser,
  upsertUser,
  findOrCreateUser,
};
